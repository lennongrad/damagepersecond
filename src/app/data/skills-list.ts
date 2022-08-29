import { Skill, SkillInfo, SkillContext, SkillTargetType, SkillType, SkillSubtype, DamageType } from '../interfaces/skill-information';
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

function statusDescription(statusInformation: StatusInformation, increase: string, positive: boolean, duration: number = 0) {
  return "<span class='" + (positive ? "positive" : "negative") + "-description'><b>" + increase + (increase != "" ? " " : "")
    + statusIcon(statusInformation) + "<span class='skill-description-status'> " + statusInformation.name + "</span></b>"
     + (duration != 0 ? (" for " + duration + (duration > 1 ? " seconds" : " second")) : "") + "</span>";
}

export const SKILLS: SkillInfo[] = [
  {
    icon: "skill-icons/skill_249.png", name: "Strike", type: SkillType.attack, subtypes: [SkillSubtype.arm],
    description: "Deal 1 base damage <i class='small'>(50% / 5%)</i> to the closest enemy.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    effect: (skillContext: SkillContext) => basicDamage(skillContext, 1, 50, 5)
  }, {
    icon: "Light-Skills/383.png", name: "Infuse", fpCost: 2, type: SkillType.ability,
    description: "Gain " + statusDescription(STATUSES["strength"], "+2", true, 3) + ".",
    flavour: undefined, target: SkillTargetType.noTarget,
    relevantStatuses: [STATUSES["strength"]],
    effect: (skillContext: SkillContext) => {
      skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 2, duration: 3, origin: skillContext.origin });
    }
  }, {
    icon: "skill-icons/skill_272.png", name: "Bladesong", fpCost: 5, type: SkillType.ability, subtypes: [SkillSubtype.song],
    description: "Gain " + statusDescription(STATUSES["strength"], "+2", true) + " if you have none and " +
      statusDescription(STATUSES["precise"], "+10", true) + " if you have none.",
    flavour: undefined, target: SkillTargetType.noTarget,
    relevantStatuses: [STATUSES["strength"], STATUSES["deft"]],
    effect: (skillContext: SkillContext) => {
      if (!_.some(skillContext.origin.statuses, { statusInformation: STATUSES["strength"] })) {
        skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 2, origin: skillContext.origin })
      }
      if (!_.some(skillContext.origin.statuses, { statusInformation: STATUSES["deft"] })) {
        skillContext.origin.addStatus({ statusInformation: STATUSES["precise"], degree: 10, origin: skillContext.origin })
      }
    }
  }, {
    icon: "skill-icons/skill_261.png", name: "Reckless Attack", fpCost: 1, type: SkillType.ability,
    description: "The next time you deal damage, gain a <b class='positive-description'>+100%</b> chance to deal a critical hit.",
    flavour: undefined, target: SkillTargetType.noTarget,
    effect: (skillContext: SkillContext) => {
      skillContext.origin.addStatus({
        statusInformation: {
          id: "reckless", name: "Reckless", icon: "skill-icons/skill_261.png",
          stackType: StackType.replace, type: StatusType.buff,
          description: (Status) => "The next time you deal damage, gain a <b class='positive-description'>+100%</b> chance to deal a critical hit.",
          onDamageDeal: (status: Status, skillContext: SkillContext, host: UnitInstance, target: UnitInstance) => {
            console.log("H")
            skillContext.criticalRateAddition += 100;
            status.duration = 0;
          }
        }
      })
    }
  }, {
    icon: "skill-icons/skill_62.png", name: "Slice", type: SkillType.attack, subtypes: [SkillSubtype.sword],
    description: "Deal 1 base damage <i class='small'>(30% / 5%)</i> to the closest enemy. " +
      "On a direct or critical hit, target gains " + statusDescription(STATUSES["bleeding"], "+2", true, 5) + ".",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    relevantStatuses: [STATUSES["bleeding"]],
    effect: (skillContext: SkillContext) => {
      skillContext.targets.forEach(target => {
        skillContext.origin.playAnimation("Attack");
        skillContext.origin.dealDamage(skillContext, target, 1, 30, 5);

        if (skillContext.damageType == DamageType.critical || skillContext.damageType == DamageType.direct) {
          target.addStatus({ statusInformation: STATUSES["bleeding"], degree: 2, duration: 5 })
        }

        target.playAnimation("Damage");
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
            "<b class='positive-description'>+25% direct hit damage</b> as long as " + 
            "you keep using <i>arm</i> and <i>leg</i> skills.",
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
        }, origin: skillContext.origin
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
              host.dealDamage(skillContext, host, 5, -Infinity, -Infinity);
            }
          },
          onNoSkill: (status: Status, host: UnitInstance) => host.dealDamage(skillContext, host, 5, -100, -100),
        }, origin: skillContext.origin
      })
    }
  }, {
    icon: "Light-Skills/329.png", name: "Replenshing Strike", fpCost: 1, type: SkillType.attack, subtypes: [SkillSubtype.arm],
    description: "Deal 4 base damage <i class='small'>(50% / 5%)</i> to the closest enemy." +
      "<br>Add 1 second to the duration of each " + statusDescription(STATUSES["strength"], "", true) + ", " +
      statusDescription(STATUSES["deft"], "", true) + ", and " +
      statusDescription(STATUSES["precise"], "", true) + " status you have.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    relevantStatuses: [STATUSES["strength"], STATUSES["deft"], STATUSES["precise"]],
    effect: (skillContext: SkillContext) => {
      basicDamage(skillContext, 4, 50, 5);
      skillContext.origin.forEachStatus((status: Status) => {
        var affectedStatuses = [STATUSES["strength"], STATUSES["deft"], STATUSES["precise"]];
        if (affectedStatuses.includes(status.statusInformation) && status.duration != undefined) {
          status.duration += 1;
        }
      })
    }
  }, {
    icon: "Light-Skills/690.png", name: "Rounding Kick", type: SkillType.attack, subtypes: [SkillSubtype.leg],
    description: "Deal 1 base damage <i class='small'>(25% / 5%)</i> to the closest enemy." +
      " If your last two skills were <i>arm</i> skills, the base damage is tripled.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    effect: (skillContext: SkillContext) => {
      var baseDamage = 1;
      if (skillContext.origin.recentSkillsAll((skill, context) => {
        return skill.skillInfo.subtypes != undefined && skill.skillInfo.subtypes.includes(SkillSubtype.arm)
      }, 2)) {
        baseDamage *= 3;
      }
      basicDamage(skillContext, baseDamage, 25, 5);
    }
  }, {
    icon: "Light-Skills/597.png", name: "Lightning Kicks", type: SkillType.attack, subtypes: [SkillSubtype.leg], fpCost: 3,
    description: "Deal 1 base damage <i class='small'>(40% / 5%)</i> to the closest enemy three times. ",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    effect: (skillContext: SkillContext) => {
      basicDamage(skillContext, 1, 20, 5);
      basicDamage(skillContext, 1, 20, 5);
      basicDamage(skillContext, 1, 20, 5);
    }
  }, {
    icon: "Light-Skills/491.png", name: "Heavy Swing", type: SkillType.attack, subtypes: [SkillSubtype.sword], fpCost: 2,
    description: "Deal 2 base damage <i class='small'>(30% / 5%)</i> to the closest enemy. " +
      "This damage is affected by " + statusDescription(STATUSES["strength"], "", true) + " an additional time.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    effect: (skillContext: SkillContext) => {
      skillContext.origin.forEachStatus((status: Status) => {
        if (status.statusInformation == STATUSES["strength"]) {
          skillContext.baseDamageAddition += status.degree ? status.degree : 0;
        }
      })
      basicDamage(skillContext, 2, 30, 5);
    }
  }, {
    icon: "skill-icons/skill_289.png", name: "Concentrate", type: SkillType.ability, fpCost: 1,
    description: "Gain " + statusDescription(STATUSES["strength"], "+2", true) + " and " +
      statusDescription(STATUSES["deft"], "+20", true) + ".<br>" + statusDescription(STATUSES["delayed"], "", false, 2) + ".",
    flavour: undefined, target: SkillTargetType.noTarget,
    relevantStatuses: [STATUSES["strength"], STATUSES["deft"], STATUSES["delayed"]],
    effect: (skillContext: SkillContext) => {
      skillContext.origin.addStatus({ statusInformation: STATUSES["strength"], degree: 2, origin: skillContext.origin });
      skillContext.origin.addStatus({ statusInformation: STATUSES["deft"], degree: 20, origin: skillContext.origin });
      skillContext.origin.addStatus({ statusInformation: STATUSES["delayed"], duration: 2, origin: skillContext.origin })
    }
  }, {
    icon: "skill-icons/skill_64.png", name: "Cleave", type: SkillType.attack, subtypes: [SkillSubtype.sword], fpCost: 1,
    description: "Deal 1.25 base damage <i class='small'>(25% / 5%)</i> to each enemy.",
    flavour: undefined, target: SkillTargetType.allEnemies,
    effect: (skillContext: SkillContext) => {
      basicDamage(skillContext, 1.25, 25, 5);
    }
  }, {
    icon: "Light-Skills/2408.png", name: "Slash", type: SkillType.attack, subtypes: [SkillSubtype.sword],
    description: "Deal 1.5 base damage <i class='small'>(30% / 5%)</i> to the closest enemy.",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    effect: (skillContext: SkillContext) => {
      basicDamage(skillContext, 2, 30, 5);
    }
  }, {
    icon: "Light-Skills/286.png", name: "Enflame Blade", type: SkillType.ability, fpCost: 2,
    description: "<b class='positive-description'>+150% direct hit damage</b> when dealing damage with <i>sword attacks</i>.",
    flavour: undefined, target: SkillTargetType.noTarget,
    effect: (skillContext: SkillContext) => {
      skillContext.origin.addStatus({
        statusInformation: {
          id: "enflamed-blade", name: "Enflamed Blade", icon: "Light-Skills/286.png",
          stackType: StackType.replace, type: StatusType.buff,
          description: (Status) => "<b class='positive-description'>+150% direct hit damage</b> when dealing damage with <i>sword attacks</i>.",
          onDamageDeal: (status: Status, skillContext: SkillContext, host: UnitInstance, target: UnitInstance) => {
            var subtypes = skillContext.skill.skillInfo.subtypes;
            if (subtypes != undefined && subtypes.includes(SkillSubtype.sword)) {
              skillContext.directDamageAddition += 150;
            }
          }
        }, origin: skillContext.origin
      })
    }
  }, {
    icon: "skill-icons/skill_23.png", name: "Blade Flourish", type: SkillType.attack, subtypes: [SkillSubtype.sword],
    description: "Deal 2 base damage <i class='small'>(40% / 10%)</i> to the closest enemy. If your last three skills were "
    + "<i>sword skills</i>, do this damage three times instead.<br>" + statusDescription(STATUSES["delayed"], "", false, 1) +  ".",
    flavour: undefined, target: SkillTargetType.firstEnemy,
    effect: (skillContext: SkillContext) => {
      basicDamage(skillContext, 2, 40, 10);
      if (skillContext.origin.recentSkillsAll((skill, context) => {
        return skill.skillInfo.subtypes != undefined && skill.skillInfo.subtypes.includes(SkillSubtype.sword)
      }, 3)){
        basicDamage(skillContext, 2, 40, 10);
        basicDamage(skillContext, 2, 40, 10);
      }

      skillContext.origin.addStatus({statusInformation: STATUSES["delayed"], duration: 1});
    }
  },
];

// always do this last
for (var i = 0; i < SKILLS.length; i++) {
  SKILLS[i].id = i;
}