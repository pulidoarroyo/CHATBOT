SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Mensaje (
    id_mensaje INTEGER PRIMARY KEY,
    primer_texto TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Chat (
    id_chat INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    fecha TEXT NOT NULL,
    contenido TEXT,
    fk_usuario INTEGER,
    fk_mensaje INTEGER,
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (fk_mensaje) REFERENCES Mensaje(id_mensaje)
);
"""