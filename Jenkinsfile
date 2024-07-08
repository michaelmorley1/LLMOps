// Define color mapping for build status notifications
def COLOR_MAP = [
  'FAILURE': 'danger',
  'SUCCESS': 'good'
]

pipeline {
  agent any // Allows this pipeline to run on any available agent

  // Set environment variables for the pipeline
  environment {
    SCANNER_HOME = tool 'sonar-scanner' // Defines the home directory of the sonar-scanner tool
  }

  // Define the stages of the pipeline
  stages {
    // Clean the workspace at the beginning of the run
    stage('Clean Workspace') {
      steps {
        cleanWs() // Cleans all files from the workspace
      }
    }

    // Check out the code from a Git repository
    stage('Checkout') {
      steps {
        checkout scmGit(
          branches: [[name: '*/main']], // Specifies the branch to checkout
          extensions: [],
          userRemoteConfigs: [[credentialsId: 'gitlab-access', url: 'https://gitlab.com/group-project1701706/LLMOps.git']]
        )
      }
    }

    // Install project dependencies from the requirements.txt file
    stage('Install Dependencies') {
      steps {
        sh 'pip install --upgrade -r requirements.txt' // Run pip install command
      }
    }

    // Perform static code analysis with SonarQube
    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('sonar-server') { // Set the SonarQube environment
          sh "$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=LLMOps -Dsonar.projectKey=LLMOps"
        }
      }
    }

    // Pause the pipeline to wait for external processing by SonarQube
    stage('Wait for SonarQube Processing') {
      steps {
        sleep time: 1, unit: 'MINUTES' // Sleep for 1 minute
      }
    }

    // Wait for the SonarQube quality gate result
    stage('Quality Gate') {
      steps {
        script {
          waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token'
        }
      }
    }

    // Perform security vulnerability check using Snyk
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

    // Scan the file system for vulnerabilities using Trivy
    stage('Trivy FS Scan') {
      steps {
        sh "trivy fs . > trivyfs.txt" // Save the output to trivyfs.txt
      }
    }

    // Build and push a Docker image to a Docker registry
    stage('Docker Build & Push') {
      steps {
        script {
          withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {   
            sh "docker build -t llmops . -f Dockerfile" // Build Docker image
            sh "docker tag llmops morlom/llmops:latest " // Tag the image
            sh "docker push morlom/llmops:latest " // Push the image to a registry
          }
        }
      }
    }

    // Scan the Docker image for vulnerabilities using Trivy
    stage('Trivy Image Scan') {
      steps {
        sh "trivy image morlom/llmops:latest > trivyimage.txt" // Save the output to trivyimage.txt
      }
    }

    // Deploy the application to a Docker container
    stage('Deploy to container') {
      steps {
        // Stop and remove the existing container if it exists
        sh 'docker stop llmops || true'
        sh 'docker rm llmops || true'
        // Build and run the new container
        sh 'docker run -d --name llmops -p 5000:5000 morlom/llmops:latest'
        // Ensure the application is running
        sh 'sleep 30'
      }
    }

    // Deploy the application to Kubernetes
    stage('Deploy to Kubernetes') {
      steps {
        script {
          withKubeConfig(credentialsId: 'k8s', serverUrl: '') {
            try {
              // Apply the Kubernetes deployment
              sh 'kubectl apply -f deployment.yml'
              // Wait for the deployment to complete
              sh 'kubectl rollout status deployment/llmops-deployment'
              // Apply the Kubernetes service
              sh 'kubectl apply -f service.yml'
              // Verify the service is up and running
              sh 'kubectl get service llmops-service'
            } catch (Exception e) {
              currentBuild.result = 'FAILURE'
              error("Deployment failed: ${e.message}")
            }
          }
        }
      }
    }

    // Perform dynamic security testing with OWASP ZAP
    stage('OWASP ZAP DAST') {
      steps {
        script {
          // Remove any existing ZAP container
          sh 'docker rm -f zap || true'
          // Run ZAP Docker container and execute the baseline scan
          def zapReturnCode = sh(script: '''
              docker run --rm --name zap -u 0 -p 8090:8090 -v $(pwd):/zap/wrk/:rw zaproxy/zap-stable zap-baseline.py \
              -t http://34.200.59.148:5000 -r zap_report.html
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
