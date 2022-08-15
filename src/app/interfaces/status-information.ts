import { UnitInstance } from "../classes/unit-instance"
import { SkillContext } from "./skill-information"

export enum StackType{
    keepHighest = "KEEP-HIGHEST",
    replace = "REPLACE",
    add = "ADD"
}

export enum StatusType{
    buff = "BUFF",
    debuff = "DEBUFF",
    neutral = "NEUTRAL"
}

export interface Status{
    statusInformation: StatusInformation,
    degree: number
}

export interface StatusInformation{
    id: string,
    name: string,
    icon: string,
    description: string,
    stackType: StackType,
    type: StatusType,
    onSkillUse?: (context: SkillContext, host: UnitInstance) => {}
}