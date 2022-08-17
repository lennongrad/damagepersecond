import { CharacterInstance } from "../classes/character-instance";
import { EnemyInstance } from "../classes/enemy-instance";
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

export interface SkillContext {
    targets: Array<UnitInstance>,
    origin: CharacterInstance,
    baseDamageAddition: number,
    damageMultiplier: number,
    fpMultiplier: number,
    directRateAddition:  number,
    criticalRateAddition: number,
    directDamageAddition: number,
    criticalDamageAddition: number
}

export interface Skill {
    skillInfo: SkillInfo
}

export interface SkillInfo {
    id?: number,
    icon: string,
    name: string,
    flavour?: string,
    fpCost?: number,
    target: SkillTargetType,
    effect: (skillContext: SkillContext) => void,
    description: string | (() => string),
    relevantStatuses?: Array<StatusInformation>
}