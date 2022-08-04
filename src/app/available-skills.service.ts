import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { Skill } from './skill';
import { SKILLS } from './skills-list';

@Injectable({
  providedIn: 'root'
})
export class AvailableSkillsService {

  getSkills(): Skill[]{
    return SKILLS;
  }

  getSkillById(id: number): Skill | undefined{
    return _.find(SKILLS, (skill) => skill.id == id);
  }

  constructor() { }
}
