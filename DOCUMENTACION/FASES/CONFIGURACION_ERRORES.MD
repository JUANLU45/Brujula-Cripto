// .eslintrc.json (raíz del monorepo) - Configuración estricta para ESLint v9+ con TypeScript, Next.js y reglas de producción robustas
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": ["packages/*/tsconfig.json"],
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import",
    "prettier"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "next/core-web-vitals"
  ],
  "rules": {
    // Reglas generales para robustez y producción (sin errores, consistencia forzada)
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "no-duplicate-imports": "error",
    "prefer-const": "error",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "no-var": "error",
    "prefer-arrow-callback": "error",
    "prefer-template": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "require-await": "error",
    "no-return-await": "error",
    "no-await-in-loop": "warn",
    "max-depth": ["warn", 4],
    "complexity": ["warn", 10],
    "max-lines": ["warn", { "max": 300, "skipBlankLines": true, "skipComments": true }],
    "max-params": ["warn", 4],

    // Reglas de TypeScript estrictas para evitar errores en producción
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-return": "error",

    // Reglas de React/Next.js para accesibilidad y performance
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": ["error", { "extensions": [".tsx"] }],
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-uses-vars": "error",
    "react/no-children-prop": "error",
    "react/no-danger-with-children": "error",
    "react/no-deprecated": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-is-mounted": "error",
    "react/no-render-return-value": "error",
    "react/no-string-refs": "error",
    "react/no-unescaped-entities": "error",
    "react/no-unknown-property": "error",
    "react/no-unsafe": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "jsx-a11y/accessible-emoji": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/aria-activedescendant-has-tabindex": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-role": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/autocomplete-valid": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/heading-has-content": "error",
    "jsx-a11y/html-has-lang": "error",
    "jsx-a11y/iframe-has-title": "error",
    "jsx-a11y/img-redundant-alt": "error",
    "jsx-a11y/interactive-supports-focus": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/lang": "error",
    "jsx-a11y/media-has-caption": "warn",
    "jsx-a11y/mouse-events-have-key-events": "error",
    "jsx-a11y/no-access-key": "error",
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/no-distracting-elements": "error",
    "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
    "jsx-a11y/no-noninteractive-element-interactions": "error",
    "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
    "jsx-a11y/no-noninteractive-tabindex": "error",
    "jsx-a11y/no-redundant-roles": "error",
    "jsx-a11y/no-static-element-interactions": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error",
    "jsx-a11y/scope": "error",
    "jsx-a11y/tabindex-no-positive": "error",

    // Reglas de import para orden y limpieza
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
      "pathGroups": [
        { "pattern": "react", "group": "builtin", "position": "before" },
        { "pattern": "next/**", "group": "builtin", "position": "before" },
        { "pattern": "@/**", "group": "internal" }
      ],
      "pathGroupsExcludedImportTypes": ["react"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc", "caseInsensitive": true }
    }],
    "import/no-duplicates": "error",
    "import/no-self-import": "error",
    "import/no-cycle": "error",
    "import/no-useless-path-segments": "error",

    // Integración con Prettier (forzar formato consistente)
    "prettier/prettier": "error"
  },
  "overrides": [
    {
      "files": ["**/*.ts", "**/_.tsx"],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": "error"
      }
    },
    {
      "files": ["packages/functions/**/_.ts"],
      "rules": {
        "no-console": "off" // Permitir console en backend para logging
      }
    }
  ],
  "ignorePatterns": ["node_modules/", "dist/", ".next/", "_.js", "_.d.ts"]
}

// .prettierrc (raíz del monorepo) - Configuración estricta para Prettier v3+ con Tailwind CSS y consistencia absoluta
{
  "singleQuote": true,
  "jsxSingleQuote": false,
  "quoteProps": "as-needed",
  "trailingComma": "all",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "useTabs": false,
  "endOfLine": "lf",
  "proseWrap": "always",
  "htmlWhitespaceSensitivity": "css",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./packages/app/tailwind.config.ts",
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "proseWrap": "preserve"
      }
    }
  ]
}
