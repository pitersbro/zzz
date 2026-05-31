-- 1. utworz keyspace biblioteka

CREATE KEYSPACE IF NOT EXISTS biblioteka
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};



-- 2 
-- w przestrzeni kluczy "biblioteka" utwórz rodzinę kolumn o nazwie "ksiazki" zawierającą
-- kolumny: id_ksiazki (klucz główny), isbn, tytul, cena, wydawnictwo, rok


CREATE TABLE IF NOT EXISTS biblioteka.ksiazki (
 id_ksiazki int,
 isbn text,
 tytul text,
 cena decimal,
 wydawnictwo text,
 rok int,
 PRIMARY KEY (id_ksiazki)
);


-- 3. wstaw wiersze jako osobne insert into

INSERT INTO biblioteka.ksiazki (id_ksiazki, isbn, tytul, cena, wydawnictwo, rok) VALUES (1, '83-7197-669-0', 'Access 2002. Projektowanie baz danych. Księga eksperta', 79.0, 'Helion', 2002);
INSERT INTO biblioteka.ksiazki (id_ksiazki, isbn, tytul, cena, wydawnictwo, rok) VALUES (2, '83-7197-786-7', 'Access 2002/XP PL dla każdego', 65.0, 'Helion', 2003);
INSERT INTO biblioteka.ksiazki (id_ksiazki, isbn, tytul, cena, wydawnictwo, rok) VALUES (3, '83-7197-691-7', 'ASP.NET. Vademecum profesjonalisty', 59.0, 'Helion', 2003);
INSERT INTO biblioteka.ksiazki (id_ksiazki, isbn, tytul, cena, wydawnictwo, rok) VALUES (4, '83-7279-215-1', 'C++ XML', 41.0, 'Mikom', 2002);
INSERT INTO biblioteka.ksiazki (id_ksiazki, isbn, tytul, cena, wydawnictwo, rok) VALUES (5, '83-7279-149-X', 'Dane w sieci WWW', 31.0, 'Mikom', 2001);



-- 4. w przestrzeni kluczy "biblioteka" utwórz rodzinę kolumn o nazwie "autorzy" zawierającą
-- kolumny: id_autora (klucz główny), imie, nazwisko

CREATE TABLE IF NOT EXISTS biblioteka.autorzy (
 id_autora int,
 imie text,
 nazwisko text,
 PRIMARY KEY (id_autora)
);



-- 5. do rodziny kolumn "autorzy" wstaw następujące wiersze:


INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (1, 'Stephen', 'Forte');
INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (2, 'Thomas', 'Howe');
INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (3, 'Kurt', 'Wall');
INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (4, 'Paul', 'Cassel');
INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (5, 'Craig', 'Eddy');
INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (6, 'Jon', 'Price');
INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (7, 'Scott', 'Worley');
INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (8, 'Fabio', 'Arciniegas');
INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (9, 'Peter', 'Buneman');
INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (10, 'Serge', 'Abiteboul');
INSERT INTO biblioteka.autorzy (id_autora, imie, nazwisko) VALUES (11, 'Dan', 'Suciu');




-- 6. wyświetl kolumny id_ksiazki i tytul z rodziny kolumn "ksiazki"

SELECT id_ksiazki, tytul FROM biblioteka.ksiazki;


-- 7. wyświetl wszystkie kolumny książki o id_ksiazki=4

SELECT * FROM biblioteka.ksiazki WHERE id_ksiazki=4;


-- 8. spróbuj wyświetlić tytuły i ceny książek, które kosztują 65 zł - czy się udało? dlaczego?


SELECT tytul, cena FROM biblioteka.ksiazki WHERE cena=65.0;

SELECT tytul, cena FROM biblioteka.ksiazki WHERE cena=65.0 ALLOW FILTERING;

-- 9. utwórz indeks na kolumnie cena w rodzinie kolumn "ksiazki"

CREATE INDEX IF NOT EXISTS idx_cena ON biblioteka.ksiazki (cena);

