# Wybierz obraz bazowy z Node.js
FROM node:18-alpine

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj plik package.json oraz package-lock.json i zainstaluj zależności
COPY package*.json ./

RUN npm install

# Skopiuj pozostałe pliki do katalogu roboczego
COPY . .

# Ustaw port nasłuchu
EXPOSE 3000

# Uruchom Vite na porcie 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
