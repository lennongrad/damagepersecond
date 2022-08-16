import { Skill, SkillInfo, SkillContext, SkillTargetType } from '../interfaces/skill-information';
import { Status, StatusInformation } from '../interfaces/status-information';
import { STATUSES } from './status-list';
import { CharacterInstance } from '../classes/character-instance';
import { EnemyInstance } from '../classes/enemy-instance';
import * as _ from 'underscore';

//skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 1, duration: 3 })
function basicDamage(skillContext: SkillContext, baseDamage: number) {
  skillContext.targets.forEach(target => {
    skillContext.origin.playAnimation("Attack");
    skillContext.origin.dealDamage(skillContext, target, baseDamage);
    target.playAnimation("Damage");
  })
}

function statusIcon(statusInformation: StatusInformation): string {
  return "<img src='assets/" + statusInformation.icon + "'/>";
}

export const SKILLS: SkillInfo[] = [
  {
    icon: "skill-icons/skill_01.png", name: "Strike", 
    description: "Deal 1 base damage to the closest enemy.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    effect: (skillContext: SkillContext) => basicDamage(skillContext, 1)
  }, {
    icon: "Light-Skills/383.png", name: "Infuse", fpCost: 2,
    description: "Gain <b>+1 " + statusIcon(STATUSES["strength"]) + " Strength</b> for the next 3 seconds.",
    flavour: undefined, target: SkillTargetType.noTarget,
    relevantStatuses: [STATUSES["strength"]],
    effect: (skillContext: SkillContext) => {
      skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 1, duration: 3 })
    }
  }, {
    icon: "skill-icons/skill_272.png", name: "Bladesong",
    description: "Gain <b>+2 " + statusIcon(STATUSES["strength"]) + " Strength</b> if you have none.",
    flavour: undefined, target: SkillTargetType.noTarget,
    relevantStatuses: [STATUSES["strength"]],
    effect: (skillContext: SkillContext) => {
      if (!_.some(skillContext.origin.statuses, { statusInformation: STATUSES["strength"] })) {
        skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 2 })
      }
    }
  }
];

// always do this last
for (var i = 0; i < SKILLS.length; i++) {
  SKILLS[i].id = i;
}