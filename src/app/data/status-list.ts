import { CharacterInstance } from "../classes/character-instance";
import { UnitInstance } from "../classes/unit-instance";
import { SkillContext } from "../interfaces/skill-information";
import { StackType, Status, StatusInformation, StatusType } from "../interfaces/status-information";

export const STATUSES: { [id: string]: StatusInformation; } = {
    "strength": {
        id: "strength", name: "Strength", icon: 'skill-icons/skill_203.png',
        stackType: StackType.keepBoth, type: StatusType.buff,
        description: (status: Status | undefined) => {
            return "Increases damage dealt per attack by <b class='positive-description'>+" + (status != undefined ? status.degree : "X") + "</b>."
        },
        onDamageDeal: (status: Status, skillContext: SkillContext, origin: UnitInstance, target: UnitInstance) => {
            skillContext.baseDamageAddition += status.degree;
        }
    },
    "fierce": {
        id: "fierce", name: "Fierce", icon: 'skill-icons/skill_250.png',
        stackType: StackType.add, type: StatusType.buff,
        description: (status: Status | undefined) => {
            return "Increases critical hit chance by <b class='positive-description'>+" + (status != undefined ? status.degree : "X") + "%</b>."
        },
        onDamageDeal: (status: Status, skillContext: SkillContext, origin: UnitInstance, target: UnitInstance) => {
            skillContext.criticalRateAddition += status.degree;
        }
    },
    "deft": {
        id: "deft", name: "Deft", icon: 'skill-icons/skill_253.png',
        stackType: StackType.add, type: StatusType.buff,
        description: (status: Status | undefined) => {
            return "Increases direct hit chance by <b class='positive-description'>+" + (status != undefined ? status.degree : "X") + "%</b>."
        },
        onDamageDeal: (status: Status, skillContext: SkillContext, origin: UnitInstance, target: UnitInstance) => {
            skillContext.directRateAddition += status.degree;
        }
    },
    "brutal": {
        id: "brutal", name: "Brutal", icon: 'skill-icons/skill_245.png',
        stackType: StackType.add, type: StatusType.buff,
        description: (status: Status | undefined) => {
            return "Increases critical hit damage by <b class='positive-description'>+" + (status != undefined ? status.degree : "X") + "%</b>."
        },
        onDamageDeal: (status: Status, skillContext: SkillContext, origin: UnitInstance, target: UnitInstance) => {
            skillContext.criticalDamageAddition += status.degree;
        }
    },
    "precise": {
        id: "precise", name: "Precise", icon: 'skill-icons/skill_243.png',
        stackType: StackType.add, type: StatusType.buff,
        description: (status: Status | undefined) => {
            return "Increases direct hit damage by <b class='positive-description'>+" + (status != undefined ? status.degree : "X") + "%</b>."
        },
        onDamageDeal: (status: Status, skillContext: SkillContext, origin: UnitInstance, target: UnitInstance) => {
            skillContext.directDamageAddition += status.degree;
        }
    },
    "weakness": {
        id: "weakness", name: "Weakness", icon: 'skill-icons/skill_223.png',
        stackType: StackType.add, type: StatusType.debuff,
        description: (status: Status | undefined) => {
            return "Decreases damage dealt per attack by <b class='negative-description'>-" + (status != undefined ? status.degree : "X") + "</b>."
        },
        onDamageDeal: (status: Status, skillContext: SkillContext, origin: UnitInstance, target: UnitInstance) => {
            skillContext.baseDamageAddition -= status.degree;
        }
    },
    "resistant": {
        id: "resistant", name: "Resistant", icon: 'skill-icons/skill_202.png',
        stackType: StackType.add, type: StatusType.debuff,
        description: (status: Status | undefined) => {
            return "Decreases damage received per attack by <b class='positive-description'>-" + (status != undefined ? status.degree : "X") + "%</b>."
        },
        onDamageReceive: (status: Status, skillContext: SkillContext, origin: UnitInstance, target: UnitInstance) => {
            skillContext.damageMultiplier -= status.degree * .01;
        }
    },
    "vulnerable": {
        id: "vulnerable", name: "Vulnerable", icon: 'skill-icons/skill_222.png',
        stackType: StackType.add, type: StatusType.debuff,
        description: (status: Status | undefined) => {
            return "Increased damage received per attack by <b class='negative-description'>+" + (status != undefined ? status.degree : "X") + "%</b>."
        },
        onDamageReceive: (status: Status, skillContext: SkillContext, origin: UnitInstance, target: UnitInstance) => {
            skillContext.damageMultiplier += status.degree * .01;
        }
    },
    "bleeding": {
        id: "bleeding", name: "Bleeding", icon: 'skill-icons/skill_49.png',
        stackType: StackType.add, type: StatusType.debuff,
        description: (status: Status | undefined) => {
            return "Each second, take <b class='negative-description'>" + (status != undefined ? status.degree : "X") + "</b> damage."
        },
        onTimeIncrement: (status: Status, host: UnitInstance) => {
            var damage = status.degree;
            damage = host.receiveDamage(damage);
            if(status.origin != undefined && status.origin instanceof CharacterInstance){
                status.origin.registerDamage(damage);
            }
        }
    }
};