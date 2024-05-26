--- Create accesses

INSERT INTO accesses (name) VALUES ('admin'), ('team_lead'), ('employee'), ('client');

--- Create organization

INSERT INTO organizations (name) VALUES ('Testowa Organizacja');

--- Create a sample project

INSERT INTO projects ("name", "description", "created_at", "updated_at") VALUES ('Testowy Projekt', 'Oto projekt sluzacy do testow.', current_timestamp, current_timestamp);

--- Create a sample employee

INSERT INTO employees ("user_id") VALUES (1);

--- Connect an employee to a project

INSERT INTO employee_projects ("since", "employee_id", "project_id") values (current_timestamp, 1, 1);

--- Insert into table "Accesses"

INSERT INTO accesses ("name") values ('Admin'), ('Team Lead'), ('Project Manager'), ('Employee'), ('Client');

--- Drop database

TRUNCATE TABLE accesses, attachments, client_projects, clients, comments, employee_projects, employee_technologies, employees, employment_histories, migrations, organizations, priorities, projects, roles, sessions, statuses, teams, technologies, ticket_histories, tickets, types, user_tickets, users CASCADE;
DROP TABLE accesses, attachments, client_projects, clients, comments, employee_projects, employee_technologies, employees, employment_histories, migrations, organizations, priorities, projects, roles, sessions, statuses, teams, technologies, ticket_histories, tickets, types, user_tickets, users;