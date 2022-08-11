import { Skill, SkillContext, SkillTargetType } from '../interfaces/skill';
import { CharacterInstance } from '../classes/character-instance';
import { EnemyInstance } from '../classes/enemy-instance';

var rangedTotal = 0
function genericSkill(): Skill {
  rangedTotal += 1
  var iconNumber = rangedTotal.toString()
  if (iconNumber.length == 1) {
    iconNumber = "0" + iconNumber;
  }

  return {
    icon: 'skill-icons/skill_' + iconNumber + '.png', name: 'Ranged' + rangedTotal,
    description: () => {
      return "Deal 3 damage to each enemy."
    },
    flavour: 'A swift flurry of blows.',
    target: SkillTargetType.firstEnemy,
    effect: (context: SkillContext) => {
      context.targets.forEach(target => {
        context.origin.playAnimation("Attack");
        target.dealDamage(1);
        target.playAnimation("Damage");
      })
    },
  };
}

export const SKILLS: Skill[] = [];

for (var i = 0; i < 40; i++) {
  SKILLS.push(genericSkill());
}

for (var i = 0; i < SKILLS.length; i++) {
  SKILLS[i].id = i;
}