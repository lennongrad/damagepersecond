import { Skill, SkillInfo, SkillContext, SkillTargetType, SkillType, SkillSubtype } from '../interfaces/skill-information';
import { StackType, Status, StatusInformation, StatusType } from '../interfaces/status-information';
import { STATUSES } from './status-list';
import { CharacterInstance } from '../classes/character-instance';
import { EnemyInstance } from '../classes/enemy-instance';
import * as _ from 'underscore';
import { UnitInstance } from '../classes/unit-instance';

//skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 1, duration: 3 })
function basicDamage(skillContext: SkillContext, baseDamage: number, directRate: number = 0, criticalRate: number = 0) {
  skillContext.targets.forEach(target => {
    skillContext.origin.playAnimation("Attack");
    skillContext.origin.dealDamage(skillContext, target, baseDamage, directRate, criticalRate);
    target.playAnimation("Damage");
  })
}

function statusIcon(statusInformation: StatusInformation): string {
  return "<img src='assets/" + statusInformation.icon + "'/>";
}

function statusDescription(statusInformation: StatusInformation, increase: string, positive: boolean) {
  return "<b class='" + (positive ? "positive" : "negative") + "-description'>" + increase + " "
    + statusIcon(statusInformation) + " <span class='skill-description-status'>" + statusInformation.name + "</span></b>";
}

