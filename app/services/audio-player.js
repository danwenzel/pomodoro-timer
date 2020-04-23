import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { Promise } from 'rsvp';

export default class AudioPlayerService extends Service {
  @task(function* () {
    const { Howl } = yield import('howler');

    this.Howl = Howl;
  })
  loadPlayer;

  play(src) {
    return new Promise((resolve) => {
      const sound = new this.Howl({
        src: [src],
        onload() {
          resolve();
        },
        // error callbacks. Log to console, but don't reject
        onloaderror() {
          console.error('error loading audio');
          resolve();
        },
        onplayerror() {
          console.error('error playing audio');
          resolve();
        },
      });

      sound.play();
    });
  }
}
