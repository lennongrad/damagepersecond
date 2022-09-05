import { UnitInstance } from "./unit-instance";
import { BaseStatTypes, CharacterFeature, CharacterInformation, CharacterSave, TraitInformation } from "../interfaces/unit-information";
import { UnitInstancesService } from "../services/unit-instances.service";
import { Skill, SkillContext, SkillInformation, SkillSubtype, SkillTargetType } from "../interfaces/skill-information";
import * as _ from 'underscore';

export class CharacterInstance extends UnitInstance {
    permanentData!: CharacterSave;

    featureList: Array<CharacterFeature> = [];

    availableSkills = Array<SkillInformation>();
    activeTraits = Array<TraitInformation>();

    currentDamageDealt = 0;
    finalDamages = Array<number>();

    recentlyUsedSkills = Array<{ skill: Skill, skillContext: SkillContext }>();

    getMaxHP(): number {
        return this.getStat(BaseStatTypes.constitution);
    }
    getMaxFP(): number {
        return this.getStat(BaseStatTypes.poise);
    }
    getCarryingCapacity(): number {
        return this.getStat(BaseStatTypes.endurance);
    }

    getStat(stat: BaseStatTypes, includeStatuses: boolean = true): number {
        var base = this.characterInformation.baseStats[stat];
        base += this.permanentData.statBonuses[stat];

        if (includeStatuses) {
            this.forEachStatus((status) => {
                if (status.statusInformation.onCheckStat != undefined) {

                    base = status.statusInformation.onCheckStat(status, this, stat, base);
                }
            })
        }

        return base;
    }

    getStatModifier(stat: BaseStatTypes, includeStatuses: boolean = true): number{
        var baseStat = this.getStat(stat, includeStatuses);
        return baseStat / 4;
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

    updateFeatureBonuses() {
        this.availableSkills = [...this.characterInformation.defaultSkills];
        this.activeTraits = [];

        this.getFeatureList().forEach((feature: CharacterFeature) => {
            if (feature.skillUnlocked != undefined && this.permanentData.learntFeatures.has(feature.skillUnlocked.id)) {
                this.availableSkills.push(feature.skillUnlocked);
            }
            if (feature.traitUnlocked != undefined && this.permanentData.learntFeatures.has(feature.traitUnlocked.id)) {
                this.activeTraits.push(feature.traitUnlocked);
            }
        })
    }

    getStatCost(stat: BaseStatTypes): number {
        return 40 * Math.pow(1.5, (this.permanentData.statBonuses[stat] + 1));
    }

    canAffordStat(stat: BaseStatTypes): boolean {
        return this.getXP() >= this.getStatCost(stat);
    }

    buyStat(stat: BaseStatTypes): void {
        if (this.canAffordStat(stat)) {
            this.permanentData.experience -= this.getStatCost(stat);
            this.permanentData.statBonuses[stat] += 1;
            this.unitInstancesService.saveData(this, true);
        }
    }

    getFeatureList(): Array<CharacterFeature> {
        return this.featureList;//this.characterInformation.characterFeatures.concat(this.genericFeatures);
    }

    getFeatureCost(feature: CharacterFeature): number {
        var index = _.indexOf(this.getFeatureList(), feature);
        var baseCost = 40 * Math.pow(1.5, (index + 1));
        return Math.floor(baseCost / 10) * 10// + feature.expCost;
    }

    canAffordFeature(feature: CharacterFeature): boolean {
        return this.permanentData.experience >= this.getFeatureCost(feature);
    }

    hasLearntFeature(feature: CharacterFeature): boolean {
        return this.permanentData.learntFeatures.has(this.getFeatureID(feature));
    }

    recentSkillsCount(predicate: (skill: Skill, skillContext: SkillContext) => boolean, distance: number): number {
        return _.reduceRight(this.recentlyUsedSkills, (total, usedSkill, index) => {
            return total + ((predicate(usedSkill.skill, usedSkill.skillContext) && index < distance) ? 1 : 0);
        }, 0)
    }

    recentSkillsAll(predicate: (skill: Skill, skillContext: SkillContext) => boolean, distance: number): boolean {
        return this.recentSkillsCount(predicate, distance) == Math.min(distance, this.recentlyUsedSkills.length);
    }

    recentSkillsNone(predicate: (skill: Skill, skillContext: SkillContext) => boolean, distance: number): boolean {
        return this.recentSkillsCount(predicate, distance) == 0;
    }

    getFeatureID(feature: CharacterFeature): string {
        if (feature.skillUnlocked != undefined) {
            return feature.skillUnlocked.id;
        }
        if (feature.traitUnlocked != undefined) {
            return feature.traitUnlocked.id;
        }
        return "";
    }

    buyFeature(feature: CharacterFeature): void {
        if (this.getFeatureList().includes(feature)
            && !this.hasLearntFeature(feature)
            && this.canAffordFeature(feature)) {
            this.permanentData.learntFeatures.add(this.getFeatureID(feature));
            this.addXP(-feature.expCost);
            this.updateFeatureBonuses();
            this.unitInstancesService.saveData(this, true);
        }
    }

    addXP(amount: number): void {
        this.permanentData.experience += amount;
        this.unitInstancesService.saveData(this);
    }

    loadData(): void {
        var loadedData = this.unitInstancesService.loadData(this);
        if (loadedData != undefined) {
            this.permanentData = loadedData;
        } else {
            this.permanentData = {
                experience: 0, learntFeatures: new Set<string>(), statBonuses: {
                    CON: 0, POI: 0, END: 0, STR: 0, DEX: 0, INT: 0
                }
            };
        }
        this.updateFeatureBonuses();
    }

    registerDamage(damage: number): void {
        this.currentDamageDealt += damage;
    }

    useSkill(skill: Skill) {
        if (!this.availableSkills.includes(skill.skillInfo)) {
            return;
        }

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
        var modifiedBaseDamage = baseDamage;
        if(skillContext.skill.skillInfo.subtypes?.includes(SkillSubtype.physical)){
            modifiedBaseDamage += this.getStatModifier(BaseStatTypes.strength);
        }else if(skillContext.skill.skillInfo.subtypes?.includes(SkillSubtype.finesse)){
            modifiedBaseDamage += this.getStatModifier(BaseStatTypes.dexterity);
        }else if(skillContext.skill.skillInfo.subtypes?.includes(SkillSubtype.magical)){
            modifiedBaseDamage += this.getStatModifier(BaseStatTypes.intelligence);
        }

        var damageDealt = super.dealDamage(skillContext, target, modifiedBaseDamage, directRate, criticalRate);

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
        unitInstancesService: UnitInstancesService,
        genericFeatures: Array<CharacterFeature>) {
        super(name, characterInformation, unitInstancesService);

        var smallerLength = Math.min(genericFeatures.length, characterInformation.characterFeatures.length);
        for(var i = 0; i < smallerLength; i++){
            this.featureList.push(characterInformation.characterFeatures[i]);
            this.featureList.push(genericFeatures[i]);
        }
        characterInformation.characterFeatures.forEach((feature, index) => {
            if(index >= smallerLength){
                this.featureList.push(feature);
            }
        })
        genericFeatures.forEach((feature, index) => {
            if(index >= smallerLength){
                this.featureList.push(feature);
            }
        })

        this.loadData();
    }
}