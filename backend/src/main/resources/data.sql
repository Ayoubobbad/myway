-- Insert test users
INSERT INTO users (name, email, password, role, status, created_at, updated_at) VALUES
('Admin User', 'admin@myway.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Test User', 'user@myway.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('John Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert stations for Casablanca
INSERT INTO stations (name, latitude, longitude, type, address, city, is_active, created_at, updated_at) VALUES
('Casa Port', 33.6069, -7.6164, 'TRAMWAY', 'Boulevard Mohammed V', 'Casablanca', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Casa Voyageurs', 33.5731, -7.5898, 'MIXED', 'Avenue des FAR', 'Casablanca', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Place Mohammed V', 33.5928, -7.6192, 'BUS', 'Place Mohammed V', 'Casablanca', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ain Diab', 33.5731, -7.6731, 'TRAMWAY', 'Corniche Ain Diab', 'Casablanca', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Maarif', 33.5731, -7.6164, 'BUS', 'Boulevard Zerktouni', 'Casablanca', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gauthier', 33.5928, -7.6164, 'TRAMWAY', 'Boulevard Rachidi', 'Casablanca', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hay Mohammadi', 33.5500, -7.5500, 'BUS', 'Hay Mohammadi', 'Casablanca', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sidi Moumen', 33.6200, -7.5200, 'BUS', 'Sidi Moumen', 'Casablanca', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert transport lines
INSERT INTO transport_lines (name, type, color, description, is_active, created_at, updated_at) VALUES
('T1', 'TRAMWAY', '#FF0000', 'Ligne de tramway T1 - Sidi Moumen ↔ Ain Diab', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T2', 'TRAMWAY', '#0000FF', 'Ligne de tramway T2 - Hay Mohammadi ↔ Ain Sebaa', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('L1', 'BUS', '#00FF00', 'Ligne de bus L1 - Centre-ville', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('L2', 'BUS', '#FFFF00', 'Ligne de bus L2 - Maarif ↔ Casa Port', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('L3', 'BUS', '#FF00FF', 'Ligne de bus L3 - Gauthier ↔ Casa Voyageurs', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Link stations to lines
INSERT INTO line_stations (line_id, station_id) VALUES
-- T1 Line
(1, 8), -- Sidi Moumen
(1, 2), -- Casa Voyageurs
(1, 6), -- Gauthier
(1, 4), -- Ain Diab
-- T2 Line
(2, 7), -- Hay Mohammadi
(2, 3), -- Place Mohammed V
(2, 1), -- Casa Port
-- L1 Line
(3, 3), -- Place Mohammed V
(3, 5), -- Maarif
(3, 6), -- Gauthier
-- L2 Line
(4, 5), -- Maarif
(4, 1), -- Casa Port
-- L3 Line
(5, 6), -- Gauthier
(5, 2); -- Casa Voyageurs

-- Insert sample reports
INSERT INTO reports (crowd_level, status, comment, created_at, user_id, station_id, line_id) VALUES
('MOYEN', 'APPROVED', 'Affluence normale en matinée', CURRENT_TIMESTAMP - INTERVAL '2 HOUR', 2, 1, 2),
('FORT', 'APPROVED', 'Très chargé aux heures de pointe', CURRENT_TIMESTAMP - INTERVAL '1 HOUR', 3, 2, 1),
('FAIBLE', 'APPROVED', 'Peu de monde cet après-midi', CURRENT_TIMESTAMP - INTERVAL '30 MINUTE', 2, 3, 3),
('FORT', 'APPROVED', 'Station bondée', CURRENT_TIMESTAMP - INTERVAL '15 MINUTE', 3, 4, 1),
('MOYEN', 'PENDING', 'Affluence modérée', CURRENT_TIMESTAMP - INTERVAL '5 MINUTE', 2, 5, 4);
