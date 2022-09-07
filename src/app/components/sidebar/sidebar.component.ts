import { Component, OnInit } from '@angular/core';
import { UnitInstancesService } from 'src/app/services/unit-instances.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
  getSelected(): string{
    return this.unitInstanceService.selectedTab;
  }

  constructor(private unitInstanceService :UnitInstancesService) { }

  ngOnInit(): void {
  }

}
