# Taskly - Aplikacja web do zarządzania zespołem i system zgłoszeń

## Podsumowanie

Taskly to aplikacja umożliwiająca zarządzanie projektami oraz zespołami w firmach tworzących oprogramowanie. Narzędzie jest przystosowane zarówno do zespołów, które tworzą rozwiązania na użytek wewnętrzny, jak i dla zewnętrznych klientów.

### Główne funkcjonalności

* **Tworzenie użytkowników, zespołów, projektów i zgłoszeń**: Podział ten umożliwia odpowiednie zorganizowanie pracy, szczególnie w organizacjach, w których jednocześnie tworzonych jest wiele produktów, przez wiele zespołów, na potrzeby wielu użytkowników zewnętrznych.
* **Przejrzysty interfejs**: Aplikacja oferuje intuicyjny dashboard podsumowujący wybrany przez użytkownika projekt.
* **Internacjonalizacja**: Możliwość dostosowania języka interfejsu do preferencji użytkownika.
* **Udostępnianie plików**: Członkowie projektu mogą łatwo dzielić się plikami.

### Technologie backendowe

Serwer aplikacji został utworzony przy użyciu frameworku **Express.js**, z wykorzystaniem ORM Sequelize do wykonywania zapytań na bazie danych. Sama baza danych jest zarządzana przez relacyjny system **PostgreSQL** i hostowana na [fly.io](https://fly.io/).

### Technologie frontendowe

Interfejs jest napisany w środowisku uruchomieniowym **Node.js**, przy użyciu frameworku **React** oraz narzędzia do bundlingu **Vite**. Znaczna część komponentów wykorzystanych w aplikacji pochodzi z biblioteki **Material UI**.

### Hosting

Aplikacja również jest hostowana na platformie [fly.io](https://fly.io/) i jest dostępna pod adresem https://taskly-backend.fly.dev/.

## Instalacja

Aby uruchomić aplikację lokalnie należy:

1. Pobrać Node.js: [Pobierz Node.js](https://nodejs.org/en/download/prebuilt-installer)
2. Sklonować to repozytorium przy uzyciu komendy 'git clone https://github.com/Path-Finder-00/taskly-backend.git'
3. Zmienić gałąź na 'uat' przy pomocy komendy 'git switch uat && git pull'
4. Zainstalować narzędzie konsolowe flyclt:
    -   na Windows: pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
    -	na Linux: curl -L https://fly.io/install.sh | sh
    -	na MacOS: curl -L https://fly.io/install.sh | sh
5. Zalogować się na specjalnie utworzone konto w aplikacji fly.io przy uzyciu komendy 'fly auth login', podanymi danymi: 
    - login: taskly.db.user@gmail.com
    - hasło: 42M*E>vL})Tn8Mu
6. Dodać do folderu aplikacji pliku .env (należy upewnić się, że utworzony plik nie jest plikiem tekstowym, a plikiem ENV) o następującej strukturze:
    - DATABASE_URL=postgres://postgres:bH21HI50Xm9p3on@127.0.0.1:15432
    - SECRET=secret
    - PORT=3001
7. W osobnych oknach konsoli, w folderze aplikacji, wywołać następujące komendy, w podanej kolejności:
    -   fly proxy 15432:5432 -a taskly-db
    -   npm install && npm run dev
8. Uruchomić aplikacę poprzez przejście na adres http://localhost:3001.
9. Zalogować się do aplikacji na jednym z podanych kont (konta róznia się dostepnymi funkcjami):
    - Admin
        - Email: admin@gmail.com
        - Hasło: password
    - Lider zespołu
        - Email: team_leader_1@gmail.com
        - Hasło: password
    - Menadżer projektu
        - Email: manager1@gmail.com
        - Hasło: password
    - Pracownik
        - Email: pracownik1@gmail.com
        - Hasło: password
    - Klient
        - Email: klient1@gmail.com
        - Hasło: password

    
    