import { db } from "../src/db/index.ts";
import { cities, regions } from "../src/db/schema.ts";

await db.insert(regions).values([
  { regions_name: "Stockholm", regions_population: 2480000 },
  { regions_name: "Uppsala", regions_population: 390000 },
  { regions_name: "Södermanland", regions_population: 300000 },
  { regions_name: "Östergötland", regions_population: 465000 },
  { regions_name: "Jönköping", regions_population: 364000 },
  { regions_name: "Kronoberg", regions_population: 204000 },
  { regions_name: "Kalmar", regions_population: 246000 },
  { regions_name: "Gotland", regions_population: 60000 },
  { regions_name: "Blekinge", regions_population: 158000 },
  { regions_name: "Skåne", regions_population: 1400000 },
  { regions_name: "Halland", regions_population: 340000 },
  { regions_name: "Västra Götaland", regions_population: 1800000 },
  { regions_name: "Värmland", regions_population: 280000 },
  { regions_name: "Örebro", regions_population: 310000 },
  { regions_name: "Västmanland", regions_population: 275000 },
  { regions_name: "Dalarna", regions_population: 285000 },
  { regions_name: "Gävleborg", regions_population: 285000 },
  { regions_name: "Västerbotten", regions_population: 270000 },
  { regions_name: "Norrbotten", regions_population: 250000 },
  { regions_name: "Jämtland", regions_population: 130000 },
  { regions_name: "Västernorrland", regions_population: 246000 },
]);

