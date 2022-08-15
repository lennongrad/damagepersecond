import { Skill, SkillInfo, SkillContext, SkillTargetType } from '../interfaces/skill-information';
import { Status, StatusInformation } from '../interfaces/status-information';
import { STATUSES } from './status-list';
import { CharacterInstance } from '../classes/character-instance';
import { EnemyInstance } from '../classes/enemy-instance';

function genericSkill(strength: number): SkillInfo {
  var iconNumber = strength.toString()
  if (iconNumber.length == 1) {
    iconNumber = "0" + iconNumber;
  } 

  return {
    icon: 'skill-icons/skill_' + iconNumber + '.png', name: 'Ranged' + strength,
    description: () => {
      return "Deal " + Math.pow(10, strength - 1) + " damage to each enemy."
    },
    flavour: 'A swift flurry of blows.',
    target: SkillTargetType.firstEnemy,
    effect: (context: SkillContext) => {
      context.targets.forEach(target => {
        context.origin.playAnimation("Attack");
        context.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 1 })
        context.origin.addStatus({ statusInformation: STATUSES["weakness"], degree: 1 })
        context.origin.addStatus({ statusInformation: STATUSES["smelly"], degree: 1 })
        context.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 1 })
        context.origin.addStatus({ statusInformation: STATUSES["weakness"], degree: 1 })
        context.origin.addStatus({ statusInformation: STATUSES["smelly"], degree: 1 })
        target.dealDamage(Math.pow(10, strength - 1));
        //context.origin.healDamage(10);
        target.playAnimation("Damage");
      })
    },
  };
}

export const SKILLS: SkillInfo[] = [];

for (var i = 0; i < 40; i++) {
  SKILLS.push(genericSkill(i + 1));
}

for (var i = 0; i < SKILLS.length; i++) {
  SKILLS[i].id = i;
}