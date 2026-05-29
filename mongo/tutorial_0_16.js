use("student");
function header(title) {
  const line = "#".repeat(40);
  print(`${line}\n  ${title}\n${line}`);
}
function zadanie1() {
  function setup() {
    db.pracownicy.deleteMany({});

    db.pracownicy.insertOne({
      id_prac: 100,
      nazwisko: "WEGLARZ",
      placa_pod: 1730,
    });

    db.pracownicy.insertOne({
      id_prac: 100,
      nazwisko: "WEGLARZ",
      placa_pod: 1730,
    });

    db.pracownicy.insertOne({
      _id: 100,
      id_prac: 101,
      nazwisko: "WEGLARZ",
      placa_pod: 1730,
    });

    db.pracownicy.insertOne({
      id_prac: 110,
      nazwisko: "BLAZEWICZ",
      placa_pod: 1350,
      zatrudniony: new Date("1973-05-01"),
    });
  }
  setup();
  header("ZADANIE 1");

  print("Liczba dokumentów:", db.pracownicy.countDocuments({}));
  db.pracownicy.find({}).forEach(printjson);
}

function zadanie2() {
  function setup() {
    db.pracownicy.deleteMany({});
    db.pracownicy.insertMany([
      {
        id_prac: 100,
        nazwisko: "WEGLARZ",
        etat: "DYREKTOR",
        zatrudniony: new Date("1968-01-01"),
        placa_pod: 1730.0,
        placa_dod: 420.5,
        id_zesp: 10,
      },
      {
        id_prac: 110,
        nazwisko: "BLAZEWICZ",
        etat: "PROFESOR",
        id_szefa: 100,
        zatrudniony: new Date("1973-05-01"),
        placa_pod: 1350.0,
        placa_dod: 210.0,
        id_zesp: 40,
      },
      {
        id_prac: 120,
        nazwisko: "SLOWINSKI",
        etat: "PROFESOR",
        id_szefa: 100,
        zatrudniony: new Date("1977-09-01"),
        placa_pod: 1070.0,
        id_zesp: 30,
      },
      {
        id_prac: 130,
        nazwisko: "BRZEZINSKI",
        etat: "PROFESOR",
        id_szefa: 100,
        zatrudniony: new Date("1968-07-01"),
        placa_pod: 960.0,
        id_zesp: 20,
      },
      {
        id_prac: 140,
        nazwisko: "MORZY",
        etat: "PROFESOR",
        id_szefa: 130,
        zatrudniony: new Date("1975-09-15"),
        placa_pod: 830.0,
        placa_dod: 105.0,
        id_zesp: 20,
      },
      {
        id_prac: 150,
        nazwisko: "KROLIKOWSKI",
        etat: "ADIUNKT",
        id_szefa: 130,
        zatrudniony: new Date("1977-09-01"),
        placa_pod: 645.5,
        id_zesp: 20,
      },
      {
        id_prac: 160,
        nazwisko: "KOSZLAJDA",
        etat: "ADIUNKT",
        id_szefa: 130,
        zatrudniony: new Date("1985-03-01"),
        placa_pod: 590.0,
        id_zesp: 20,
      },
      {
        id_prac: 170,
        nazwisko: "JEZIERSKI",
        etat: "ASYSTENT",
        id_szefa: 130,
        zatrudniony: new Date("1992-10-01"),
        placa_pod: 439.7,
        placa_dod: 80.5,
        id_zesp: 20,
      },
      {
        id_prac: 190,
        nazwisko: "MATYSIAK",
        etat: "ASYSTENT",
        id_szefa: 140,
        zatrudniony: new Date("1993-09-01"),
        placa_pod: 371.0,
        id_zesp: 20,
      },
      {
        id_prac: 180,
        nazwisko: "MAREK",
        etat: "SEKRETARKA",
        id_szefa: 100,
        zatrudniony: new Date("1985-02-20"),
        placa_pod: 410.2,
        id_zesp: 10,
      },
      {
        id_prac: 200,
        nazwisko: "ZAKRZEWICZ",
        etat: "STAZYSTA",
        id_szefa: 140,
        zatrudniony: new Date("1994-07-15"),
        placa_pod: 208.0,
        id_zesp: 30,
      },
      {
        id_prac: 210,
        nazwisko: "BIALY",
        etat: "STAZYSTA",
        id_szefa: 130,
        zatrudniony: new Date("1993-10-15"),
        placa_pod: 250.0,
        placa_dod: 170.6,
        id_zesp: 30,
      },
      {
        id_prac: 220,
        nazwisko: "KONOPKA",
        etat: "ASYSTENT",
        id_szefa: 110,
        zatrudniony: new Date("1993-10-01"),
        placa_pod: 480.0,
        id_zesp: 20,
      },
      {
        id_prac: 230,
        nazwisko: "HAPKE",
        etat: "ASYSTENT",
        id_szefa: 120,
        zatrudniony: new Date("1992-09-01"),
        placa_pod: 480.0,
        placa_dod: 90.0,
        id_zesp: 30,
      },
    ]);
  }
  setup();
  header("ZADANIE 2");
  db.zespoly.deleteMany({});
  db.zespoly.insertMany([
    { id_zesp: 10, nazwa: "ADMINISTRACJA", adres: "PIOTROWO 3A" },
    { id_zesp: 20, nazwa: "SYSTEMY ROZPROSZONE", adres: "PIOTROWO 3A" },
    { id_zesp: 30, nazwa: "SYSTEMY EKSPERCKIE", adres: "STRZELECKA 14" },
    { id_zesp: 40, nazwa: "ALGORYTMY", adres: "WLODKOWICA 16" },
    { id_zesp: 50, nazwa: "BADANIA OPERACYJNE", adres: "MIELZYNSKIEGO 30" },
  ]);
  print("Liczba dokumentów", db.zespoly.countDocuments({}));
}

