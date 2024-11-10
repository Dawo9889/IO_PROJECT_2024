# Jak uruchomic aplikacje frontendową do testów i zabaw :)

Kiedy pobierzemy repo przechodzimy do folderu

```
IO_PROJECT_2024\Frontend\web\Album\album
```

A w nim wykonujemy polecenie 

```
npm install 
```
aby zainstalować wymagane zależności itd.

Kiedy wszystko sie zainstaluje wystarczy wykonac polecenie 

```
npm start
```

Aplikacja uruchomi się pod portem 3000

Po uruchomieniu aplikacja odpali się na lokalizacji /

Póki co można ręcznie przechodzić pomiędzy routes-ami

```
/album
/weddings
/login
/register
/linkpage
/unauthorized
```

Aby móc wykorzystać zabawe z api to musicie stowrzyć sobie jakiejś konto w bazie i po zalogowaniu pobrać token.

Tworzycie plik .env w glownym katalogu aplikacji i wrzucacie `VITE_APP_API_TOKEN=bearer_token`