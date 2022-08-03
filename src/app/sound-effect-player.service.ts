import { Injectable } from '@angular/core';
import { SoundInfo } from './soundinfo';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class SoundEffectPlayerService {
  noisesPlaying: Record<string, Array<any>> = {};

  // returns true if there were already max number of sounds playing
  playSound(soundInfo: SoundInfo): boolean {
    // check if there are already too many of these noises playing
    if (!this.noisesPlaying.hasOwnProperty(soundInfo.audioFilename)) {
      this.noisesPlaying[soundInfo.audioFilename] = [];
    }

    if (this.noisesPlaying[soundInfo.audioFilename].length > soundInfo.concurrentMaximum) {
      if (soundInfo.replacePrevious) {
        this.noisesPlaying[soundInfo.audioFilename].unshift();
        this._startSound(this._createSound(soundInfo), soundInfo.audioFilename);
      }

      return true;
    } else {
      this._startSound(this._createSound(soundInfo), soundInfo.audioFilename);

      return false;
    }
  }

  _removeSound(sound: any, filename: string): void {
    this.noisesPlaying[filename] = _.without(this.noisesPlaying[filename], sound.path[0]);
  }

  _createSound(soundInfo: SoundInfo) {
    // ts wont let me do preservesPitch unless i cast it as any
    var sound = new Audio(soundInfo.audioFilename) as any;
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
  }

  constructor() { }
}
