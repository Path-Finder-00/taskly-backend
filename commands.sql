--- Create accesses

INSERT INTO accesses (name) VALUES ('admin'), ('team_lead'), ('manager'), ('employee'), ('client');

--- Create organization

INSERT INTO organizations (name) VALUES ('Testowa Organizacja');

--- Create sample technologies

INSERT INTO technologies (technology) VALUES ('Scala'), ('Java'), ('SQL'), ('React'), ('JavaScript'), ('Node.js'), ('Python');

--- Create sample roles

INSERT INTO roles (role) VALUES ('Menadżer'), ('Team Leader'), ('Grafik'), ('Backend Developer'), ('Frontend Developer'), ('Scrum Master'), ('Klient');

--- Create sample priorities

INSERT INTO priorities (priority) VALUES ('Niski'), ('Średni'), ('Wysoki'), ('Krytyczny');

--- Create sample types

INSERT INTO types (type) VALUES ('Bug'), ('Feature'), ('Change Request');

--- Create sample statuses

INSERT INTO statuses (status) VALUES ('Nowy'), ('Przypisany'), ('W trakcie'), ('Oceniany'), ('Zamknięty');

--- Create a sample project

INSERT INTO projects ("name", "description", "created_at", "updated_at") VALUES ('Testowy Projekt', 'Oto projekt sluzacy do testow.', current_timestamp, current_timestamp);

--- Create a sample employee

INSERT INTO employees ("user_id") VALUES (1);

--- Connect an employee to a project

INSERT INTO employee_projects ("since", "employee_id", "project_id") values (current_timestamp, 1, 1);

--- Create sample permissions

TRUNCATE TABLE access_permissions, permissions;
select setval('access_permissions_id_seq', 1, false);
select setval('permissions_id_seq', 1, false);

INSERT INTO permissions ("name") values ('seeAllUsers'), ('editAnyUser'), ('editUserInTeam'), ('createTeam'), ('createUser'), ('createHighAccessUser'), ('assignUser'), ('createProject'), ('editProject');
--- Admin permissions
INSERT INTO access_permissions ("access_id", "permission_id") VALUES (1, 1), (1, 2), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9);
--- Team lead permissions
INSERT INTO access_permissions ("access_id", "permission_id") VALUES (2, 1), (2, 3), (2, 5), (2, 7), (2, 8), (2, 9);
--- Manager permissions
INSERT INTO access_permissions ("access_id", "permission_id") VALUES (3, 7), (3, 9);
--- Employee permissions
INSERT INTO access_permissions ("access_id", "permission_id") VALUES (4, 7);

--- Drop database

--TRUNCATE TABLE accesses, attachments, client_projects, clients, comments, employee_projects, employee_technologies, employees, employment_histories, migrations, organizations, priorities, projects, roles, sessions, statuses, teams, technologies, ticket_histories, tickets, types, user_tickets, users CASCADE;
--DROP TABLE accesses, attachments, client_projects, clients, comments, employee_projects, employee_technologies, employees, employment_histories, migrations, organizations, priorities, projects, roles, sessions, statuses, teams, technologies, ticket_histories, tickets, types, user_tickets, users;