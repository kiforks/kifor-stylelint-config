# Changelog

# [2.0.0] - 2024-12-05

| **Category**      | **Description**                                                                                                                                                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Major Changes** | - Completely revamped CI/CD workflows.<br>- Removed `.stylelintrc.js` from the core project; now builds exclusively on CD workflows.<br>- Updated **Stylelint** peer dependency to `16.11.0`.                                                                                                 |
| **Improvements**  | - Refactored project architecture for scalability.<br>- Removed outdated and conflicting rules.<br>- Added new ESLint rules for enhanced code quality.<br>- Introduced custom Git rules: <br> • Commit linting rules for standardized messages. <br> • Branch naming pattern for consistency. |
| **Testing**       | - Updated test cases to align with the refactored architecture.<br>- Removed legacy mocks for Stylelint testing.                                                                                                                                                                              |
| **Cleanup**       | - Removed unnecessary dependencies and outdated rules, improving compatibility with the latest Stylelint version.                                                                                                                                                                             |

**Summary**:  
This release introduces significant upgrades to the project's architecture, workflows, and configurations. With enhanced compatibility, streamlined CI/CD processes, and improved linting rules, this version sets a robust foundation for future scalability and maintainability.

[#44](https://github.com/kiforks/kifor-stylelint-config/pull/44) by [@kiforks](https://github.com/kiforks).

## [1.1.3] - 2024-10-12

- 🔧 **Enhanced**: Restricted package versions to improve dependency stability ([#43](https://github.com/kiforks/kifor-stylelint-config/pull/43)) by [@kiforks](https://github.com/kiforks).

## [1.1.2] - 2024-06-05

- 🔄 **Updated**: Dependencies to latest stable versions ([#42](https://github.com/kiforks/kifor-stylelint-config/pull/42)) by [@kiforks](https://github.com/kiforks).
- 🗑️ **Removed**: Dependabot due to misaligned update workflows ([#42](https://github.com/kiforks/kifor-stylelint-config/pull/42)).
- ⚙️ **Improved**: Ignored unnecessary linter files for cleaner logs ([#42](https://github.com/kiforks/kifor-stylelint-config/pull/42)).

## [1.1.1] - 2024-05-24

- 🚀 **Upgraded**: Dependencies to ensure compatibility with new features ([#36](https://github.com/kiforks/kifor-stylelint-config/pull/36)).
- ➕ **Added**: `.gitattributes` file to normalize line endings ([#36](https://github.com/kiforks/kifor-stylelint-config/pull/36)).

## [1.1.0] - 2024-05-12

- 🗑️ **Removed**: Tag creation job from the "deploy" workflow to simplify CI/CD ([#35](https://github.com/kiforks/kifor-stylelint-config/pull/35)).

## [1.0.9] - 2024-05-12

- 🔄 **Modified**: Adjusted tag creation logic in "deploy" workflow for better versioning ([#34](https://github.com/kiforks/kifor-stylelint-config/pull/34)).

## [1.0.8] - 2024-05-12

- 🐛 **Fixed**: Resolved tag creation issues in "deploy" workflow ([#33](https://github.com/kiforks/kifor-stylelint-config/pull/33)).

## [1.0.7] - 2024-05-12

- 🛠️ **Fixed**: Permissions for "deploy" workflow ([#31](https://github.com/kiforks/kifor-stylelint-config/pull/31), [#32](https://github.com/kiforks/kifor-stylelint-config/pull/32)).

## [1.0.6] - 2024-05-12

- 🚀 **Added**: Automatic creation of Git tags in "deploy" workflow ([#30](https://github.com/kiforks/kifor-stylelint-config/pull/30)).
- 🗑️ **Removed**: Dependencies between "build" workflows for faster CI ([#30](https://github.com/kiforks/kifor-stylelint-config/pull/30)).

## [1.0.5] - 2024-05-08

- 🐛 **Fixed**: Peer dependency for Stylelint to align with new versions ([#29](https://github.com/kiforks/kifor-stylelint-config/pull/29)).

## [1.0.4] - 2024-05-08

- 🔄 **Updated**: Dependency versions for better compatibility ([#28](https://github.com/kiforks/kifor-stylelint-config/pull/28)).
- 🗑️ **Removed**: Deprecated `scss/at-else-empty-line-before` rule ([#28](https://github.com/kiforks/kifor-stylelint-config/pull/28)).
- ⚙️ **Improved**: Configurations for rules like `at-rule-no-unknown`, `at-rule-empty-line-before`, and `selector-disallowed-list` ([#28](https://github.com/kiforks/kifor-stylelint-config/pull/28)).

## [1.0.3] - 2024-04-25

- 🔄 **Updated**: ESLint configuration for better linting compatibility ([#25](https://github.com/kiforks/kifor-stylelint-config/pull/25)).
- ➕ **Added**: Pre-commit validation configuration ([#25](https://github.com/kiforks/kifor-stylelint-config/pull/25)).

## [1.0.2] - 2024-04-17

- 🔄 **Updated**: Prettier configurations to enforce consistent styling ([#24](https://github.com/kiforks/kifor-stylelint-config/pull/24)).

## [1.0.1] - 2024-04-16

- 🔄 **Updated**: Dependencies to latest stable versions ([#23](https://github.com/kiforks/kifor-stylelint-config/pull/23)).
- 🔄 **Updated**: ESLint configuration for improved integration ([#23](https://github.com/kiforks/kifor-stylelint-config/pull/23)).

## [1.0.0] - 2024-04-15

- 🎉 **Initial Release**: Finalized Stylelint configuration with polished rules ([#17](https://github.com/kiforks/kifor-stylelint-config/pull/17)).
- 🐛 **Fixed**: Media query ordering and rule cycles ([#17](https://github.com/kiforks/kifor-stylelint-config/pull/17)).
