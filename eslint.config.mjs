import eslint from '@eslint/js';
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import react from "eslint-plugin-react"
import reactNative from "eslint-plugin-react-native"
import tseslint from 'typescript-eslint';


export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 5,
            sourceType: "script",
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react,
            "react-native": reactNative,
        },
        rules: {
            "import/prefer-default-export": "off",
            "no-nested-ternary": "off",
            "no-redeclare": "off",
            "no-underscore-dangle": ["error", {
                enforceInMethodNames: false,
                allowAfterThis: true,
            }],
            "@typescript-eslint/lines-between-class-members": "off",
            "@typescript-eslint/no-require-imports": "off",
        },
    },
);
