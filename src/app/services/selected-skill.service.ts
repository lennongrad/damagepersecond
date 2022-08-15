import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SkillInfo } from '../interfaces/skill-information';

@Injectable({
  providedIn: 'root'
})
export class SelectedSkillService {
  selectedSkill?: SkillInfo;
  selectedSkillChange = new Subject<SkillInfo | undefined>();

  skillUsed = new Subject<SkillInfo>;

  keycodeSelect = new Subject<number>;

  constructor() { 
    this.selectedSkillChange.subscribe((value) => {
        this.selectedSkill = value;
    });
  }

  changeSelectedSkill(newSkill?: SkillInfo){
    this.selectedSkillChange.next(newSkill);
  }

  useSkill(skill: SkillInfo){
    this.skillUsed.next(skill);
  }

  keyPress(val: number){
    this.keycodeSelect.next(val);
  }
}
