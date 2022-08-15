import { StackType, StatusInformation, StatusType } from "../interfaces/status-information";

export const STATUSES: { [id: string]: StatusInformation; } = {
    "strength": {
        id: "strength", name: "Strength", icon: 'skill-icons/skill_04.png',
        stackType: StackType.add, type: StatusType.buff,
        description: "Increases damage dealt by attacks."
    },
    "weakness": {
        id: "weakness", name: "Weakness", icon: 'skill-icons/skill_06.png', 
        stackType: StackType.replace, type: StatusType.debuff,
        description: "Decreases damage dealt by attacks."
    },
    "smelly": {
        id: "smelly", name: "Smell", icon: 'skill-icons/skill_08.png', 
        stackType: StackType.keepHighest, type: StatusType.neutral,
        description: "You smell worse."
    },
};