function zadanie3() {
  header("ZADANIE 3");
  // zawiera tylko nazwisko i _id
  db.pracownicy
    .find({ etat: "PROFESOR" }, { nazwisko: 1, _id: 0 })
    .forEach(printjson);
  // zawiera wszystkie pola oprócz nazwiska i _id
  db.pracownicy
    .find({ etat: "PROFESOR" }, { nazwisko: 0, _id: 0 })
    .forEach(printjson);

  // Cannot do exclusion on field 'nazwisko' in inclusion projection
  // db.pracownicy
  //   .find({ etat: "PROFESOR" }, { nazwisko: 1, placa_pod: 0 })
  //   .forEach(printjson);
}

function zadanie4() {
  header("ZADANIE 4");
  print(
    "Znajdź nazwiska, etaty i place podstawowe wszystkich asystentów (bez wzgledu na zarobki) oraz pracownikow," +
      "ktorzy zajmuja dowolne stanowsko, ale zarabiaja pomiedzy 200 a 500 zl",
  );
  db.pracownicy
    .find(
      {
        $or: [{ etat: "ASYSTENT" }, { placa_pod: { $gte: 200, $lte: 500 } }],
      },
      { nazwisko: 1, etat: 1, placa_pod: 1, _id: 0 },
    )
    .forEach(printjson);
}
function zadanie5() {
  header("ZADANIE 5");
  print(
    "Znajdź etaty, nazwiska i płace podstawowe pracowników zarabiających więcej niż 400zł. Otrzymane dokumenty " +
      "powinny być posortowane wg etatu (zgodnie z porządkiem leksykograficznym). W przypadku powtarzających się" +
      "etatów sortowanie powinno być zgodne z malejącą wartością płacy podstawowej.",
  );
  db.pracownicy
    .find(
      { placa_pod: { $gt: 400 } },
      { etat: 1, nazwisko: 1, placa_pod: 1, _id: 0 },
    )
    .sort({ etat: 1, placa_pod: -1 })
    .forEach(printjson);
}

