/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

// master affix list
// based on https://d4builds.gg/page-data/database/gear-affixes/page-data.json
// NOTE: i've found this list to be incomplete, or the spelling to not match the game!
const sourceFilePath = path.join(__dirname, 'gearAffixes.json');

// these affixes are missing from the source data
const missingAffixes = [
  {
    classType: 'all',
    affix: 'nonPhysicalDamage',
    text: '#.#% Non-Physical Damage',
  },
  {
    classType: 'druid',
    affix: 'ranksOfClaw',
    text: '# Ranks of Claw',
  },
  {
    classType: 'all',
    affix: 'maximumLifePercent',
    text: '#.#% Maximum Life',
  },
  {
    classType: 'rogue',
    affix:
      'luckyHitMakingAnEnemyVulnerableChanceToGrantIncreasedCriticalStrikeChancePercent',
    text: 'Lucky Hit: Making an enemy Vulnerable has up to a #.#% chance to grant 3% increased Critical Strike Chance for 3 seconds, up to 9%',
  },
  {
    classType: 'all',
    affix: 'ignoresDurabilityLoss',
    text: 'Ignores Durability Loss',
  },
  {
    classType: 'all',
    affix: 'ranksOfAllCoreSkills',
    text: '# Ranks of All Core Skills',
  },
  {
    classType: 'all',
    affix: 'ruptureCooldownReduction',
    text: '#.#% Rupture Cooldown Reduction',
  },
];

// these affixes have misspelled text in the source data
const correctedAffixes = [
  {
    classType: 'all',
    affix: 'luckyHitChanceToExecuteInjuredNonElitesPercent',
    text: 'Lucky Hit: Up to a #.#% Chance to Execute Injured Non-Elites',
  },
];

function transformAffixData(filePath) {
  const rawData = fs.readFileSync(filePath);
  const data = JSON.parse(rawData);
  const stats = data.result.pageContext.stats;

  const transformedData = [];
  const affixSet = new Set();

  stats.forEach((stat) => {
    Object.keys(stat).forEach((classType) => {
      if (classType !== 'slot' && classType !== 'implicit') {
        stat[classType].forEach((affixText) => {
          const simplifiedText = affixText
            .replace(/\[\d+\.?\d* - \d+\.?\d*\]%/g, '#.#%') // Replace decimal percent range with '#.#%'
            .replace(/\[\d+ - \d+\]%/g, '#%') // Replace integer percent range with '#%'
            .replace(/\[\d+ - \d+\]/g, '#') // Replace integer range with '#'
            .replace(/\[\d+\.?\d* - \d+\.?\d*\]/g, '#.#'); // Replace decimal range with '#.#'

          const affixWords = simplifiedText
            .replace(/['%]/g, '') // Replace apostrophes and percent signs with a blank
            .replace(/[^a-zA-Z\s]/g, ' ') // Replace all non-letter symbols (except spaces) with a space
            .replace(/\s+/g, ' ') // Collapse consecutive spaces into one space
            .replace(/Up to a|Up to|for seconds/gi, '') // Case-insensitive removal of specific phrases
            .trim()
            .split(/\s+/)
            .filter((x) => x);

          let affixCamelCase = affixWords
            .map((word, index) =>
              index === 0
                ? word.toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
            )
            .join('')
            .replace(/[^a-zA-Z]/g, '');

          if (simplifiedText.includes('%'))
            affixCamelCase = `${affixCamelCase}Percent`;

          if (!affixSet.has(affixCamelCase)) {
            affixSet.add(affixCamelCase);
            transformedData.push({
              classType,
              affix: affixCamelCase,
              text: simplifiedText,
            });
          }
        });
      }
    });

    // Add missing affixes
    missingAffixes.forEach((affix) => {
      if (!affixSet.has(affix.affix)) {
        affixSet.add(affix.affix);
        transformedData.push(affix);
      }
    });

    // Correct misspelled affixes
    correctedAffixes.forEach((affix) => {
      const index = transformedData.findIndex(
        (item) => item.affix === affix.affix,
      );
      if (index > -1) {
        transformedData[index].text = affix.text;
      }
    });
  });

  return transformedData;
}

const transformedAffixes = transformAffixData(sourceFilePath);

// Alphabetize the final result by affix name
const sortedTransformedAffixes = transformedAffixes.sort((a, b) =>
  a.affix.localeCompare(b.affix),
);

console.log(`Total Affixes Created: ${transformedAffixes.length}`);

fs.writeFileSync(
  'src/itemData/affixes.master.json',
  JSON.stringify(sortedTransformedAffixes, null, 2),
);

// =====================================================================================================================

// function camelCase(str) {
//   return str
//     .split(' ')
//     .map((word, index) =>
//       index === 0
//         ? word.toLowerCase()
//         : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
//     )
//     .join('');
// }

// function transformImplicitAffixes(filePath) {
//   const rawData = fs.readFileSync(filePath);
//   const data = JSON.parse(rawData);
//   const stats = data.result.pageContext.stats;

//   const transformedData = [];

//   stats.forEach((stat) => {
//     if (stat.implicit) {
//       let slotSuffix = '';
//       if (stat.slot.includes('2h')) {
//         slotSuffix = '2h';
//       } else if (stat.slot.includes('1h')) {
//         slotSuffix = '1h';
//       }

//       stat.implicit.forEach((implicitText) => {
//         // const [itemType, affixText] = implicitText.split(': ');
//         let itemType = '';
//         let affixText = '';

//         if (implicitText.includes(': ')) {
//           [itemType, affixText] = implicitText.split(': ');
//         } else {
//           itemType = stat.slot;
//           affixText = implicitText;
//         }

//         const formattedItemType = camelCase(itemType) + slotSuffix;
//         const formattedAffixText = affixText
//           .replace(/\d+\.?\d*%?/g, (match) =>
//             match.includes('%') ? '#.#%' : '#',
//           )
//           .replace(/\d+-\d+%?/g, '#.#%')
//           .trim();

//         const affix = camelCase(
//           formattedAffixText.replace(/#\.?#?%?/g, '').trim(),
//         );

//         transformedData.push({
//           itemType: formattedItemType,
//           affix: affix,
//           text: formattedAffixText,
//         });
//       });
//     }
//   });

//   return transformedData;
// }

// const transformedImplicitAffixes = transformImplicitAffixes(gearDatafilePath);

// // NOTE: this just never came out quite right, so I'm not using it for now
// fs.writeFileSync(
//   'src/itemData/affixes.implicit.json',
//   JSON.stringify(transformedImplicitAffixes, null, 4),
// );
