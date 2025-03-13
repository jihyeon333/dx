export default {
  extends: ["stylelint-config-standard", "stylelint-config-standard-scss"],
  overrides: [
    {
      files: ["**/*.vue", "**/*.html"],
      customSyntax: "postcss-html",
    },
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
  rules: {
    "at-rule-no-unknown": [
      true,
      { ignoreAtRules: ["use", "mixin", "include"] },
    ],
    "selector-class-pattern": null,
    indentation: null,
    "import-notation": "string",
    "rule-empty-line-before": ["always", { except: ["first-nested"] }],
    "font-family-name-quotes": "always-where-required",
    "function-url-quotes": "always",
    "font-family-no-missing-generic-family-keyword": null,
    "declaration-block-single-line-max-declarations": 2,
    "property-no-vendor-prefix": null,
    "color-function-notation": "modern",
    "alpha-value-notation": null,
    "color-hex-length": null,
    "no-duplicate-selectors": true,
    "no-descending-specificity": null,
    "at-rule-no-vendor-prefix": null,
    "keyframes-name-pattern": null,
    "selector-class-pattern": "^[a-z][a-zA-Z0-9-_]*$",
  },
};
