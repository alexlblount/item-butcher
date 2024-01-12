import type { Item } from '@features/imageParsing/transformText';

export const getPowerDisplay = (item: Item) => {
  const { basePower, upgradePower } = item;
  const powerDisplay = upgradePower ? `${basePower}+${upgradePower}` : basePower;
  return `${powerDisplay} Item Power`;
};

export const getTypeName = (item: Item) => {
  const typeName = [item.quality, item.rarity, item.itemType].filter((str) => str !== 'Normal').join(' ');
  return typeName;
};
