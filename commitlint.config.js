export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'breaking',
                'feat',
                'security',
                'improvement',
                'perf',
                'fix',
                'docs',
                'chore',
                'refactor',
                'test',
                'style',
                'build',
                'ci',
                'wip',
            ],
        ],
    },
    ignores: [
        commit => /^Release \d+\.\d+\.\d+(-[\w.]+)?/.test(commit),
    ],
};
