import {action, computed, makeObservable, observable} from 'mobx';
import {ResusStore} from './ResusState.store';
import {
  makeNlsFunctionButtonsObject,
  makeChestRiseButtons,
} from '../nlsObjects';

class NlsStore extends ResusStore {
  assessBabyTimer: () => string | null;
  constructor() {
    super();
    makeObservable(this);
    this.chestRiseOutput = makeChestRiseButtons();
    this.functionButtons = makeNlsFunctionButtonsObject();
    this.nlsReset = this.resetLogMaker(
      () => makeNlsFunctionButtonsObject(),
      this,
    );
    this.assessBabyTimer = this.customTimerMaker(30, 'Baby Assessed:', this);
  }
  nlsReset: () => void;
  @observable chestRiseOutput: Record<string, boolean>;
  @action toggleChestRiseColor(title: string) {
    this.chestRiseOutput[title] = !this.chestRiseOutput[title];
  }

  @action addPickerTime(logInput: string) {
    if (!this.functionButtons[logInput]) {
      this.functionButtons[logInput] = [];
    }
    this.addTime(logInput);
  }

  @action resetChestRiseColor() {
    Object.keys(this.chestRiseOutput).forEach(title => {
      this.chestRiseOutput[title] = false;
    });
  }
}

export const nlsStore = new NlsStore();
