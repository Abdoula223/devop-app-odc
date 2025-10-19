pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'abdoul223'
        IMAGE_BACKEND = 'smartphone-backend'
        IMAGE_FRONTEND = 'smartphone-frontend'
        KUBECONFIG = "${HOME}/.kube/config"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Récupération du code...'
                checkout scm
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        echo '🔨 Construction Backend...'
                        sh """
                            docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_BACKEND}:${BUILD_NUMBER} \
                                         -t ${DOCKERHUB_USERNAME}/${IMAGE_BACKEND}:latest \
                                         -f backend/Dockerfile ./backend
                        """
                    }
                }
                stage('Build Frontend') {
                    steps {
                        echo '🔨 Construction Frontend...'
                        sh """
                            docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_FRONTEND}:${BUILD_NUMBER} \
                                         -t ${DOCKERHUB_USERNAME}/${IMAGE_FRONTEND}:latest \
                                         -f Dockerfile .
                        """
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '📤 Push vers Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_BACKEND}:${BUILD_NUMBER}
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_BACKEND}:latest
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_FRONTEND}:${BUILD_NUMBER}
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_FRONTEND}:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Déploiement sur Kubernetes...'

                // Mise à jour dynamique des images dans les fichiers YAML
                sh """
                    sed -i 's|image: ${DOCKERHUB_USERNAME}/${IMAGE_BACKEND}:.*|image: ${DOCKERHUB_USERNAME}/${IMAGE_BACKEND}:${BUILD_NUMBER}|' kubernet/backend-deployment.yaml
                    sed -i 's|image: ${DOCKERHUB_USERNAME}/${IMAGE_FRONTEND}:.*|image: ${DOCKERHUB_USERNAME}/${IMAGE_FRONTEND}:${BUILD_NUMBER}|' kubernet/frontend-deployment.yaml
                """

                // Application des fichiers Kubernetes
                sh '''
                    export KUBECONFIG=$HOME/.kube/config
                    kubectl apply -f kubernet/mongo-deployment.yaml
                    kubectl apply -f kubernet/mongo-service.yaml
                    kubectl apply -f kubernet/backend-deployment.yaml
                    kubectl apply -f kubernet/backend-service.yaml
                    kubectl apply -f kubernet/frontend-deployment.yaml
                    kubectl apply -f kubernet/frontend-service.yaml
                    kubectl apply -f kubernet/ingress.yaml
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline réussi !'
            emailext(
                subject: "✅ Jenkins SUCCESS - Build #${BUILD_NUMBER}",
                body: """
                    <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #28a745;">✅ Pipeline réussi !</h2>
                        <ul>
                            <li><strong>Build:</strong> #${BUILD_NUMBER}</li>
                            <li><strong>Durée:</strong> ${currentBuild.durationString}</li>
                            <li><a href="http://smartphone.local">🌐 Accès à l'application</a></li>
                            <li><a href="http://smartphone.local/api/smartphones">📦 API Smartphones</a></li>
                        </ul>
                    </body>
                    </html>
                """,
                mimeType: 'text/html',
                to: 'oldpipa16@gmail.com',
                from: 'jenkins@devops.local'
            )
        }

        failure {
            echo '❌ Pipeline échoué !'
            emailext(
                subject: "❌ Jenkins FAILED - Build #${BUILD_NUMBER}",
                body: """
                    <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #dc3545;">❌ Pipeline échoué !</h2>
                        <p><a href="${BUILD_URL}console">Consulter les logs</a></p>
                    </body>
                    </html>
                """,
                mimeType: 'text/html',
                to: 'oldpipa16@gmail.com',
                from: 'jenkins@devops.local'
            )
        }
    }
}
