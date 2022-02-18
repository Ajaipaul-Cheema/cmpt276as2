CREATE DATABASE rectangleDatabase;
CREATE TABLE rectangle (
    id SERIAL NOT NULL PRIMARY KEY,
    rectangleName VARCHAR(27),
    rectangleWidth SMALLINT,
    rectangleHeight SMALLINT,
    rectangleColor VARCHAR(15),
    rectangleBorder VARCHAR(5),
    rectangleBorderColor VARCHAR(10)
);
