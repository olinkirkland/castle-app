const fs = require('fs');

// Get raw json
const data = JSON.parse(fs.readFileSync('public/data.json', 'utf8'));

// Analysis
let uniqueStructures = [];
let uniqueClassifications = [];
let uniqueConditions = [];
let uniquePurposes = [];

let all = [];
Object.keys(data).forEach((key) => {
  const d = data[key];
  let analysis = {
    id: d.id,
    urls: d.urls,
    name: transformTitle(d.title),
    slug: generateSlug(d.title),
    location: {
      city: d.city,
      county: d.county,
      region: d.region,
      state: transformState(d.state),
      country: transformCountry(d.country)
    },
    classifications: d.classification
      ? d.classification.map((c) => transformClassification(c))
      : [],
    structures: d.structureType.map((t) => transformStructure(t)),
    condition: transformCondition(d.condition),
    conditionCommentary: d.conditionCommentary,
    purpose: transformPurpose(d.purpose),
    gallery: d.gallery,
    dates: { start: transformDate(d.dateBegin), end: transformDate(d.dateEnd) }
  };

  all.push(analysis);
});

console.log(`${all.length} entries`);

// console.log('=== unique classifications ===');
// console.log(uniqueClassifications);
// console.log('=== unique types ===');
// console.log(uniqueStructures);
// console.log('=== unique conditions ===');
// console.log(uniqueConditions);
console.log('=== unique purposes ===');
console.log(uniquePurposes);

// Write to json
fs.writeFileSync('public/analysis.json', JSON.stringify(all, null, 2));

function transformPurpose(arr) {
  const purposes = [
    { de: 'burg', en: 'castle' },
    { de: 'burg-schloss', en: 'castle-manor' },
    { de: 'sonstiges', en: 'other' }
  ];

  if (!arr) arr = [];
  let t = arr.map((str) => {
    str = str.toLowerCase();
    if (!uniquePurposes.includes(str)) uniquePurposes.push(str);

    let u = purposes.find((t) => t.de === str);
    if (!u) u = { de: str, en: null };
    return u;
  });

  return t;
}

function transformDate(str) {
  let date = { century: null, half: null };

  if (!str) return;
  str = str.toLowerCase().trim();

  // Unknown
  if (str === 'unbekannt') {
    return date;
  }

  // Half & Century
  const regex = /((?<half>[0-9]+).H.)?((?<century>[0-9]+).Jh.)/gi;
  const r = regex.exec(str);
  return {
    century: r.groups.century,
    half: r.groups.half ? r.groups.half : null
  };
}

function transformTitle(str) {
  // Fix foo.bar -> foo. bar
  // Fix foo,bar -> foo, bar
  str = str.replaceAll(/([.,])([a-z])/gi, '$1 $2');
  if (!str.trim().includes(' ')) {
    // For single words, just return the str
    return {
      primary: str,
      secondary: null
    };
  }

  str = str.replaceAll(' b. ', ' bei ');
  str = str.replaceAll(' i. ', ' im ');

  const regex = /( (b\.|bei|im|am|in|a\. d\.))|(,)/gi;
  const separatorIndex = str.search(regex);

  // TODO: Use google search result count to determine if it's "an der" or "an dem"

  // Primary
  const primary =
    separatorIndex < 0 ? str : str.substring(0, separatorIndex).trim();

  // Secondary
  let secondary =
    separatorIndex < 0 ? null : str.substring(separatorIndex).trim();
  // Fix leading comma
  if (secondary && secondary.indexOf(', ') === 0)
    secondary = secondary.substring(2);

  return {
    primary: primary,
    secondary: secondary
  };
}

function transformStructure(str) {
  const structures = [
    { de: 'burg', en: 'castle' },
    { de: 'burg-schloss', en: 'castle-manor' },
    { de: 'sonstiges', en: 'other' }
  ];

  str = str.toLowerCase();
  let t = structures.find((t) => t.de === str);
  if (!t) t = { de: str, en: null };

  if (!uniqueStructures.includes(str)) uniqueStructures.push(str);
  return t;
}

