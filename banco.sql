CREATE DATABASE IF NOT EXISTS cadastro_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cadastro_db;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id        INT          NOT NULL AUTO_INCREMENT,
    email     VARCHAR(150) NOT NULL,
    senha     TEXT         NOT NULL,
    data_hora DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Para visualizar os cadastros:
SELECT * FROM usuarios ORDER BY data_hora DESC;
