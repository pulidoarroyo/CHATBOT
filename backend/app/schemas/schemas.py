SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT NOT NULL,
    contraseña TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS Chat (
    id_chat INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    fecha TEXT NOT NULL,
    contenido TEXT,
    fk_usuario INTEGER,
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS Mensaje (
    id_mensaje INTEGER PRIMARY KEY,
    primer_texto TEXT NOT NULL,
    fk_chat INTEGER,
    FOREIGN KEY (fk_chat) REFERENCES Chat(id_chat)
);
"""