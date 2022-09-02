import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { SkillInformation } from '../interfaces/skill-information';
import { SKILLS } from '../data/skill-list';

@Injectable({
  providedIn: 'root'
})
export class AvailableSkillsService {

  getSkills(): { [id: string]: SkillInformation }{
    return SKILLS;
  }

  getSkillById(id: string): SkillInformation | undefined{
    return SKILLS[id];
  }

  constructor() { }
}
