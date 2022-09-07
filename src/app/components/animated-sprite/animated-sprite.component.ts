import { animation } from '@angular/animations';
import { Component, OnInit, Input, Output } from '@angular/core';
import { interval, Subscription, Subject } from 'rxjs';
import { AnimationInformation, AnimationDetails } from 'src/app/interfaces/animation-information';
import * as _ from 'underscore';

@Component({
  selector: 'app-animated-sprite',
  templateUrl: './animated-sprite.component.html',
  styleUrls: ['./animated-sprite.component.less']
})
export class AnimatedSpriteComponent implements OnInit {
  @Input() set AnimationSubject(value: Subject<string>) {
    value.subscribe(name => this.playAnimation(name));
  }
  @Input() set TickSubject(value: Subject<number | true>) {
    value.subscribe(amt => this.addTick(amt));
  }

  @Input() flipSprite = false;

  animationDetails?: AnimationDetails;
  @Input() set AnimationDetails(value: AnimationDetails) {
    this.animationDetails = value;

    if (this.animationIndex == undefined) {
      this.playAnimation("Idle");
    }
  }

  @Input() isDead: boolean = false;

  tickTimeToComplete = 100;

  bufferPlayAnimation?: string;

  timeSource = interval(1);
  subscription?: Subscription;

  animationIndex?: number;
  animationTime = 0;

  activeTicks = new Array<{ value: number, time: number }>();

  getAnimationInformation(): AnimationInformation | undefined {
    if (this.animationIndex == undefined || this.animationDetails == undefined) {
      return undefined;
    }

    return this.animationDetails.animations[this.animationIndex];
  }

  getFrame(time: number): { x: number, y: number } | null {
    var animationInformation = this.getAnimationInformation();
    if (animationInformation == undefined) {
      return null;
    }

    var adjustedTime = time;

    for (var i = 0; i < animationInformation.frameDurations.length; i++) {
      adjustedTime -= animationInformation.frameDurations[i].duration;

      if (adjustedTime < 0) {
        return animationInformation.frameDurations[i].frame;
      }
    }

    return null;
  }

  getStyle(isShadow: boolean = false): any {
    var style: { [klass: string]: any } = {};

    var animationInformation = this.getAnimationInformation();
    if (animationInformation != undefined) {
      var frame = this.getFrame(this.animationTime);
      if (frame != null) {
        style["background-position-x"] = frame.x * -128 + "px";
        style["background-position-y"] = frame.y * -128 + "px";
      }
    }

    if (this.animationDetails != undefined) {
      style["background-size"] = this.animationDetails.sheetWidth + "00% " + this.animationDetails.sheetHeight + "00%";
      style["background-image"] = "url(assets/" + this.animationDetails.imageURL + ")";
      if (isShadow) {
        if (this.animationDetails.shadowImageURL != undefined) {
          style["background-image"] = "url(assets/" + this.animationDetails.shadowImageURL + ")";
        } else {
          style["display"] = "none";
        }
      }

      if (this.animationDetails.horizontalDisplacement != undefined) {
        style["transform"] = "translateX(" + this.animationDetails.horizontalDisplacement + "px)";
      }
    }

    return style;
  }

  getTickStyle(tick: {value: number, time: number}): any{
    var style: { [klass: string]: any } = {};

    var percentTime = tick.time / this.tickTimeToComplete;

    style["bottom"] = Math.pow(percentTime, .35) * 60 - 20 + "px";
    style["opacity"] = -Math.pow(percentTime, 1.5) + 1;

    return style;
  }

  lastDate = Date.now();
  eachMillisecond(time: number): void {
    var delta = Date.now() - this.lastDate;

    if (!this.isDead) {
      var animationInformation = this.getAnimationInformation();
      var originalTime = this.animationTime
      if (animationInformation != undefined) {
        this.animationTime += delta / 1000;
        if (animationInformation.randomize != undefined && Math.random() < animationInformation.randomize) {
          this.animationTime += .01;
        }
  
        var frame = this.getFrame(this.animationTime);
        if (frame == null) {
          if (animationInformation.repeat) {
            this.animationTime = 0;
          } else if (animationInformation.returnTo != undefined) {
            this.playAnimation(animationInformation.returnTo);
          } else {
            this.animationTime = originalTime;
          }
        }
      }
    }

    this.activeTicks = _.forEach(this.activeTicks, tick => { tick.time += 1; });
    this.activeTicks = _.filter(this.activeTicks, tick => tick.time < this.tickTimeToComplete);

    this.lastDate = Date.now();
  }

  playAnimation(animationName: string): void {
    if (this.animationDetails == undefined) {
      this.bufferPlayAnimation = animationName;
      return;
    }

    var animationInformation = this.getAnimationInformation();
    if (animationInformation != undefined && animationInformation.name == animationName) {
      if (animationInformation.restartAt != undefined) {
        this.animationTime = animationInformation.restartAt;
      } else {
        this.animationTime = 0;
      }
    } else {
      this.animationIndex = _.findIndex(this.animationDetails.animations, { name: animationName });
      this.animationTime = 0;
    }

    if (animationName == "Idle") {
      this.animationTime += this.animationDetails.animations[0].frameDurations[0].duration * Math.random();
    }
  }

  addTick(value: number | true): void {
   
    if(value === true){
      this.activeTicks = [];
    } else {
      this.activeTicks = _.forEach(this.activeTicks, tick => { 
        tick.time += this.tickTimeToComplete / 6; 
      });
      
      this.activeTicks.push({ value: value, time: 0 });
    }
  }

  constructor() {
    this.subscription = this.timeSource.subscribe(time => this.eachMillisecond(time))
  }

  ngOnInit(): void {
  }

}
