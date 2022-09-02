import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SkillInformation } from '../interfaces/skill-information';

@Injectable({
  providedIn: 'root'
})
export class SelectedSkillService {
  selectedSkill?: SkillInformation;
  selectedSkillChange = new Subject<SkillInformation | undefined>();

  skillUsed = new Subject<SkillInformation>;

  keycodeSelect = new Subject<number>;

  constructor() { 
    this.selectedSkillChange.subscribe((value) => {
        this.selectedSkill = value;
    });
  }

  changeSelectedSkill(newSkill?: SkillInformation){
    this.selectedSkillChange.next(newSkill);
  }

  useSkill(skill: SkillInformation){
    this.skillUsed.next(skill);
  }

  keyPress(val: number){
    this.keycodeSelect.next(val);
  }
}
