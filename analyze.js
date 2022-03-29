import { readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';

analyze();
export default function analyze() {
  console.log('========= analyze.js =========');

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
    { de: 'Rheinland-Pfalz', en: 'Rheinland-Palatinate', abbreviation: 'rp' },
    { de: 'Saarland', en: 'Saarland', abbreviation: 'sl' },
    { de: 'Sachsen', en: 'Saxony', abbreviation: 'sn' },
    { de: 'Sachsen-Anhalt', en: 'Saxony-Anhalt', abbreviation: 'st' },
    {
      de: 'Schleswig-Holstein',
      en: 'Schleswig-Holstein',
      abbreviation: 'sh'
    },
    { de: 'Thüringen', en: 'Thuringia', abbreviation: 'th' }
  ];

  // Get raw json
  const data = JSON.parse(readFileSync('public/data.json', 'utf8'));

  // Data from external API
  let countryData = [];

  // Compiled filter data
  let filterData = { geography: { nodes: [] } };

  // Final data
  let all = [];

  console.log('1. Determining unique location data');
  Object.values(data).forEach((d) => {
    let u = countryData.find((c) => c.name === d.country);
    if (!u)
      countryData.push({
        name: d.country,
        url: `https://restcountries.com/v3.1/name/${d.country}`
      });
  });

  countryData.forEach((c) => {
    fetch(c.url)
      .then((response) => response.json())
      .then((data) => {
        c.data = data[0];
        if (countryData.every((c) => c.data)) {
          mapEntries();
        }
      });
  });

  function mapEntries() {
    console.log('2. Mapping entries');
    Object.keys(data).forEach((key) => {
      const d = data[key];
      let analysis = {
        id: d.id,
        urls: d.urls,
        name: transformTitle(d.title),
        slug: generateSlug(d.title),
        location: {
          city: cleanZip(d.city),
          county: cleanZip(d.county),
          region: d.region,
          state: transformState(d.state, d.id),
          country: transformCountry(d.country),
          subregion: transformSubregion(d.country)
        },
        classifications: d.classification
          ? d.classification.map((c) => transformClassification(c))
          : [],
        structures: d.structureType.map((t) => transformStructure(t)),
        condition: transformCondition(d.condition),
        conditionCommentary: d.conditionCommentary,
        purpose: transformPurpose(d.purpose),
        gallery: d.gallery,
        dates: {
          start: transformDate(d.dateBegin),
          end: transformDate(d.dateEnd)
        }
      };

      if (isAnalysisValid(analysis)) {
        addFilterData(analysis);
        all.push(analysis);
      } else {
        // todo: keep track of entries that are considered invalid, in case there's a lot of them
      }
    });

    function isAnalysisValid(analysis) {
      if (!analysis.location.state.abbreviation) return false;
      return true;
    }

    console.log(`Analyzed ${all.length} entries`);

    // Write to json
    writeFileSync('public/analysis.json', JSON.stringify(all, null, 2));
    console.log('Saved analysis to public/analysis.json');
    writeFileSync(
      'public/filter-data.json',
      JSON.stringify(filterData, null, 2)
    );
    console.log('Saved filter data to public/filter-data.json');
  }

  function cleanZip(str) {
    if (!str) return str;
    str = str.replaceAll(/[()/\\]/gi, '');
    const arr = str.split(' ').filter((s) => !s.match(/[0-9]{5}/));
    str = arr.join(' ');
    return str;
  }

  function addFilterData(d) {
    // city
    // county
    // region
    // state
    // country
    // subregion

    // Location
    const city = d.location.city ? d.location.city : null;
    const county = d.location.county ? d.location.county : null;
    const region = d.location.region ? d.location.region : null;
    const state = d.location.state ? d.location.state.abbreviation : null;
    const country = d.location.country ? d.location.country.abbreviation : null;

    const g = filterData.geography; // { nodes: [] }

    // Merge into the node tree
    const types = ['country', 'state', 'region', 'county', 'city'];
    const arr = [country, state, region, county, city, d.id];
    function addGeographyNode(parent, index = 0) {
      const name = arr[index];
      const isId = index === arr.length - 1;

      let obj = parent.nodes.find((n) => n.name === name);
      if (!obj) {
        obj = isId ? name : { name: name, type: types[index], nodes: [] };
        parent.nodes.push(obj);
      }

      index++;
      if (index < arr.length) addGeographyNode(obj, index);
    }

    // Start the recursive node-adding process
    addGeographyNode(g);

    function collapseChildrenWithNoName(parent) {
      parent.nodes.forEach((childNode, index) => {
        // Check for type to determine it's not an id
        if (childNode.type && !childNode.name) {
          // Collapse the child nodes into the parent nodes
          parent.nodes.splice(index, 1);
          if (childNode.nodes)
            parent.nodes = [...parent.nodes, ...childNode.nodes];
        }
      });

      parent.nodes.forEach((childNode) => {
        if (childNode.nodes) collapseChildrenWithNoName(childNode);
      });
    }

    // Collapse nodes without a name
    collapseChildrenWithNoName(g);
  }

  function transformPurpose(arr) {
    const purposes = [
      { de: 'burg', en: 'castle' },
      { de: 'burg-schloss', en: 'castle-manor' },
      { de: 'sonstiges', en: 'other' }
    ];

    if (!arr) arr = [];
    let t = arr.map((str) => {
      str = str.toLowerCase();

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
      {
        de: 'stark historisierend überformt',
        en: 'historic reshaping',
        value: 4
      }
    ];

    if (!str) return 'unknown';
    str = str.toLowerCase();
    let t = conditions.find((c) => c.de === str);
    if (!t) t = { de: str, en: null };

    return t;
  }

  function transformCountry(str) {
    const c = countryData.find((t) => t.name === str);
    // if (!c)
    //   console.error(`Country "${str}" didn't match any defined countries`);

    const u = {
      en: c.data.name.common,
      de: c.data.translations.deu.common,
      abbreviation: c.data.cca2.toLowerCase()
    };

    return u;
  }

  function transformSubregion(str) {
    const c = countryData.find((t) => t.name === str);
    if (!c)
      console.error(`Country "${str}" didn't match any defined countries`);

    const u = {
      en: c.data.subregion,
      de: null
    };

    return u;
  }

  function transformState(str, id) {
    const s = states.find((t) => t.de === str);
    if (!s) {
      // console.error(`State "${str}" (${id}) didn't match any defined states`);
      return { flag: null, crest: null };
    }

    s.value = {
      flag: `/images/countries/states/${s.abbreviation}_flag.svg`,
      crest: `/images/countries/states/${s.abbreviation}_crest.svg`
    };

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
}
