import {computed, makeObservable} from 'mobx';
import {makeAplsFunctionButtonsObject} from '../aplsObjects';
import {ResusStore} from './ResusState.store';

class AplsStore extends ResusStore {
  constructor() {
    super();
    makeObservable(this);
    this.functionButtons = makeAplsFunctionButtonsObject();
    this.aplsReset = this.resetLogMaker(
      () => makeAplsFunctionButtonsObject(),
      this,
    );
  }
  aplsReset: () => void;

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
        const timeToNextAdrenaline = repeatTime - secDiff;
        if (timeToNextAdrenaline >= 0 && timeToNextAdrenaline < 180) {
          return (adrenalineOutputTime =
            this.secondsConverter(timeToNextAdrenaline));
        } else {
          return '';
        }
      }
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
          rhythmOutputTime = this.secondsConverter(timeToNextRhythm);
          return rhythmOutputTime;
        } else {
          return '';
        }
      }
    }
    return rhythmOutputTime;
  }
}
export const aplsStore = new AplsStore();
