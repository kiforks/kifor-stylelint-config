# kifor-stylelint-config

Created by [Kifor Kostiantyn][author-url]

> This is the standard configuration file for stylelint from [Kifor Kostiantyn](https://www.linkedin.com/in/kiforks/).

Use it as is or as a basis for your own configuration.

## Installation

Along with the config, install the `stylelint` itself.

```sh
npm i -D kifor-stylelint-config stylelint
```

## Usage

In the root of the project, create a `.stylelintrc` file and in it add `kifor-stylelint-config` to the `extends` field.

_.stylelintrc_

```json
{
  "extends": "kifor-stylelint-config"
}
```

If you set `kifor-stylelint-config` globally with the `-g` flag, then you need to use the absolute path `kifor-stylelint-config` in the configuration file:

_.stylelintrc_

```json
{
  "extends": "/absolute/path/to/kifor-stylelint-config"
}
```

## Configure extension

You can override existing rules or add new ones.

To do this, add a `rules` field to the config with the desired rule overrides.

_.stylelintrc_

```json
{
  "extends": "kifor-stylelint-config",
  "rules": {
    "property-no-unknown": [
      true,
      {
        "ignoreProperties": [
          "composes"
        ]
      }
    ],
    "unit-whitelist": ["em", "rem", "s", "px"]
  }
}
```

In the same `rules` field, you can also override the no longer supported Stylelint [styleguide rules](https://github.com/firefoxic/stylelint-codeguide/blob/main/docs/user-guide/rules.md#rules) from the `stylelint-codeguide` plugin by adding the prefix `codeguide/` before the rule name.

_.stylelintrc_

```json
{
  "extends": "kifor-stylelint-config",
  "rules": {
    "property-no-unknown": [
      true,
      {
        "ignoreProperties": [
          "composes"
        ]
      }
    ],
    "unit-whitelist": ["em", "rem", "s", "px"],

    "codeguide/indentation": "tab",
    "codeguide/number-leading-zero": null
  }
}
```

**ATTENTION!** This config is for media [mixins](https://gist.github.com/kifork/0c449aace117fb4db7695aea34b63925) instead of **media queries**:
```scss
// BAD
@media (min-width: 1200px) {
  width: 300px;
}

// GOOD
$breakpoints: (
  xs: 0, /* <576px */
  sm: 576px, /* ≥576px */
  md: 768px, /* ≥768px */
  lg: 992px, /* ≥992px */
  xl: 1200px, /* ≥1200px */
  xxl: 1400px /* ≥1400px */
) !default;

@include media-min(xs);
@include media-max(xxl);
@include media-only(lg);
@include media-between(sm, md);
```

## Usage in VSCode

1. Install stylelint and config
2. Open VSCode
3. Install the [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) plugin
4. Use it

![Inconsistencies with the config rules are underlined with a red wavy line, hovering over it will bring up a popup with the error description.](vscode-error.png)

[author-url]: https://www.linkedin.com/in/kiforks/

