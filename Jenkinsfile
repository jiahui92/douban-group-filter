pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        withNPM() {
          sh '''npm i
'''
        }

      }
    }
  }
  environment {
    echo = 'start'
  }
}