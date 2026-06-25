// eslint.config.js
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const boundaries = require('eslint-plugin-boundaries');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
      'boundaries/elements': [
        { type: 'app', mode: 'full', pattern: 'app/**' },
        { type: 'core', mode: 'folder', pattern: 'src/core/*', capture: ['segment'] },
        { type: 'feature', mode: 'folder', pattern: 'src/features/*', capture: ['feature'] },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            // Routes may use anything.
            {
              from: [{ type: 'app' }],
              allow: [{ to: { type: 'app' } }, { to: { type: 'core' } }, { to: { type: 'feature' } }],
            },
            // A feature may use core, and only ITS OWN feature folder — never a sibling.
            {
              from: [{ type: 'feature' }],
              allow: [
                { to: { type: 'core' } },
                { to: { type: 'feature', captured: { feature: '{{ from.captured.feature }}' } } },
              ],
            },
            // Core is the shared kernel: core → core only.
            {
              from: [{ type: 'core' }],
              allow: [{ to: { type: 'core' } }],
            },
          ],
        },
      ],
    },
  },
  prettier, // must come last: turns off ESLint formatting rules that conflict with Prettier
  {
    ignores: ['dist/*', '.expo/*', 'app-example/*'],
  },
]);
