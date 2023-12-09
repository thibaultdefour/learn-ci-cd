/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/eslint-config-typescript/recommended',
        '@vue/eslint-config-prettier',
    ],
    plugins: ['import', 'unused-imports'],
    rules: {
        'quotes': ["error", "single", { "allowTemplateLiterals": true }],

        // Disable some opinionated rules from @vue/prettier/@typescript-eslint ruleset
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',

        //import plugin
        // https://github.com/import-js/eslint-plugin-import
        'import/no-extraneous-dependencies': 'error',
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
                'newlines-between': 'never',
                alphabetize: { order: 'asc', caseInsensitive: true },
                pathGroups: [
                    {
                        pattern: '@/**',
                        group: 'internal',
                    },
                ],
            },
        ],

        // unused-imports plugin config:
        // https://www.npmjs.com/package/eslint-plugin-unused-imports
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'error',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],

        // overrides
        'vue/valid-v-slot': [
            'error',
            {
                allowModifiers: true,
            },
        ],
        'vue/component-name-in-template-casing': [
            'error',
            'PascalCase',
            {
                registeredComponentsOnly: false,
                ignores: [
                    'component',
                    'keep-alive',
                    'transition',
                    'transition-group',
                ],
            },
        ],
        '@typescript-eslint/consistent-type-imports': 'error',
    },}