await db.insert(cities).values([
  // Stockholm län
  { cities_name: "Stockholm", cities_population: 980000, region: "Stockholm" },
  { cities_name: "Södertälje", cities_population: 98000, region: "Stockholm" },
  { cities_name: "Solna", cities_population: 72000, region: "Stockholm" },
  { cities_name: "Täby", cities_population: 71000, region: "Stockholm" },
  { cities_name: "Norrtälje", cities_population: 22000, region: "Stockholm" },

  // Uppsala län
  { cities_name: "Uppsala", cities_population: 180000, region: "Uppsala" },
  { cities_name: "Enköping", cities_population: 43000, region: "Uppsala" },
  { cities_name: "Tierp", cities_population: 19000, region: "Uppsala" },
  { cities_name: "Knivsta", cities_population: 21000, region: "Uppsala" },
  { cities_name: "Östhammar", cities_population: 21000, region: "Uppsala" },

  // Södermanland län
  {
    cities_name: "Eskilstuna",
    cities_population: 107000,
    region: "Södermanland",
  },
  { cities_name: "Nyköping", cities_population: 36000, region: "Södermanland" },
  {
    cities_name: "Katrineholm",
    cities_population: 34000,
    region: "Södermanland",
  },
  {
    cities_name: "Strängnäs",
    cities_population: 21000,
    region: "Södermanland",
  },
  { cities_name: "Trosa", cities_population: 10000, region: "Södermanland" },

  // Östergötland län
  {
    cities_name: "Linköping",
    cities_population: 165000,
    region: "Östergötland",
  },
  {
    cities_name: "Norrköping",
    cities_population: 141000,
    region: "Östergötland",
  },
  { cities_name: "Motala", cities_population: 43000, region: "Östergötland" },
  { cities_name: "Mjölby", cities_population: 29000, region: "Östergötland" },
  { cities_name: "Finspång", cities_population: 21000, region: "Östergötland" },

  // Jönköping län
  { cities_name: "Jönköping", cities_population: 142000, region: "Jönköping" },
  { cities_name: "Huskvarna", cities_population: 70000, region: "Jönköping" },
  { cities_name: "Värnamo", cities_population: 36000, region: "Jönköping" },
  { cities_name: "Nässjö", cities_population: 17000, region: "Jönköping" },
  { cities_name: "Gislaved", cities_population: 10000, region: "Jönköping" },

  // Kronoberg län
  { cities_name: "Växjö", cities_population: 92000, region: "Kronoberg" },
  { cities_name: "Ljungby", cities_population: 28000, region: "Kronoberg" },
  { cities_name: "Alvesta", cities_population: 10000, region: "Kronoberg" },
  { cities_name: "Älmhult", cities_population: 14000, region: "Kronoberg" },
  { cities_name: "Markaryd", cities_population: 9000, region: "Kronoberg" },

  // Kalmar län
  { cities_name: "Kalmar", cities_population: 65000, region: "Kalmar" },
  { cities_name: "Västervik", cities_population: 20000, region: "Kalmar" },
  { cities_name: "Oskarshamn", cities_population: 17000, region: "Kalmar" },
  { cities_name: "Nybro", cities_population: 12000, region: "Kalmar" },
  { cities_name: "Vimmerby", cities_population: 7000, region: "Kalmar" },

  // Gotland län
  { cities_name: "Visby", cities_population: 25000, region: "Gotland" },
  { cities_name: "Slite", cities_population: 2600, region: "Gotland" },
  { cities_name: "Hemse", cities_population: 1700, region: "Gotland" },
  { cities_name: "Klintehamn", cities_population: 2200, region: "Gotland" },
  { cities_name: "Burgsvik", cities_population: 1100, region: "Gotland" },

  // Blekinge län
  { cities_name: "Karlskrona", cities_population: 66000, region: "Blekinge" },
  { cities_name: "Karlshamn", cities_population: 26000, region: "Blekinge" },
  { cities_name: "Ronneby", cities_population: 12000, region: "Blekinge" },
  { cities_name: "Sölvesborg", cities_population: 10000, region: "Blekinge" },
  { cities_name: "Olofström", cities_population: 7000, region: "Blekinge" },

  // Skåne län
  { cities_name: "Malmö", cities_population: 360000, region: "Skåne" },
  { cities_name: "Lund", cities_population: 95000, region: "Skåne" },
  { cities_name: "Helsingborg", cities_population: 110000, region: "Skåne" },
  { cities_name: "Kristianstad", cities_population: 47000, region: "Skåne" },
  { cities_name: "Landskrona", cities_population: 46000, region: "Skåne" },

  // Halland län
  { cities_name: "Halmstad", cities_population: 67000, region: "Halland" },
  { cities_name: "Varberg", cities_population: 43000, region: "Halland" },
  { cities_name: "Falkenberg", cities_population: 26000, region: "Halland" },
  { cities_name: "Kungsbacka", cities_population: 86000, region: "Halland" },
  { cities_name: "Laholm", cities_population: 12000, region: "Halland" },

  // Västra Götaland län
  {
    cities_name: "Göteborg",
    cities_population: 600000,
    region: "Västra Götaland",
  },
  {
    cities_name: "Borås",
    cities_population: 115000,
    region: "Västra Götaland",
  },
  {
    cities_name: "Trollhättan",
    cities_population: 58000,
    region: "Västra Götaland",
  },
  {
    cities_name: "Skövde",
    cities_population: 54000,
    region: "Västra Götaland",
  },
  {
    cities_name: "Uddevalla",
    cities_population: 35000,
    region: "Västra Götaland",
  },

  // Värmland län
  { cities_name: "Karlstad", cities_population: 96000, region: "Värmland" },
  { cities_name: "Arvika", cities_population: 25000, region: "Värmland" },
  { cities_name: "Kristinehamn", cities_population: 31000, region: "Värmland" },
  { cities_name: "Säffle", cities_population: 9000, region: "Värmland" },
  { cities_name: "Torsby", cities_population: 9000, region: "Värmland" },

  // Örebro län
  { cities_name: "Örebro", cities_population: 160000, region: "Örebro" },
  { cities_name: "Karlskoga", cities_population: 31000, region: "Örebro" },
  { cities_name: "Kumla", cities_population: 21000, region: "Örebro" },
  { cities_name: "Hallsberg", cities_population: 17000, region: "Örebro" },
  { cities_name: "Lindesberg", cities_population: 16000, region: "Örebro" },

  // Västmanland län
  { cities_name: "Västerås", cities_population: 155000, region: "Västmanland" },
  { cities_name: "Köping", cities_population: 18000, region: "Västmanland" },
  {
    cities_name: "Hallstahammar",
    cities_population: 15000,
    region: "Västmanland",
  },
  { cities_name: "Kungsör", cities_population: 6000, region: "Västmanland" },
  { cities_name: "Fagersta", cities_population: 12000, region: "Västmanland" },

  // Dalarna län
  { cities_name: "Falun", cities_population: 58000, region: "Dalarna" },
  { cities_name: "Borlänge", cities_population: 52000, region: "Dalarna" },
  { cities_name: "Mora", cities_population: 16000, region: "Dalarna" },
  { cities_name: "Ludvika", cities_population: 26000, region: "Dalarna" },
  { cities_name: "Avesta", cities_population: 14000, region: "Dalarna" },

  // Gävleborg län
  { cities_name: "Gävle", cities_population: 100000, region: "Gävleborg" },
  { cities_name: "Sandviken", cities_population: 30000, region: "Gävleborg" },
  { cities_name: "Hudiksvall", cities_population: 15000, region: "Gävleborg" },
  { cities_name: "Bollnäs", cities_population: 17000, region: "Gävleborg" },
  { cities_name: "Söderhamn", cities_population: 11000, region: "Gävleborg" },

  // Västerbotten län
  { cities_name: "Umeå", cities_population: 130000, region: "Västerbotten" },
  {
    cities_name: "Skellefteå",
    cities_population: 72000,
    region: "Västerbotten",
  },
  { cities_name: "Lycksele", cities_population: 13000, region: "Västerbotten" },
  {
    cities_name: "Robertsfors",
    cities_population: 7000,
    region: "Västerbotten",
  },
  { cities_name: "Norsjö", cities_population: 2500, region: "Västerbotten" },

  // Norrbotten län
  { cities_name: "Luleå", cities_population: 78000, region: "Norrbotten" },
  { cities_name: "Boden", cities_population: 17000, region: "Norrbotten" },
  { cities_name: "Piteå", cities_population: 42000, region: "Norrbotten" },
  { cities_name: "Kiruna", cities_population: 22000, region: "Norrbotten" },
  { cities_name: "Haparanda", cities_population: 10000, region: "Norrbotten" },

  // Jämtland län
  { cities_name: "Östersund", cities_population: 52000, region: "Jämtland" },
  { cities_name: "Åre", cities_population: 10000, region: "Jämtland" },
  { cities_name: "Bräcke", cities_population: 3000, region: "Jämtland" },
  { cities_name: "Strömsund", cities_population: 3500, region: "Jämtland" },
  { cities_name: "Krokom", cities_population: 3000, region: "Jämtland" },

  // Västernorrland län
  {
    cities_name: "Sundsvall",
    cities_population: 58000,
    region: "Västernorrland",
  },
  {
    cities_name: "Örnsköldsvik",
    cities_population: 33000,
    region: "Västernorrland",
  },
  {
    cities_name: "Härnösand",
    cities_population: 18000,
    region: "Västernorrland",
  },
  {
    cities_name: "Kramfors",
    cities_population: 6000,
    region: "Västernorrland",
  },
  {
    cities_name: "Sollefteå",
    cities_population: 8000,
    region: "Västernorrland",
  },
]);
