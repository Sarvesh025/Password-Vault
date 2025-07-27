pipeline {
  agent any

  environment {
    NODE_ENV = 'production'
  }

  stages {
    stage('Checkout Code') {
      steps {
        git credentialsId: 'github-creds', url: 'https://github.com/Sarvesh025/Password-Vault'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Lint Code') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build Project') {
      steps {
        sh 'npm run build'
      }
    }
  }
}
