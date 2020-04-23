import Component from '@glimmer/component';

export default class TimerComponent extends Component {
  get circleColor() {
    return this.args.label === 'work' ? 'border-red-600' : 'border-green-600';
  }
}
