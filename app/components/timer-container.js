import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { readOnly } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import zeroPadded from '../utils/zero-padded';
import { inject as service } from '@ember/service';

export default class TimerContainerComponent extends Component {
  totalPomodoros = 4;

  @readOnly('args.pomodoroSeconds') pomodoroSeconds;
  @readOnly('args.breakSeconds') breakSeconds;
  @readOnly('args.longBreakSeconds') longBreakSeconds;
  @readOnly('args.totalPomodoros') totalPomodoros;
  @readOnly('startTimer.isRunning') isPlaying;

  @tracked currentSeconds;
  @tracked currentMode = 'work';
  @tracked pomodorosComplete = 0;

  @service audioPlayer;

  constructor() {
    super(...arguments);
    this.currentSeconds = this.pomodoroSeconds;

    this.audioPlayer.loadPlayer.perform();
  }

  get displayMinutes() {
    return zeroPadded(this.currentSeconds / 60);
  }

  get displaySeconds() {
    return zeroPadded(this.currentSeconds % 60);
  }

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
    this.currentSeconds = this.pomodoroSeconds;
    this.currentMode = 'work';
  }

  @task(function* () {
    while (true) {
      yield timeout(1000);
      this.currentSeconds--;
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
    this.currentSeconds = this.pomodoroSeconds;
  }

  async _switchToBreakMode() {
    await this.audioPlayer.play('/assets/audio/birds-tweet.mp3');
    window.alert('Time for a short break!');
    this.currentMode = 'break';
    this.currentSeconds = this.breakSeconds;
    this.startTimer.perform();
  }

  async _switchToLongBreakMode() {
    await this.audioPlayer.play('/assets/audio/ff3-fanfare.mp3', {
      volume: 0.5,
    });
    window.alert('You did it! Reward yourself with a long break.');
    this.currentMode = 'break';
    this.currentSeconds = this.longBreakSeconds;
    this.pomodorosComplete = 0;
    this.startTimer.perform();
  }
}
