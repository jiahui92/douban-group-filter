pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        withNPM() {
          sh '''
            echo $PATH
            node -v
            npm -v
            npm i
            npm run build
          '''
        }

      }
    }
  }
}