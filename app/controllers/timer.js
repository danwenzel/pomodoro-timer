import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { readOnly } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import zeroPadded from '../utils/zero-padded';

export default class TimerController extends Controller {
  pomodoroMinutes = 25;
  @tracked currentSeconds;

  constructor() {
    super(...arguments);

    // this.currentSeconds = 60 * this.pomodoroMinutes;
    this.currentSeconds = 5;
  }

  get displayMinutes() {
    return zeroPadded(this.currentSeconds / 60);
  }

  get displaySeconds() {
    return zeroPadded(this.currentSeconds % 60);
  }

  @readOnly('startTimer.isRunning') isPlaying;

  @action
  togglePlay() {
    if (this.isPlaying) {
      this.startTimer.cancelAll();
    } else {
      this.startTimer.perform();
    }
  }

  @task(function* () {
    this.decrementProperty('currentSeconds');
    if (this.currentSeconds <= 0) {
      return;
    }

    yield timeout(1000);
    this.startTimer.perform();
  })
  startTimer;
}
