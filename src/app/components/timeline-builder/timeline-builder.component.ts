import { Component, OnInit } from '@angular/core';
import { TimelineService } from 'src/app/services/timeline.service';
import { SelectedSkillService } from '../../services/selected-skill.service';

@Component({
  selector: 'app-timeline-builder',
  templateUrl: './timeline-builder.component.html',
  styleUrls: ['./timeline-builder.component.less']
})
export class TimelineBuilderComponent implements OnInit {

  onKeydown(event: any) {
    this.selectedSkillService.keycodeSelect.next(event.keyCode);
  }

  load(): void{
    this.timelineService.loadGrid();
  }

  constructor(private selectedSkillService: SelectedSkillService,
    private timelineService: TimelineService) { }

  ngOnInit(): void {
    this.load();
  }

}
