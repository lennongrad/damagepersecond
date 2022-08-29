import { UnitInstance } from "./unit-instance";
import { CharacterInformation, CharacterSave } from "../interfaces/unit-information";
import { UnitInstancesService } from "../services/unit-instances.service";
import { Skill, SkillContext, SkillTargetType } from "../interfaces/skill-information";
import * as _ from 'underscore';
import { Status } from "../interfaces/status-information";

export class CharacterInstance extends UnitInstance {
    permanentData!: CharacterSave;

    currentDamageDealt = 0;
    finalDamages = Array<number>();

    recentlyUsedSkills = Array<{ skill: Skill, skillContext: SkillContext }>();

    getMaxHP(): number {
        return this.characterInformation.baseMaxHP;
    }
    getMaxFP(): number {
        return this.characterInformation.baseMaxFP;
    }
    getXP(): number {
        return this.permanentData.experience;
    }
    getDPR(length: number): number {
        var totalDamage = 0;
        if (this.finalDamages.length > 0) {
            totalDamage = _.reduce(this.finalDamages, (memo, num) => memo + num) as number;
            totalDamage /= this.finalDamages.length;
        } else {
            totalDamage = this.currentDamageDealt;
        }
        return totalDamage / length;
    }

    recentSkillsCount(predicate: (skill: Skill, skillContext: SkillContext) => boolean, distance: number): number {
        return _.reduceRight(this.recentlyUsedSkills, (total, usedSkill, index) => {
            return total + ((predicate(usedSkill.skill, usedSkill.skillContext) && index < distance) ? 1 : 0);
        }, 0)
        /*
        var total = 0;
        this.recentlyUsedSkills.forEach((used: {skill: Skill, skillContext: SkillContext}, index: number) => {
            if(predicate(used.skill, used.skillContext) && true){
                total += 1;
            }
        })
        return total;*/
    }

    recentSkillsAll(predicate: (skill: Skill, skillContext: SkillContext) => boolean, distance: number): boolean {
        return this.recentSkillsCount(predicate, distance) == Math.min(distance, this.recentlyUsedSkills.length);
    }

    recentSkillsNone(predicate: (skill: Skill, skillContext: SkillContext) => boolean, distance: number): boolean {
        return this.recentSkillsCount(predicate, distance) == 0;
    }

    addXP(amount: number): void {
        this.permanentData.experience += amount;
        this.saveData();
    }

    saveData(): void {
        this.unitInstancesService.saveData(this);
    }

    loadData(): void {
        var loadedData = this.unitInstancesService.loadData(this);
        if (loadedData != undefined) {
            this.permanentData = loadedData;
        } else {
            this.permanentData = { experience: 0 };
        }
    }

    registerDamage(damage: number): void {
        this.currentDamageDealt += damage;
    }

    useSkill(skill: Skill) {
        var targets = Array<UnitInstance>();
        switch (skill.skillInfo.target) {
            case SkillTargetType.allButSelf:
                targets = _.without(this.unitInstancesService.characterInstances, this); break;
            case SkillTargetType.allCharacters:
                targets = this.unitInstancesService.characterInstances; break;
            case SkillTargetType.allEnemies:
                targets = this.unitInstancesService.enemyInstances; break;
            case SkillTargetType.firstEnemy:
                var firstEnemy = _.find(this.unitInstancesService.enemyInstances, (enemy) => enemy.isAlive());
                targets = firstEnemy != undefined ? [firstEnemy] : [];
                break;
            case SkillTargetType.firstCharacter:
                var firstCharacter = _.find(this.unitInstancesService.characterInstances, (character) => character.isAlive());
                targets = firstCharacter != undefined ? [firstCharacter] : [];
                break;
            case SkillTargetType.noTarget:
                targets = []; break;
            case SkillTargetType.randomAliveCharacter:
                var aliveCharacters = _.reject(this.unitInstancesService.characterInstances, (character) => character.isAlive());
                targets = _.sample(aliveCharacters, 1); break;
            case SkillTargetType.randomAliveEnemy:
                var aliveEnemies = _.reject(this.unitInstancesService.enemyInstances, (enemy) => enemy.isAlive());
                targets = _.sample(aliveEnemies, 1); break;
        }

        var skillContext: SkillContext = {
            skill: skill,
            targets: targets,
            origin: this,
            baseDamageAddition: 0,
            damageMultiplier: 1,
            fpMultiplier: 1,
            directRateAddition: 0,
            criticalRateAddition: 0,
            directDamageAddition: 0,
            criticalDamageAddition: 0,
            damageDealt: 0
        }

        this.forEachStatus((status) => {
            if (status.statusInformation.onSkillUse != undefined) {
                status.statusInformation.onSkillUse(status, skillContext, this);
            }
        })

        if (this.canAfford(skillContext) && !skillContext.cancelSkill) {
            this.spendFP(skillContext);

            skill.skillInfo.effect(skillContext);

            this.recentlyUsedSkills.unshift({ skill: skill, skillContext: skillContext });
        }
    }

    override dealDamage(skillContext: SkillContext, target: UnitInstance, baseDamage: number,
        directRate: number = 0, criticalRate: number = 0): number {
        var damageDealt = super.dealDamage(skillContext, target, baseDamage, directRate, criticalRate);

        this.registerDamage(damageDealt);

        return damageDealt;
    }

    override reset(): void {
        super.reset();
        this.finalDamages.push(this.currentDamageDealt);
        this.currentDamageDealt = 0;
        this.recentlyUsedSkills = [];
    }

    override completeReset(): void {
        super.completeReset();
        this.finalDamages = [];
    }

    constructor(name: string,
        public characterInformation: CharacterInformation,
        unitInstancesService: UnitInstancesService) {
        super(name, characterInformation, unitInstancesService);

        this.loadData();
    }
}