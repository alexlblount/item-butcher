/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

function camelCase(str) {
  return (
    str
      // Replace hyphens with spaces to maintain word boundaries
      .replace(/-/g, ' ')
      .split(/\s+/) // Split the string into words
      .map(
        (word, index) =>
          index === 0
            ? word.toLowerCase() // Lowercase the first word
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(), // Capitalize the first letter of subsequent words
      )
      .join('')
  ); // Join the words back together
}

const spellingCorrections = [
  { incorrect: 'additonal', correct: 'additional' },
  { incorrect: 'addtional', correct: 'additional' },
  { incorrect: 'gaurantees', correct: 'guarantees' },
  { incorrect: 'lmmobilize', correct: 'Immobilize' },
  { incorrect: 'lncinerate', correct: 'Incinerate' },
  { incorrect: 'lnjured', correct: 'Injured' },
  { incorrect: 'Marskman', correct: 'Marksman' },
  { incorrect: 'Neaby', correct: 'Nearby' },
  { incorrect: 'Poision', correct: 'Poison' },
  {
    incorrect:
      'The other properties of this weapon can roll higher than normal',
    correct: 'The other properties on this weapon can roll higher than normal',
  },
  {
    incorrect: 'Enemies standing in the pool take 20% increased Bleed damage.',
    correct: 'Enemies standing in the pool take 20% increased Bleeding damage',
  },
];

function applySpellingCorrections(text, corrections) {
  corrections.forEach((correction) => {
    text = text.replace(
      new RegExp(correction.incorrect, 'gi'),
      correction.correct,
    );
  });
  return text;
}

function transformLegendaryAspects() {
  // based on https://d4builds.gg/page-data/database/legendary-aspects/page-data.json
  const sourceFilePath = path.join(__dirname, 'aspects.json');
  const rawData = fs.readFileSync(sourceFilePath);
  const data = JSON.parse(rawData);

  const transformedData = data.result.pageContext.codexes.map((aspect) => {
    const description = applySpellingCorrections(
      aspect.description,
      spellingCorrections,
    );

    return {
      aspect: camelCase(
        aspect.name
          .replace(/'s/g, '')
          .replace(/aspect\s*of\s*the\s*/gi, '')
          .replace(/aspect\s*of\s*/gi, '')
          .replace(/aspect/gi, '')
          .replace(/[^a-zA-Z0-9]/g, ' ') // This line replaces any non-letter or non-number character with a space
          .replace(/\s+/g, ' '), // Collapse consecutive spaces into one space
      ),
      class: camelCase(aspect.class || 'all'),
      name: aspect.name,
      text: description
        .replace(/\u2013/g, '-') // Replace en dash with normal hyphen
        .replace(/\u2019/g, "'") // Replace U+2019 with normal apostrophe
        .replace(/\[\d+\.?\d*%?(-\d+\.?\d*%?)?\]/g, (match) =>
          match.includes('%') ? '#.#%' : '#',
        )
        .replace(/\[X\]/gi, '#') // Replace [X] with #
        .replace(/ x /gi, ' ') // Replace " x " with " "
        .replace(/\.$/g, '') // Replace period at the end with a blank
        .replace(/ ,/g, ',') // Replace " ," with ","
        .replace(/\+/g, '') // Remove all plus signs
        .replace(/\s+/g, ' ') // Collapse consecutive spaces into one space
        .replace(/ \. /g, '. ') // Replace " . " with ". "
        .trim(),
      type: camelCase(aspect.type),
      rarity: 'legendary',
    };
  });

  return transformedData;
}

function transformUniqueAspects() {
  // based on https://d4builds.gg/page-data/database/uniques/page-data.json
  const sourceFilePath = path.join(__dirname, 'uniques.json');
  const rawData = fs.readFileSync(sourceFilePath);
  const data = JSON.parse(rawData);

  const transformedData = data.result.pageContext.uniques.map((unique) => {
    const effect = applySpellingCorrections(unique.effect, spellingCorrections);

    return {
      aspect: camelCase(
        unique.name
          .replace(/'s/g, 's')
          .replace(/aspect\s*of\s*the\s*/gi, '')
          .replace(/aspect\s*of\s*/gi, '')
          .replace(/aspect/gi, '')
          .replace(/[^a-zA-Z0-9]/g, ' ') // This line replaces any non-letter or non-number character with a space
          .replace(/\s+/g, ' '), // Collapse consecutive spaces into one space
      ),
      class: camelCase(unique.class || 'all'),
      name: unique.name,
      text: effect
        .replace(/\u2013/g, '-') // Replace en dash with normal hyphen
        .replace(/\u2019/g, "'") // Replace U+2019 with normal apostrophe
        .replace(/\[\d+\.?\d*%?(-\d+\.?\d*%?)?\]/g, (match) =>
          match.includes('%') ? '#.#%' : '#',
        )
        .replace(/\[X\]/gi, '#') // Replace [X] with #
        .replace(/ x /gi, ' ') // Replace " x " with " "
        .replace(/\.$/g, '') // Replace period at the end with a blank
        .replace(/ ,/g, ',') // Replace " ," with ","
        .replace(/\+/g, '') // Remove all plus signs
        .replace(/\s+/g, ' ') // Collapse consecutive spaces into one space
        .replace(/ \. /g, '. ') // Replace " . " with ". "
        .trim(),
      type: 'unique',
      rarity: 'unique',
    };
  });

  return transformedData;
}

const legendaryAspects = transformLegendaryAspects();
const uniqueAspects = transformUniqueAspects();

const transformedData = [...legendaryAspects, ...uniqueAspects];

// Alphabetize the final result by affix name
const sortedTransformedData = transformedData.sort((a, b) =>
  a.aspect.localeCompare(b.aspect),
);

console.log(`Total Aspects Created: ${sortedTransformedData.length}`);

fs.writeFileSync(
  'src/itemData/aspects.master.json',
  JSON.stringify(sortedTransformedData, null, 2),
);
