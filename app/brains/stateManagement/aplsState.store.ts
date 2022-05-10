import {action, computed, makeObservable, observable} from 'mobx';
import {makeFunctionButtonsObject, FunctionButtonsType} from '../aplsObjects';

class AplsStore {
  constructor() {
    makeObservable(this);
    this.functionButtons = makeFunctionButtonsObject();
  }

  @observable functionButtons: FunctionButtonsType = {};

  //gets time entry for APLS interaction
  @observable getFunctionButtonTime(title: string) {
    return this.functionButtons[title];
  }

  //adds time to APLS interaction
  @action addTime(title: string) {
    this.functionButtons[title].push(new Date());
  }

  //removes time from APLS interaction
  @action removeTime(title: string) {
    this.functionButtons[title].splice(-1, 1);
  }

  //Reset logic
  //logic to replace 'end encounter' state
  @observable endEncounter: boolean = false;
  @action setEndEncounter(value: boolean): void {
    this.endEncounter = value;
  }
  //resets time from APLS object
  @action resetLog(): void {
    this.functionButtons = makeFunctionButtonsObject();
    this.stopTimer();
    this.setEndEncounter(false);
  }

  @action addTimeHandler(title: string) {
    if (!this.timerIsRunning) {
      this.startTimer();
    }
    this.addTime(title);
  }

  //TIMERS

  @action secondsConverter(seconds: number): string {
    let hours = Math.floor(seconds / 3600);
    let remainingDuration = seconds % 3600;

    let min = Math.floor(remainingDuration / 60);
    remainingDuration = remainingDuration % 60;

    let sec = remainingDuration;

    if (hours > 0) {
      return `${`${hours}`}h ${min}m ${sec}s`;
    } else if (min < 1) {
      return `${sec}s`;
    } else if (min > 0) {
      return `${min}m ${sec}s`;
    } else {
      return '';
    }
  }

  //APLS Timer
  @observable startTime: number | null = null;
  @observable timerIsRunning = false;
  @observable currentTime: number | null = null;
  _intervalRef: NodeJS.Timer | null = null;

  @action startTimer = () => {
    if (this.timerIsRunning === false) {
      this.timerIsRunning = true;
      this.addTime('Start Time');
      this.startTime = new Date().getTime();
      this._intervalRef = setInterval(
        action(() => (this.currentTime = new Date().getTime())),
        1000,
      );
    }
  };

  @computed get stopwatchDisplay() {
    if (
      this.currentTime &&
      this.startTime &&
      this.currentTime > this.startTime
    ) {
      const seconds = Math.floor((this.currentTime - this.startTime) / 1000);
      return this.secondsConverter(seconds);
    }
  }

  @action stopTimer = () => {
    this.timerIsRunning = false;
    if (this._intervalRef) {
      clearInterval(this._intervalRef);
      this._intervalRef = null;
    }
  };

  //Adrenaline Timer

  @computed get adrenalineDisplay(): string | null {
    const repeatTime = 180;
    let lastAdrenalineTime: null | number = null;
    let adrenalineOutputTime: string = '';

    if (this.getFunctionButtonTime('Adrenaline Administered').length) {
      const allAdrenalineTimes = this.getFunctionButtonTime(
        'Adrenaline Administered',
      );
      lastAdrenalineTime =
        allAdrenalineTimes[allAdrenalineTimes.length - 1].getTime();
    }

    if (this.currentTime && lastAdrenalineTime) {
      const secDiff = Math.floor(
        (this.currentTime - lastAdrenalineTime) / 1000,
      );
      if (this.getFunctionButtonTime('Adrenaline Administered').length > 0) {
        let timeToNextAdrenaline = repeatTime - secDiff;
        if (timeToNextAdrenaline >= 0 && timeToNextAdrenaline < 180) {
          return (adrenalineOutputTime =
            this.secondsConverter(timeToNextAdrenaline));
        } else {
          return (adrenalineOutputTime = '');
        }
      }
    } else {
      return adrenalineOutputTime;
    }
    return adrenalineOutputTime;
  }

  //Rhythm timer

  @computed get rhythmTimer(): string | null {
    const repeatTime = 120;
    let lastRhythmTime: null | number = null;
    let rhythmOutputTime: string = '';

    if (this.getFunctionButtonTime('Rhythm Analysed').length) {
      const allRhythmTimes = this.getFunctionButtonTime('Rhythm Analysed');
      lastRhythmTime = allRhythmTimes[allRhythmTimes.length - 1].getTime();
    }

    if (this.currentTime && lastRhythmTime) {
      const secDiff = Math.floor((this.currentTime - lastRhythmTime) / 1000);
      if (this.getFunctionButtonTime('Rhythm Analysed').length > 0) {
        let timeToNextRhythm = repeatTime - secDiff;
        if (timeToNextRhythm >= 0 && timeToNextRhythm < 120) {
          return (rhythmOutputTime = this.secondsConverter(timeToNextRhythm));
        } else {
          return (rhythmOutputTime = '');
        }
      }
    }
    return rhythmOutputTime;
  }
}
export const aplsStore = new AplsStore();
