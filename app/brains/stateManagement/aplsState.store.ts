import {makeObservable} from 'mobx';
import {makeAplsFunctionButtonsObject} from '../aplsObjects';
import {ResusStore} from './ResusState.store';

class AplsStore extends ResusStore {
  adrenalineTimer: () => string | null;
  rhythmTimer: () => string | null;
  aplsReset: () => void;
  constructor() {
    super();
    makeObservable(this);
    this.functionButtons = makeAplsFunctionButtonsObject();
    this.aplsReset = this.resetLogMaker(
      () => makeAplsFunctionButtonsObject(),
      this,
    );
    this.adrenalineTimer = this.customTimerMaker(
      180,
      'Adrenaline Administered',
      this,
    );
    this.rhythmTimer = this.customTimerMaker(120, 'Rhythm Analysed', this);
  }
}
export const aplsStore = new AplsStore();
