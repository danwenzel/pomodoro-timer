'use strict';

const pomodoroDefaults = {
  workSeconds: 25 * 60,
  breakSeconds: 5 * 60,
  longBreakSeconds: 25 * 60,
  totalPomodoros: 4,
};

const pomodoroFast = {
  workSeconds: 5,
  breakSeconds: 2,
  longBreakSeconds: 7,
  totalPomodoros: 4,
};

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'pomodoro-timer',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    msPerSecond: 1000,

    pomodoroDefaults:
      process.env.DEBUG || environment === 'test'
        ? pomodoroFast
        : pomodoroDefaults,

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    // make timers super fast in tests;
    ENV.msPerSecond = 1;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
