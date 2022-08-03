import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Skill } from './skill';

@Injectable({
  providedIn: 'root'
})
export class SelectedSkillService {
  selectedSkill?: Skill;
  selectedSkillChange = new Subject<Skill | undefined>();

  skillUsed = new Subject<Skill>;

  keycodeSelect = new Subject<number>;

  constructor() { 
    this.selectedSkillChange.subscribe((value) => {
        this.selectedSkill = value;
    });
  }

  changeSelectedSkill(newSkill?: Skill){
    this.selectedSkillChange.next(newSkill);
  }

  useSkill(skill: Skill){
    this.skillUsed.next(skill);
  }

  keyPress(val: number){
    this.keycodeSelect.next(val);
  }
}
