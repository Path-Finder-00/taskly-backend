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

Interfejs jest napisany w środowisku uruchomieniowym **Node.js**, przy użyciu frameworków **React** oraz **Vue**. Znaczna część komponentów wykorzystanych w aplikacji pochodzi z biblioteki **Material UI**.

### Hosting

Aplikacja również jest hostowana na platformie [fly.io](https://fly.io/) i jest dostępna pod adresem https://taskly-backend.fly.dev/.

## Instalacja

Aby uruchomić aplikację lokalnie należy:

1. Pobrać Node.js: [Pobierz Node.js](https://nodejs.org/en/download/prebuilt-installer)
2. 