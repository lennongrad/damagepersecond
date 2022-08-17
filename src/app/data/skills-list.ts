import { Skill, SkillInfo, SkillContext, SkillTargetType } from '../interfaces/skill-information';
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

export const SKILLS: SkillInfo[] = [
  {
    icon: "skill-icons/skill_01.png", name: "Strike",
    description: "Deal 1 base damage <i class='small'>(50% / 5%)</i> to the closest enemy.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    effect: (skillContext: SkillContext) => basicDamage(skillContext, 1, 50, 5)
  }, {
    icon: "Light-Skills/383.png", name: "Infuse", fpCost: 2,
    description: "Gain <b class='positive-description'>+1 " + statusIcon(STATUSES["strength"]) + " Strength</b> for the next 3 seconds.",
    flavour: undefined, target: SkillTargetType.noTarget,
    relevantStatuses: [STATUSES["strength"]],
    effect: (skillContext: SkillContext) => {
      skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 1, duration: 3 })
    }
  }, {
    icon: "skill-icons/skill_272.png", name: "Bladesong", fpCost: 5,
    description: "Gain <b class='positive-description'>+2 " + statusIcon(STATUSES["strength"])
      + " Strength</b> if you have none and <b class='positive-description'>+5 " + statusIcon(STATUSES["deft"]) + " Deft</b> if you have none.",
    flavour: undefined, target: SkillTargetType.noTarget,
    relevantStatuses: [STATUSES["strength"], STATUSES["deft"]],
    effect: (skillContext: SkillContext) => {
      if (!_.some(skillContext.origin.statuses, { statusInformation: STATUSES["strength"] })) {
        skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 2 })
      }
    }
  }, {
    icon: "skill-icons/skill_261.png", name: "Reckless Attack", fpCost: 1,
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
    icon: "skill-icons/skill_62.png", name: "Slice",
    description: "Deal 1 base damage <i class='small'>(20% / 5%)</i> to the closest enemy " +
      "with a 50% chance to apply <b class='negative-description'>+1 " + statusIcon(STATUSES["bleeding"]) + " Bleeding</b> to the target for 5 seconds.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    effect: (skillContext: SkillContext) => {
      basicDamage(skillContext, 1, 20, 5);
      skillContext.targets.forEach((unitInstance: UnitInstance) => {
        if (Math.random() < .5) {
          unitInstance.addStatus({ statusInformation: STATUSES["bleeding"], degree: 1, duration: 5 })
        }
      })
    }
  }, {
    icon: "skill-icons/skill_24.png", name: "Leg Sweep", fpCost: 1,
    description: "Apply <b class='positive-description'>+10 " + statusIcon(STATUSES["vulnerable"]) + " Vulnerable</b> to the nearest enemy for 3 seconds.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    relevantStatuses: [STATUSES["vulnerable"]],
    effect: (skillContext: SkillContext) => {
      skillContext.targets.forEach((unitInstance: UnitInstance) => {
        unitInstance.addStatus({ statusInformation: STATUSES["vulnerable"], degree: 10, duration: 3 })
      })
    }
  }
];

// always do this last
for (var i = 0; i < SKILLS.length; i++) {
  SKILLS[i].id = i;
}