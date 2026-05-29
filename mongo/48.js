// stworz baze big_data
use("big_data");
db.users.deleteMany({});

// stworz uzytkownika
db.users.insertOne({
  name: "Jan",
  last_name: "Kowalski",
});

db.users.find({}).forEach(printjson);

// 5. dodaj kolejnych uzytkownikow
db.users.insertMany([
  { name: "Jan", last_name: "Nowak" },
  { name: "Alicja", last_name: "Babacka" },
  { name: "Aleksander", last_name: "Wielki" },
  { name: "Ola", last_name: "Gwint" },
  { name: "Juliusz", last_name: "Cezar" },
  { name: "Anna", last_name: "Nowak" },
]);

print("6. Liczebnosc", db.users.countDocuments({}));

print("7. wszystkie dokumenty o nazwisku Nowak");
db.users.find({ last_name: "Nowak" }).forEach(printjson);

print("8. wszystkie osoby o imieniu Anna badz Alicja");
db.users.find({ name: { $in: ["Anna", "Alicja"] } }).forEach(printjson);

print("9. dodanie informacji o plci");
mezczyzni = ["Jan", "Aleksander", "Juliusz"];
kobiety = ["Alicja", "Ola", "Anna"];

db.users.updateMany({ name: { $in: mezczyzni } }, { $set: { plec: "M" } });

db.users.updateMany({ name: { $in: kobiety } }, { $set: { plec: "K" } });

print("10. mezczyzni z imieniem na J");
db.users.find({ name: { $regex: "^J" }, plec: "M" }).forEach(printjson);

print("11. dodaj kolor green kobietom a blue mezczyznom");
db.users.updateMany({ plec: "K" }, { $set: { color: "green" } });
db.users.updateMany({ plec: "M" }, { $set: { color: "blue" } });

print("12 utworz kolekcje big_data_2 i wprowadz jeden dokument");
db.big_data_2.insertOne({ key: "value" });

print("13. usun kolekcje big_data_2");
db.big_data_2.drop();

print("14. dodaj ulubiony film kazdemu uzytkownikowi");
filmy = [
  { movie: "Pierwsza Krew", gatunek: "sensacja" },
  { movie: "Predator", gatunek: "Sci-fi" },
  { movie: "Obcy", gatunek: "Sci-fi" },
  { movie: "Gladiator", gatunek: "historyczny" },
  { movie: "Matrix", gatunek: "Sci-fi" },
  { movie: "Pulp Fiction", gatunek: "sensacja" },
];

var uzytkownicy = db.users.find({});
while (uzytkownicy.hasNext()) {
  var user = uzytkownicy.next();
  var randomFilm = filmy[Math.floor(Math.random() * filmy.length)];
  db.users.updateOne(
    { _id: user._id },
    { $set: { ulubiony_film: randomFilm } },
  );
}

print("15. stworz kolejcje numbers i wprowadz 3000 dokuentow");

db.numbers.deleteMany({});
var numbers = [];
for (var i = 1; i <= 30000; i++) {
  numbers.push({ value: i });
}

db.numbers.insertMany(numbers);

print("16. zwroc wartosci wieksze od 25000");
db.numbers.find({ value: { $gt: 25000 } }).forEach(printjson);
print("-- zwroc wartosci z przedzialu <1000,15000>");
db.numbers.find({ value: { $gt: 1000, $lt: 15000 } }).forEach(printjson);

print("17. wykorzystaj explain do zapytan z pkt 16");
print("-- explain dla wartosci wiekszych od 25000");
print(db.numbers.find({ value: { $gt: 25000 } }).explain("executionStats"));
print("-- explain dla wartosci z przedzialu <1000,15000>");
print(
  db.numbers
    .find({ value: { $gt: 1000, $lt: 15000 } })
    .explain("executionStats"),
);

print("18. stworz indeks do kolekcji numbers (value)");
db.numbers.createIndex({ value: 1 });

print("19. ponownie wykorzystaj explain do zapytan z pkt 16");
print("-- explain dla wartosci wiekszych od 25000");
print(db.numbers.find({ value: { $gt: 25000 } }).explain("executionStats"));
print("-- explain dla wartosci z przedzialu <1000,15000>");
print(
  db.numbers
    .find({ value: { $gt: 1000, $lt: 15000 } })
    .explain("executionStats"),
);

// roznice
// COLLECTION SCAN (brak indeksu) vs IXSCAN (indeks)
// DOCS EXAMINED mniejsza po indeksowaniu
// EXECUTION TIME lepszy po indeksowaniu
//

print("20. utworz baze uczelnia");
use("uczelnia");
db.students.deleteMany({});

