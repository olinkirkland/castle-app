import * as fs from 'fs';
import * as https from 'https';
import * as jsdom from 'jsdom';
import * as path from 'path';
import ProgressBar from 'progress';
import * as readline from 'readline';
import { fileURLToPath } from 'url';
import analyze from './analyze.js';

const sectionNames = [
  'history',
  'properties',
  'physical',
  'tourism',
  'references'
];

const sectionUrls = [
  'https://www.ebidat.de/cgi-bin/ebidat.pl?id=',
  'https://www.ebidat.de/cgi-bin/ebidat.pl?m=h&id=',
  'https://www.ebidat.de/cgi-bin/ebidat.pl?m=o&id=',
  'https://www.ebidat.de/cgi-bin/ebidat.pl?m=g&id=',
  'https://www.ebidat.de/cgi-bin/ebidat.pl?m=n&id='
];

const keyMap = [
  { ebidatKeys: ['staat'], id: 'country' },
  { ebidatKeys: ['bundesland'], id: 'state' },
  { ebidatKeys: ['region'], id: 'region' },
  { ebidatKeys: ['kreis'], id: 'county' },
  { ebidatKeys: ['stadt / gemeinde'], id: 'city' },
  { ebidatKeys: ['typ'], id: 'structureType' },
  { ebidatKeys: ['klassifizierung'], id: 'classification' },
  { ebidatKeys: ['funktion rechtsstellung'], id: 'purpose' },
  { ebidatKeys: ['kurzansprache'], id: 'overview' },
  { ebidatKeys: ['datierung-beginn'], id: 'dateBegin' },
  { ebidatKeys: ['datierung-ende'], id: 'dateEnd' },
  { ebidatKeys: ['erhaltung - heutiger zustand'], id: 'condition' },
  { ebidatKeys: ['erhaltung - kommentar'], id: 'conditionCommentary' }
];

let allJson = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawDir = 'data/raw-data/';
const jsonDir = 'data/json-data/';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Perform Actions
 */

let max = 10;
let skipped = 0;

let bar;

function askDownload() {
  // todo log summary of all data from data.json
  rl.question(`Scrape number of entries (number)? `, (str) => {
    const n = Number.parseInt(str);
    if (!Number.isInteger(n)) {
      console.log(`'${str}' is not a valid integer\n`);
      return askDownload();
    } else {
      max = n;
      return performDownload();
    }
  });
}

askDownload();

function performDownload() {
  // Download new data from EBIDAT, then parse once the downloads are complete
  // This can take a long time, will save to the raw-data folder
  console.log(`Downloading ${max} entries (${max * 5} files)...`);
  bar = new ProgressBar(`[:bar] :current/:total | :percent`, {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: max * 5
  });

  skipped = 0;
  loadFromEbidat(1, 0);
}

/**
 * Download from EBIDAT
 */

function loadFromEbidat(index = 1, section = 0, callback = null) {
  // Make sure the file path exists so it can be written to
  let filePath = `${rawDir}${index}/entry-${index}-${section}.html`;
  ensureDirectoryExistence(filePath);

  // Assemble the query url by combining the correct section with the index
  let url = sectionUrls[section] + index;

  if (fs.existsSync(filePath)) {
    // Skip if it exists
    skipped++;
    next();
  } else {
    const file = fs.createWriteStream(filePath);
    https.get(url, function (res) {
      res.setEncoding('binary');
      res.pipe(file);
      next();
    });
  }

  function next() {
    // Determine if the next query of the current index should be loaded
    // Or if the next index should be loaded (with the query index reset)
    section++;
    if (section === sectionUrls.length) {
      section = 0;
      index++;
    }

    bar.tick();

    if (index <= max) {
      // Load the next url
      loadFromEbidat(index, section, callback);
    } else {
      const totalFileCount = max * 5;
      const downloadedFileCount = totalFileCount - skipped;
      console.log(`Total files: ${totalFileCount}`);

      if (downloadedFileCount === 0)
        console.log(` No files were downloaded (skipped all)`);
      if (downloadedFileCount > 0)
        console.log(
          ` Downloaded ${downloadedFileCount} files (skipped ${skipped})`
        );

      askParse();
    }
  }
}

function askParse() {
  rl.question('Parse all downloaded files (y/n)? ', (str) => {
    if (str === 'y') {
      performParse(askDownloadImages);
    } else if (str === 'n') {
      askAnalyze();
    } else {
      console.log(`'${str}' is not valid input`);
      return askParse();
    }
  });
}

function askDownloadImages() {
  rl.question('Download images (y/n)? ', (str) => {
    if (str === 'y') {
      performDownloadImages(askAnalyze);
    } else if (str === 'n') {
      askAnalyze();
    } else {
      console.log(`'${str}' is not valid input`);
      return askDownloadImages();
    }
  });
}

function askAnalyze() {
  rl.question('Publish using analyze.js? (y/n)? ', (str) => {
    if (str === 'y') {
      rl.close();
      analyze();
    } else if (str === 'n') {
      rl.close();
    } else {
      console.log(`'${str}' is not valid input`);
      return askParse();
    }
  });
}

