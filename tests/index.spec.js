const { lint } = require('stylelint');
const config = require('../.stylelintrc.js');

describe('stylelint', () => {
	/**
	 * @see https://stylelint.io/user-guide/rules/
	 */
	describe('stylelint-config-standart', () => {
		describe('duplicate', () => {
			/** @see https://stylelint.io/user-guide/rules/list/no-descending-specificity */
			describe('no-descending-specificity', () => {
				it('should report an error for selectors with descending specificity', async () => {
					const result = await lint({
						code: `
					        #id .class {}
					        .class {}
					    `,
						config,
					});

					const { warnings } = result.results[0];

					expect(warnings.find(warning => warning.rule === 'no-descending-specificity').text).toContain(
						'Expected selector ".class" to come before selector "#id .class"'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/declaration-block-no-duplicate-properties */
			describe('declaration-block-no-duplicate-properties', () => {
				it('should report an error for duplicate properties in the same declaration block', async () => {
					const result = await lint({
						code: `
							.example {
							  color: red;
							  color: blue;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];

					const duplicatePropertiesWarning = warnings.find(
						warning => warning.rule === 'declaration-block-no-duplicate-properties'
					);

					expect(duplicatePropertiesWarning.text).toContain('Unexpected duplicate "color"');
				});
			});

			/** @see https://stylelint.io/user-guide/rules/declaration-block-no-duplicate-custom-properties */
			describe('declaration-block-no-duplicate-custom-properties', () => {
				it('should report an error for duplicate custom properties', async () => {
					const result = await lint({
						code: `
					        p {
					          --my-color: red;
					          --my-color: blue; /* Make sure there's an empty line before this declaration if required by your config */
					          color: var(--my-color);
					        }
					    `,
						config,
					});

					const { errored, warnings } = result.results[0];

					expect(errored).toBeTruthy();
					expect(warnings).toHaveLength(2);
					expect(warnings[0].text).toContain(
						'Unexpected duplicate "--my-color" (declaration-block-no-duplicate-custom-properties)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/font-family-no-duplicate-names */
			describe('font-family-no-duplicate-names', () => {
				it('should report an error for duplicate font family names', async () => {
					const result = await lint({
						code: `
							.example {
							  font-family: Helvetica, Arial, Helvetica;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];

					const duplicateFontFamilyWarning = warnings.find(
						warning => warning.rule === 'font-family-no-duplicate-names'
					);

					expect(duplicateFontFamilyWarning).toBeDefined();
					expect(duplicateFontFamilyWarning.text).toContain(
						'Unexpected duplicate name Helvetica (font-family-no-duplicate-names)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/keyframe-block-no-duplicate-selectors */
			describe('keyframe-block-no-duplicate-selectors', () => {
				it('should report an error for duplicate selectors within keyframes', async () => {
					const result = await lint({
						code: `
							@keyframes slidein {
								from {
								  transform: translateX(0%);
								}
								from {
								  transform: translateX(100%);
								}
								to {
								  transform: translateX(100%);
								}
							}
						`,
						config,
					});

					const { warnings } = result.results[0];

					const duplicateKeyframeSelectorWarning = warnings.find(
						warning => warning.rule === 'keyframe-block-no-duplicate-selectors'
					);

					expect(duplicateKeyframeSelectorWarning.text).toContain(
						'Unexpected duplicate "from" (keyframe-block-no-duplicate-selectors)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/no-duplicate-at-import-rules */
			describe('no-duplicate-at-import-rules', () => {
				it('should report an error for duplicate @import rules', async () => {
					const result = await lint({
						code: `
							@import 'a.css';
							@import 'b.css';
							@import 'a.css';
						`,
						config,
					});

					const { warnings } = result.results[0];

					const duplicateAtImportRuleWarning = warnings.find(
						warning => warning.rule === 'no-duplicate-at-import-rules'
					);

					expect(duplicateAtImportRuleWarning.text).toContain(
						'Unexpected duplicate @import rule a.css (no-duplicate-at-import-rules)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/no-duplicate-selectors */
			describe('no-duplicate-selectors', () => {
				it('should report an error for duplicate selectors', async () => {
					const result = await lint({
						code: `
							.example { color: blue; }
							.example { color: red; }
						`,
						config,
					});

					const { warnings } = result.results[0];

					const duplicateSelectorsWarning = warnings.find(warning => warning.rule === 'no-duplicate-selectors');

					expect(duplicateSelectorsWarning.text).toContain(
						'Unexpected duplicate selector ".example", first used at line 2 (no-duplicate-selectors)'
					);
				});
			});
		});

		describe('empty', () => {
			/** @see https://stylelint.io/user-guide/rules/list/block-no-empty */
			describe('block-no-empty', () => {
				it('should report an error for empty blocks', async () => {
					const result = await lint({
						code: `
							.example {}
						`,
						config,
					});

					const { warnings } = result.results[0];

					const emptyBlockWarning = warnings.find(warning => warning.rule === 'block-no-empty');

					expect(emptyBlockWarning.text).toContain('Unexpected empty block (block-no-empty)');
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/comment-no-empty */
			describe('comment-no-empty', () => {
				it('should report an error for empty comments', async () => {
					const result = await lint({
						code: `
							/* */
						`,
						config,
					});

					const { warnings } = result.results[0];

					const emptyCommentWarning = warnings.find(warning => warning.rule === 'comment-no-empty');

					expect(emptyCommentWarning.text).toContain('Unexpected empty comment (comment-no-empty)');
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/no-empty-source */
			describe('no-empty-source', () => {
				it('should report an error for empty sources', async () => {
					const result = await lint({
						code: '',
						config,
					});

					const { warnings } = result.results[0];

					const emptySourceWarning = warnings.find(warning => warning.rule === 'no-empty-source');

					expect(emptySourceWarning.text).toContain('Unexpected empty source (no-empty-source)');
				});
			});
		});

		describe('invalid', () => {
			/** @see https://stylelint.io/user-guide/rules/list/color-no-invalid-hex */
			describe('color-no-invalid-hex', () => {
				it('should report an error for invalid hex colors', async () => {
					const result = await lint({
						code: `
							.example {
								color: #00zz00;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];

					const invalidHexColorWarning = warnings.find(warning => warning.rule === 'color-no-invalid-hex');

					expect(invalidHexColorWarning.text).toContain(
						'Unexpected invalid hex color "#00zz00" (color-no-invalid-hex)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/function-calc-no-unspaced-operator */
			describe('function-calc-no-unspaced-operator', () => {
				it('should report an error for unspaced operators in calc functions', async () => {
					const result = await lint({
						code: `
							.example {
								width: calc(100% -20px);
							}
						`,
						config,
					});

					const { warnings } = result.results[0];

					const unspacedOperatorWarning = warnings.find(
						warning => warning.rule === 'function-calc-no-unspaced-operator'
					);

					expect(unspacedOperatorWarning.text).toContain(
						'Expected an operator before sign "-" (function-calc-no-unspaced-operator)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/keyframe-declaration-no-important */
			describe('keyframe-declaration-no-important', () => {
				it('should report an error for !important in keyframe declarations', async () => {
					const result = await lint({
						code: `
							@keyframes important-animation {
								from { margin-top: 10px !important; }
								to { margin-top: 20px; }
							}
						`,
						config,
					});

					const { warnings } = result.results[0];

					const importantInKeyframeWarning = warnings.find(
						warning => warning.rule === 'keyframe-declaration-no-important'
					);

					expect(importantInKeyframeWarning.text).toContain(
						'Unexpected !important (keyframe-declaration-no-important)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/media-feature-name-no-unknown */
			describe('media-feature-name-no-unknown', () => {
				it('should report an error for unknown media feature names', async () => {
					const result = await lint({
						code: `
							@media screen and (unknown-feature: 10px) {
								.example { display: none; }
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const unknownMediaFeatureNameWarning = warnings.find(
						warning => warning.rule === 'media-feature-name-no-unknown'
					);

					expect(unknownMediaFeatureNameWarning.text).toContain(
						'Unexpected unknown media feature name "unknown-feature" (media-feature-name-no-unknown)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/named-grid-areas-no-invalid */
			describe('named-grid-areas-no-invalid', () => {
				it('should report an error for invalid named grid areas', async () => {
					const result = await lint({
						code: `
							.container {
								display: grid;
								grid-template-areas: "header header header" "main . ";
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const invalidNamedGridAreasWarning = warnings.find(warning => warning.rule === 'named-grid-areas-no-invalid');

					expect(invalidNamedGridAreasWarning.text).toContain(
						'Expected same number of cell tokens in each string (named-grid-areas-no-invalid)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/no-invalid-position-at-import-rule */
			describe('no-invalid-position-at-import-rule', () => {
				it('should report an error for @import rules that are not at the start of the document', async () => {
					const result = await lint({
						code: `
							.example { color: pink; }
							@import 'invalid.css';
						`,
						config,
					});

					const { warnings } = result.results[0];
					const invalidAtImportPositionWarning = warnings.find(
						warning => warning.rule === 'no-invalid-position-at-import-rule'
					);

					expect(invalidAtImportPositionWarning.text).toContain(
						'Unexpected invalid position @import rule (no-invalid-position-at-import-rule)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/string-no-newline */
			describe('string-no-newline', () => {
				it('should report an error for strings that contain newlines', async () => {
					const result = await lint({
						code: `
							a {
								сontent: "first
								second";
							}
				        `,
						config,
					});

					const { warnings } = result.results[0];
					const stringNoNewlineWarning = warnings.find(warning => warning.rule === 'string-no-newline');

					expect(stringNoNewlineWarning.text).toContain('Unexpected newline in string (string-no-newline)');
				});
			});
		});
	});
});
