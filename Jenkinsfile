def COLOR_MAP = [
  'FAILURE': 'danger',
  'SUCCESS': 'good'
]

pipeline {
  agent any
  environment {
    SCANNER_HOME = tool 'sonar-scanner'
    OPENAI_API_KEY = credentials('openai-api-key')
    SECRET_KEY = credentials('app-secret-key')
  }
  stages {
    stage('Clean Workspace') {
      steps {
        cleanWs()
      }
    }
    stage('Checkout') {
      steps {
        checkout scmGit(
          branches: [[name: '*/main']],
          extensions: [],
          userRemoteConfigs: [[credentialsId: 'gitlab-access', url: 'https://gitlab.com/group-project1701706/LLMOps.git']]
        )
      }
    }
    stage('Install Dependencies') {
      steps {
        sh 'pip install --upgrade -r requirements.txt'
      }
    }
    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('sonar-server') {
          sh "$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=LLMOps -Dsonar.projectKey=LLMOps"
        }
      }
    }
    stage('Wait for SonarQube Processing') {
  steps {
    sleep time: 1, unit: 'MINUTES'
  }
} 
    stage('Quality Gate') {
      steps {
        script {
          waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token'
        }
      }
    } 
    stage('Snyk Security Check') {
      steps {
        echo 'Testing...'
        snykSecurity(
          severity: 'high',
          snykInstallation: 'snyk-latest',
          snykTokenId: 'snyk-api',
          targetFile: "requirements.txt",
          failOnIssues: false,
          additionalArguments: '--command=python3'
        )
      }
    }
    
    
    stage('Trivy FS Scan') {
            steps {
                sh "trivy fs . > trivyfs.txt"
            }
        }
    
    stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {   
                        sh "docker build -t llmops . -f Dockerfile"
                        sh "docker tag llmops morlom/llmops:latest "
                        sh "docker push morlom/llmops:latest "
                    }
                }
            }
        }
    
    stage('Trivy Image Scan') {
            steps {
                sh "trivy image morlom/llmops:latest > trivyimage.txt" 
            }
        }
    stage('Deploy to container'){
            steps{
                // Stop and remove the existing container if it exists
                sh 'docker stop llmops || true'
                sh 'docker rm llmops || true'
                // Build and run the new container with environment variables
                sh """
                    docker run -d --name llmops -p 5000:5000 \
                    -e OPENAI_API_KEY=${OPENAI_API_KEY} \
                    -e SECRET_KEY=${SECRET_KEY} \
                    morlom/llmops:latest
                """
                // Ensure the application is running
                sh 'sleep 30'
            }
        }
    stage('Deploy to Kubernetes') {
            steps {
                script {
                    withKubeConfig(credentialsId: 'k8s', serverUrl: '') {
                        try {
                        // Create or update Kubernetes secret
                        sh """
                           kubectl create secret generic app-secrets \
                            --from-literal=OPENAI_API_KEY=${OPENAI_API_KEY} \
                            --from-literal=SECRET_KEY=${SECRET_KEY} \
                            --dry-run=client -o yaml | kubectl apply -f -
                        """
                            // Apply the deployment
                            sh 'kubectl apply -f deployment.yml'
                            
                            // Force a rollout restart to ensure the latest image is pulled
                            sh 'kubectl rollout restart deployment llmops-deployment'
                            
                            // Wait for the deployment to complete
                            sh 'kubectl rollout status deployment/llmops-deployment'
                            
                            // Apply the service
                            sh 'kubectl apply -f service.yml'
                            
                            // Verify the service
                            sh 'kubectl get service llmops-service'
                        } catch (Exception e) {
                            currentBuild.result = 'FAILURE'
                            error("Deployment failed: ${e.message}")
                        }
                    }
                }
            }
        }
    

    stage('OWASP ZAP DAST') {
            steps {
                script {
                    // Remove any existing ZAP container
                    sh 'docker rm -f zap || true'
                    // Run ZAP Docker container and execute the baseline scan
                    def zapReturnCode = sh(script: '''
                        docker run --rm --name zap -u 0 -p 8090:8090 -v $(pwd):/zap/wrk/:rw zaproxy/zap-stable zap-baseline.py \
                        -t http://100.28.246.166:30007 -r zap_report.html
                    ''', returnStatus: true)
                    // Archive the ZAP report
                    archiveArtifacts artifacts: 'zap_report.html'
                    // Handle ZAP return code
                    if (zapReturnCode != 0 && zapReturnCode != 2) {
                        error "ZAP scan failed with return code ${zapReturnCode}"
                    } else {
                        echo "ZAP scan completed with warnings (return code ${zapReturnCode})"
                    }
                }
            }
        }
    }
}