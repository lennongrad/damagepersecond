import { UnitInstance } from "./unit-instance";
import { CharacterFeature, CharacterInformation, CharacterSave, TraitInformation } from "../interfaces/unit-information";
import { UnitInstancesService } from "../services/unit-instances.service";
import { Skill, SkillContext, SkillInformation, SkillSubtype, SkillTargetType } from "../interfaces/skill-information";
import * as _ from 'underscore';
import { BaseStatTypes } from "../interfaces/stat-information";
import { Equipment } from "../interfaces/item-information";
import { InventoryService } from "../services/inventory.service";

export class CharacterInstance extends UnitInstance {
    permanentData!: CharacterSave;
    
    inventoryService: InventoryService;

    featureList: Array<CharacterFeature> = [];

    availableSkills = Array<SkillInformation>();
    activeTraits = Array<TraitInformation>();

    currentDamageDealt?: number;
    finalDamages = Array<number>();

    currentXPGained?: number;
    finalXP = Array<number>();

    recentlyUsedSkills = Array<{ skill: Skill, skillContext: SkillContext }>();

    getMaxHP(): number {
        return this.getStat(BaseStatTypes.constitution) * 2;
    }
    getMaxFP(): number {
        return this.getStat(BaseStatTypes.poise) * 2;
    }
    getCarryingCapacity(): number {
        return this.getStat(BaseStatTypes.endurance);
    }

    getEquippedItems(): Array<Equipment> {
        return this.permanentData.equippedItems;
    }
    isEquipped(equipment: Equipment): boolean {
        return this.permanentData.equippedItems.includes(equipment);
    }
    canEquip(equipment: Equipment): boolean {
        return (!this.isEquipped(equipment)
            && ((equipment.weight + this.getEncumberance()) <= this.getCarryingCapacity())
            && (this.inventoryService.getUnequippedEquipment(equipment) >= 1)
            && _.countBy(this.getEquippedItems(), (e) => e.equipmentType)[equipment.equipmentType] == undefined);
    }
    equipEquipment(equipment: Equipment): void {
        if (this.canEquip(equipment)) {
            this.permanentData.equippedItems.push(equipment);
            this.unitInstancesService.saveCharacterData(this, true);
        }
    }
    unequipEquipment(equipment: Equipment): void {
        if (this.isEquipped(equipment)) {
            this.permanentData.equippedItems = _.without(this.permanentData.equippedItems, equipment);
            this.unitInstancesService.saveCharacterData(this, true);
        }
    }
    getEncumberance(): number {
        return _.reduce(this.permanentData.equippedItems, (val: number, equipment: Equipment) => equipment.weight + val, 0);
    }

    getStat(stat: BaseStatTypes, includeEquipment: boolean = true, includeStatuses: boolean = true): number {
        var base = this.characterInformation.baseStats[stat];
        base += this.permanentData.statBonuses[stat];

        if (includeEquipment) {
            this.permanentData.equippedItems.forEach((equipment) => {
                var bonus = equipment.statBonuses[stat];
                base += bonus != undefined ? bonus : 0;
            })
        }

        if (includeStatuses) {
            this.forEachStatus((status) => {
                if (status.statusInformation.onCheckStat != undefined) {

                    base = status.statusInformation.onCheckStat(status, this, stat, base);
                }
            })
        }

        return base;
    }

    getStatModifier(stat: BaseStatTypes, includeEquipment: boolean = true, includeStatuses: boolean = true): number {
        var baseStat = this.getStat(stat, includeEquipment, includeStatuses);
        return (baseStat - 5) / 5;
    }

    getXP(): number {
        return this.permanentData.experience;
    }
    getDPR(length: number): number {
        var totalDamage = 0;
        if (this.finalDamages.length > 0) {
            totalDamage = _.reduce(this.finalDamages, (memo, num) => memo + num) as number;
            totalDamage /= this.finalDamages.length;
        } else if(this.currentDamageDealt != undefined) {
            totalDamage = this.currentDamageDealt;
        }
        return totalDamage / length;
    }
    getXPS(length: number): number {
        var totalXP = 0;
        if (this.finalXP.length > 0) {
            totalXP = _.reduce(this.finalXP, (memo, num) => memo + num) as number;
            totalXP /= this.finalXP.length;
        } else if(this.currentXPGained != undefined) {
            totalXP = this.currentXPGained;
        }
        return totalXP / length;
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
        return 40 * Math.pow(1.6, (this.permanentData.statBonuses[stat] + 1));
    }

