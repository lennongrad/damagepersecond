import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { SkillInfo } from '../interfaces/skill-information';
import { SKILLS } from '../data/skills-list';

@Injectable({
  providedIn: 'root'
})
export class AvailableSkillsService {

  getSkills(): SkillInfo[]{
    return SKILLS;
  }

  getSkillById(id: number): SkillInfo | undefined{
    return _.find(SKILLS, (skill: SkillInfo) => skill.id == id);
  }

  constructor() { }
}
