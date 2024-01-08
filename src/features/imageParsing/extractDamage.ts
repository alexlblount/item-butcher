import { WeaponCategories } from '@src/itemData/itemTypes';

function isWeapon(itemType: string): boolean {
  return WeaponCategories.includes(itemType);
}

export interface DamageDetails {
  dps: number;
  min: number;
  max: number;
  speed: number;
}

function extractWeaponDamageDetailsAndCleanText(
  remainingText: string[],
): [DamageDetails | null, string[]] {
  const dpsRegex = /(\d{1,3}(,\d{3})*(\.\d+)?) Damage Per Second/i;
  const damagePerHitRegex =
    /\[\s*(\d{1,3}(,\d{3})*(\.\d+)?)\s*-\s*(\d{1,3}(,\d{3})*(\.\d+)?)\s*\]\s*Damage per Hit/i;
  const speedRegex = /(\d+\.\d+) Attacks per Second/i;

  const newText: string[] = [];
  let damageDetailsFound = false;

  remainingText.forEach((line) => {
    if (
      line.match(dpsRegex) ||
      line.match(damagePerHitRegex) ||
      line.match(speedRegex)
    ) {
      damageDetailsFound = true;
    } else {
      newText.push(line);
    }
  });

  if (!damageDetailsFound) {
    return [null, newText];
  }

  const combinedText = remainingText.join(' ');
  const damageDetails: DamageDetails = {
    dps: parseInt(combinedText.match(dpsRegex)?.[1].replace(/,/g, '') || '0'),
    min: parseInt(
      combinedText.match(damagePerHitRegex)?.[1].replace(/,/g, '') || '0',
    ),
    max: parseInt(
      combinedText.match(damagePerHitRegex)?.[4].replace(/,/g, '') || '0',
    ),
    speed: parseFloat(combinedText.match(speedRegex)?.[1] || '0'),
  };

  return [damageDetails, newText];
}

function extractArmorValueAndCleanText(
  remainingText: string[],
): [number | null, string[]] {
  const armorRegex = /(\d{1,3}(,\d{3})*(\.\d+)?) armor/i;
  let armorValue: number | null = null;
  const newText: string[] = [];

  remainingText.forEach((line) => {
    const armorMatch = line.match(armorRegex);
    if (armorMatch) {
      armorValue = parseInt(armorMatch[1].replace(/,/g, ''));
    } else {
      newText.push(line);
    }
  });

  return [armorValue, newText];
}

export {
  extractArmorValueAndCleanText,
  extractWeaponDamageDetailsAndCleanText,
  isWeapon,
};
