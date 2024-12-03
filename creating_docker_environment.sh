#!/bin/bash

# Path to the SSH key
SSH_KEY_PATH="$HOME/.ssh/github"
# Device IP address
TARGET_IP="192.168.100.200"

#------------------------------------ You can left it by default
# Path to the folder that requires sudo
FOLDER_PATH="/docker_github"
DATA_FOLDER_PATH="data"
# GitHub repository URL
GIT_REPO_URL="git@github.com:Dawo9889/IO_PROJECT_2024.git"
REPO_DIR=$(basename "$GIT_REPO_URL" .git)

# Branch name to synchronize
BRANCH_NAME="main"



# Check if the SSH key exists
if [[ ! -f "$SSH_KEY_PATH" ]]; then
  echo "SSH key not found at: $SSH_KEY_PATH"
  exit 1
fi

# Start the SSH agent and add the key
eval "$(ssh-agent -s)"
ssh-add "$SSH_KEY_PATH"

# Check if the key was added successfully
if [[ $? -ne 0 ]]; then
  echo "Failed to add the SSH key."
  exit 1
fi

# Create folder with sudo if it doesn't exist
if [[ ! -d "$FOLDER_PATH" ]]; then
  echo "Creating folder that requires sudo: $FOLDER_PATH"
  sudo mkdir -p "$FOLDER_PATH"

  # Set permissions for the folder
  sudo chown "$USER:$USER" "$FOLDER_PATH"
  sudo chmod 755 "$FOLDER_PATH"

  if [[ $? -ne 0 ]]; then
    echo "Failed to create folder: $FOLDER_PATH"
    exit 1
  fi
else
  echo "Folder already exists: $FOLDER_PATH"
fi

# Change to the folder
cd "$FOLDER_PATH" || exit 1


# Check if the repository already exists
if [[ -d "$REPO_DIR" ]]; then
  echo "Repository already exists. Pulling latest changes..."
  cd "$REPO_DIR" || exit 1
  
  # Check if there are any changes on the branch and pull them
  git fetch origin
  git checkout "$BRANCH_NAME"  # Ensure we're on the correct branch
  git pull origin "$BRANCH_NAME"  # Pull the latest changes from the specified branch
  
  if [[ $? -ne 0 ]]; then
    echo "Failed to pull the latest changes from the repository."
    exit 1
  fi
else
  # If the repository doesn't exist, clone it
  echo "Cloning repository..."
  git clone "$GIT_REPO_URL"
  if [[ $? -ne 0 ]]; then
    echo "Failed to clone the repository."
    exit 1
  fi
  cd "$REPO_DIR" || exit 1
fi


cd "$FOLDER_PATH" || exit 1

echo "Creating 'data': $DATA_FOLDER_PATH  directory with subfolders backend and database..."
sudo mkdir -p "$DATA_FOLDER_PATH/backend/zdjecia" "$DATA_FOLDER_PATH/database"
# Change permissions for the backend and database folders
echo "Changing permissions for backend and database folders"
sudo chmod -R 777 "$DATA_FOLDER_PATH/backend"
sudo chown -R 10001:10001 "$DATA_FOLDER_PATH/database"

cd "$FOLDER_PATH/IO_PROJECT_2024"

# Replace <your-ip-address> with the target IP in the docker-compose.yaml file
echo "Replacing <your-ip-address> with $TARGET_IP in the file"
sed -i "s/<your-ip-address>/$TARGET_IP/g" "docker-compose.yaml"

# Replace {URL} with the target IP in the docker-compose.yaml file
sed -i "s|{URL}|http://$TARGET_IP:8080/api|g" "docker-compose.yaml"

# Start the Docker containers
sudo docker compose up --build --force-recreate -d