function zadanie6() {
  header("ZADANIE 6");
  print(`Znajdź nazwisko i płacę podstawową pracownika zespołu nr 20, który jest na drugim miejscu pod względem
  zarobków (placa_pod) w swoim zespole.`);
  db.pracownicy
    .find({ id_zesp: 20 }, { nazwisko: 1, placa_pod: 1, _id: 0 })
    .sort({ placa_pod: -1 })
    .skip(1)
    .limit(1)
    .forEach(printjson);
}
function zadanie7() {
  header("ZADANIE 7");
  print(
    `Znajdź nazwiska i etaty pracowników zespołu 20 lub 30, którzy nie są asystentami, a ich nazwisko kończy się na literę I`,
  );
  db.pracownicy
    .find(
      {
        id_zesp: { $in: [20, 30] },
        etat: { $ne: "ASYSTENT" },
        nazwisko: { $regex: "I$" },
      },
      { nazwisko: 1, etat: 1, _id: 0 },
    )
    .forEach(printjson);
}
function zadanie8() {
  header("ZADANIE 8");
  print(`We frameworku agregacji, sortowanie oraz ograniczanie zbioru wynikowego 
  przyjmuje postać dodatkowych operatorów $sort, $skip, $limit.
  Wykorzystaj mechanizm agregacji do znalezienia nazwiska, etatu i roku zatrudnienia pracownika, który jest trzeci
  pod względem wysokości zarobków.

`);
  db.pracownicy
    .aggregate([
      { $sort: { placa_pod: -1 } },
      { $skip: 2 },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          nazwisko: 1,
          etat: 1,
          rok_zatrudnienia: { $year: "$zatrudniony" },
        },
      },
    ])
    .forEach(printjson);
}
function zadanie9() {
  header("ZADANIE 9");
  print(`Znajdź dla każdego identyfikatora zespołu liczbę pracowników zatrudnionych w tym zespole. Wynik ogranicz do
  zespołów, które zatrudniają więcej niż 3 pracowników. Wskazówka: użyj wyrażenia {$sum: 1} do zliczania
  pracowników.`);
  db.pracownicy
    .aggregate([
      { $group: { _id: "$id_zesp", liczba: { $sum: 1 } } },
      { $match: { liczba: { $gt: 3 } } },
    ])
    .forEach(printjson);
}

function zadanie10() {
  header("ZADANIE 10");
  print(
    `Dla każdego pracownika zespołu nr 20 lub 30, uzyskaj nazwisko tego pracownika oraz adres jego zespołu.`,
  );
  db.pracownicy
    .aggregate([
      { $match: { id_zesp: { $in: [20, 30] } } },
      {
        $lookup: {
          from: "zespoly",
          localField: "id_zesp",
          foreignField: "id_zesp",
          as: "zesp",
        },
      },
      // { $unwind: "$zesp" },
      {
        $project: {
          _id: 0,
          nazwisko: 1,
          adres_zespolu: { $arrayElemAt: ["$zesp.adres", 0] },
          // jezeli uzywamy unwind
          // adres_zespolu: "$zesp.adres",
        },
      },
    ])
    .forEach(printjson);
}

function zadanie11() {
  header("ZADANIE 11");
  print(`Znajdź pracowników, którzy pracują przy ul. Strzeleckiej. Oprócz nazwiska podaj również nazwę zespołu, do
którego pracownik należy. Uwaga! Nie używaj identyfikatora zespołu do przeprowadzenia selekcji. Nie używaj
również numeru budynku.`);
  db.pracownicy
    .aggregate([
      {
        $lookup: {
          from: "zespoly",
          localField: "id_zesp",
          foreignField: "id_zesp",
          as: "zesp",
        },
      },
      { $unwind: "$zesp" },
      {
        $match: { "zesp.adres": { $regex: "STRZELECKA" } },
      },
      {
        $project: {
          _id: 0,
          nazwisko: 1,
          nazwa_zespolu: "$zesp.nazwa",
        },
      },
    ])
    .forEach(printjson);
}

function zadanie12() {
  header("ZADANIE 12");
  print(
    `Znajdź liczbę pracowników zatrudnionych w każdym zespole (interesuje nas nazwa zespołu).`,
  );
  db.pracownicy
    .aggregate([
      {
        $lookup: {
          from: "zespoly",
          localField: "id_zesp",
          foreignField: "id_zesp",
          as: "zesp",
        },
      },
      { $unwind: "$zesp" },
      {
        $group: { _id: "$zesp.nazwa", liczba_pracownikow: { $sum: 1 } },
      },
    ])
    .forEach(printjson);
}
// modyfikacja danych
function zadanie13() {
  header("ZADANIE 13");
  print(`Połącz nazwisko z nazwa zespolu pracownika za pomoca java script`);
  // var pracownicy = db.pracownicy.find({});
  // while (pracownicy.hasNext()) {
  //   var prac = pracownicy.next();
  //   var zesp = db.zespoly.findOne({ id_zesp: prac.id_zesp });
  //   var nazwisko_zespol = `${prac.nazwisko}:${zesp.nazwa}`;
  //   print(nazwisko_zespol);
  // }
  print(`Napisz skrypt, który wartość klucza id_zesp w
  dokumentach kolekcji pracownicy ustawi na wartość odpowiadającą identyfikatorowi (_id) dokumentu
  odpowiedniego zespołu.`);
  var pracownicy = db.pracownicy.find({});
  while (pracownicy.hasNext()) {
    var prac = pracownicy.next();
    var zesp = db.zespoly.findOne({ id_zesp: prac.id_zesp });
    var query = { _id: prac._id };
    var update = { $set: { id_zesp: zesp._id } };
    db.pracownicy.updateOne(query, update);
  }
  db.pracownicy.find({}, { id_prac: 1, id_zesp: 1, _id: 0 }).forEach(printjson);
}

