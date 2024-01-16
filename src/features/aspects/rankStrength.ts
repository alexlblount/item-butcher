import { ItemType, Rarity, WeaponCategory } from '@features/vault/itemTypes';
import type { Item } from '@features/imageParsing/transformText';

export function countDecimalPlaces(value: number): number {
  if (Math.floor(value) === value) return 0;
  const decimalPart = value.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}

export function getStrengthMultiplier(item: Item): number {
  // 2h weapon: 200%
  // amulets:   150%
  // else:      100%
  if (item.category === WeaponCategory.twoHand) return 2;
  if (item.category === ItemType.amulet) return 1.5;
  return 1;
}

export const getAspectStrength = (item: Item) => {
  if (item.rarity === Rarity.unique) return item.aspect?.values;
  const multiplier = getStrengthMultiplier(item);

  // return the actual aspect values based on the item type
  const { aspect } = item;
  if (!aspect) return null;

  const { values } = aspect;
  if (!values) return null;

  return values.map((value) => {
    if (typeof value !== 'number') return value;

    // a bit of a hack, but most of the time we want to round to 1 decimal place.
    // if there happens to be more than 1 decimal place, then we want to round to that.
    // From what i've seen this is at most 2 decimal places, but that could change in the future.
    const decimalPlaces = countDecimalPlaces(value);
    const roundTo = decimalPlaces > 1 ? decimalPlaces : 1;
    return parseFloat((value / multiplier).toFixed(roundTo));
  });
};

export interface AspectRanking {
  [aspect: string]: {
    rankings: { itemId: string; value: number | string }[][];
    maxValues: (number | string)[];
  };
}

export function calculateAspectRankings(items: Item[]): AspectRanking {
  const rankings: AspectRanking = {};

  for (const item of items) {
    const trueStrength = getAspectStrength(item);
    if (trueStrength) {
      const aspectKey = item.aspect!.type; // Assuming `type` is a property of `aspect`
      if (!rankings[aspectKey]) {
        rankings[aspectKey] = { rankings: [], maxValues: [] };
      }
      trueStrength.forEach((value, index) => {
        if (!rankings[aspectKey].rankings[index]) {
          rankings[aspectKey].rankings[index] = [];
        }
        rankings[aspectKey].rankings[index].push({ itemId: item.id, value });
        // Update max value for this slot
        if (typeof value === 'number') {
          if (
            typeof rankings[aspectKey].maxValues[index] === 'string' ||
            rankings[aspectKey].maxValues[index] === undefined ||
            rankings[aspectKey].maxValues[index] < value
          ) {
            rankings[aspectKey].maxValues[index] = value;
          }
        } else if (typeof rankings[aspectKey].maxValues[index] === 'undefined') {
          rankings[aspectKey].maxValues[index] = value;
        }
      });
    }
  }

  // Sort rankings for each slot
  for (const aspect in rankings) {
    rankings[aspect].rankings.forEach((slotRanking) => {
      slotRanking.sort((a, b) => {
        if (typeof a.value === 'number' && typeof b.value === 'number') {
          return b.value - a.value; // Descending order for numbers
        }
        return 0; // Consider non-numeric values as equal
      });
    });
  }

  return rankings;
}
