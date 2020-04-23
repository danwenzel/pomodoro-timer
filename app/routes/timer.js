import Route from '@ember/routing/route';

// DEFAULTS
const DEFAULTS = {
  POMODORO_MINUTES: 25,
  BREAK_MINUTES: 5,
  LONG_BREAK_MINUTES: 25,
  TOTAL_POMODOROS: 4,
};

export default class TimerRoute extends Route {
  model() {
    return {
      pomodoroSeconds: DEFAULTS.POMODORO_MINUTES * 60,
      breakSeconds: DEFAULTS.BREAK_MINUTES * 60,
      longBreakSeconds: DEFAULTS.LONG_BREAK_MINUTES * 60,
      totalPomodoros: DEFAULTS.TOTAL_POMODOROS,
    };
  }
}
