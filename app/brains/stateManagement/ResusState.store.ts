import {action, computed, observable} from 'mobx';
import {FunctionButtonsType} from '../aplsObjects';

export class ResusStore {
  @observable functionButtons: FunctionButtonsType = {};

  //gets time entry for  interaction
  @observable getFunctionButtonTime(title: string) {
    return this.functionButtons[title];
  }
  //Reset logic
  //logic to replace 'end encounter' state
  @observable endEncounter: boolean = false;
  @action setEndEncounter(value: boolean): void {
    this.endEncounter = value;
  }

  //adds time to  interaction
  @action addTime(title: string) {
    this.functionButtons[title].push(new Date());
  }

  //removes time from interaction
  @action removeTime(title: string) {
    this.functionButtons[title].splice(-1, 1);
  }

  //resets time from object
  resetLogMaker(
    makeFunctionButtonsObject: () => FunctionButtonsType,
    thisContext: ResusStore,
  ): () => void {
    return action(() => {
      thisContext.functionButtons = makeFunctionButtonsObject();
      this.stopTimer();
      this.setEndEncounter(false);
    });
  }

  @action addTimeHandler(title: string) {
    if (!this.timerIsRunning) {
      this.startTimer();
    }
    this.addTime(title);
  }

  //TIMERS

  @action secondsConverter(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    let remainingDuration = seconds % 3600;

    const min = Math.floor(remainingDuration / 60);
    remainingDuration = remainingDuration % 60;

    const sec = remainingDuration;

    if (hours > 0) {
      return `${hours}h ${min}m ${sec}s`;
    } else if (min < 1) {
      return `${sec}s`;
    } else if (min > 0) {
      return `${min}m ${sec}s`;
    } else {
      return '';
    }
  }

  //Timer
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
        action(() => {
          this.currentTime = new Date().getTime();
        }),
        1000,
      );
    }
  };

  @action stopTimer = () => {
    this.timerIsRunning = false;
    if (this._intervalRef) {
      clearInterval(this._intervalRef);
      this._intervalRef = null;
    }
  };

  @computed get stopwatchDisplay(): string {
    if (
      this.currentTime &&
      this.startTime &&
      this.currentTime > this.startTime
    ) {
      const seconds = Math.floor((this.currentTime - this.startTime) / 1000);
      return this.secondsConverter(seconds);
    }
    return '';
  }
}
