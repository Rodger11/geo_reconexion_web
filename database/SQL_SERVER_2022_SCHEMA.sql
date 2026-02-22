-- =======================================================================================
-- PROYECTO: GEO RE-CONEXION 2026
-- MOTOR DE BASE DE DATOS: Microsoft SQL Server 2022
-- DESCRIPCIÓN: Script de creación de tablas optimizado para Geolocalización en la nube.
-- =======================================================================================

-- Crear la base de datos (Ejecutar solo si no existe)
-- CREATE DATABASE GeoReconexionDB;
-- GO
-- USE GeoReconexionDB;
-- GO

-- 1. TABLA DE USUARIOS (Roles y Accesos)
CREATE TABLE Usuarios (
    ID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL, -- Almacenar hash, NUNCA texto plano
    Role VARCHAR(20) NOT NULL, -- ADMIN, MONITOR, COORDINADOR, ENCUESTADOR
    Name VARCHAR(100) NOT NULL,
    Cargo VARCHAR(50),
    Zona VARCHAR(50),
    Activo BIT DEFAULT 1,
    FechaCreacion DATETIME2 DEFAULT GETDATE()
);
GO

-- 2. TABLA DATA_CAMPO (Encuestas y Semaforización)
CREATE TABLE Encuestas (
    ID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FechaHora DATETIME2 DEFAULT GETDATE(),
    
    -- GEOGRAPHY TYPE: Optimo en SQL Server 2022 para cálculos de mapas de calor, radios y polígonos
    UbicacionGPS GEOGRAPHY NOT NULL, 
    Latitud FLOAT NOT NULL,
    Longitud FLOAT NOT NULL,
    
    Zona VARCHAR(50) NOT NULL,
    Manzana VARCHAR(50) NOT NULL,
    Lote VARCHAR(50) NULL,
    CantidadVotantes INT NOT NULL,
    
    Apoyo VARCHAR(20) NOT NULL, -- SI, NO, INDECISO
    ComparteDatos BIT NULL,
    DNI VARCHAR(8) NULL,
    Celular VARCHAR(9) NULL,
    Whatsapp VARCHAR(9) NULL,
    MotivoRechazo VARCHAR(255) NULL,
    Prioridad VARCHAR(20) NOT NULL, -- ALTA, MEDIA, BAJA
    
    EncuestadorID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Usuarios(ID),
    EncuestadorName VARCHAR(100) NOT NULL
);
GO

-- Indice espacial para mejorar radicalmente el rendimiento de los Mapas de Calor en la nube
CREATE SPATIAL INDEX IX_Encuestas_UbicacionGPS ON Encuestas(UbicacionGPS);
GO

-- 3. TABLA ACTIVIDADES (Registro de Eventos de Campaña)
CREATE TABLE Actividades (
    ID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Tipo VARCHAR(100) NOT NULL,
    Nombre VARCHAR(200) NOT NULL,
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    AsistenciaEsperada VARCHAR(2) NOT NULL, -- SI / NO
    AsistenciaReal VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE', -- PENDIENTE, SI, NO
    Direccion VARCHAR(255) NOT NULL,
    Zona VARCHAR(50) NOT NULL,
    Observaciones NVARCHAR(MAX) NULL,
    
    -- Coordenadas de la actividad
    UbicacionGPS GEOGRAPHY NOT NULL,
    Latitud FLOAT NOT NULL,
    Longitud FLOAT NOT NULL,
    
    FotoUrl VARCHAR(500) NULL,
    UsuarioRegistroID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Usuarios(ID)
);
GO

-- 4. TABLA PERSONAL (Monitor RRHH)
CREATE TABLE Personal (
    ID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Estado BIT DEFAULT 1, -- 1 = ACTIVO, 0 = INACTIVO
    ApellidoPaterno VARCHAR(100) NOT NULL,
    ApellidoMaterno VARCHAR(100) NULL,
    Nombres VARCHAR(100) NOT NULL,
    TipoDoc VARCHAR(10) NOT NULL, -- DNI / CE
    NumeroDoc VARCHAR(20) NOT NULL UNIQUE,
    Telefono VARCHAR(15) NULL,
    Whatsapp VARCHAR(15) NULL,
    FechaNacimiento DATE NOT NULL,
    Sexo VARCHAR(15) NOT NULL, -- MASCULINO / FEMENINO
    EsPadreMadre VARCHAR(20) NOT NULL, -- PADRE, NO PADRE, MADRE, NO MADRE
    Correo VARCHAR(150) NULL,
    CargoPartido VARCHAR(50) NOT NULL,
    Profesion VARCHAR(100) NOT NULL,
    Ocupacion VARCHAR(100) NOT NULL,
    Zona VARCHAR(50) NOT NULL,
    FechaRegistro DATETIME2 DEFAULT GETDATE()
);
GO

-- =======================================================================================
-- EJEMPLO DE INSERCIÓN DESDE EL BACKEND (.NET / NODE.JS) A SQL SERVER
-- =======================================================================================
/*
-- Cuando tu API reciba el JSON del frontend, el INSERT debe construir el punto GEOGRAPHY así:

INSERT INTO Encuestas (Latitud, Longitud, UbicacionGPS, Zona, Manzana, CantidadVotantes, Apoyo, Prioridad, EncuestadorName)
VALUES (
    -11.875, 
    -77.125, 
    geography::Point(-11.875, -77.125, 4326), -- 4326 es el estándar espacial SRID para GPS
    'ZONA NORTE', 
    'A1', 
    3, 
    'SI', 
    'BAJA', 
    'Juan Perez'
);
*/
