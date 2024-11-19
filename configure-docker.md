# witam w poradniku tworzenia wlasnego srodowiska pod docker


## 1.1 Wrzucamy nasze pliki z brancha testy-pod-docker na jakiejś urządzenie typu terminal, maszyna wirtualna itd.

### Na tym branchu są już utworzone pliki Dockerfile oraz Docker-Compose

## 1.2 Następnie logujemy się na nasz terminal i tworzymy strukture katalogów, i ustawiamy uprawnienia tak aby kontener z baza mogl odczytywac dane

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
Uprawnienia: 

` sudo chown -R 10001:10001 /IO-PROJ-DATA/database/data /IO-PROJ-DATA/database/log /IO-PROJ-DATA/database/secrets `

I uruchamiamy kontener z baza tym poleceniem 

```
docker run -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=Zaq12wsx' \
-p 1433:1433 \
-v /IO-PROJ-DATA/database/data:/var/opt/mssql/data \
-v /IO-PROJ-DATA/database/log:/var/opt/mssql/log \
-v /IO-PROJ-DATA/database/secrets:/var/opt/mssql/secrets \
-d mcr.microsoft.com/mssql/server:2022-latest
```

## 1.3 Kolejnym krokiem bedzie utworzenie bazy danych

### 1.3.1 Przechodzimy do visual studio i zmieniamy connection string 

```
"DockerConnection": "Server=<your_device_IP>,1433;Database=ProjectIO;User Id=sa;Password=Zaq12wsx;Encrypt=True;TrustServerCertificate=True;"
```

### 1.3.2 Wykonujemy migracje i aktualizacje bazy

```
add-migration init
update-database
```

## 1.4 W pliku .env w katalogu ./Frontend/web/Album/album dodajemy wpis
```
VITE_LOCALHOST_IP=adres_IP
```

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
     - DATABASE_IP={your_local_ip}
    ports:
      - 8080:8080
    volumes:
      - /IO-PROJ-DATA/backend/zdjecia:/app/zdjecia
    restart: always
  frontend:
    build:
     context: ./frontend-web
     args:
      DOCKER_ENV_FRONT_URL: "{your_local_ip}"
    ports:
      - 3001:3000
    restart: always
    depends_on:
      - backend
```

Zostanie utworzony nowy obraz aplikacji backednowej i frontendowej z baza danych zaciagnie dane z folderow

A na koniec uruchamiamy stos

```
docker compose up --build --detach
```
