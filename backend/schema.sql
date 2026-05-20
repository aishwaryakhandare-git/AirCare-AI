CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS preferences (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  theme TEXT DEFAULT 'dark',
  temperature_unit TEXT DEFAULT 'c'
);

INSERT OR IGNORE INTO preferences (id, theme, temperature_unit)
VALUES (1, 'dark', 'c');
