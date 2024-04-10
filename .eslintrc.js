module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "plugins": [
        "vue"
    ],
    "rules": {
    },
    "overrides": [
        {
            files: ["src/views/**/*.vue"],
            rules: {
                "vue/multi-word-component-names": 0
            }
        }
    ]
};