export const SKILLS: SkillInfo[] = [
  {
    icon: "skill-icons/skill_249.png", name: "Strike", type: SkillType.attack, subtypes: [SkillSubtype.arm],
    description: "Deal 1 base damage <i class='small'>(50% / 5%)</i> to the closest enemy.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    effect: (skillContext: SkillContext) => basicDamage(skillContext, 1, 50, 5)
  }, {
    icon: "Light-Skills/383.png", name: "Infuse", fpCost: 2, type: SkillType.attack,
    description: "Gain " + statusDescription(STATUSES["strength"], "+1", true) + " for the next 3 seconds.",
    flavour: undefined, target: SkillTargetType.noTarget,
    relevantStatuses: [STATUSES["strength"]],
    effect: (skillContext: SkillContext) => {
      skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 1, duration: 3, origin: skillContext.origin })
    }
  }, {
    icon: "skill-icons/skill_272.png", name: "Bladesong", fpCost: 5, type: SkillType.ability, subtypes: [SkillSubtype.song],
    description: "Gain " + statusDescription(STATUSES["strength"], "+2", true) + " if you have none and " +
      statusDescription(STATUSES["deft"], "+10", true) + " if you have none.",
    flavour: undefined, target: SkillTargetType.noTarget,
    relevantStatuses: [STATUSES["strength"], STATUSES["deft"]],
    effect: (skillContext: SkillContext) => {
      if (!_.some(skillContext.origin.statuses, { statusInformation: STATUSES["strength"] })) {
        skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 2, origin: skillContext.origin })
      }
      if (!_.some(skillContext.origin.statuses, { statusInformation: STATUSES["deft"] })) {
        skillContext.origin.addStatus({ statusInformation: STATUSES["deft"], degree: 10, origin: skillContext.origin })
      }
    }
  }, {
    icon: "skill-icons/skill_261.png", name: "Reckless Attack", fpCost: 1, type: SkillType.ability,
    description: "Your next attack has a <b class='positive-description'>+100%</b> chance to be a critical hit.",
    flavour: undefined, target: SkillTargetType.noTarget,
    effect: (skillContext: SkillContext) => {
      skillContext.origin.addStatus({
        statusInformation: {
          id: "reckless", name: "Reckless", icon: "skill-icons/skill_261.png",
          stackType: StackType.replace, type: StatusType.buff,
          description: (Status) => "Your next attack has a <b class='positive-description'>+100%</b> chance to be a critical hit.",
          onDamageDeal: (status: Status, skillContext: SkillContext, host: UnitInstance, target: UnitInstance) => {
            skillContext.criticalRateAddition += 100;
            status.duration = 0;
          }
        }, degree: 1
      })
    }
  }, {
    icon: "skill-icons/skill_62.png", name: "Slice", type: SkillType.attack, subtypes: [SkillSubtype.sword],
    description: "Deal 1 base damage <i class='small'>(20% / 5%)</i> to the closest enemy " +
      "with a 50% chance to apply " + statusDescription(STATUSES["bleeding"], "+1", true) + " to the target for 5 seconds.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    relevantStatuses: [STATUSES["bleeding"]],
    effect: (skillContext: SkillContext) => {
      basicDamage(skillContext, 1, 20, 5);
      skillContext.targets.forEach((unitInstance: UnitInstance) => {
        if (Math.random() < .5) {
          unitInstance.addStatus({ statusInformation: STATUSES["bleeding"], degree: 1, duration: 5, origin: skillContext.origin })
        }
      })
    }
  }, {
    icon: "skill-icons/skill_24.png", name: "Leg Sweep", fpCost: 1, type: SkillType.ability, subtypes: [SkillSubtype.leg],
    description: "Apply " + statusDescription(STATUSES["vulnerable"], "+25", true) + " to the nearest enemy for 3 seconds.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    relevantStatuses: [STATUSES["vulnerable"]],
    effect: (skillContext: SkillContext) => {
      skillContext.targets.forEach((unitInstance: UnitInstance) => {
        unitInstance.addStatus({ statusInformation: STATUSES["vulnerable"], degree: 25, duration: 3, origin: skillContext.origin })
      })
    }
  }, {
    icon: "skill-icons/skill_44.png", name: "Flurry of Blows", fpCost: 2, type: SkillType.ability,
    description: "Gain <b class='positive-description'>+25% direct hit chance</b> and <b class='positive-description'>+25% direct hit damage</b>. "
      + "This effect ends when you do not use an <i>arm</i> or <i>leg</i> skill for a second.",
    flavour: undefined, target: SkillTargetType.noTarget,
    effect: (skillContext: SkillContext) => {
      skillContext.origin.addStatus({
        statusInformation: {
          id: "flurry", name: "Flurry of Blows", icon: "skill-icons/skill_44.png",
          stackType: StackType.replace, type: StatusType.buff,
          description: (Status) => "<b class='positive-description'>+25% direct hit chance</b> and " +
            "<b class='positive-description'>+25% direct hit damage</b>.",
          onSkillUse: (status: Status, skillContext: SkillContext, host: UnitInstance) => {
            var subtypes = skillContext.skill.skillInfo.subtypes;
            if (subtypes == undefined || (!subtypes.includes(SkillSubtype.arm) && !subtypes.includes(SkillSubtype.leg))) {
              if (skillContext.skill.skillInfo.name != "Flurry of Blows") {
                status.duration = 0;
              }
            }
          },
          onDamageDeal: (status: Status, skillContext: SkillContext, host: UnitInstance, target: UnitInstance) => {
            skillContext.directDamageAddition += 25;
            skillContext.directRateAddition += 25;
          },
          onNoSkill: (status: Status, host: UnitInstance) => status.duration = 0,
        }, degree: 1, origin: skillContext.origin
      })
    }
  }, {
    icon: "skill-icons/skill_292.png", name: "Rage", fpCost: 3, type: SkillType.ability,
    description: "Gain " + statusDescription(STATUSES["strength"], "+1", true) + ", " +
      statusDescription(STATUSES["fierce"], "+15", true) + ", and " +
      statusDescription(STATUSES["brutal"], "+50", true) + ".<br>Whenever you don't use an <i>attack</i> skill for a second, " +
      "<b class='negative-description'>deal 5 base damage <i class='small'>(0% / 0%)</i> to yourself</b>.",
    flavour: undefined, target: SkillTargetType.noTarget,
    relevantStatuses: [STATUSES["strength"], STATUSES["fierce"], STATUSES["brutal"]],
    effect: (skillContext: SkillContext) => {
      skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 1, origin: skillContext.origin })
      skillContext.origin.addStatus({ statusInformation: STATUSES["fierce"], degree: 15, origin: skillContext.origin })
      skillContext.origin.addStatus({ statusInformation: STATUSES["brutal"], degree: 50, origin: skillContext.origin })
      skillContext.origin.addStatus({
        statusInformation: {
          id: "raging", name: "Raging", icon: "skill-icons/skill_292.png",
          stackType: StackType.add, type: StatusType.debuff,
          description: (Status) => "Whenever you don't use an <i>attack</i> skill for a second, " +
            "<b class='negative-description'>deal 5 base damage <i class='small'>(0 / 0)</i> to yourself</b>.",
          onSkillUse: (status: Status, skillContext: SkillContext, host: UnitInstance) => {
            if (skillContext.skill.skillInfo.type != SkillType.attack) {
              host.dealDamage(skillContext, host, 5, -100, -100);
            }
          },
          onNoSkill: (status: Status, host: UnitInstance) => host.dealDamage(skillContext, host, 5, -100, -100),
        }, degree: 1, origin: skillContext.origin
      })
    }
  }, {
    icon: "Light-Skills/329.png", name: "Replenshing Strike", fpCost: 1, type: SkillType.attack,
    description: "Deal 1 base damage <i class='small'>(50% / 5%)</i> to the closest enemy." +
      "<br>Add 1 second to the duration of each " + statusDescription(STATUSES["strength"], "", true) + ", " +
      statusDescription(STATUSES["deft"], "", true) + ", and " +
      statusDescription(STATUSES["precise"], "", true) + " status you have.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    relevantStatuses: [STATUSES["strength"], STATUSES["deft"], STATUSES["precise"]],
    effect: (skillContext: SkillContext) => {
      basicDamage(skillContext, 1, 50, 5);
      skillContext.origin.forEachStatus((status: Status) => {
        var affectedStatuses = [STATUSES["strength"], STATUSES["deft"], STATUSES["precise"]];
        if(affectedStatuses.includes(status.statusInformation) && status.duration != undefined){
          status.duration += 1;
        }
      })
    }
  }
];

// always do this last
for (var i = 0; i < SKILLS.length; i++) {
  SKILLS[i].id = i;
}