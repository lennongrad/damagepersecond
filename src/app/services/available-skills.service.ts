import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { Skill } from '../interfaces/skill';
import { SKILLS } from '../data/skills-list';

@Injectable({
  providedIn: 'root'
})
export class AvailableSkillsService {

  getSkills(): Skill[]{
    return SKILLS;
  }

  getSkillById(id: number): Skill | undefined{
    return _.find(SKILLS, (skill: Skill) => skill.id == id);
  }

  constructor() { }
}
