pipeline {
    agent any
    
    environment {
        DOCKERHUB_USERNAME = 'abdoul223'
        IMAGE_BACKEND = 'smartphone-backend'
        IMAGE_FRONTEND = 'smartphone-frontend'
        SONAR_HOST_URL = 'https://sonarcloud.io'
        SONAR_PROJECT_KEY = 'Abdoula223_DEvop-app'
        SONAR_ORGANIZATION = 'abdoula223'
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Récupération du code...'
                checkout scm
            }
        }
        
        stage('SonarCloud Analysis') {
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
        
        stage('Deploy') {
            steps {
                script {
                    echo '🚀 Déploiement...'
                    
                    // Créer le .env EXACTEMENT comme avant
                    sh '''
                        mkdir -p backend
                        cat > backend/.env << 'ENVFILE'
PORT=5000
MONGO_URI=mongodb://mongo:27017/smartphoneDB
DELETE_CODE=123
ENVFILE
                        echo "✅ Fichier .env créé"
                        cat backend/.env
                    '''
                    
                    sh """
                        docker compose down --remove-orphans || true
                        docker compose pull
                        docker compose up -d
                        sleep 10
                        docker compose ps
                        docker logs backend --tail 20
                    """
                }
            }
        }
    }
    
    post {
        success {
            script {
                echo '✅ Pipeline réussi !'
                
                // Email de succès
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
                                <li><a href="https://sonarcloud.io/project/overview?id=Abdoula223_DEvop-app">📊 SonarCloud</a></li>
                                <li><a href="https://hub.docker.com/r/${DOCKERHUB_USERNAME}">🐳 Docker Hub</a></li>
                                <li><a href="${BUILD_URL}console">📄 Logs Jenkins</a></li>
                            </ul>
                            
                            <h3>🚀 Application</h3>
                            <ul>
                                <li>Frontend: <a href="http://localhost">http://localhost</a></li>
                                <li>Backend: <a href="http://localhost:5000/api/smartphones">http://localhost:5000/api/smartphones</a></li>
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
                
                // Email d'échec
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
