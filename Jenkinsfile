pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'abdoul223'
        IMAGE_BACKEND = 'smartphone-backend'
        IMAGE_FRONTEND = 'smartphone-frontend'
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

        stage('Create .env') {
            steps {
                script {
                    echo '🔐 Création du fichier .env...'
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
                }
            }
        }

        stage('Deploy Local (Docker Compose)') {
            steps {
                script {
                    echo '🚀 Déploiement local avec Docker Compose...'
                    sh '''
                        docker compose down --remove-orphans || true
                        docker compose pull
                        docker compose up -d
                        sleep 5
                        docker compose ps
                        docker logs backend --tail 20
                    '''
                }
            }
        }

        stage('Terraform Deploy') {
            steps {
                script {
                    echo '📦 Déploiement Kubernetes avec Terraform...'
                }
                dir('terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline terminé avec succès !'
        }
        failure {
            echo '❌ Pipeline échoué. Vérifie les logs Jenkins.'
        }
    }
}
