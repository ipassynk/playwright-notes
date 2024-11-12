import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    eslintConfigPrettier,
    {
        plugins: {
            import: importPlugin
        }
    },
    {
        settings: {
            react: {
                version: 'detect'
            },
            'import/internal-regex': '^#(cmp|features)/'
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
                    pathGroups: [
                        {
                            pattern: '#cmp/**',
                            group: 'internal',
                        },
                        {
                            pattern: '#features/**',
                            group: 'internal',
                        }
                    ],
                    pathGroupsExcludedImportTypes: ['builtin']
                }
            ]
        }
    }
]
