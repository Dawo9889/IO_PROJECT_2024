# IO_PROJECT_2024
CUPID

1. Aby wszystko działało tak jak chcecie, musicie na pewno mieć Backend.API jako projekt startowy:

![api jako projekt startowy](Documentation/Images/api_startup.jpg)

2. Otwieramy konsole Nugeta:

![nuget console](Documentation/Images/nuget_console.png)

3. Upewniamy się że mamy ustawione Infrastructure: 

![nuiget_infrastructure](Documentation/Images/nuget_console_infrastructure.png)

4. Sprawdzamy czy mamy jakieś migracje w projekcie:
   
![migrations](Documentation/Images/Migrations.png)

    4.1. Jezeli nie mamy to tworzymy migracje w konsoli: `Add-Migration init`

5. Baza danych aktualnie jest na wbudowanym serwerze sql, który dostajemy podczas instalacji Visual Studio. Aby utworzyć baze danych na podstawie migracji wpisujemy w konsoli `update-database`

6. W wyszukiwarce mozemy poszukac domyslnej apki do zarzadzania bazą danych:
   
![sql_server_explorer](Documentation/Images/sql_explorer.png)

7. Powinniśmy widzieć nasza baze danych:
    
![baza danych](Documentation/Images/baza_w_sql_explorer.png)
