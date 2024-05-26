--- Create accesses

INSERT INTO accesses (name) VALUES ('admin'), ('team_lead'), ('employee'), ('client');

--- Create a sample project

INSERT INTO projects ("name", "description", "created_at", "updated_at") VALUES ('Testowy Projekt', 'Oto projekt sluzacy do testow.', current_timestamp, current_timestamp);

--- Create a sample employee

INSERT INTO employees ("user_id") VALUES (1);

--- Connect an employee to a project

INSERT INTO employee_projects ("since", "employee_id", "project_id") values (current_timestamp, 1, 1);

--- Insert into table "Accesses"

INSERT INTO accesses ("name") values ('Admin'), ('Team Lead'), ('Project Manager'), ('Employee'), ('Client');