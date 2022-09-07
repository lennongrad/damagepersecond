import { StatBonuses } from "./stat-information"

export interface Item{
    itemType: ItemType,
    id: string,
    name: string,
    icon: string,
    description?: string,
    flavor?: string, 
    cost: number
}

export enum ItemType{
    equipment = "EQUIPMENT",
    consumable = "CONSUMABLE"
}

export enum EquipmentType{
    sword = "SWORD",
    bow = "BOW",
    staff = "STAFF",
    heavyArmor = "HEAVY-ARMOR",
    lightArmor = "LIGHT-ARMOR",
    shield = "SHIELD"
}

export const EquipmentTypeNames: {[type: string]: string} = {
    "SWORD": "Sword",
    "BOW": "Bow",
    "STAFF": "Staff",
    "HEAVY-ARMOR": "Heavy Armor",
    "LIGHT-ARMOR": "Light Armor",
    "SHIELD": "Shield"
}

export interface Equipment extends Item{
    weight: number,
    statBonuses: StatBonuses,
    equipmentType: EquipmentType
}