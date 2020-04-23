import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { readOnly } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import zeroPadded from '../utils/zero-padded';
import { inject as service } from '@ember/service';

export default class TimerController extends Controller {
  pomodoroMinutes = 25;
  breakMinutes = 5;

  @tracked currentSeconds;
  @tracked currentMode = 'work';

  @service audioPlayer;

  constructor() {
    super(...arguments);

    // this.currentSeconds = 60 * this.pomodoroMinutes;
    this.currentSeconds = 5;

    this.audioPlayer.loadPlayer.perform();
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
      yield this._endMode();
      return;
    }

    yield timeout(1000);
    this.startTimer.perform();
  })
  startTimer;

  async _endMode() {
    if (this.currentMode === 'work') {
      await this._switchToBreakMode();
    }
  }

  async _switchToBreakMode() {
    this.currentMode = 'break';
    this.currentSeconds = 60 * this.breakMinutes;
    await this.audioPlayer.play('/assets/audio/Birds-tweet.mp3');
    window.alert('Time for a short break!');
    this.startTimer.perform();
  }
}