    canAffordStat(stat: BaseStatTypes): boolean {
        return this.getXP() >= this.getStatCost(stat);
    }

    buyStat(stat: BaseStatTypes): void {
        if (this.canAffordStat(stat)) {
            this.permanentData.experience -= this.getStatCost(stat);
            this.permanentData.statBonuses[stat] += 1;
            this.unitInstancesService.saveCharacterData(this, true);
        }
    }

    getFeatureList(): Array<CharacterFeature> {
        return this.featureList;//this.characterInformation.characterFeatures.concat(this.genericFeatures);
    }

    getFeatureCost(feature: CharacterFeature): number {
        var index = _.indexOf(this.getFeatureList(), feature);
        var baseCost = 30 * Math.pow(2, (index + 1));
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
            this.unitInstancesService.saveCharacterData(this, true);
        }
    }

    addXP(amount: number): void {
        this.permanentData.experience += amount;

        if(this.currentXPGained == undefined){
            this.currentXPGained = 0;
        }
        this.currentXPGained += amount;

        this.unitInstancesService.saveCharacterData(this);
    }

    loadData(): void {
        var loadedData = this.unitInstancesService.loadCharacterData(this);
        if (loadedData != undefined) {
            this.permanentData = loadedData;
        } else {
            this.permanentData = {
                experience: 0, learntFeatures: new Set<string>(), statBonuses: {
                    CON: 0, POI: 0, END: 0, STR: 0, DEX: 0, INT: 0
                }, equippedItems: []
            };
        }
        this.updateFeatureBonuses();
    }

    registerDamage(damage: number): void {
        if(this.currentDamageDealt == undefined){
            this.currentDamageDealt = 0;
        }
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
        if (skillContext.skill.skillInfo.subtypes?.includes(SkillSubtype.physical)) {
            modifiedBaseDamage += this.getStatModifier(BaseStatTypes.strength);
        } else if (skillContext.skill.skillInfo.subtypes?.includes(SkillSubtype.finesse)) {
            modifiedBaseDamage += this.getStatModifier(BaseStatTypes.dexterity);
        } else if (skillContext.skill.skillInfo.subtypes?.includes(SkillSubtype.magical)) {
            modifiedBaseDamage += this.getStatModifier(BaseStatTypes.intelligence);
        }

        var damageDealt = super.dealDamage(skillContext, target, modifiedBaseDamage, directRate, criticalRate);

        this.registerDamage(damageDealt);

        return damageDealt;
    }

    override reset(): void {
        super.reset();

        if(this.currentDamageDealt != undefined){
            this.finalDamages.push(this.currentDamageDealt);
        }
        if(this.currentXPGained != undefined){
            this.finalXP.push(this.currentXPGained);
        }

        this.currentDamageDealt = 0;
        this.currentXPGained = 0;
        this.recentlyUsedSkills = [];
    }

    override completeReset(): void {
        super.completeReset();
        this.finalDamages = [];
        this.finalXP = [];
    }

    constructor(name: string,
        public characterInformation: CharacterInformation,
        unitInstancesService: UnitInstancesService,
        inventoryService: InventoryService,
        genericFeatures: Array<CharacterFeature>) {
        super(name, characterInformation, unitInstancesService);
        this.inventoryService = inventoryService;

        var smallerLength = Math.min(genericFeatures.length, characterInformation.characterFeatures.length);
        for (var i = 0; i < smallerLength; i++) {
            this.featureList.push(characterInformation.characterFeatures[i]);
            this.featureList.push(genericFeatures[i]);
        }
        characterInformation.characterFeatures.forEach((feature, index) => {
            if (index >= smallerLength) {
                this.featureList.push(feature);
            }
        })
        genericFeatures.forEach((feature, index) => {
            if (index >= smallerLength) {
                this.featureList.push(feature);
            }
        })

        this.featureList = _.sortBy(this.featureList, (feature) => this.getFeatureCost(feature));

        this.loadData();
    }
}