function zadanie14() {
  header("ZADANIE 14");
  function setup() {
    db.produkty.deleteMany({});
    db.produkty.insertMany([
      {
        nazwa: "Kosiarka spalinowa",
        cena: 1000,
        cechy: {
          zbiornik_paliwa_pojemnosc: 0.8,
          waga: 23,
        },
        tagi: ["maszyna", "ogrod", "dom", "kosiarka"],
        oceny: [
          { osoba: "Jurek", ocena: 3 },
          { osoba: "Ania", ocena: 4 },
          { osoba: "Basia", ocena: 3.6 },
        ],
      },
      {
        nazwa: "Wiertarka udarowa",
        cena: 1200,
        cechy: {
          moc_udaru: 4,
          maksymalne_obroty: 4000,
          uchwyt: "SDS",
        },
        tagi: ["wiertarka"],
        oceny: [
          { osoba: "Michał", ocena: 5 },
          { osoba: "Roman", ocena: 4.8 },
        ],
      },
      {
        nazwa: "Wiertarko - wkrętarka",
        cena: 450,
        cechy: {
          pojemnosc_akumulatora: 1.3,
          czas_ladowania: 60,
        },
        tagi: ["wiertarka", "dom"],
        oceny: [
          { osoba: "Ania", ocena: 5 },
          { osoba: "Robert", ocena: 4 },
          { osoba: "Janusz", ocena: 4 },
          { osoba: "Julita", ocena: 3 },
        ],
      },
      {
        nazwa: "Kosiarka elektryczna",
        cena: 900,
        cechy: {
          moc: 1700,
          waga: 17,
        },
        tagi: ["kosiarka", "ogrod", "dom"],
        oceny: [
          { osoba: "Monika", ocena: 3 },
          { osoba: "Karol", ocena: 4 },
        ],
      },
    ]);
  }
  setup();
  print(
    `Znajdź nazwy, dla których oceny nie wystawiła zarówno Alicja, jak i Karol.`,
  );
  query = {
    "oceny.osoba": { $nin: ["Ania", "Karol"] },
  };

  db.produkty.find(query, { nazwa: 1, _id: 0 }).forEach(printjson);
}

function zadanie15() {
  header("ZADANIE 15");
  print(`Znajdź najlepiej oceniony produkt (z najwyższą średnią ocen). Wybierz nazwę produktu (użyj aliasu „produkt”) oraz
jego średnią ocenę.`);
  db.produkty
    .aggregate([
      { $unwind: "$oceny" },
      {
        $group: {
          _id: "$nazwa",
          srednia_ocena: { $avg: "$oceny.ocena" },
        },
      },
      { $sort: { srednia_ocena: -1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          produkt: "$_id",
          srednia_ocena: 1,
        },
      },
    ])
    .forEach(printjson);
}
function zadanie16() {
  header("ZADANIE 16");
  print(
    `Dodaj nową ocenę kosiarki elektrycznej. Niech tą oceną będzie 4 i niech będzie wystawiona przez Anię.`,
  );
  var query = { nazwa: "Kosiarka elektryczna" };
  var update = {
    $push: { oceny: { osoba: "Ania", ocena: 4 } },
  };
  db.produkty.updateOne(query, update);
  db.produkty
    .find({ nazwa: "Kosiarka elektryczna" }, { oceny: 1, _id: 0 })
    .forEach(printjson);
}

zadanie1();
zadanie2();
zadanie3();
zadanie4();
zadanie5();
zadanie6();
zadanie7();
zadanie8();
zadanie9();
zadanie10();
zadanie11();
zadanie12();
// modyfikacja
zadanie13();
zadanie14();
zadanie15();
// wstawianie
zadanie16();
