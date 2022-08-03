import { Injectable } from '@angular/core';
import { Skill } from './skill';
import { SKILLS } from './skills-list';

@Injectable({
  providedIn: 'root'
})
export class AvailableSkillsService {

  getSkills(): Skill[]{
    return SKILLS;
  }

  constructor() { }
}
