pipeline {
  agent any

  environment {
    FRONTEND_IMAGE = 'devsecops-portfolio-frontend'
    BACKEND_IMAGE = 'devsecops-portfolio-backend'
  }

  stages {
    stage('Install') {
      parallel {
        stage('Frontend') {
          steps {
            dir('frontend') {
              sh 'npm install'
            }
          }
        }
        stage('Backend') {
          steps {
            dir('backend') {
              sh 'npm install'
            }
          }
        }
      }
    }

    stage('Test') {
      parallel {
        stage('Frontend Quality') {
          steps {
            dir('frontend') {
              sh 'npm run lint'
              sh 'npm test'
            }
          }
        }
        stage('Backend Quality') {
          steps {
            dir('backend') {
              sh 'npm run lint'
              sh 'npm test'
            }
          }
        }
      }
    }

    stage('Build') {
      parallel {
        stage('Frontend Build') {
          steps {
            dir('frontend') {
              sh 'npm run build'
            }
          }
        }
        stage('Backend Build Check') {
          steps {
            dir('backend') {
              sh 'node --check src/server.js'
            }
          }
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER frontend'
        sh 'docker build -t $BACKEND_IMAGE:$BUILD_NUMBER backend'
      }
    }

    stage('Deploy Simulation') {
      steps {
        echo 'Simulating deployment to AWS EC2.'
        echo 'In production, this stage would pull images on EC2 or deploy through a registry-backed release process.'
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
