import { CharacterInstance } from "../classes/character-instance";
import { UnitInstance } from "../classes/unit-instance";
import { StatusInformation } from "./status-information";

export enum SkillTargetType {
    noTarget = "NO-TARGET",
    allEnemies = "ALL-ENEMIES",
    firstEnemy = "FIRST-ENEMY",
    randomAliveEnemy = "RANDOM-ENEMY",
    allCharacters = "ALL-CHARACTERS",
    allButSelf = "ALL-BUT-SELF",
    randomAliveCharacter = "RANDOM-CHARACTER",
    firstCharacter = "FIRST-CHARACTER"
}

export enum SkillType {
    attack = "ATTACK",
    ability = "ABILITY"
}

export enum SkillSubtype {
    physical = "PHYSICAL",
    magical = "MAGICAL",
    finesse = "FINESSE",

    // attacks
    // physical attacks
    arm = "ARM",
    leg = "LEG",
    sword = "SWORD",
    // finesse attacks
    bow = "BOW",

    // abilities
    song = "SONG"
}

export enum DamageType {
    normal = "NORMAL",
    direct = "DIRECT",
    critical = "CRITICAL"
}

export interface SkillContext {
    skill: Skill,
    targets: Array<UnitInstance>,
    origin: CharacterInstance,
    cancelSkill?: boolean,
    baseDamageAddition: number,
    damageMultiplier: number,
    fpMultiplier: number,
    directRateAddition: number,
    criticalRateAddition: number,
    directDamageAddition: number,
    criticalDamageAddition: number,
    damageDealt: number,
    damageType?: DamageType
}

export interface Skill {
    skillInfo: SkillInformation
}

export interface SkillInformation {
    id: string,
    icon: string,
    name: string,
    type: SkillType,
    subtypes?: Array<SkillSubtype>,
    flavour?: string,
    fpCost?: number,
    target: SkillTargetType,
    effect: (skillContext: SkillContext) => void,
    description: string | (() => string),
    relevantStatuses?: Array<StatusInformation>
}

export function getType(skill: SkillInformation): string {
    var baseString = "";

    baseString = skill.type.toLowerCase();
    baseString = baseString.charAt(0).toUpperCase() + baseString.slice(1);

    if (skill.subtypes != undefined) {
        baseString += " – ";
        skill.subtypes.forEach((subtype: SkillSubtype) => {
            var subtypeString = subtype.toLowerCase();
            subtypeString = subtypeString.charAt(0).toUpperCase() + subtypeString.slice(1);
            baseString += subtypeString + " ";
        })
    }

    return baseString;
}