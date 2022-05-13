import {computed, makeObservable} from 'mobx';
import {ResusStore} from './ResusState.store';
import {makeNlsFunctionButtonsObject} from '../nlsObjects';

class NlsStore extends ResusStore {
  constructor() {
    super();
    makeObservable(this);

    this.functionButtons = makeNlsFunctionButtonsObject();
    console.log(this.functionButtons);
    this.nlsReset = this.resetLogMaker(
      () => makeNlsFunctionButtonsObject(),
      this,
    );
  }
  nlsReset: () => void;
}

export const nlsStore = new NlsStore();
