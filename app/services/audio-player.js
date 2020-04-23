import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { Promise, resolve } from 'rsvp';
import { assert } from '@ember/debug';

export default class AudioPlayerService extends Service {
  @task(function* () {
    const { Howl } = yield import('howler');

    this.Howl = Howl;
  })
  loadPlayer;

  async play(src, { volume = 1 } = {}) {
    if (!this.loadPlayer.last) {
      assert(
        `Must perform audioPlayer's loadPlayer task before attempting to play`
      );

      return resolve();
    }

    await this.loadPlayer.last;

    return new Promise((resolve) => {
      const sound = new this.Howl({
        src: [src],
        volume,
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