function ensureDirectoryExistence(filePath) {
  let dir = path.dirname(filePath);
  if (fs.existsSync(dir)) {
    return true;
  }
  ensureDirectoryExistence(dir);
  fs.mkdirSync(dir);
}

/**
 * Parse downloaded files to json
 */

function performParse(callback) {
  fs.readdir(rawDir, function (err, dirs) {
    if (err) {
      return console.log(`Unable to scan directory: ${err}`);
    }

    console.log(`Parsing (${dirs.length} entries)...`);
    bar = new ProgressBar(`[:bar] :current/:total | :percent`, {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: dirs.length
    });

    // Combine the contents of the files into one .json file and store it in json-data
    // Each folder in 'dirs' contains 5 files
    parseNext();

    function parseNext(index = 0) {
      let dir = dirs[index];
      bar.tick();

      const files = fs.readdirSync(`${rawDir}${dir}`);

      let combinedContent = {};

      files.forEach(function (file) {
        // Read the file
        let url = path.resolve(__dirname, `${rawDir}${dir}/${file}`);

        let data = null;
        try {
          data = fs.readFileSync(url, 'utf8');
        } catch (err) {}

        // Get the id and section from the file name
        let arr = file.match(/([0-9]+)/gi);
        let id = arr[0];
        let section = arr[1];

        // Add the data to the combined object
        combinedContent['id'] = id;
        combinedContent[sectionNames[section]] = data;
      });

      const object = parseToObject(combinedContent);

      analyzeObject(object);

      // Add it to allJson
      if (object) {
        allJson[object.id] = object;

        try {
          let filePath = `${jsonDir}${object.id}.json`;
          ensureDirectoryExistence(filePath);
          fs.writeFileSync(filePath, JSON.stringify(object, null, 2));
        } catch (err) {}
      } else {
        // This wasn't loadable; keep track of non loading ids?
        // console.log(`\nerror@id=${combinedContent.id}`);
      }

      if (++index < dirs.length) {
        parseNext(index);
      } else {
        // End
        writeAllJson();
        callback();
      }
    }
  });
}

function printAllKeys() {
  let arr = [];
  for (let key in allKeys) {
    arr.push({ key: key, value: allKeys[key] });
  }

  arr.sort(function (a, b) {
    return b.value - a.value;
  });

  // arr.forEach((item, index) => {
  //   console.log(item.key + ' ... ' + item.value);
  // });
}

function writeAllJson() {
  // Write allJson to all.json, a file that contains all of the json data
  try {
    let filePath = `public/data.json`;
    ensureDirectoryExistence(filePath);
    fs.writeFileSync(filePath, JSON.stringify(allJson));
    console.log(`Saved to ${filePath}`);
  } catch (err) {
    console.error(err);
  }
}

let allKeys = {};
function analyzeObject(o) {
  for (let key in o) {
    allKeys[key] = allKeys[key] ? allKeys[key] + 1 : 1;
  }
}

function parseToObject(u) {
  const history = new jsdom.JSDOM(u.history);
  const properties = new jsdom.JSDOM(u.properties);
  const physical = new jsdom.JSDOM(u.physical);
  const tourism = new jsdom.JSDOM(u.tourism);
  const references = new jsdom.JSDOM(u.references);

  let urls = [];
  sectionUrls.forEach((sectionUrl) => {
    urls.push(sectionUrl + u.id);
  });

  let o = { id: u.id, urls: urls };

  /**
   * History
   */

  // Title
  const titleEl = history.window.document.querySelector('h2');
  if (!titleEl) return null;

  o.title = titleEl.textContent;
  if (!o.title) return null;

  // Timeline (Geschichte)
  const timelineEl = history.window.document.querySelector(
    'section > article.beschreibung > h3 + p:nth-of-type(1)'
  );
  o.timeline = timelineEl ? timelineEl.textContent : null;

  // Building Development (Bauentwicklung)
  const buildingDevelopmentEl = history.window.document.querySelector(
    'section > article.beschreibung > h3 + p:nth-of-type(2)'
  );
  o.buildingDevelopment = buildingDevelopmentEl
    ? buildingDevelopmentEl.textContent
    : null;

  // Building Description (Baubeschreibung)
  const buildingDescriptionEl = history.window.document.querySelector(
    'section > article.beschreibung > h3 + p:nth-of-type(3)'
  );
  o.buildingDescription = buildingDescriptionEl
    ? buildingDescriptionEl.textContent
    : null;

  // Gallery
  // Get urls of full-size images
  let gallery = [];

  const galleryImgEl = history.window.document.querySelectorAll(
    'div.galerie > a > img'
  );

  const galleryAEl = [];
  galleryImgEl.forEach((img) => galleryAEl.push(img.closest('a')));
  galleryAEl.forEach((el, index) => {
    const url =
      'https://www.ebidat.de' + el.href.substring(el.href.indexOf('/'));
    gallery.push({
      id: `${index}`,
      url: url,
      path: `/images/castles/${o.id}/${index}${fileTypeFromUrl(url)}`
    });
  });

  galleryImgEl.forEach((el, index) => {
    let galleryItem = gallery[index];
    galleryItem.castle = o.id;
    // galleryItem.thumbnail =
    //   'https://ebidat.de' + el.src.substring(el.src.indexOf('/'));

    if (el.alt) {
      galleryItem.caption = el.alt;

      // Extract year from caption
      const arr = el.alt.match(/\(([0-9]{4})\)/);
      if (arr && arr.length > 0) galleryItem.year = arr.pop();
    }
  });
  o.gallery = gallery;

  // Properties, Physical, and Tourism are all parsed the same way
  Object.assign(o, parseDataEls(properties));
  Object.assign(o, parseDataEls(physical));
  Object.assign(o, parseDataEls(tourism));

  // References
  const referencesEl = references.window.document.querySelector(
    'section > article.beschreibung > ul > li.daten'
  );

  let refs = [];
  if (referencesEl) {
    let childNodes = referencesEl.childNodes;
    childNodes.forEach((node) => {
      if (
        node.nodeType === node.TEXT_NODE &&
        node.textContent.trim().length > 0
      ) {
        refs.push(node.textContent.trim());
      }
    });
  }

  o.references = refs;
  return o;
}

