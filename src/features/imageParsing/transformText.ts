import {
  DamageDetails,
  extractArmorValueAndCleanText,
  extractWeaponDamageDetailsAndCleanText,
} from './extractDamage';
import {
  ItemTypeToCategoryMap,
  ItemTypes,
  Qualities,
  Rarities,
} from '@itemData/itemTypes';

import { extractAffixesAndCleanText } from './extractAffixes';
import { extractImplicitAffixes } from './extractImplicit';
import { AspectDetails, extractAspectsAndCleanText } from './extractAspects';

// Rarity
// -----------------------------------------------
// Normal
// Magic: 1-2 Affixes
// Rare: 2-6 extra random modifiers
// Unique: 4 Fixed affixes and 1 class-specific
// Legendary: 4 affixes and 1 Legendary modifier.

// Quality
// -----------------------------------------------
// (none): All World Tiers
// Sacred: World Tier III and IV
// Ancestral: World Tier IV

// Item Power Breakpoints
// -----------------------------------------------
// 0: 1 – 149
// 1: 150 – 339
// 2: 340 – 459
// 3: 460 – 624
// 4: 625 – 724
// 5: 725+

// Within the first 7 ocrLines, the following information should be found: name, type, power, and upgrades
// each of these are typically the start of a line, but the parsing can break each into multiple ocrLines

// name - alphabetic characters only, but can include apostrophies and hypens

// type - [Quality] [Rarity] [ItemType], alphabetic characters only, but can include hypens and parenthesis
//  * quality: Will be the first word, and can only be (none), Sacred, or Ancestral
//  * rarity: Will be the second word, and can only (none), Magic, Rare, Unique, or Legendary
//  * remainder is the ItemType

// power - follows the pattern "[power][+upgradePower] Item Power"

// upgrades - follows the pattern "Upgrades: [number]/[total]"

export interface Affix {
  classType: string;
  affix: string;
  text: string;
}

export interface ItemTypeDetails {
  category: string;
  itemType: string;
  name: string;
  quality: string;
  rarity: string;
}

export interface ItemDetails extends ItemTypeDetails {
  affixes: Record<string, number | string>;
  armor: number | null;
  aspect: AspectDetails | null;
  basePower: number;
  damage: DamageDetails | null;
  implicitAffixes: Record<string, number | string>;
  upgradePower: number | null;
  upgrades: number | null;
}

export interface JsonData {
  [key: string]: Affix[];
}

export interface PowerDetails {
  basePower: number;
  upgradePower: number | null;
  upgrades: number | null;
  remainingText: string[];
  nameAndTypeLines: string[];
}

function parseItemData(
  ocrText: string,
  jsonData: JsonData,
): Record<string, string> {
  const itemType = determineItemType(ocrText, jsonData);
  if (!itemType) return {};
  const itemData = matchAffixes(ocrText, jsonData[itemType]);
  return itemData;
}

function determineItemType(ocrText: string, jsonData: JsonData): string | null {
  for (const type in jsonData) {
    if (ocrText.includes(type)) {
      return type;
    }
  }
  return null;
}

