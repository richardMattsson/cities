import { db } from "../src/db/index.ts";
import { cities, municipalities, regions } from "../src/db/schema.ts";

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

await db.insert(municipalities).values([
  {
    municipalities_name: "Stockholm",
    municipalities_population: 975000,
    region: "Stockholm",
  },
  {
    municipalities_name: "Nacka",
    municipalities_population: 116000,
    region: "Stockholm",
  },
  {
    municipalities_name: "Uppsala",
    municipalities_population: 240000,
    region: "Uppsala",
  },
  {
    municipalities_name: "Enköping",
    municipalities_population: 50000,
    region: "Uppsala",
  },
  {
    municipalities_name: "Nyköping",
    municipalities_population: 82000,
    region: "Södermanland",
  },
  {
    municipalities_name: "Eskilstuna",
    municipalities_population: 110000,
    region: "Södermanland",
  },
  {
    municipalities_name: "Linköping",
    municipalities_population: 170000,
    region: "Östergötland",
  },
  {
    municipalities_name: "Norrköping",
    municipalities_population: 150000,
    region: "Östergötland",
  },
  {
    municipalities_name: "Jönköping",
    municipalities_population: 145000,
    region: "Jönköping",
  },
  {
    municipalities_name: "Nässjö",
    municipalities_population: 36000,
    region: "Jönköping",
  },
  {
    municipalities_name: "Växjö",
    municipalities_population: 99000,
    region: "Kronoberg",
  },
  {
    municipalities_name: "Ljungby",
    municipalities_population: 29000,
    region: "Kronoberg",
  },
  {
    municipalities_name: "Kalmar",
    municipalities_population: 72000,
    region: "Kalmar",
  },
  {
    municipalities_name: "Oskarshamn",
    municipalities_population: 28000,
    region: "Kalmar",
  },
  {
    municipalities_name: "Visby",
    municipalities_population: 26000,
    region: "Gotland",
  },
  {
    municipalities_name: "Gotland",
    municipalities_population: 22000,
    region: "Gotland",
  },
  {
    municipalities_name: "Karlskrona",
    municipalities_population: 70000,
    region: "Blekinge",
  },
  {
    municipalities_name: "Ronneby",
    municipalities_population: 32000,
    region: "Blekinge",
  },
  {
    municipalities_name: "Malmö",
    municipalities_population: 360000,
    region: "Skåne",
  },
  {
    municipalities_name: "Lund",
    municipalities_population: 130000,
    region: "Skåne",
  },
  {
    municipalities_name: "Halmstad",
    municipalities_population: 98000,
    region: "Halland",
  },
  {
    municipalities_name: "Varberg",
    municipalities_population: 70000,
    region: "Halland",
  },
  {
    municipalities_name: "Göteborg",
    municipalities_population: 600000,
    region: "Västra Götaland",
  },
  {
    municipalities_name: "Borås",
    municipalities_population: 115000,
    region: "Västra Götaland",
  },
  {
    municipalities_name: "Karlstad",
    municipalities_population: 100000,
    region: "Värmland",
  },
  {
    municipalities_name: "Arvika",
    municipalities_population: 31000,
    region: "Värmland",
  },
  {
    municipalities_name: "Örebro",
    municipalities_population: 160000,
    region: "Örebro",
  },
  {
    municipalities_name: "Kumla",
    municipalities_population: 25000,
    region: "Örebro",
  },
  {
    municipalities_name: "Västerås",
    municipalities_population: 150000,
    region: "Västmanland",
  },
  {
    municipalities_name: "Sala",
    municipalities_population: 24000,
    region: "Västmanland",
  },
  {
    municipalities_name: "Falun",
    municipalities_population: 62000,
    region: "Dalarna",
  },
  {
    municipalities_name: "Borlänge",
    municipalities_population: 56000,
    region: "Dalarna",
  },
  {
    municipalities_name: "Gävle",
    municipalities_population: 100000,
    region: "Gävleborg",
  },
  {
    municipalities_name: "Söderhamn",
    municipalities_population: 26000,
    region: "Gävleborg",
  },
  {
    municipalities_name: "Umeå",
    municipalities_population: 130000,
    region: "Västerbotten",
  },
  {
    municipalities_name: "Skellefteå",
    municipalities_population: 75000,
    region: "Västerbotten",
  },
  {
    municipalities_name: "Luleå",
    municipalities_population: 80000,
    region: "Norrbotten",
  },
  {
    municipalities_name: "Kiruna",
    municipalities_population: 23000,
    region: "Norrbotten",
  },
  {
    municipalities_name: "Östersund",
    municipalities_population: 65000,
    region: "Jämtland",
  },
  {
    municipalities_name: "Härjedalen",
    municipalities_population: 11000,
    region: "Jämtland",
  },
  {
    municipalities_name: "Sundsvall",
    municipalities_population: 105000,
    region: "Västernorrland",
  },
  {
    municipalities_name: "Härnösand",
    municipalities_population: 25000,
    region: "Västernorrland",
  },
]);

