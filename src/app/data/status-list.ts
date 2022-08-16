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
        onDamageCheck: (status: Status, skillContext: SkillContext, origin: UnitInstance, target: UnitInstance) => {
            skillContext.baseDamageAddition += status.degree;
        }
    },
    "weakness": {
        id: "weakness", name: "Weakness", icon: 'skill-icons/skill_223.png',
        stackType: StackType.add, type: StatusType.debuff,
        description: (status: Status | undefined) => {
            return "Decreases damage dealt per attack by <b class='negative-description'>-" + (status != undefined ? status.degree : "X") + "</b>."
        },
        onDamageCheck: (status: Status, skillContext: SkillContext, origin: UnitInstance, target: UnitInstance) => {
            skillContext.baseDamageAddition -= status.degree;
        }
    }
};