function matchAffixes(
  ocrText: string,
  affixes: Affix[],
): Record<string, string> {
  const matchedAffixes: Record<string, string> = {};
  affixes.forEach((affix) => {
    const regex = new RegExp(
      affix.text.replace(/##/g, '\\d+').replace(/#/g, '\\d'),
      'i',
    );
    const match = ocrText.match(regex);
    if (match) {
      matchedAffixes[affix.affix] = match[0]; // Or extract the numeric value as needed
    }
  });
  return matchedAffixes;
}

function cleanBeforeExtraction(line: string): string {
  // Reduce consecutive spaces to a single space and remove leading and trailing spaces
  return line.replace(/\s+/g, ' ').trim();
}

function parseInitialInfo(ocrText: string): ItemDetails {
  const ocrLines = ocrText.split('\n'); // .slice(0, 7);

  const {
    basePower,
    upgradePower,
    upgrades,
    remainingText: remainingLines,
    nameAndTypeLines,
  } = extractPowerAndSplitText(ocrLines);

  const combinedTextBeforePower: string = nameAndTypeLines.join(' ');
  const { category, name, quality, rarity, itemType } =
    extractDetailsBeforePower(combinedTextBeforePower);

  const [damage, remainingLines2] =
    extractWeaponDamageDetailsAndCleanText(remainingLines);

  const [armor, remainingLines3] =
    extractArmorValueAndCleanText(remainingLines2);

  // combine lines and remove any remaining plus signs
  const combinedText = remainingLines3.join(' ').replace(/\+/g, '');

  const [implicitAffixes, combinedText2] = extractImplicitAffixes(
    itemType,
    cleanBeforeExtraction(combinedText),
  );

  const [affixes, combinedText3] = extractAffixesAndCleanText(
    cleanBeforeExtraction(combinedText2),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [aspect, combinedText4] = extractAspectsAndCleanText(
    cleanBeforeExtraction(combinedText3),
  );

  return {
    affixes,
    armor,
    aspect,
    basePower,
    category,
    damage,
    implicitAffixes,
    itemType,
    name,
    quality,
    rarity,
    upgradePower,
    upgrades,
  };
}

function extractPowerAndSplitText(ocrLines: string[]): PowerDetails {
  const powerRegex = /(\d+)\+?(\d+)? Item Power/;
  let basePower = 0,
    upgradePower = null,
    upgrades = null;
  let powerLineIndex = -1;

  for (let i = 0; i < ocrLines.length; i++) {
    const match = ocrLines[i].match(powerRegex);
    if (match) {
      basePower = parseInt(match[1]);
      upgradePower = match[2] ? parseInt(match[2]) : null;
      upgrades = upgradePower !== null ? Math.floor(upgradePower / 5) : null;
      powerLineIndex = i;
      break;
    }
  }

  const nameAndTypeLines = ocrLines.slice(0, powerLineIndex);
  const removeLines = upgradePower ? 2 : 1;
  const remainingText = ocrLines.slice(powerLineIndex + removeLines);

  return { basePower, upgradePower, upgrades, remainingText, nameAndTypeLines };
}

function extractDetailsBeforePower(combinedText: string): ItemTypeDetails {
  // remove spaces in hyphenated words. this can occur when a line break is in the middle
  // of a hyphenated word and the lines have been rejoined with a space.
  // barbarians get an extra " (damage type)" descriptor on their screen, so removing it
  // to match the type better.
  const text = combinedText
    .replace(/-\s|\s-/g, '-')
    .replace(/\s+\([^)]*\)$/, '');

  const sortedItemTypes = [...ItemTypes].sort((a, b) => b.length - a.length);
  const itemType =
    sortedItemTypes.find((type) => text.endsWith(type)) ?? 'Unknown';

  const typeIndex = text.indexOf(itemType);
  let precedingWords = text.substring(0, typeIndex).trim().split(' ');
  let lastWord = precedingWords[precedingWords.length - 1];

  let rarity = 'Normal';
  if (Rarities.includes(lastWord)) {
    rarity = lastWord;
    precedingWords = precedingWords.slice(0, -1);
    lastWord = precedingWords[precedingWords.length - 1];
  }

  let quality = 'Normal';
  if (Qualities.includes(lastWord)) {
    quality = lastWord;
    precedingWords = precedingWords.slice(0, -1);
  }

  // join the remaining words into a name. all names should start with a letter, so
  // remove any symbols that can sometimes be misinterpreted from a border artifact.
  const name = precedingWords
    .join(' ')
    .replace(/^[^a-zA-Z]+/, '')
    .trim();

  const category =
    ItemTypeToCategoryMap[itemType as keyof typeof ItemTypeToCategoryMap];

  return { category, name, quality, rarity, itemType };
}

export {
  // Affix,
  // ItemDetails,
  // JsonData,
  determineItemType,
  matchAffixes,
  parseInitialInfo,
  parseItemData,
};
