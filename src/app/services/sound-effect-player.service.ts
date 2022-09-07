import { Injectable } from '@angular/core';
import { SoundInformation } from '../interfaces/sound-information';
import * as _ from 'underscore';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoundEffectPlayerService {
  noisesPlaying: Record<string, Array<any>> = {};
  timeSinceLast: Record<string, number> = {};
  
  buttonClickNoise: SoundInformation = {
    audioFilename: "buttonnoise.mp3",
    playbackRateMin: 4,
    playbackRateMax: 8,
    volume: 1,
    concurrentMaximum: 1,
    replacePrevious: true,
    timeSinceLast: 100
  }

  timeSource = interval(1);
  subscription?: Subscription;
  lastDate = Date.now();

  playSound(soundInfo: SoundInformation): void {
    this._playSound(soundInfo);
  }

  // returns true if there were already max number of sounds playing
  _playSound(soundInfo: SoundInformation): void {
    // check if there are already too many of these noises playing
    if (!this.noisesPlaying.hasOwnProperty(soundInfo.audioFilename)) {
      this.noisesPlaying[soundInfo.audioFilename] = [];
    }

    if(soundInfo.timeSinceLast != undefined && this.timeSinceLast[soundInfo.audioFilename] != undefined && 
       this.timeSinceLast[soundInfo.audioFilename] < soundInfo.timeSinceLast){
      return;
    }

    if (this.noisesPlaying[soundInfo.audioFilename].length > soundInfo.concurrentMaximum) {
      if (soundInfo.replacePrevious) {
        this.noisesPlaying[soundInfo.audioFilename].unshift();
        this._startSound(this._createSound(soundInfo), soundInfo.audioFilename);
      }
    } else {
      this._startSound(this._createSound(soundInfo), soundInfo.audioFilename);
    }
  }

  _removeSound(sound: any, filename: string): void {
    if(sound.path != undefined){
      this.noisesPlaying[filename] = _.without(this.noisesPlaying[filename], sound.path[0]);
    }
  }

  _createSound(soundInfo: SoundInformation) {
    // ts wont let me do preservesPitch unless i cast it as any
    var sound = new Audio("assets/" + soundInfo.audioFilename) as any;
    sound.playbackRate = soundInfo.playbackRateMin + (soundInfo.playbackRateMax - soundInfo.playbackRateMin) * Math.random();
    sound.volume = soundInfo.volume;
    if ('preservesPitch' in sound) {
      sound.preservesPitch = false;
    }
    else if ('mozPreservesPitch' in sound) { //deprecated
      sound.mozPreservesPitch = false;
    }
    return sound;
  }

  _startSound(sound: any, filename: string): void {
    this.noisesPlaying[filename].push(sound);

    sound.play();
    sound.addEventListener("ended", (self: any) => this._removeSound(self, filename));
    this.timeSinceLast[filename] = 0;
  }

  _eachMillisecond(time: number): void{
    var delta = Date.now() - this.lastDate;
    this.lastDate = Date.now();

    for(const key in this.timeSinceLast){
      this.timeSinceLast[key] += delta;
    }
  }

  constructor() {
    this.subscription = this.timeSource.subscribe(time => this._eachMillisecond(time));
   }
}
