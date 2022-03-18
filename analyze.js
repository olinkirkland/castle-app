const fs = require('fs');
const https = require('https');
const path = require('path');
const { title } = require('process');

// Get raw json
const data = JSON.parse(fs.readFileSync('public/data.json', 'utf8'));

// Analysis
let uniqueStructures = [];
let uniqueClassifications = [];

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
      country: d.country
    },
    classifications: d.classification
      ? d.classification.map((c) => transformClassification(c))
      : [],
    structures: d.structureType.map((t) => transformStructure(t))
  };

  all.push(analysis);
});

console.log('=== unique classifications ===');
console.log(uniqueClassifications);
console.log('=== unique types ===');
console.log(uniqueStructures);

// Write to json
fs.writeFileSync('public/analysis.json', JSON.stringify(all, null, 2));

function transformTitle(str) {
  // Fix foo.bar -> foo. bar
  // Fix foo,bar -> foo, bar
  str = str.replaceAll(/([\.,])([a-z])/gi, '$1 $2');

  str = str.replaceAll(' b. ', ' bei ');

  const regex = /(b\.|bei|im|a\. d\.|,)/gi;
  const separatorIndex = str.search(regex);

  // TODO: Use google search result count to determine if it's "an der" or "an dem"

  // Primary
  const primary =
    separatorIndex < 0 ? str : str.substring(0, separatorIndex).trim();

  // Secondary
  let secondary =
    separatorIndex < 0 ? null : str.substring(separatorIndex).trim();
  // Fix leading comma
  if (secondary && secondary.indexOf(', ') == 0)
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
  let t = structures.find((t) => t.de == str);
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