await db.insert(cities).values([
  {
    cities_name: "Stockholm Centrum",
    cities_population: 430000,
    municipality: "Stockholm",
  },
  {
    cities_name: "Södermalm",
    cities_population: 170000,
    municipality: "Stockholm",
  },
  {
    cities_name: "Nacka Strand",
    cities_population: 42000,
    municipality: "Nacka",
  },
  { cities_name: "Boo", cities_population: 30000, municipality: "Nacka" },
  {
    cities_name: "Uppsala Centrum",
    cities_population: 120000,
    municipality: "Uppsala",
  },
  {
    cities_name: "Gamla Uppsala",
    cities_population: 18000,
    municipality: "Uppsala",
  },
  {
    cities_name: "Enköping Nord",
    cities_population: 22000,
    municipality: "Enköping",
  },
  {
    cities_name: "Enköping Syd",
    cities_population: 28000,
    municipality: "Enköping",
  },
  {
    cities_name: "Nyköping Centrum",
    cities_population: 33000,
    municipality: "Nyköping",
  },
  { cities_name: "Valla", cities_population: 17000, municipality: "Nyköping" },
  {
    cities_name: "Eskilstuna Centrum",
    cities_population: 67000,
    municipality: "Eskilstuna",
  },
  {
    cities_name: "Torshälla",
    cities_population: 11000,
    municipality: "Eskilstuna",
  },
  {
    cities_name: "Linköping Centrum",
    cities_population: 98000,
    municipality: "Linköping",
  },
  {
    cities_name: "Ljungsbro",
    cities_population: 22000,
    municipality: "Linköping",
  },
  {
    cities_name: "Norrköping Centrum",
    cities_population: 92000,
    municipality: "Norrköping",
  },
  {
    cities_name: "Krokek",
    cities_population: 18000,
    municipality: "Norrköping",
  },
  {
    cities_name: "Jönköping Centrum",
    cities_population: 88000,
    municipality: "Jönköping",
  },
  { cities_name: "Aneby", cities_population: 15000, municipality: "Jönköping" },
  {
    cities_name: "Nässjö Centrum",
    cities_population: 16000,
    municipality: "Nässjö",
  },
  { cities_name: "Forserum", cities_population: 9000, municipality: "Nässjö" },
  {
    cities_name: "Växjö Centrum",
    cities_population: 55000,
    municipality: "Växjö",
  },
  { cities_name: "Teleborg", cities_population: 14000, municipality: "Växjö" },
  {
    cities_name: "Ljungby Centrum",
    cities_population: 18000,
    municipality: "Ljungby",
  },
  { cities_name: "Ryssby", cities_population: 7000, municipality: "Ljungby" },
  {
    cities_name: "Kalmar Centrum",
    cities_population: 43000,
    municipality: "Kalmar",
  },
  { cities_name: "Möja", cities_population: 13000, municipality: "Kalmar" },
  {
    cities_name: "Oskarshamn Centrum",
    cities_population: 22000,
    municipality: "Oskarshamn",
  },
  {
    cities_name: "Högsby",
    cities_population: 8000,
    municipality: "Oskarshamn",
  },
  {
    cities_name: "Visby Centrum",
    cities_population: 18000,
    municipality: "Visby",
  },
  {
    cities_name: "Västerhejde",
    cities_population: 6000,
    municipality: "Visby",
  },
  { cities_name: "Hemse", cities_population: 5000, municipality: "Gotland" },
  {
    cities_name: "Kappelshamn",
    cities_population: 4000,
    municipality: "Gotland",
  },
  {
    cities_name: "Karlskrona Centrum",
    cities_population: 42000,
    municipality: "Karlskrona",
  },
  { cities_name: "Tving", cities_population: 7000, municipality: "Karlskrona" },
  {
    cities_name: "Ronneby Centrum",
    cities_population: 15000,
    municipality: "Ronneby",
  },
  { cities_name: "Kallinge", cities_population: 7000, municipality: "Ronneby" },
  {
    cities_name: "Malmö Centrum",
    cities_population: 180000,
    municipality: "Malmö",
  },
  { cities_name: "Limhamn", cities_population: 26000, municipality: "Malmö" },
  {
    cities_name: "Lund Centrum",
    cities_population: 98000,
    municipality: "Lund",
  },
  {
    cities_name: "Södra Sandby",
    cities_population: 12000,
    municipality: "Lund",
  },
  {
    cities_name: "Halmstad Centrum",
    cities_population: 50000,
    municipality: "Halmstad",
  },
  {
    cities_name: "Slättåkra",
    cities_population: 6000,
    municipality: "Halmstad",
  },
  {
    cities_name: "Varberg Centrum",
    cities_population: 35000,
    municipality: "Varberg",
  },
  {
    cities_name: "Kungsbacka",
    cities_population: 15000,
    municipality: "Varberg",
  },
  {
    cities_name: "Göteborg Centrum",
    cities_population: 230000,
    municipality: "Göteborg",
  },
  { cities_name: "Linné", cities_population: 40000, municipality: "Göteborg" },
  {
    cities_name: "Borås Centrum",
    cities_population: 72000,
    municipality: "Borås",
  },
  { cities_name: "Sandared", cities_population: 9000, municipality: "Borås" },
  {
    cities_name: "Karlstad Centrum",
    cities_population: 62000,
    municipality: "Karlstad",
  },
  { cities_name: "Skåre", cities_population: 14000, municipality: "Karlstad" },
  {
    cities_name: "Arvika Centrum",
    cities_population: 17000,
    municipality: "Arvika",
  },
  { cities_name: "Edsvalla", cities_population: 6000, municipality: "Arvika" },
  {
    cities_name: "Örebro Centrum",
    cities_population: 98000,
    municipality: "Örebro",
  },
  {
    cities_name: "Marieberg",
    cities_population: 18000,
    municipality: "Örebro",
  },
  {
    cities_name: "Kumla Centrum",
    cities_population: 16000,
    municipality: "Kumla",
  },
  { cities_name: "Hovsta", cities_population: 5000, municipality: "Kumla" },
  {
    cities_name: "Västerås Centrum",
    cities_population: 100000,
    municipality: "Västerås",
  },
  { cities_name: "Bäckby", cities_population: 15000, municipality: "Västerås" },
  {
    cities_name: "Sala Centrum",
    cities_population: 13000,
    municipality: "Sala",
  },
  { cities_name: "Knutby", cities_population: 4000, municipality: "Sala" },
  {
    cities_name: "Falun Centrum",
    cities_population: 36000,
    municipality: "Falun",
  },
  { cities_name: "Kopparberg", cities_population: 8000, municipality: "Falun" },
  {
    cities_name: "Borlänge Centrum",
    cities_population: 42000,
    municipality: "Borlänge",
  },
  { cities_name: "Haråker", cities_population: 7000, municipality: "Borlänge" },
  {
    cities_name: "Gävle Centrum",
    cities_population: 65000,
    municipality: "Gävle",
  },
  { cities_name: "Valbo", cities_population: 12000, municipality: "Gävle" },
  {
    cities_name: "Söderhamn Centrum",
    cities_population: 17000,
    municipality: "Söderhamn",
  },
  { cities_name: "Mohed", cities_population: 5000, municipality: "Söderhamn" },
  {
    cities_name: "Umeå Centrum",
    cities_population: 82000,
    municipality: "Umeå",
  },
  { cities_name: "Holmsund", cities_population: 5000, municipality: "Umeå" },
  {
    cities_name: "Skellefteå Centrum",
    cities_population: 39000,
    municipality: "Skellefteå",
  },
  { cities_name: "Byske", cities_population: 7000, municipality: "Skellefteå" },
  {
    cities_name: "Luleå Centrum",
    cities_population: 50000,
    municipality: "Luleå",
  },
  { cities_name: "Boden", cities_population: 18000, municipality: "Luleå" },
  {
    cities_name: "Kiruna Centrum",
    cities_population: 17000,
    municipality: "Kiruna",
  },
  {
    cities_name: "Tuolluvaara",
    cities_population: 3000,
    municipality: "Kiruna",
  },
  {
    cities_name: "Östersund Centrum",
    cities_population: 42000,
    municipality: "Östersund",
  },
  {
    cities_name: "Bergsåker",
    cities_population: 6000,
    municipality: "Östersund",
  },
  { cities_name: "Sveg", cities_population: 5000, municipality: "Härjedalen" },
  {
    cities_name: "Funäsdalen",
    cities_population: 2000,
    municipality: "Härjedalen",
  },
  {
    cities_name: "Sundsvall Centrum",
    cities_population: 53000,
    municipality: "Sundsvall",
  },
  {
    cities_name: "Njurunda",
    cities_population: 7000,
    municipality: "Sundsvall",
  },
  {
    cities_name: "Härnösand Centrum",
    cities_population: 16000,
    municipality: "Härnösand",
  },
  {
    cities_name: "Sollefteå",
    cities_population: 12000,
    municipality: "Härnösand",
  },
]);
