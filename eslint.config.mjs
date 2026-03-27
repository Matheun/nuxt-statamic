import antfu from '@antfu/eslint-config';
// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
    features: {
        standalone: false,
        tooling: true,
    },
    dirs: {
        src: [
            './playground/app',
            './docs',
            './example',
        ],
    },
}).append(
    antfu({
        formatters: true,
        imports: {
            rules: {
                'import/first': 'off',
                'import/newline-after-import': 'error',
                'import/no-duplicates': 'error',
                'import/order': 'off',
            },
        },
        javascript: {
            overrides: {
                'comma-dangle': ['error', 'always-multiline'],
                'curly': 'error',
                'eqeqeq': 'off',
                'indent': ['error', 4, { SwitchCase: 1 }],
                'no-console': 'warn',
                'no-prototype-builtins': 'off',
                'no-unused-vars': 'off',
                'prefer-const': 'error',
                'quotes': ['error', 'single'],
                'semi': ['error', 'always'],
            },
        },
        stylistic: {
            indent: 4,
            quotes: 'single',
            semi: true,
            overrides: {
                'style/max-statements-per-line': ['error', { max: 5 }],
            },
        },
        typescript: {
            overrides: {
                'ts/consistent-type-definitions': 'off',
                'ts/explicit-module-boundary-types': 'off',
                'ts/no-empty-function': 'off',
                'ts/no-empty-interface': 'off',
                'ts/no-explicit-any': 'off',
                'ts/no-this-alias': 'off',
                'ts/no-unused-vars': ['error', {
                    vars: 'all',
                    args: 'none',
                    ignoreRestSiblings: true,
                }],
            },
        },
        vue: {
            overrides: {
                'vue/attributes-order': ['error', {
                    order: [
                        'DEFINITION',
                        'LIST_RENDERING',
                        'CONDITIONALS',
                        'RENDER_MODIFIERS',
                        'GLOBAL',
                        'UNIQUE',
                        'SLOT',
                        'TWO_WAY_BINDING',
                        'OTHER_DIRECTIVES',
                        'ATTR_DYNAMIC',
                        'ATTR_STATIC',
                        'ATTR_SHORTHAND_BOOL',
                        'EVENTS',
                        'CONTENT',
                    ],
                    alphabetical: true,
                }],
                'vue/html-indent': ['error', 4],
                'vue/max-attributes-per-line': ['error', {
                    singleline: 3,
                    multiline: 1,
                }],
                'vue/multi-word-component-names': 'off',
                'vue/no-export-in-script-setup': 'off',
                'vue/require-default-prop': 'off',
            },
        },
        ignores: [
            'dist',
            'node_modules',
            '**/*.yaml',
            '**/*.yml',
            '**/*.md',
            '.release-it.ts',
            '.axample',
        ],
    }),
);