function performDownloadImages(callback, overwrite = false) {
  let queue = [];
  Object.values(allJson).forEach((castle) => {
    castle.gallery.forEach((g) => {
      const url = `public${g.path}`;
      ensureDirectoryExistence(url);
      queue.push({ path: url, url: g.url });
    });
  });

  const imageCount = queue.length;

  if (imageCount === 0) {
    console.log('No images to download');
    callback();
    return;
  }

  console.log(`Downloading ${imageCount} images...`);
  bar = new ProgressBar(`[:bar] :current/:total | :percent`, {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: imageCount
  });

  let current;
  skipped = 0;
  const intervalId = setInterval(() => {
    if (!current) {
      if (queue.length === 0) {
        clearInterval(intervalId);
        return;
      }

      current = queue.pop();

      // If overwrite is set to false, skip this download if the file already exists
      bar.tick();
      if (!overwrite && fs.existsSync(current.path)) {
        // console.log(`${imageCount - queue.length}/${imageCount} SKIP`);
        skipped++;
        current = null;
        if (bar.complete) finishDownloadImages();
      } else {
        // console.log(`${imageCount - queue.length}/${imageCount}`);
        const file = fs.createWriteStream(current.path);
        https.get(current.url, function (response) {
          response.pipe(file);
          current = null;
          if (bar.complete) finishDownloadImages();
        });
      }
    }
  }, 5);

  function finishDownloadImages() {
    const downloadCount = imageCount - skipped;
    console.log(`Total images: ${imageCount}`);

    if (downloadCount === 0)
      console.log(` No images were downloaded (skipped all)`);
    if (downloadCount > 0)
      console.log(` Downloaded ${downloadCount} images (skipped ${skipped})`);
    clearInterval(intervalId);
    callback();
  }
}

function fileTypeFromUrl(url) {
  return url.substring(url.lastIndexOf('.'));
}

function parseDataEls(dom) {
  let o = { misc: {} };

  // Loop through all possible data elements
  const dataEls = dom.window.document.querySelectorAll(
    `section > article.beschreibung > ul > li.daten`
  );

  dataEls.forEach((el) => {
    const dataKeyEl = el.querySelector(`div.gruppe`);
    const dataValueEl = el.querySelector(`div.gruppenergebnis`);

    if (dataKeyEl && dataValueEl) {
      let dataKey = formatDataKey(dataKeyEl.innerHTML);
      let dataValue = formatDataValue(dataValueEl.innerHTML);

      // Determine the correct id
      let keyMatch = false;
      keyMap.forEach((key) => {
        if (key.ebidatKeys.indexOf(dataKey) >= 0) {
          // Match!
          if (dataValue !== '') {
            o[key.id] = dataValue;
            keyMatch = true;
          }
        }
      });

      // If there is no predetermined id for this key, add it to a misc container
      if (!keyMatch) {
        o.misc[dataKey] = dataValue;
      }
    }
  });

  return o;
}

function printOneKey(key) {
  const arr = Object.values(allJson).map((u) => u[key]);
  console.log(arr);
}

function formatDataKey(str) {
  // Strip out the ':' and make it lowercase
  str = str.substring(0, str.indexOf(':')).toLowerCase();
  return str;
}

function formatDataValue(str) {
  // Trim and split by line breaks if necessary
  str.trim();

  // Multiple items?
  // TODO: use childNodes
  const lineBreakMatch = str.match(/\n|<br>/);
  if (lineBreakMatch && lineBreakMatch.length > 0) {
    let arr = str.split(/\n|<br>/);

    arr = arr.map((item) => item.trim());
    arr = arr.filter((item) => item.length > 0);
    return arr;
  }

  return str;
}