function transformClassification(str) {
  const classifications = [
    { de: 'wasserburg', en: 'water castle' },
    // { de: 'randhausanlage', en: '' },
    // { de: 'ringmauerburg', en: '' },
    // { de: 'schildmauerburg', en: '' },
    { de: 'burghaus', en: 'fortified house' },
    { de: 'wohnturm', en: 'keep' },
    { de: 'abgegangene burgstelle', en: 'abandoned ruin' },
    { de: 'niederungsburg', en: 'lowland castle' },
    // { de: 'frontturmburg', en: '' },
    { de: 'bodendenkmal', en: '' },
    { de: 'burgstelle', en: 'castle site' },
    { de: 'burg allgemein', en: 'castle' },
    { de: 'kastellburg', en: 'quadrangular castle' },
    { de: 'felsenburg', en: 'rock castle' },
    { de: 'burgstall', en: 'stable' }
    // { de: 'kompaktanlage', en: '' }
  ];

  str = str.toLowerCase();
  let t = classifications.find((c) => c.de == str);
  if (!t) t = { de: str, en: null };

  if (!uniqueClassifications.includes(str)) uniqueClassifications.push(str);
  return t;
}

function transformCondition(str) {
  const conditions = [
    { de: 'keine reste', en: 'no remains', value: 0 },
    { de: 'überbaut', en: 'overbuilt', value: 0 },
    { de: 'fundamente', en: 'foundations', value: 1 },
    { de: 'geringe reste', en: 'small leftovers', value: 2 },
    { de: 'bedeutende reste', en: 'significant remains', value: 3 },
    { de: 'weitgehend erhalten', en: 'largely preserved', value: 4 },
    { de: 'stark historisierend überformt', en: 'historic reshaping', value: 4 }
  ];

  if (!str) return 'unknown';
  str = str.toLowerCase();
  let t = conditions.find((c) => c.de === str);
  if (!t) t = { de: str, en: null };

  if (!uniqueConditions.includes(str)) uniqueConditions.push(str);
  return t;
}

function transformCountry(str) {
  const countries = [
    {
      de: 'Bundesrepublik Deutschland',
      en: 'Germany',
      abbreviation: 'de'
    }
  ];

  const c = countries.find((t) => t.de == str);
  if (!c) console.error(`Country "${str}" didn't match any defined countries`);
  return c;
}

function transformState(str) {
  const states = [
    { de: 'Baden-Württemberg', en: 'Baden-Württemberg', abbreviation: 'bw' },
    { de: 'Bayern', en: 'Bavaria', abbreviation: 'by' },
    { de: 'Berlin', en: 'Berlin', abbreviation: 'be' },
    { de: 'Brandenburg', en: 'Brandenburg', abbreviation: 'bb' },
    { de: 'Bremen', en: 'Bremen', abbreviation: 'hb' },
    { de: 'Hamburg ', en: 'Hamburg', abbreviation: 'hh' },
    { de: 'Hessen', en: 'Hesse', abbreviation: 'he' },
    { de: 'Niedersachsen', en: 'Lower Saxony', abbreviation: 'ni' },
    {
      de: 'Mecklenburg-Vorpommern',
      en: 'Mecklenburg-Western Pomerania',
      abbreviation: 'mv'
    },
    {
      de: 'Nordrhein-Westfalen',
      en: 'North Rhine-Westphalia',
      abbreviation: 'nw'
    },
    { de: 'Rheinland-Pfalz', en: 'Rheinland-Pfalz', abbreviation: 'rp' },
    { de: 'Saarland', en: 'Saarland', abbreviation: 'sl' },
    { de: 'Sachsen', en: 'Saxony', abbreviation: 'sn' },
    { de: 'Sachsen-Anhalt', en: 'Saxony-Anhalt', abbreviation: 'st' },
    { de: 'Schleswig-Holstein', en: 'Schleswig-Holstein', abbreviation: 'sh' },
    { de: 'Thüringen', en: 'Thuringia', abbreviation: 'th' }
  ];

  const s = states.find((t) => t.de == str);
  if (!s) console.error(`State "${str}" didn't match any defined states`);
  return s;
}

function generateSlug(str) {
  // Generate a unique slug based on str
  let i = 0;
  str = str
    .toLowerCase()
    .replaceAll(/[ -\.]/g, '-')
    .replaceAll(/-+/g, '-');
  let slug;
  do {
    slug = i > 0 ? `${str}-${i}` : str;
    i++;
  } while (all.some(({ l }) => slug == l));

  return slug;
}
