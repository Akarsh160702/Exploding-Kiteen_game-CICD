pipeline {
    agent {
        kubernetes {
            yaml """
            apiVersion: v1
            kind: Pod
            spec:
              containers:
              - name: docker
                image: docker:latest
                command:
                - cat
                tty: true
                volumeMounts:
                - name: docker-socket
                  mountPath: /var/run/docker.sock
              - name: node
                image: node:14
                command:
                - cat
                tty: true
            volumes:
            - name: docker-socket
              hostPath:
                path: /var/run/docker.sock
            """
        }
    }
    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'github-credential', branch: 'main', url: 'https://github.com/Akarsh160702/delhivery.git'
            }
        }
        stage('Build') {
            steps {
                container('docker') {
                    sh 'docker build -t akarsh1607/myapp-backend:latest ./Backend'
                    sh 'docker build -t akarsh1607/myapp-frontend:latest ./Frontend'
                }
            }
        }
        stage('Push') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh 'docker push akarsh1607/myapp-backend:latest'
                        sh 'docker push akarsh1607/myapp-frontend:latest'
                    }
                }
            }
        }
        stage('Test') {
            steps {
                container('node') {
                    echo 'Running backend tests...'
                    // Add backend test commands here, e.g., using Mocha or Jest

                    echo 'Running frontend tests...'
                    sh 'cd Frontend && npm install && npm run test'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying to Kubernetes...'
                script {
                    sh 'kubectl apply -f k8s/deployment.yaml'
                }
            }
        }
    }
}