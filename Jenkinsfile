pipeline {
    agent any
    
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }
    
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        
        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: 'https://gitlab.com/group-project1701706/LLMOps.git'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh "$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=LLMOps -Dsonar.projectKey=LLMOps"
                }
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
                script {
                    sh "snyk test --all-projects"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }
        
        stage('OWASP FS SCAN') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
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
                        sh "docker build -t LLMOps . -f Dockerfile"
                        sh "docker tag LLMOps morlom/LLMOps:latest "
                        sh "docker push morlom/LLMOps:latest "
                    }
                }
            }
        }
        
        stage('Trivy Image Scan') {
            steps {
                sh "trivy image morlom/LLMOps:latest > trivyimage.txt" 
            }
        }
        
        stage('Deploy to Container') {
            steps {
                sh 'docker run -d --name LLMOps -p 8081:80 morlom/LLMOps:latest'
            }
        }
    }
}
