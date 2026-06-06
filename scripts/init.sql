CREATE TABLE IF NOT EXISTS categories (
    name TEXT PRIMARY KEY,
    icon TEXT DEFAULT '🍣',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dishes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    en TEXT,
    price REAL NOT NULL,
    image TEXT,
    tag TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category) REFERENCES categories(name)
);

CREATE INDEX IF NOT EXISTS idx_category ON dishes(category);

-- Categorías de ejemplo
INSERT OR IGNORE INTO categories (name, icon) VALUES
('compartir', '🍱'),
('rolls', '🍣'),
('nigiri', '🍙'),
('sashimi', '🐟'),
('sides', '🥒');

-- Platos de ejemplo (Nikkei)
INSERT OR IGNORE INTO dishes (id, name, category, description, en, price, tag) VALUES
(1, 'Edamame', 'compartir', 'Vainas de soja al vapor, sal marina en escamas.', 'Steamed soy beans', 4800, 'veggie'),
(2, 'Gyozas · 5u', 'compartir', 'Empanaditas de cerdo selladas a la plancha, ponzu cítrico.', 'Pan-seared dumplings', 8900, 'pop'),
(3, 'Tako Wakame', 'compartir', 'Pulpo, alga wakame, pepino, sésamo tostado.', 'Octopus & seaweed', 11500, NULL),
(4, 'California Roll', 'rolls', 'Cangrejo, aguacate, pepino, huevino.', 'Crab, avocado, cucumber', 9500, 'pop'),
(5, 'Philadelphia Roll', 'rolls', 'Salmón, queso crema, pepino, eneldo.', 'Salmon, cream cheese, dill', 11500, NULL),
(6, 'Spicy Tuna Roll', 'rolls', 'Atún picante, cebolleta, sriracha, mayo picante.', 'Spicy tuna, scallion', 10500, NULL),
(7, 'Nigiri Salmón', 'nigiri', 'Arroz con salmón premium.', 'Salmon nigiri', 8500, NULL),
(8, 'Nigiri Atún Rojo', 'nigiri', 'Arroz con atún rojo de máxima calidad.', 'Red tuna nigiri', 9500, NULL),
(9, 'Sashimi Salmón · 3u', 'sashimi', 'Tres porciones de salmón premium.', '3 pieces of salmon', 10500, NULL),
(10, 'Sashimi Atún · 3u', 'sashimi', 'Tres porciones de atún rojo premium.', '3 pieces of red tuna', 12500, NULL);
