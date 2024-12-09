pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        TARGET_IP = "192.168.100.200"
        FOLDER_PATH = "/var/lib/jenkins/workspace/Cupid"
        DATA_FOLDER_PATH = "data"
        GIT_REPO_URL = "git@github.com:Dawo9889/IO_PROJECT_2024.git"
        BRANCH_NAME = "main"
        REPO_DIR = "IO_PROJECT_2024"
        GIT_CREDENTIALS_ID = "cupid"
    }

    stages {
        stage('Prepare Folder') {
            steps {
                script {
                    sh """
                        if [ ! -d "${env.FOLDER_PATH}" ]; then
                            echo "Creating folder: ${env.FOLDER_PATH}"
                            sudo mkdir -p ${env.FOLDER_PATH}
                            sudo chown jenkins:jenkins ${env.FOLDER_PATH}
                            sudo chmod 755 ${env.FOLDER_PATH}
                        else
                            echo "Folder already exists: ${env.FOLDER_PATH}"
                        fi
                    """
                }
            }
        }

        stage('Clone or Update Repository') {
            steps {
                dir("${env.FOLDER_PATH}") {
                    sshagent(['github-ssh-key']) {
                        sh """
                            pwd
                            if [ -d "${env.REPO_DIR}" ]; then
                                echo "Repository exists. Pulling latest changes..."
                                cd ${env.REPO_DIR}
                                git fetch origin
                                git checkout ${env.BRANCH_NAME}
                                git pull origin ${env.BRANCH_NAME}
                            else
                                echo "Cloning repository..."
                                git clone ${env.GIT_REPO_URL}
                                cd ${env.REPO_DIR}
                            fi
                        """
                    }
                }
            }
        }


       stage('Create Data Folders') {
           steps {
               dir("${env.FOLDER_PATH}") {
                   script {
                       sh """
                           echo "Creating 'data' directory with subfolders..."
                           sudo mkdir -p ${env.DATA_FOLDER_PATH}/backend/zdjecia ${env.DATA_FOLDER_PATH}/database
                           echo "Changing permissions for backend and database folders"
                           sudo chmod -R 777 ${env.DATA_FOLDER_PATH}/backend
                           sudo chown -R 10001:10001 ${env.DATA_FOLDER_PATH}/database
                       """
                   }
               }
           }
       }

        stage('Update Docker Compose File') {
           steps {
               dir("${env.FOLDER_PATH}/${env.REPO_DIR}") {
                   script {
                       sh """
                           echo "Replacing <your-ip-address> with ${env.TARGET_IP} in docker-compose.yaml"
                           sed -i "s/<your-ip-address>/${env.TARGET_IP}/g" docker-compose.yaml
                           sed -i "s|{URL}|http://${env.TARGET_IP}:8080/api|g" docker-compose.yaml
                           sed -i "s|/docker_github/data/database/|${env.FOLDER_PATH}/data/database/|g" docker-compose.yaml
                           sed -i "s|/docker_github/data/backend/zdjecia|${env.FOLDER_PATH}/data/backend/zdjecia|g" docker-compose.yaml
                       """
                    }
                }
            }
        }

        stage('Start Docker Containers') {
           steps {
               dir("${env.FOLDER_PATH}/${env.REPO_DIR}") {
                   script {
                       sh """
                           echo "Starting Docker containers..."
                           sudo docker compose up --build --force-recreate -d
                       """
                   }
               }
           }
       }
        stage('Cleanup') {
           steps {
               dir("${env.FOLDER_PATH}") {
                   script {
                       sh """
                        find ${env.FOLDER_PATH} -mindepth 1 -maxdepth 1 ! -name 'data' ! -name '${env.REPO_DIR}' -exec rm -rf {} +
                       """
                   }
               }
           }
       }
   }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed.'
        }
    }
}