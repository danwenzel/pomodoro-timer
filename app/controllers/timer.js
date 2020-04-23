import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { readOnly } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import zeroPadded from '../utils/zero-padded';
import { inject as service } from '@ember/service';

export default class TimerController extends Controller {
  pomodoroMinutes = 10;
  breakMinutes = 5;
  longBreakMinutes = 10;
  totalPomodoros = 4;
  secondsPerMinute = 60;

  @tracked currentSeconds;
  @tracked currentMode = 'work';
  @tracked pomodorosComplete = 0;

  @service audioPlayer;

  constructor() {
    super(...arguments);

    this.currentSeconds = this.secondsPerMinute * this.pomodoroMinutes;

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

  @action
  reset() {
    this.startTimer.cancelAll();
    this.pomodorosComplete = 0;
    this.currentSeconds = this.secondsPerMinute * this.pomodoroMinutes;
    this.currentMode = 'work';
  }

  @task(function* () {
    while (true) {
      yield timeout(1000);
      this.decrementProperty('currentSeconds');
      if (this.currentSeconds <= 0) {
        yield this._endMode();
        return;
      }
    }
  })
  startTimer;

  async _endMode() {
    if (this.currentMode === 'work') {
      this.incrementProperty('pomodorosComplete');
      if (this.pomodorosComplete >= this.totalPomodoros) {
        await this._switchToLongBreakMode();
      } else {
        await this._switchToBreakMode();
      }
    } else {
      await this._switchToWorkMode();
    }
  }

  async _switchToWorkMode() {
    await this.audioPlayer.play('/assets/audio/tea-bell.mp3');
    this.currentMode = 'work';
    this.currentSeconds = this.secondsPerMinute * this.pomodoroMinutes;
  }

  async _switchToBreakMode() {
    await this.audioPlayer.play('/assets/audio/birds-tweet.mp3');
    window.alert('Time for a short break!');
    this.currentMode = 'break';
    this.currentSeconds = this.secondsPerMinute * this.breakMinutes;
    this.startTimer.perform();
  }

  async _switchToLongBreakMode() {
    await this.audioPlayer.play('/assets/audio/ff3-fanfare.mp3', {
      volume: 0.5,
    });
    window.alert('You did it! Reward yourself with a long break.');
    this.currentMode = 'break';
    this.currentSeconds = this.secondsPerMinute * this.longBreakMinutes;
    this.pomodorosComplete = 0;
    this.startTimer.perform();
  }
}
