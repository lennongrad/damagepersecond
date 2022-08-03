import { Component, OnInit } from '@angular/core';
import { Skill } from '../skill';
import { SelectedSkillService } from '../selected-skill.service';

@Component({
  selector: 'app-timeline-builder',
  templateUrl: './timeline-builder.component.html',
  styleUrls: ['./timeline-builder.component.less']
})
export class TimelineBuilderComponent implements OnInit {

  onKeydown(event: any){
    this.selectedSkillService.keycodeSelect.next(event.keyCode);
  }

  constructor(private selectedSkillService: SelectedSkillService) {}

  ngOnInit(): void {
  }

}
