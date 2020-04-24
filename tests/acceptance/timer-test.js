import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import config from '../../config/environment';

const workTimeDisplay = `00:0${config.pomodoroDefaults.pomodoroSeconds}`;
const breakTimeDisplay = `00:0${config.pomodoroDefaults.breakSeconds}`;
const longBreakTimeDisplay = `00:0${config.pomodoroDefaults.longBreakSeconds}`;

const workLabel = 'work';
const breakLabel = 'short break';
const longBreakLabel = 'long break';

module('Acceptance | timer', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const audioPlayer = this.owner.lookup('service:audio-player');
    audioPlayer.play = () => {};
  });

  test('end to end', async function (assert) {
    await visit('/');

    assert.equal(currentURL(), '/');

    assert
      .dom('[data-test-timer-time]')
      .hasText(workTimeDisplay, 'Initial work time is correct');
    assert
      .dom('[data-test-timer-label]')
      .hasText(workLabel, 'Initial work display is correct');

    // Pomodoro 1
    await click('[data-test-toggle-play-button]');
    assert
      .dom('[data-test-timer-time]')
      .hasText(breakTimeDisplay, 'Break time after pomodoro 1 is correct');
    assert
      .dom('[data-test-timer-label]')
      .hasText(breakLabel, 'Break display after pomodoro 1 is correct');
    await click('[data-test-toggle-play-button]');
    assert
      .dom('[data-test-timer-time]')
      .hasText(workTimeDisplay, 'Work time after break 1 is correct');
    assert
      .dom('[data-test-timer-label]')
      .hasText(workLabel, 'Work display after break 1 is correct');

    // Pomodoro 2
    await click('[data-test-toggle-play-button]');
    assert
      .dom('[data-test-timer-time]')
      .hasText(breakTimeDisplay, 'Break time after pomodoro 1 is correct');
    assert
      .dom('[data-test-timer-label]')
      .hasText(breakLabel, 'Break display after pomodoro 1 is correct');
    await click('[data-test-toggle-play-button]');
    assert
      .dom('[data-test-timer-time]')
      .hasText(workTimeDisplay, 'Work time after break 1 is correct');
    assert
      .dom('[data-test-timer-label]')
      .hasText(workLabel, 'Work display after break 1 is correct');

    // Pomodoro 3
    await click('[data-test-toggle-play-button]');
    assert
      .dom('[data-test-timer-time]')
      .hasText(breakTimeDisplay, 'Break time after pomodoro 1 is correct');
    assert
      .dom('[data-test-timer-label]')
      .hasText(breakLabel, 'Break display after pomodoro 1 is correct');
    await click('[data-test-toggle-play-button]');
    assert
      .dom('[data-test-timer-time]')
      .hasText(workTimeDisplay, 'Work time after break 1 is correct');
    assert
      .dom('[data-test-timer-label]')
      .hasText(workLabel, 'Work display after break 1 is correct');

    // Pomodoro 4
    await click('[data-test-toggle-play-button]');
    assert
      .dom('[data-test-timer-time]')
      .hasText(longBreakTimeDisplay, 'Break time after pomodoro 1 is correct');
    assert
      .dom('[data-test-timer-label]')
      .hasText(longBreakLabel, 'Break display after pomodoro 1 is correct');
    await click('[data-test-toggle-play-button]');
    assert
      .dom('[data-test-timer-time]')
      .hasText(workTimeDisplay, 'Work time after break 1 is correct');
    assert
      .dom('[data-test-timer-label]')
      .hasText(workLabel, 'Work display after break 1 is correct');
  });
});
