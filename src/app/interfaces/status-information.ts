import { UnitInstance } from "../classes/unit-instance"
import { Skill, SkillContext } from "./skill-information"
import { BaseStatTypes } from "./unit-information"

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
    degree?: number,
    duration?: number,
    origin?: UnitInstance
}

//type predicateFunction<t> = {priority: number, function: t} | t;

export interface StatusInformation{
    id: string,
    name: string,
    icon: string,
    stackType: StackType,
    type: StatusType,
    description: (status: Status | undefined) => string,
    onSkillUse?: (status: Status, skillContext: SkillContext, host: UnitInstance) => void,
    onDamageDeal?: (status: Status, skillContext: SkillContext, host: UnitInstance, target: UnitInstance) => void,
    onDamageDone?: (status: Status, skillContext: SkillContext, host: UnitInstance, target: UnitInstance) => void,
    onDamageReceive?: (status: Status, skillContext: SkillContext, host: UnitInstance, target: UnitInstance) => void,
    onTimeIncrement?: (status: Status, host: UnitInstance) => void,
    onNoSkill?: (status: Status, host: UnitInstance) => void,
    onCheckStat?: (status: Status, host: UnitInstance, stat: BaseStatTypes, current: number) => number
}