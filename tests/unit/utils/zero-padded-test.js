import zeroPadded from 'pomodoro-timer/utils/zero-padded';
import { module, test } from 'qunit';

module('Unit | Utility | zero-padded', function () {
  test('it works with 2-digit number', function (assert) {
    assert.strictEqual(zeroPadded(33), '33');
  });
  test('it works with 1-digit number', function (assert) {
    assert.strictEqual(zeroPadded(3), '03');
  });
  test('it works with float', function (assert) {
    assert.strictEqual(zeroPadded(3.66), '03');
  });
  test('it works with null', function (assert) {
    assert.strictEqual(zeroPadded(null), '00');
  });
});
