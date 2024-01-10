// based on https://d4builds.gg/database/gear-affixes/
// as of 30-DEC-2023

enum ItemType {
  amulet = 'Amulet',
  aspect = 'Aspect',
  axe1h = 'Axe',
  axe2h = 'Two-Handed Axe',
  boots = 'Boots',
  bow = 'Bow',
  chestArmor = 'Chest Armor',
  crossbow = 'Crossbow',
  dagger = 'Dagger',
  focus = 'Focus',
  gloves = 'Gloves',
  helm = 'Helm',
  mace1h = 'Mace',
  mace2h = 'Two-Handed Mace',
  pants = 'Pants',
  polearm = 'Polearm',
  ring = 'Ring',
  scythe1h = 'Scythe',
  scythe2h = 'Two-Handed Scythe',
  shield = 'Shield',
  staff = 'Staff',
  sword1h = 'Sword',
  sword2h = 'Two-Handed Sword',
  totem = 'Totem',
  wand = 'Wand',
}

const ItemTypes: string[] = Object.values(ItemType);

enum Rarity {
  magic = 'Magic',
  rare = 'Rare',
  unique = 'Unique',
  legendary = 'Legendary',
  normal = 'Normal',
}

const Rarities: string[] = Object.values(Rarity);

enum Quality {
  sacred = 'Sacred',
  ancestral = 'Ancestral',
  normal = 'Normal',
}

const Qualities: string[] = Object.values(Quality);

enum WeaponCategory {
  offhand = 'Offhand Weapon',
  oneHand = 'One-Handed Weapon',
  twoHand = 'Two-Handed Weapon',
}

const WeaponTypes = [
  ItemType.axe1h,
  ItemType.axe2h,
  ItemType.dagger,
  ItemType.mace1h,
  ItemType.mace2h,
  ItemType.polearm,
  ItemType.scythe1h,
  ItemType.scythe2h,
  ItemType.sword1h,
  ItemType.sword2h,
  ItemType.wand,
  ItemType.staff,
];

const WeaponCategories: string[] = Object.values(WeaponCategory);

const ItemTypeToCategoryMap = {
  [ItemType.amulet]: ItemType.amulet,
  [ItemType.aspect]: ItemType.aspect,
  [ItemType.axe1h]: WeaponCategory.oneHand,
  [ItemType.axe2h]: WeaponCategory.twoHand,
  [ItemType.boots]: ItemType.boots,
  [ItemType.bow]: WeaponCategory.twoHand,
  [ItemType.chestArmor]: ItemType.chestArmor,
  [ItemType.crossbow]: WeaponCategory.twoHand,
  [ItemType.dagger]: WeaponCategory.oneHand,
  [ItemType.focus]: WeaponCategory.offhand,
  [ItemType.gloves]: ItemType.gloves,
  [ItemType.helm]: ItemType.helm,
  [ItemType.mace1h]: WeaponCategory.oneHand,
  [ItemType.mace2h]: WeaponCategory.twoHand,
  [ItemType.pants]: ItemType.pants,
  [ItemType.polearm]: WeaponCategory.twoHand,
  [ItemType.ring]: ItemType.ring,
  [ItemType.scythe1h]: WeaponCategory.oneHand,
  [ItemType.scythe2h]: WeaponCategory.twoHand,
  [ItemType.shield]: ItemType.shield,
  [ItemType.staff]: WeaponCategory.twoHand,
  [ItemType.sword1h]: WeaponCategory.oneHand,
  [ItemType.sword2h]: WeaponCategory.twoHand,
  [ItemType.totem]: WeaponCategory.offhand,
  [ItemType.wand]: WeaponCategory.oneHand,
};

enum PhysicalDamageType {
  bludgeoning = 'Bludgeoning',
  piercing = 'Piercing',
  slashing = 'Slashing',
}

const PhysicalDamageTypes: string[] = Object.values(PhysicalDamageType);

export {
  ItemType,
  ItemTypes,
  ItemTypeToCategoryMap,
  PhysicalDamageType,
  PhysicalDamageTypes,
  Qualities,
  Quality,
  Rarities,
  Rarity,
  WeaponCategories,
  WeaponCategory,
  WeaponTypes,
};