print("21. dodaj kolekcje studenci");
db.students.insertMany([
  {
    imie: "Jan",
    nazwisko: "Kowalski",
    nr_albumu: "12345",
    wiek: 22,
    oceny: { Matematyka: 4.5, Informatyka: 5.0 },
  },
  {
    imie: "Anna",
    nazwisko: "Nowak",
    nr_albumu: "54321",
    wiek: 21,
    oceny: { Matematyka: 3.5, Informatyka: 5.0 },
  },
  {
    imie: "Piotr",
    nazwisko: "Zieliński",
    nr_albumu: "67890",
    wiek: 23,
    oceny: { Matematyka: 4.0, Informatyka: 4.5 },
  },
  {
    imie: "Katarzyna",
    nazwisko: "Wiśniewska",
    nr_albumu: "98765",
    wiek: 20,
    oceny: { Matematyka: 3.0, Informatyka: 3.0 },
  },
  {
    imie: "Marek",
    nazwisko: "Kowalczyk",
    nr_albumu: "11223",
    wiek: 22,
    oceny: { Matematyka: 2.0, Informatyka: 2.5 },
  },

  {
    imie: "Ewa",
    nazwisko: "Lewandowska",
    nr_albumu: "33445",
    wiek: 21,
    oceny: { Matematyka: 5.0, Informatyka: 4.0 },
  },
  {
    imie: "Tomasz",
    nazwisko: "Kaczmarek",
    nr_albumu: "55667",
    wiek: 23,
    oceny: { Matematyka: 4.5, Informatyka: 3.5 },
  },
  {
    imie: "Agnieszka",
    nazwisko: "Szymańska",
    nr_albumu: "77889",
    wiek: 20,
    oceny: { Matematyka: 3.5, Informatyka: 4.5 },
  },
  {
    imie: "Łukasz",
    nazwisko: "Dąbrowski",
    nr_albumu: "99001",
    wiek: 22,
    oceny: { Matematyka: 2.5, Informatyka: 3.0 },
  },

  {
    imie: "Monika",
    nazwisko: "Kowalska",
    nr_albumu: "22334",
    wiek: 21,
    oceny: { Matematyka: 4.0, Informatyka: 5.0 },
  },
  {
    imie: "Adam",
    nazwisko: "Nowicki",
    nr_albumu: "44556",
    wiek: 23,
    oceny: { Matematyka: 3.0, Informatyka: 4.0 },
  },
  {
    imie: "Magdalena",
    nazwisko: "Wójcik",
    nr_albumu: "66778",
    wiek: 20,
    oceny: { Matematyka: 5.0, Informatyka: 5.0 },
  },

  {
    imie: "Piotr",
    nazwisko: "Nowakowski",
    nr_albumu: "88990",
    wiek: 42,
    oceny: { Matematyka: 4.5, Informatyka: 4.0 },
  },
  {
    imie: "Katarzyna",
    nazwisko: "Kowalska",
    nr_albumu: "10101",
    wiek: 21,
    oceny: { Matematyka: 3.5, Informatyka: 4.5 },
  },

  {
    imie: "Marek",
    nazwisko: "Nowak",
    nr_albumu: "20202",
    wiek: 22,
    oceny: { Matematyka: 2.0, Informatyka: 3.0 },
  },
]);

print("25. wyswietl wszystkich studentow ");
db.students.find({}).forEach(printjson);
print(db.students.countDocuments({}));

print("26. posortuj wg nazwiska");
db.students.find({}).sort({ nazwisko: 1 }).forEach(printjson);

print("27. posortuj wg nazwiska i zwroc 2 pierszych");
db.students.find({}).sort({ nazwisko: 1 }).limit(2).forEach(printjson);

print("28. wyznacz srednia arytmetyczna poszczegolnych studentow");
db.students
  .aggregate([
    {
      $group: {
        _id: "$nr_albumu",
        imie: { $first: "$imie" },
        nazwisko: { $first: "$nazwisko" },
        srednia_ocen: {
          $avg: { $avg: ["$oceny.Matematyka", "$oceny.Informatyka"] },
        },
      },
    },
    { $project: { _id: 0, imie: 1, nazwisko: 1, srednia_ocen: 1 } },
  ])
  .forEach(printjson);

print("29. wyznacz srednia arytmetyczna dla wszystkich studentow");
db.students
  .aggregate([
    {
      $group: {
        _id: null,
        srednia_ocen: {
          $avg: { $avg: ["$oceny.Matematyka", "$oceny.Informatyka"] },
        },
      },
    },
    { $project: { _id: 0, srednia_ocen: 1 } },
  ])
  .forEach(printjson);

print("30. utworz baze company");
use("company");

print("31. do kolekcji workers wczytaj dane z my_workers.csv");
//schema
// id,country,city,gender,age,salary,position,favorite_book;

print("32. zwroc zarobki stazystow oraz zarobki managerow");
projection = { _id: 0, salary: 1, position: 1 };
db.workers.find({ position: "Apprentice" }, projection).forEach(printjson);
db.workers.find({ position: "Project_Manager" }, projection).forEach(printjson);

print(
  "33. wstaw nowy klucz o nazwie internship z wartoscia 3 do osob ktore sa stazystami",
);

db.workers.updateMany({ position: "Apprentice" }, { $set: { internship: 3 } });

print(
  "34. Do odrębnych kolekcji male i female wgraj odpowiednio mężczyzn i kobiety z kolekcji workers.",
);

