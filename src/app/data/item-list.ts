import { Equipment, EquipmentType, Item, ItemType } from "../interfaces/item-information";

export const EQUIPMENT: { [id: string]: Equipment } = {
    // swords
    "wooden-sword": {
        id: "wooden-sword", name: "Wooden Sword", icon: "items/weapons/2721.png", cost: 250,
        itemType: ItemType.equipment, weight: 3, statBonuses: {STR: 1}, equipmentType: EquipmentType.sword
    },
    "bronze-sword": {
        id: "bronze-sword", name: "Bronze Sword", icon: "items/weapons/2671.png", cost: 1500,
        itemType: ItemType.equipment, weight: 3, statBonuses: {STR: 2}, equipmentType: EquipmentType.sword
    },
    "iron-sword": {
        id: "iron-sword", name: "Iron Sword", icon: "items/weapons/2217.png", cost: 12000,
        itemType: ItemType.equipment, weight: 4, statBonuses: {STR: 4}, equipmentType: EquipmentType.sword
    },
    "iron-rapier": {
        id: "iron-rapier", name: "Iron Rapier", icon: "items/weapons/2217.png", cost: 17500,
        itemType: ItemType.equipment, weight: 3, statBonuses: {STR: 3, DEX: 1}, equipmentType: EquipmentType.sword
    },
    // bows
    "oak-bow": {
        id: "oak-bow", name: "Oak Bow", icon: "items/weapons/2249.png", cost: 250,
        itemType: ItemType.equipment, weight: 3, statBonuses: {DEX: 1}, equipmentType: EquipmentType.bow
    },
    "birch-bow": {
        id: "birch-bow", name: "Birch Bow", icon: "items/weapons/2441.png", cost: 1500,
        itemType: ItemType.equipment, weight: 3, statBonuses: {DEX: 2}, equipmentType: EquipmentType.bow
    },
    "iron-bow": {
        id: "iron-bow", name: "Iron Bow", icon: "items/weapons/2250.png", cost: 12000,
        itemType: ItemType.equipment, weight: 4, statBonuses: {DEX: 4}, equipmentType: EquipmentType.bow
    },
    "iron-longbow": {
        id: "iron-longbow", name: "Iron Longbow", icon: "items/weapons/2252.png", cost: 15500,
        itemType: ItemType.equipment, weight: 5, statBonuses: {POI: 2, DEX: 4}, equipmentType: EquipmentType.bow
    },
    // staves
    "flint-staff": {
        id: "flint-staff", name: "Flint Staff", icon: "items/weapons/3159.png", cost: 250,
        itemType: ItemType.equipment, weight: 3, statBonuses: {INT: 1}, equipmentType: EquipmentType.staff
    },
    "lapis-staff": {
        id: "lapis-staff", name: "Lapis Staff", icon: "items/weapons/2711.png", cost: 1500,
        itemType: ItemType.equipment, weight: 3, statBonuses: {INT: 2}, equipmentType: EquipmentType.staff
    },
    "amethyst-staff": {
        id: "amethyst-staff", name: "Amethyst Staff", icon: "items/weapons/2648.png", cost: 12000,
        itemType: ItemType.equipment, weight: 3, statBonuses: {INT: 4}, equipmentType: EquipmentType.staff
    },
    "amethyst-wand": {
        id: "amethyst-wand", name: "Amethyst Wand", icon: "items/weapons/2642.png", cost: 17500,
        itemType: ItemType.equipment, weight: 2, statBonuses: {INT: 3, DEX: 1}, equipmentType: EquipmentType.staff
    },
    // heavyArmor
    "bronze-plate": {
        id: "bronze-plate", name: "Bronze Plate", icon: "items/armor/3985.png", cost: 1250,
        itemType: ItemType.equipment, weight: 4, statBonuses: {CON: 4, DEX: -1}, equipmentType: EquipmentType.heavyArmor
    },
    "iron-plate": {
        id: "iron-plate", name: "Iron Plate", icon: "items/armor/4434.png", cost: 16500,
        itemType: ItemType.equipment, weight: 5, statBonuses: {CON: 6, DEX: -1}, equipmentType: EquipmentType.heavyArmor
    },
    // lightArmor
    "leather-armor": {
        id: "leather-armor", name: "Leather Armor", icon: "items/armor/4033.png", cost: 450,
        itemType: ItemType.equipment, weight: 2, statBonuses: {CON: 1}, equipmentType: EquipmentType.lightArmor
    },
    "tanned-armor": {
        id: "tanned-armor", name: "Tanned Armor", icon: "items/armor/4034.png", cost: 1400,
        itemType: ItemType.equipment, weight: 2, statBonuses: {CON: 2}, equipmentType: EquipmentType.lightArmor
    },
    "padded-armor": {
        id: "padded-armor", name: "Padded Armor", icon: "items/armor/4037.png", cost: 18000,
        itemType: ItemType.equipment, weight: 3, statBonuses: {CON: 3}, equipmentType: EquipmentType.lightArmor
    },
    // shields
    "wooden-shield": {
        id: "wooden-shield", name: "Wooden Shield", icon: "items/shields-arrows/3452.png", cost: 575,
        itemType: ItemType.equipment, weight: 1, statBonuses: {POI: 1}, equipmentType: EquipmentType.shield
    },
    "padded-shield": {
        id: "padded-shield", name: "Padded Shield", icon: "items/shields-arrows/3453.png", cost: 1625,
        itemType: ItemType.equipment, weight: 1, statBonuses: {POI: 2}, equipmentType: EquipmentType.shield
    },
    "reinforced-shield": {
        id: "reinforced-shield", name: "Reinforced Shield", icon: "items/shields-arrows/3454.png", cost: 19500,
        itemType: ItemType.equipment, weight: 2, statBonuses: {POI: 4}, equipmentType: EquipmentType.shield
    },
    "chestnut-shield": {
        id: "chestnut-shield", name: "Chestnut Shield", icon: "items/shields-arrows/3406.png", cost: 21000,
        itemType: ItemType.equipment, weight: 3, statBonuses: {POI: 4, CON: 1}, equipmentType: EquipmentType.shield
    },
}

export const ITEMS: { [id: string]: Item } = {};
export const STOREITEMS: Array<Item> = [];
Object.keys(EQUIPMENT).forEach((id) => {STOREITEMS.push(EQUIPMENT[id]); ITEMS[id] = EQUIPMENT[id]});