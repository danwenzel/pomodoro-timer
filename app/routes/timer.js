import Route from '@ember/routing/route';
import config from '../config/environment';

export default class TimerRoute extends Route {
  model() {
    return config.pomodoroDefaults;
  }
}
