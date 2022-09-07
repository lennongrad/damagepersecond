export enum BaseStatTypes {
    constitution = "CON",
    poise = "POI",
    endurance = "END",
    strength = "STR",
    dexterity = "DEX",
    intelligence = "INT"
}

export const StatTypeArray: Array<BaseStatTypes> = [
  BaseStatTypes.constitution, 
  BaseStatTypes.poise, 
  BaseStatTypes.endurance, 
  BaseStatTypes.strength, 
  BaseStatTypes.dexterity, 
  BaseStatTypes.intelligence
];

export interface StatArray {
    CON: number,
    POI: number,
    END: number,
    STR: number,
    DEX: number,
    INT: number
}

export interface StatBonuses {
    CON?: number,
    POI?: number,
    END?: number,
    STR?: number,
    DEX?: number,
    INT?: number
}

export const StatNames: { [statID: string]: string } = {
    "CON": "Constitution",
    "POI": "Poise",
    "END": "Endurance",
    "STR": "Strength",
    "DEX": "Dexterity",
    "INT": "Intelligence"
}

export const StatDescriptions: { [statID: string]: string } = {
    "CON": "Determines your maximum HP and thus how much damage you can take.",
    "POI": "Determines your maximum FP and thus how many special skills you can use.",
    "END": "Determines your carrying capacity and thus how many pieces of equipment you can handle.",
    "STR": "Your <b>STR</b> modifier is added each time you damage an enemy with a <i>physical</i> attack skill.",
    "DEX": "Your <b>DEX</b> modifier is added each time you damage an enemy with a <i>finesse</i> attack skill.",
    "INT": "Your <b>INT</b> modifier is added each time you damage an enemy with a <i>magical</i> attack skill.",
}