-- 10. spróbuj ponownie wyświetlić tytuły i ceny książek, które kosztują 65 zł

SELECT tytul, cena FROM biblioteka.ksiazki WHERE cena=65.0;


-- 11. spróbuj wyświetlić tytuły i ceny książek, których id_ksiazki jest większe od 3 - czy się udało?


SELECT tytul, cena FROM biblioteka.ksiazki WHERE id_ksiazki > 3;

-- 12. do rodziny kolumn "ksiazki" dodaj superkolumnę id_autorow typu set<int>, która umożliwi
-- powiązanie autorów z książką


ALTER TABLE biblioteka.ksiazki ADD id_autorow set<int>;


-- 13. wyświetl strukturę rodziny kolumn "ksiazki" (polecenie DESCRIBE)


DESCRIBE TABLE biblioteka.ksiazki;



-- 14. do każdej książki przypisz listę identyfikatorów jej autorów:


UPDATE biblioteka.ksiazki SET id_autorow={1, 2} WHERE id_ksiazki=1;
UPDATE biblioteka.ksiazki SET id_autorow={3, 4} WHERE id_ksiazki=2;
UPDATE biblioteka.ksiazki SET id_autorow={5, 6} WHERE id_ksiazki=3;
UPDATE biblioteka.ksiazki SET id_autorow={7, 8} WHERE id_ksiazki=4;
UPDATE biblioteka.ksiazki SET id_autorow={9, 10, 11} WHERE id_ksiazki=5;  



-- 15. wyświetl tytuły i listy identyfikatorów autorów wszystkich książek


SELECT tytul, id_autorow FROM biblioteka.ksiazki;

-- 16. utwórz indeks na kolumnie id_autorow rodziny kolumn "ksiazki"


CREATE INDEX IF NOT EXISTS idx_id_autorow ON biblioteka.ksiazki (id_autorow);



-- 17. Spróbuj odnaleźć tytuły książek, które napisał Thomas Howe. W tym celu najpierw znajdź
-- identyfikator autora o takim imieniu i nazwisku, a następnie wyszukaj książkę, która posiada
-- ten identyfikator w swojej kolumnie id_autorow


SELECT id_autora FROM biblioteka.autorzy WHERE imie='Thomas' AND nazwisko='Howe';

SELECT tytul FROM biblioteka.ksiazki WHERE id_autorow CONTAINS 2;


-- 18. posługując się poleceniem DESCRIBE wyświetl opis przestrzeni kluczy "biblioteka"


DESCRIBE KEYSPACE biblioteka;


-- 19. posługując się poleceniem COPY skopiuj zawartość kolumn id_ksiazki, tytul i cena rodziny
-- kolumn "ksiazki" do pliku CSV; skorzystaj z dokumentacji
-- http://docs.datastax.com/en/cql/3.1/cql/cql_reference/copy_r.html
-- dlaczego?


COPY biblioteka.ksiazki (id_ksiazki, tytul, cena) TO 'ksiazki.csv' WITH HEADER=true;


-- 20. utwórz nową rodzinę kolumn o nazwie "nowe_ksiazki" zawierającą kolumny: id_ksiazki (klucz
-- główny), tytul, cena

CREATE TABLE IF NOT EXISTS biblioteka.nowe_ksiazki (
 id_ksiazki int,
 tytul text,
 cena decimal,
 PRIMARY KEY (id_ksiazki)
);

-- 21. posługując się poleceniem COPY wczytaj zawartość wcześniej utworzonego pliku CSV do
-- rodziny kolumn "nowe_ksiazki"; skorzystaj z dokumentacji
-- http://docs.datastax.com/en/cql/3.1/cql/cql_reference/copy_r.html

COPY biblioteka.nowe_ksiazki (id_ksiazki, tytul, cena) FROM 'ksiazki.csv' WITH HEADER=true;

-- 22. wyświetl zawartość rodziny kolumn "nowe_ksiazki"

SELECT * FROM biblioteka.nowe_ksiazki;


-- 23. usuń przestrzeń kluczy "biblioteka"


DROP KEYSPACE biblioteka;
