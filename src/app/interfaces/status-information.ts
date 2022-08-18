import { UnitInstance } from "../classes/unit-instance"
import { Skill, SkillContext } from "./skill-information"

export enum StackType{
    keepBoth = "KEEP-BOTH",
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
    degree: number,
    duration?: number,
    origin?: UnitInstance
}

export interface StatusInformation{
    id: string,
    name: string,
    icon: string,
    stackType: StackType,
    type: StatusType,
    description: (status: Status | undefined) => string,
    onSkillUse?: (status: Status, skillContext: SkillContext, host: UnitInstance) => void,
    onDamageDeal?: (status: Status, skillContext: SkillContext, host: UnitInstance, target: UnitInstance) => void,
    onDamageReceive?: (status: Status, skillContext: SkillContext, host: UnitInstance, target: UnitInstance) => void,
    onTimeIncrement?: (status: Status, host: UnitInstance) => void
    onNoSkill?: (status: Status, host: UnitInstance) => void
}