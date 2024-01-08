// master affix list
// based on https://d4builds.gg/page-data/database/gear-affixes/page-data.json
// NOTE: i've found this list to be incomplete, or the spelling to not match the game
import affixes from '@src/itemData/affixes.master.json';

const affixData = affixes as Affix[];

export interface Affix {
  affix: string;
  classType: string;
  text: string;
}

function convertToNumberOrDefault(value: string): number | string {
  const parsedValue = parseFloat(value);
  return isNaN(parsedValue) ? value : parsedValue;
}

function extractAffixesAndCleanText(
  combinedText: string,
): [Record<string, number | string>, string] {
  const extractedAffixes: Record<string, number | string> = {};

  affixData.sort((a, b) => b.text.length - a.text.length);

  affixData.forEach((affix) => {
    const regexPattern = affix.text
      .replace(/\+/g, '\\+') // Escape plus sign
      .replace('#.#', '(\\d+\\.\\d+|\\d+)%?') // Match decimal or whole number for percentages
      .replace('#', '(\\d+)%?'); // Match whole numbers
    const regex = new RegExp(regexPattern, 'i');

    const match = combinedText.match(regex);

    if (match) {
      // match[1] will be the number if its an affix with a number.
      // match[0] will be the entire string that matches if there is no number.
      extractedAffixes[affix.affix] = convertToNumberOrDefault(
        match[1] || match[0],
      );
      combinedText = combinedText.replace(regex, '');
    }
  });

  return [extractedAffixes, combinedText];
}

export { extractAffixesAndCleanText };
