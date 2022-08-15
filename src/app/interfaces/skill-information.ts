import { CharacterInstance } from "../classes/character-instance";
import { EnemyInstance } from "../classes/enemy-instance";
import { UnitInstance } from "../classes/unit-instance";

export enum SkillTargetType{
    noTarget = "NO-TARGET",
    allEnemies = "ALL-ENEMIES",
    firstEnemy = "FIRST-ENEMY",
    randomAliveEnemy = "RANDOM-ENEMY",
    allCharacters = "ALL-CHARACTERS",
    allButSelf = "ALL-BUT-SELF",
    randomAliveCharacter = "RANDOM-CHARACTER",
    firstCharacter = "FIRST-CHARACTER"
}

export interface SkillContext{
    targets: Array<UnitInstance>,
    origin: CharacterInstance,
    damageMultiplier?: number,
    fpMultiplier?: number
}

export interface Skill {
    skillInfo: SkillInfo
}

export interface SkillInfo{
    id?: number;
    icon: string;
    name: string;
    flavour: string;
    target: SkillTargetType,
    effect: (context: SkillContext) => void;
    description: () => string;
}