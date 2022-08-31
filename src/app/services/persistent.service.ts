import { Injectable } from '@angular/core';
import { SaveService } from './save.service';
import { UserSettings } from '../interfaces/user-settings';

@Injectable({
  providedIn: 'root'
})
export class PersistentService {
  userSettings!: UserSettings;
  set bigIconsOn(value: boolean){ this.userSettings.bigIconsOn = value; this.saveData(); }
  get bigIconsOn(): boolean{ return this.userSettings.bigIconsOn; }

  getDefault(): UserSettings{
    return {
      bigIconsOn: false
    }
  }

  saveData(): void {
    var data = JSON.stringify(this.userSettings)
    this.saveService.saveData("user-settings", data);
  }

  loadData(): void{
    var dataString = this.saveService.getData("user-settings");

    try{
      this.userSettings = JSON.parse(dataString) as UserSettings;
    } catch { 
      // set to default value because could not load
      this.userSettings = this.getDefault();
    }
  }

  constructor(private saveService: SaveService) {
    this.loadData();
   }
}
