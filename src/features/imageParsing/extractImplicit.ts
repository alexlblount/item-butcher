import affixes from '@src/itemData/affixes.implicit.json';
import { ItemType } from '@src/itemData/itemTypes';

export interface ImplicitAffix {
  itemType: string;
  affix: string;
  text: string;
  value?: string;
}

function convertToNumberOrDefault(value: string): number | string {
  const parsedValue = parseFloat(value);
  return isNaN(parsedValue) ? value : parsedValue;
}

function getKeyByValue(value: string): string | undefined {
  for (const key in ItemType) {
    if (ItemType[key as keyof typeof ItemType] === value) {
      return key;
    }
  }
  return undefined; // or handle the case where the value is not found
}

function extractImplicitAffixes(
  itemTypeValue: string,
  combinedText: string,
): [Record<string, number | string>, string] {
  const itemType = getKeyByValue(itemTypeValue);

  if (!itemType || ['helm', 'gloves', 'chestArmor'].includes(itemType)) {
    return [{}, combinedText]; // Early exit for item types with no implicit affixes
  }

  const extractedAffixes: Record<string, number | string> = {};

  const relevantAffixes = affixes.filter(
    (affix) => affix.itemType === itemType,
  );
  relevantAffixes.sort((a, b) => b.text.length - a.text.length);

  for (const affix of relevantAffixes) {
    if (itemType !== 'shield' && Object.keys(extractedAffixes).length > 0) {
      break; // Exit the entire loop for non-shield items after the first match
    }

    const regexPattern = affix.text
      .replace(/\+/g, '\\+') // Escape plus sign
      .replace('#.#', '(\\d+\\.\\d+|\\d+)%?') // Match decimal or whole number for percentages
      .replace('#', '(\\d+)%?'); // Match whole numbers
    const regex = new RegExp(regexPattern, 'i');
    const match = combinedText.match(regex);

    if (match) {
      extractedAffixes[affix.affix] = convertToNumberOrDefault(
        match[1] || match[2],
      );
      combinedText = combinedText.replace(match[0], ''); // Remove matched affix from text
    }

    if (itemType === 'shield' && Object.keys(extractedAffixes).length === 4) {
      break; // Exit the entire loop after finding 4 affixes for shields
    }
  }

  return [extractedAffixes, combinedText];
}

export { extractImplicitAffixes };
