"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GRID_EXPERIMENTAL_ENABLED = void 0;

var _utils = require("../utils/utils");

// A guide to feature toggling.
//
// The feature toggle is:
// - independent from the NODE_ENV
// - isn't pruning code in production, as the objective is to eventually ship the code.
// - doesn't allow to cherry-pick which feature to enable
//
// By default, the experimental features are only enabled in:
// - the local environment
// - the pull request previews
//
// Reviewers can force the value with the local storage and the GRID_EXPERIMENTAL_ENABLED key:
// - 'true' => force it to be enabled
// - 'false' => force it to be disabled
//
// Developers (users) are discouraged to enable the experimental feature by setting the GRID_EXPERIMENTAL_ENABLED env.
// Instead, prefer exposing experimental APIs, for instance, a prop or a new `unstable_` module.
let experimentalEnabled = false;

if (typeof process !== 'undefined' && process.env.GRID_EXPERIMENTAL_ENABLED !== undefined && (0, _utils.localStorageAvailable)() && window.localStorage.getItem('GRID_EXPERIMENTAL_ENABLED')) {
  experimentalEnabled = window.localStorage.getItem('GRID_EXPERIMENTAL_ENABLED') === 'true';
} else if (typeof process !== 'undefined') {
  experimentalEnabled = process.env.GRID_EXPERIMENTAL_ENABLED === 'true';
}

const GRID_EXPERIMENTAL_ENABLED = experimentalEnabled;
exports.GRID_EXPERIMENTAL_ENABLED = GRID_EXPERIMENTAL_ENABLED;