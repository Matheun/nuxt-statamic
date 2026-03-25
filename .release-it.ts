import type { Config } from "release-it";

const fs = require("node:fs");

import Handlebars from "handlebars";

const commitTemplate = fs.readFileSync(".release-it/templates/commit.hbs").toString();
const footerTemplate = fs.readFileSync(".release-it/templates/footer.hbs").toString();
const mainTemplate = fs.readFileSync(".release-it/templates/template.hbs").toString();
const headerNoteGroupsTemplate = fs.readFileSync(".release-it/templates/header-note-groups.hbs").toString();

Handlebars.registerHelper("eq", (a, b) => a == b);

export default {
    npm: {
        publish: true,
        skipChecks: true,
    },
    plugins: {
        "@release-it/conventional-changelog": {
            infile: "CHANGELOG.md",
            writerOpts: {
                footerPartial: footerTemplate,
                commitPartial: commitTemplate,
                mainTemplate,
                partials: {
                    headerNoteGroups: headerNoteGroupsTemplate,
                },
            },
            preset: {
                name: "conventionalcommits",
                types: [
                    {
                        type: "breaking",
                        section: "🚨 Breaking Changes",
                        hidden: false,
                    },
                    {
                        type: "feat",
                        section: "✨ Features",
                        hidden: false,
                    },
                    {
                        type: "security",
                        section: "🔒 Security",
                        hidden: false,
                    },
                    {
                        type: "improvement",
                        section: "🛠 Improvements",
                        hidden: false,
                    },
                    {
                        type: "perf",
                        section: "⚡️ Performance",
                        hidden: false,
                    },
                    {
                        type: "fix",
                        section: "🐛 Bug Fixes",
                        hidden: false,
                    },
                    {
                        type: "docs",
                        section: "📚 Documentation",
                        hidden: true,
                    },
                    {
                        type: "chore",
                        section: "🏗 Chore",
                        hidden: true,
                    },
                    {
                        type: "refactor",
                        section: "♻️ Refactoring",
                        hidden: true,
                    },
                    {
                        type: "test",
                        section: "🤖 Tests",
                        hidden: true,
                    },
                    {
                        type: "style",
                        section: "🎨 Style",
                        hidden: true,
                    },
                    {
                        type: "build",
                        section: "📦 Build",
                        hidden: true,
                    },
                    {
                        type: "ci",
                        section: "🔄 Continuous Integration",
                        hidden: true,
                    },
                    {
                        type: "wip",
                        section: "🚧 Wip",
                        hidden: true,
                    },
                ],
            },
        },
    },
} satisfies Config;
