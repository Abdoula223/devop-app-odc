pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'abdoul223'
        IMAGE_BACKEND = 'smartphone-backend'
        IMAGE_FRONTEND = 'smartphone-frontend'

        SONAR_HOST_URL = 'https://sonarcloud.io'
        SONAR_PROJECT_KEY = 'Abdoula223/devop-app-odc'
        SONAR_ORGANIZATION = 'abdoula223'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Récupération du code...'
                checkout scm
            }
        }

        stage('Analyse SonarCloud') {
            steps {
                script {
                    echo '📊 Analyse SonarCloud...'
                    withCredentials([string(credentialsId: 'sonarcloud-token', variable: 'SONAR_TOKEN')]) {
                        sh """
                            docker run --rm \
                                -e SONAR_HOST_URL="${SONAR_HOST_URL}" \
                                -e SONAR_TOKEN="${SONAR_TOKEN}" \
                                -v "\$(pwd):/usr/src" \
                                sonarsource/sonar-scanner-cli \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                -Dsonar.organization=${SONAR_ORGANIZATION} \
                                -Dsonar.sources=. \
                                -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/*.test.js
                        """
                    }
                }
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            echo '🔨 Construction Backend...'
                            sh """
                                docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_BACKEND}:${BUILD_NUMBER} \
                                             -t ${DOCKERHUB_USERNAME}/${IMAGE_BACKEND}:latest \
                                             -f backend/Dockerfile ./backend
                            """
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        script {
                            echo '🔨 Construction Frontend...'
                            sh """
                                docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_FRONTEND}:${BUILD_NUMBER} \
                                             -t ${DOCKERHUB_USERNAME}/${IMAGE_FRONTEND}:latest \
                                             --build-arg VITE_API_URL=http://backend-service:5000/api \
                                             -f Dockerfile .
                            """
                        }
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
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
        }

        stage('Déploiement Kubernetes') {
            steps {
                echo '🚀 Déploiement sur Kubernetes...'
                withKubeConfig([credentialsId: 'kubeconfig-jenkins']) {
                    sh 'kubectl apply -f kubernet/mongo-deployment.yaml'
                    sh 'kubectl apply -f kubernet/mongo-service.yaml'
                    sh 'kubectl apply -f kubernet/backend-deployment.yaml'
                    sh 'kubectl apply -f kubernet/backend-service.yaml'
                    sh 'kubectl apply -f kubernet/frontend-deployment.yaml'
                    sh 'kubectl apply -f kubernet/frontend-service.yaml'
                    sh 'kubectl apply -f kubernet/ingress.yaml || echo "Pas d\'ingress"'

                    sh 'kubectl rollout status deployment/mongo'
                    sh 'kubectl rollout status deployment/backend'
                    sh 'kubectl rollout status deployment/frontend'
                }
            }
        }
    }

    post {
        success {
            script {
                echo '✅ Pipeline réussi !'
                emailext(
                    subject: "✅ Jenkins SUCCESS - Build #${BUILD_NUMBER}",
                    body: """
                        <html>
                        <body style="font-family: Arial, sans-serif;">
                            <h2 style="color: #28a745;">✅ Pipeline réussi !</h2>

                            <h3>📋 Détails</h3>
                            <ul>
                                <li><strong>Build:</strong> #${BUILD_NUMBER}</li>
                                <li><strong>Durée:</strong> ${currentBuild.durationString}</li>
                            </ul>

                            <h3>🔗 Liens</h3>
                            <ul>
                                <li><a href="https://sonarcloud.io/project/overview?id=${SONAR_PROJECT_KEY}">📊 SonarCloud</a></li>
                                <li><a href="https://hub.docker.com/r/${DOCKERHUB_USERNAME}">🐳 Docker Hub</a></li>
                                <li><a href="${BUILD_URL}console">📄 Logs Jenkins</a></li>
                            </ul>

                            <h3>🚀 Application</h3>
                            <ul>
                                <li>Frontend: <a href="http://smartphone.local">http://smartphone.local</a></li>
                                <li>Backend: <a href="http://smartphone.local/api/smartphones">http://smartphone.local/api/smartphones</a></li>
                            </ul>
                        </body>
                        </html>
                    """,
                    mimeType: 'text/html',
                    to: 'oldpipa16@gmail.com',
                    from: 'jenkins@devops.local'
                )
            }
        }

        failure {
            script {
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
}
