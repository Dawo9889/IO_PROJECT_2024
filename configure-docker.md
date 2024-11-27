# witam w poradniku tworzenia wlasnego srodowiska pod docker
# Aktualny poradnik pomaga zautomatyzować proces tworzenia kontenerów (Takie proste CI/CD)

## Do poprawnego rozpoczęcia musimy zacząć od konfiguracji uwierzytelniania do github za pomocą klucza publicznego
### 1. Konfiguracja klucza publicznego na github:
1. Tworzymy parę klucza na naszym linuksie: 
``` ssh-keygen -t ed25519 -C "klucz_do_github" ``` 
1.1. Najlepiej zapisać go w folderze domowym użytkownika, ustawiając jednocześnie nazwę klucza, w celu odróżniania wielu kluczy, np.: 
``` /home/$USER/.ssh/github ``` 
1.2. Passphrase ominiemy ze względu, że to tylko development testowy
1.3. Wchodzimy w ustawienia githuba:

![ustawienia dla githuba](/assets/github-settings.png)

1.4. Dodajemy nowy klucz: 

![klucz github](/assets/github-settings-new-key.png)

1.5. Na linuksie wyświetlamy klucz publiczny, który będziemy kopiować:
``` cat /home/$USER/.ssh/github.pub ```  

![cat](/assets/cat-pub-key.png)

1.6. Wklejamy ten klucz publiczny i zapisujemy

![Wkelajnie klucza publicznego](/assets/pasting_key.png)

### 2. Teraz na linuksie tworzymy skrypt:
2.1.  ```sudo nano /home$USER/creating_docker_environment.sh ```

2.2 wklejamy plik z podmieniem w szczególności dwóch zmiennych:
``` TARGET_IP="Twoje IP na którym stawiasz urządzenie" ```
``` SSH_KEY_PATH="Twoja scieżka do klucza prywatnego" ```

``` bash
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

# Check if the data folder exists, create it with subfolders if not
if [[ ! -d "$DATA_FOLDER_PATH" ]]; then
    echo "Creating 'data' directory with subfolders backend and database..."
    mkdir -p "$DATA_FOLDER_PATH/backend" "$DATA_FOLDER_PATH/database"
else
  echo "Data folder already exists: $DATA_FOLDER_PATH"
fi

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

```


2.3. Następnie nadajemy uprawnienia dla pliku: 
```sudo chmod +x creating_docker_environment.sh```

2.4. Teraz możemy wykonać nasz skrypt: 
``` ./creating_docker_environment.sh ```
<!-- 
## 1.1 Wrzucamy nasze pliki z git-a na jakiejś urządzenie typu terminal, maszyna wirtualna itd.

### Na tym branchu są już utworzone pliki Dockerfile oraz Docker-Compose

## 1.2 Następnie logujemy się na nasz terminal i tworzymy strukture katalogów projektu

## 1.2.1 truktura folderu /Frontend/web/Album/album

![alt text](image-3.png)

### Struktura folderu /Backend
![alt text](image-1.png)

## 1.2.2 Tworzymy strukture katalogów dla kontenera bazy danych

```
/
 IO-PROJ-DATA
    backend
        zdjecia
    database
        data
        log
        secrets

```

### Nadajemy Uprawnienia: 

` sudo chown -R 10001:10001 /IO-PROJ-DATA/database/data /IO-PROJ-DATA/database/log /IO-PROJ-DATA/database/secrets `

### I uruchamiamy kontener z baza tym poleceniem 

```
docker run -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD={your_password}' \
-p 1433:1433 \
-v /IO-PROJ-DATA/database/data:/var/opt/mssql/data \
-v /IO-PROJ-DATA/database/log:/var/opt/mssql/log \
-v /IO-PROJ-DATA/database/secrets:/var/opt/mssql/secrets \
-d mcr.microsoft.com/mssql/server:2022-latest
```

## 1.3 Kolejnym krokiem bedzie utworzenie bazy danych

### 1.3.1 Przechodzimy do visual studio i zmieniamy connection string 

```
"DockerConnection": "Server=<your_device_IP>,1433;Database=ProjectIO;User Id=sa;Password={your_password};Encrypt=True;TrustServerCertificate=True;"
```

### 1.3.2 Wykonujemy migracje i aktualizacje bazy

```
add-migration init
update-database
```
### Jeśli w konsoli managera pakietów nuget pojawi się taki wpis 
![alt text](image-2.png)
## To oznacza, że wszystko dobrze zostało wykonane

## 1.3.3 Na tym etapie kończymy pracę z Visual Studio

### Na serwerze wykonujemy polecenie:

`docker ps`

#### I usuwamy kontener z bazą danych poleceniem

`docker rm <ID-KONTENERA>`

## 1.5 Na zdalnym urządzeniu tam gdzie mamy nasze pliki projektu twrzymy plik docker-compose 

```
version: "3.8"
services:
  database:
   image: 'mcr.microsoft.com/mssql/server:2022-latest'
   environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD={your_strong_password}
   volumes:
      - /IO-PROJ-DATA/database/data:/var/opt/mssql/data
      - /IO-PROJ-DATA/database/log:/var/opt/mssql/log
      - /IO-PROJ-DATA/database/secrets:/var/opt/mssql/secrets
   ports:
    - 1433:1433
  backend:
    build: ./Backend
    environment:
     - DATABASE_IP=<YOUR-DEVICE-IP>
    ports:
      - 8080:8080
    volumes:
      - /IO-PROJ-DATA/backend/zdjecia:/app/zdjecia
    restart: always
  frontend:
    build:
     context: ./Frontend/web/Album/album/
     args:
      DOCKER_ENV_FRONT_URL: "<YOUR-DEVICE-IP>"
    ports:
      - 3001:3000
    restart: always
    depends_on:
      - backend
```

### Zostanie utworzony nowy obraz aplikacji backednowej i frontendowej z baza danych zaciagnie dane z folderow

#### A na koniec uruchamiamy stos

```
docker compose up --build --detach
``` -->