var males = db.workers.find({ gender: "Male" }).toArray();
var females = db.workers.find({ gender: "Female" }).toArray();
db.female.deleteMany({});
db.male.deleteMany({});
db.workers.aggregate([
  { $match: { gender: "Female" } }, // optional filter
  {
    $merge: {
      into: "female",
      whenMatched: "merge", // or "replace", "keepExisting"
      whenNotMatched: "insert",
    },
  },
]);
db.workers.aggregate([
  { $match: { gender: "Male" } }, // optional filter
  {
    $merge: {
      into: "male",
      whenMatched: "merge", // or "replace", "keepExisting"
      whenNotMatched: "insert",
    },
  },
]);

print("35. ustaw index na pole id");
db.workers.createIndex({ id: 1 });

print("36. Wyeksportuj kolekcje male i female jako pliki csv.");
print("mongoexport ...");

print(
  "37. Zmieńmy wartość w kluczu salary w taki sposób, żeby zamiast w dolarach była wyrażona w złotówkach przyjmijmy kurs 3,79 Złoty za USD",
);

db.workers.updateMany({}, [
  {
    $set: {
      salary: {
        $multiply: ["$salary", 3.79], //
      },
    },
  },
]);

print("38. wszyscy programisci otrzymali podwyzke 300 zl");
db.workers.aggregate([
  { $match: { position: { $regex: "Programmer", $options: "i" } } },
  {
    $set: {
      salary: {
        $add: ["$salary", 300],
      },
    },
  },
  {
    $merge: {
      into: "workers",
      whenMatched: "merge",
      whenNotMatched: "discard",
    },
  },
]);

print(
  "39. Zmieńmy tylko te klucze, które są powyżej pewnej wartości – nowa podwyżka (500 zł) obejmie tylko programistów zarabiających powyżej 4000 złotych.",
);

db.workers.aggregate([
  {
    $match: {
      position: { $regex: "Programmer", $options: "i" },
      salary: { $gt: 4000 },
    },
  },
  {
    $set: {
      salary: {
        $add: ["$salary", 500],
      },
    },
  },
  {
    $merge: {
      into: "workers",
      whenMatched: "merge",
      whenNotMatched: "discard",
    },
  },
]);

print(
  "40. Wstawmy też do każdego dokumentu w naszej kolekcji klucz _last_modified w którym wpisywać będziemy datę uruchomienia zapytania.",
);

db.workers.updateMany({}, { $set: { _last_modified: new Date() } });

print(
  "41. A teraz wykonajmy zapytanie, w którym zwrócimy wszystkich pracowników, których ulubiona książka zawiera słowo „lord”",
);

db.workers
  .find({ favorite_book: { $regex: "lord", $options: "i" } })
  .forEach(printjson);

print(
  "42. Zmieńmy samą nazwę klucza bez zmiany jego wartości, zróbmy to na przykładzie klucza _last_modified i zamieńmy jego nazwę na _last_opened.",
);

db.workers.updateMany(
  { _last_modified: { $exists: true } },
  { $rename: { _last_modified: "_last_opened" } },
);

print(
  "43. Napiszmy zapytanie, które zwróci nam wszystkich programistów narodowości Amerykańskiej",
);

db.workers
  .find({
    position: { $regex: "Programmer", $options: "i" },
    country: "USA",
  })
  .forEach(printjson);

print(
  "44. stwórzmy klucz codes, który będzie przechowywał kod stanu z którego pochodzi dane miasto.",
);
// Kody i miasta znajdują się poniżej
// New_York = NY
// Dallas = TX
// San Francisco = CAL
// Miami = FL
// Detroit = ILL
// Columbus = OH
//
db.workers.updateMany({ city: "New York" }, { $set: { codes: "NY" } });
db.workers.updateMany({ city: "Dallas" }, { $set: { codes: "TX" } });
db.workers.updateMany({ city: "San Francisco" }, { $set: { codes: "CAL" } });
db.workers.updateMany({ city: "Miami" }, { $set: { codes: "FL" } });
db.workers.updateMany({ city: "Detroit" }, { $set: { codes: "ILL" } });
db.workers.updateMany({ city: "Columbus" }, { $set: { codes: "OH" } });

print("45. Sprawdź bazy dostępne w systemie.");

print(show("databases"));

print("46. Sprawdź listę kolekcji w bazach");
use("big_data");
print("kolekcje w big_data");
print(db.getCollectionNames());

use("uczelnia");
print("kolekcje w uczelnia");
print(db.getCollectionNames());

use("company");
print("kolekcje w company");
print(db.getCollectionNames());

use("student");
print("kolekcje w student");
print(db.getCollectionNames());

print("47. Wykorzystaj funkcję stats dla baz danych i dla kolekcji.");

print("stats dla student");
print(db.stats());
print(db.produkty.stats());

print("48 usun wszystko");
db.adminCommand({ listDatabases: 1 })
  .databases.map((d) => d.name)
  .filter((name) => !["admin", "local", "config"].includes(name)) // skip system dbs
  .forEach((name) => {
    db.getSiblingDB(name).dropDatabase();
    print(`Dropped: ${name}`);
  });
