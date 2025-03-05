-- Crear tabla usuarios
CREATE TABLE Usuarios (
    Id SERIAL PRIMARY KEY,
    Nombres VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password_hash VARCHAR(255) NOT NULL,
    Foto_perfil_url VARCHAR(255),
    Fecha_nacimiento DATE NOT NULL,
	Rol VARCHAR(255) NOT NULL
);

-- Crear tabla libros
CREATE TABLE Libros (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Autor VARCHAR(100) NOT NULL,
    Sinopsis TEXT,
    Portada_url VARCHAR(255) NOT NULL,
    Pdf_url VARCHAR(255) NOT NULL,
    Anio_publicacion INT
);

-- Crear tabla categorias
CREATE TABLE Categorias (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL
);

-- Crear tabla adquisiciones
CREATE TABLE Adquisiciones (
    Id SERIAL PRIMARY KEY,
    Usuario_id INT REFERENCES Usuarios(Id),
    Libro_id INT REFERENCES Libros(Id),
    Fecha_adquisicion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla libros_categorias (relación muchos a muchos)
CREATE TABLE Libros_categorias (
    Libro_id INT REFERENCES Libros(Id),
    Categoria_id INT REFERENCES Categorias(Id),
    PRIMARY KEY (Libro_id, Categoria_id)
);