import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { readOnly } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import zeroPadded from '../utils/zero-padded';
import { inject as service } from '@ember/service';
import config from '../config/environment';

const MODES = {
  work: {
    type: 'work',
    label: 'work',
  },
  break: {
    type: 'break',
    label: 'short break',
  },
  longBreak: {
    type: 'break',
    label: 'long break',
  },
};

export default class TimerContainerComponent extends Component {
  totalPomodoros = 4;

  @readOnly('args.pomodoroSeconds') pomodoroSeconds;
  @readOnly('args.breakSeconds') breakSeconds;
  @readOnly('args.longBreakSeconds') longBreakSeconds;
  @readOnly('args.totalPomodoros') totalPomodoros;
  @readOnly('startTimer.isRunning') isPlaying;

  @tracked currentSeconds;
  @tracked currentMode = MODES.work;
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
    this.currentMode = MODES.work;
  }

  @task(function* () {
    while (true) {
      yield timeout(config.msPerSecond);
      this.currentSeconds--;
      if (this.currentSeconds <= 0) {
        yield this._endMode();
        return;
      }
    }
  })
  startTimer;

  async _endMode() {
    if (this.currentMode === MODES.work) {
      this.pomodorosComplete++;
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
    this.currentMode = MODES.work;
    this.currentSeconds = this.pomodoroSeconds;
  }

  async _switchToBreakMode() {
    await this.audioPlayer.play('/assets/audio/birds-tweet.mp3');
    this.currentMode = MODES.break;
    this.currentSeconds = this.breakSeconds;
  }

  async _switchToLongBreakMode() {
    await this.audioPlayer.play('/assets/audio/ff3-fanfare.mp3', {
      volume: 0.5,
    });
    this.currentMode = MODES.longBreak;
    this.currentSeconds = this.longBreakSeconds;
    this.pomodorosComplete = 0;
  }
}
