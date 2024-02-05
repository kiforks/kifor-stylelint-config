import stylelint from 'stylelint';

import config from './.stylelintrc.js';

const lint = stylelint.lint;

describe('stylelint', () => {
	/** @see https://stylelint.io/user-guide/rules/ */
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

		describe('missing', () => {
			describe('font-family-no-missing-generic-family-keyword', () => {
				/** @see https://stylelint.io/user-guide/rules/list/font-family-no-missing-generic-family-keyword */
				it('should report an error for font-family without a generic family keyword', async () => {
					const result = await lint({
						code: `
							.example {
							font-family: 'Helvetica';
							}
				        `,
						config,
					});

					const { warnings } = result.results[0];
					const missingGenericFamilyKeywordWarning = warnings.find(
						warning => warning.rule === 'font-family-no-missing-generic-family-keyword'
					);

					expect(missingGenericFamilyKeywordWarning.text).toContain(
						'Unexpected missing generic font family (font-family-no-missing-generic-family-keyword)'
					);
				});
			});
		});

		describe('non-standard', () => {
			/** @see https://stylelint.io/user-guide/rules/list/function-linear-gradient-no-nonstandard-direction */
			describe('function-linear-gradient-no-nonstandard-direction', () => {
				it('should report an error for linear-gradient with non-standard direction syntax', async () => {
					const result = await lint({
						code: `
							.example {
								background-image: linear-gradient(45, blue, red);
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const nonStandardDirectionWarning = warnings.find(
						warning => warning.rule === 'function-linear-gradient-no-nonstandard-direction'
					);

					expect(nonStandardDirectionWarning.text).toContain(
						'Unexpected nonstandard direction (function-linear-gradient-no-nonstandard-direction)'
					);
				});
			});
		});

		describe('overrides', () => {
			/** @see https://stylelint.io/user-guide/rules/list/declaration-block-no-shorthand-property-overrides */
			describe('declaration-block-no-shorthand-property-overrides', () => {
				it('should report an error for shorthand properties that override related longhand properties', async () => {
					const result = await lint({
						code: `
							.example {
								padding-left: 10px;
								padding: 20px;
							}
				        `,
						config,
					});

					const { warnings } = result.results[0];
					const shorthandPropertyOverrideWarning = warnings.find(
						warning => warning.rule === 'declaration-block-no-shorthand-property-overrides'
					);

					expect(shorthandPropertyOverrideWarning.text).toContain(
						'Unexpected shorthand "padding" after "padding-left" (declaration-block-no-shorthand-property-overrides)'
					);
				});
			});
		});

		describe('unmatchable', () => {
			/** @see https://stylelint.io/user-guide/rules/list/selector-anb-no-unmatchable */
			describe('selector-anb-no-unmatchable', () => {
				it('should report an error for :nth-child or :nth-last-child selectors with an+b values that are unmatchable', async () => {
					const result = await lint({
						code: `
							a:nth-of-type(0n+0) {}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const unmatchableSelectorWarning = warnings.find(warning => warning.rule === 'selector-anb-no-unmatchable');

					expect(unmatchableSelectorWarning.text).toContain(
						'Unexpected unmatchable An+B selector ":nth-of-type" (selector-anb-no-unmatchable'
					);
				});
			});
		});

		describe('unknown', () => {
			/** @see https://stylelint.io/user-guide/rules/list/at-rule-no-unknown */
			describe('at-rule-no-unknown', () => {
				it('should report an error for unknown at-rules', async () => {
					const result = await lint({
						code: `
							@unknown {
							.example { display: block; }
							}
				        `,
						config,
					});

					const { warnings } = result.results[0];
					const unknownAtRuleWarning = warnings.find(warning => warning.rule === 'at-rule-no-unknown');

					expect(unknownAtRuleWarning.text).toContain('Unexpected unknown at-rule "@unknown" (at-rule-no-unknown)');
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/annotation-no-unknown */
			describe('annotation-no-unknown', () => {
				it('should report an error for unknown annotations', async () => {
					const result = await lint({
						code: `
							a {
								color: green !imprtant;
							}
				        `,
						config,
					});

					const { warnings } = result.results[0];
					const unknownAnnotationWarning = warnings.find(warning => warning.rule === 'annotation-no-unknown');

					expect(unknownAnnotationWarning.text).toContain(
						'Unexpected unknown annotation "!imprtant" (annotation-no-unknown)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/function-no-unknown */
			describe('function-no-unknown', () => {
				it('should report an error for unknown functions', async () => {
					const result = await lint({
						code: `
							.example {
							color: unknownFunction(blue);
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const unknownFunctionWarning = warnings.find(warning => warning.rule === 'function-no-unknown');

					expect(unknownFunctionWarning.text).toContain(
						'Unexpected unknown function "unknownFunction" (function-no-unknown)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/media-feature-name-no-unknown */
			describe('media-feature-name-no-unknown', () => {
				it('should report an error for unknown media feature names', async () => {
					const result = await lint({
						code: `
							@media screen and (unknown-feature: 1024px) {
								.example { display: block; }
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

			/** @see https://stylelint.io/user-guide/rules/list/property-no-unknown */
			describe('property-no-unknown', () => {
				it('should report an error for unknown properties', async () => {
					const result = await lint({
						code: `
							.example {
								unknown-property: 1px;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const unknownPropertyWarning = warnings.find(warning => warning.rule === 'property-no-unknown');

					expect(unknownPropertyWarning.text).toContain(
						'Unexpected unknown property "unknown-property" (property-no-unknown)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/selector-pseudo-class-no-unknown */
			describe('selector-pseudo-class-no-unknown', () => {
				it('should report an error for unknown pseudo-class selectors', async () => {
					const result = await lint({
						code: `
							.example:unknown-pseudo-class {
								display: block;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const unknownPseudoClassSelectorWarning = warnings.find(
						warning => warning.rule === 'selector-pseudo-class-no-unknown'
					);

					expect(unknownPseudoClassSelectorWarning.text).toContain(
						'Unexpected unknown pseudo-class selector ":unknown-pseudo-class" (selector-pseudo-class-no-unknown)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/selector-pseudo-element-no-unknown */
			describe('selector-pseudo-element-no-unknown', () => {
				it('should report an error for unknown pseudo-element selectors', async () => {
					const result = await lint({
						code: `
							.example::unknown-pseudo-element {
								display: block;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const unknownPseudoElementSelectorWarning = warnings.find(
						warning => warning.rule === 'selector-pseudo-element-no-unknown'
					);

					expect(unknownPseudoElementSelectorWarning.text).toContain(
						'Unexpected unknown pseudo-element selector "::unknown-pseudo-element" (selector-pseudo-element-no-unknown)'
					);
				});

				it('should not report an error for "ng-deep" pseudo-element', async () => {
					const result = await lint({
						code: `
							.example::ng-deep {
								display: block;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const unknownPseudoElementSelectorWarning = warnings.find(
						warning => warning.rule === 'selector-pseudo-element-no-unknown'
					);

					expect(unknownPseudoElementSelectorWarning).toBeFalsy();
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/selector-type-no-unknown */
			describe('selector-type-no-unknown', () => {
				it('should report an error for unknown type selectors', async () => {
					const result = await lint({
						code: `
							unknownelement {
								display: block;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const unknownTypeSelectorWarning = warnings.find(warning => warning.rule === 'selector-type-no-unknown');

					expect(unknownTypeSelectorWarning.text).toContain(
						'Unexpected unknown type selector "unknownelement" (selector-type-no-unknown)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/list/unit-no-unknown */
			describe('unit-no-unknown', () => {
				it('should report an error for unknown units', async () => {
					const result = await lint({
						code: `
							.example {
								width: 100unknowns;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const unknownUnitWarning = warnings.find(warning => warning.rule === 'unit-no-unknown');

					expect(unknownUnitWarning.text).toContain('Unexpected unknown unit "unknowns" (unit-no-unknown)');
				});
			});
		});

		describe('allowed, disallowed & required', () => {
			describe('at-rule', () => {
				/** @see https://stylelint.io/user-guide/rules/list/at-rule-no-vendor-prefix */
				describe('at-rule-no-vendor-prefix', () => {
					it('should report an error for vendor prefixes in at-rules', async () => {
						const result = await lint({
							code: `
								@-webkit-keyframes slidein {
									from { top: 0; }
									to { top: 100px; }
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const atRuleNoVendorPrefixWarning = warnings.find(warning => warning.rule === 'at-rule-no-vendor-prefix');

						expect(atRuleNoVendorPrefixWarning.text).toContain(
							'Unexpected vendor-prefixed at-rule "@-webkit-keyframes" (at-rule-no-vendor-prefix)'
						);
					});
				});
			});

			describe('length', () => {
				/** @see https://stylelint.io/user-guide/rules/list/length-zero-no-unit */
				describe('length-zero-no-unit', () => {
					it('should report an error for zero lengths with units', async () => {
						const result = await lint({
							code: `
								.example {
									margin: 0px;
									padding: 0em;
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const lengthZeroNoUnitWarning = warnings.find(warning => warning.rule === 'length-zero-no-unit');

						expect(lengthZeroNoUnitWarning.text).toContain('Unexpected unit (length-zero-no-unit)');
					});
				});
			});

			describe('media feature', () => {
				/** @see https://stylelint.io/user-guide/rules/list/media-feature-name-no-vendor-prefix */
				describe('media-feature-name-no-vendor-prefix', () => {
					it('should report an error for vendor prefixes in media feature names', async () => {
						const result = await lint({
							code: `
							@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
								.example { color: black; }
							}
						`,
							config,
						});

						const { warnings } = result.results[0];
						const mediaFeatureNameNoVendorPrefixWarning = warnings.find(
							warning => warning.rule === 'media-feature-name-no-vendor-prefix'
						);

						expect(mediaFeatureNameNoVendorPrefixWarning.text).toContain(
							'Unexpected vendor-prefix (media-feature-name-no-vendor-prefix)'
						);
					});
				});
			});

			describe('property', () => {
				/** @see https://stylelint.io/user-guide/rules/list/property-no-vendor-prefix */
				describe('property-no-vendor-prefix', () => {
					it('should report an error for vendor prefixes in property names', async () => {
						const result = await lint({
							code: `
								.example {
									-webkit-transition: all 4s ease;
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const propertyNoVendorPrefixWarning = warnings.find(
							warning => warning.rule === 'property-no-vendor-prefix'
						);

						expect(propertyNoVendorPrefixWarning.text).toContain(
							'Unexpected vendor-prefix "-webkit-transition" (property-no-vendor-prefix)'
						);
					});
				});
			});

			describe('selector', () => {
				/** @see https://stylelint.io/user-guide/rules/list/selector-no-vendor-prefix */
				describe('selector-no-vendor-prefix', () => {
					it('should report an error for vendor prefixes in selector names', async () => {
						const result = await lint({
							code: `
								::-webkit-input-placeholder {
									color: grey;
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const selectorNoVendorPrefixWarning = warnings.find(
							warning => warning.rule === 'selector-no-vendor-prefix'
						);

						expect(selectorNoVendorPrefixWarning.text).toContain(
							'Unexpected vendor-prefix "::-webkit-input-placeholder" (selector-no-vendor-prefix)'
						);
					});
				});
			});

			describe('value', () => {
				/** @see https://stylelint.io/user-guide/rules/list/value-no-vendor-prefix */
				describe('value-no-vendor-prefix', () => {
					it('should report an error for vendor prefixes in values', async () => {
						const result = await lint({
							code: `
								a { max-width: -moz-max-content; }
							`,
							config,
						});

						const { warnings } = result.results[0];
						const valueNoVendorPrefixWarning = warnings.find(warning => warning.rule === 'value-no-vendor-prefix');

						expect(valueNoVendorPrefixWarning.text).toContain(
							'Unexpected vendor-prefix "-moz-max-content" (value-no-vendor-prefix)'
						);
					});
				});
			});

			describe('case', () => {
				/** @see https://stylelint.io/user-guide/rules/list/function-name-case */
				describe('function-name-case', () => {
					it('should report an error for function names that are not in lowercase', async () => {
						const result = await lint({
							code: `
								.example {
									color: RGB(255, 255, 255);
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const functionNameCaseWarning = warnings.find(warning => warning.rule === 'function-name-case');

						expect(functionNameCaseWarning.text).toContain('Expected "RGB" to be "rgb" (function-name-case)');
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/selector-type-case */
				describe('selector-type-case', () => {
					it('should report an error for type selectors that are not in lowercase', async () => {
						const result = await lint({
							code: `
								LI {
									display: block;
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const selectorTypeCaseWarning = warnings.find(warning => warning.rule === 'selector-type-case');

						expect(selectorTypeCaseWarning.text).toContain('Expected "LI" to be "li" (selector-type-case)');
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/value-keyword-case */
				describe('value-keyword-case', () => {
					it('should report an error for keyword values that are not in lowercase', async () => {
						const result = await lint({
							code: `
								.example {
									display: BLOCK;
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const valueKeywordCaseWarning = warnings.find(warning => warning.rule === 'value-keyword-case');

						expect(valueKeywordCaseWarning.text).toContain('Expected "BLOCK" to be "block" (value-keyword-case)');
					});
				});
			});

			describe('empty lines', () => {
				/** @see https://stylelint.io/user-guide/rules/list/at-rule-empty-line-before */
				describe('at-rule-empty-line-before', () => {
					it('should report an error if there is no empty line before at-rules', async () => {
						const result = await lint({
							code: `
								.example { color: pink; }
									@media (max-width: 600px) { .example { color: red; }
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const atRuleEmptyLineBeforeWarning = warnings.find(warning => warning.rule === 'at-rule-empty-line-before');

						expect(atRuleEmptyLineBeforeWarning.text).toContain(
							'Expected empty line before at-rule (at-rule-empty-line-before)'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/comment-empty-line-before */
				describe('comment-empty-line-before', () => {
					it('should report an error if there is no empty line before comments', async () => {
						const result = await lint({
							code: `
								.example { color: pink; }
								/* This is a comment without an empty line before */
								.another-example { color: red; }
							`,
							config,
						});

						const { warnings } = result.results[0];
						const commentEmptyLineBeforeWarning = warnings.find(
							warning => warning.rule === 'comment-empty-line-before'
						);

						expect(commentEmptyLineBeforeWarning.text).toContain(
							'Expected empty line before comment (comment-empty-line-before)'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/custom-property-empty-line-before */
				describe('custom-property-empty-line-before', () => {
					it('should report an error if there is no empty line before custom properties', async () => {
						const result = await lint({
							code: `
								.example {
									color: pink;
									--custom-property: value;
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const customPropertyEmptyLineBeforeWarning = warnings.find(
							warning => warning.rule === 'custom-property-empty-line-before'
						);

						expect(customPropertyEmptyLineBeforeWarning.text).toContain(
							'Expected empty line before custom property (custom-property-empty-line-before)'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/rule-empty-line-before */
				describe('rule-empty-line-before', () => {
					it('should report an error if there is no empty line before rules', async () => {
						const result = await lint({
							code: `
								a {
									p {
										margin: 0;
									}
								}
								b {
									p {
										margin: 0;
									}
								}`,
							config,
						});

						const { warnings } = result.results[0];
						const ruleEmptyLineBeforeWarning = warnings.find(warning => warning.rule === 'rule-empty-line-before');

						expect(ruleEmptyLineBeforeWarning.text).toContain(
							'Expected empty line before rule (rule-empty-line-before)'
						);
					});
				});
			});

			describe('max & min', () => {
				/** @see https://stylelint.io/user-guide/rules/list/declaration-block-single-line-max-declarations */
				describe('declaration-block-single-line-max-declarations', () => {
					it('should report an error if there are too many declarations in a single line', async () => {
						const result = await lint({
							code: `
								.example { color: pink; background: white; border: 1px solid black; }
							`,
							config,
						});

						const { warnings } = result.results[0];
						const singleLineMaxDeclarationsWarning = warnings.find(
							warning => warning.rule === 'declaration-block-single-line-max-declarations'
						);

						expect(singleLineMaxDeclarationsWarning.text).toContain(
							'Expected no more than 1 declaration (declaration-block-single-line-max-declarations)'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/number-max-precision */
				describe('number-max-precision', () => {
					it('should report an error for numbers with too many decimal places', async () => {
						const result = await lint({
							code: `
								a {
									top: 3.245634px;
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const numberMaxPrecisionWarning = warnings.find(warning => warning.rule === 'number-max-precision');

						expect(numberMaxPrecisionWarning.text).toContain(
							'Expected "3.245634" to be "3.2456" (number-max-precision)'
						);
					});
				});
			});

			describe('notation', () => {
				/** @see https://stylelint.io/user-guide/rules/list/alpha-value-notation */
				describe('alpha-value-notation', () => {
					it('should report an error for incorrect alpha values', async () => {
						const result = await lint({
							code: `
								.example {
									background: rgba(255, 0, 0, .5);
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const alphaValueNotationWarning = warnings.find(warning => warning.rule === 'alpha-value-notation');

						expect(alphaValueNotationWarning.text).toContain('Expected ".5" to be "50%" (alpha-value-notation)');
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/color-function-notation */
				describe('color-function-notation', () => {
					it('should report an error for incorrect color function notation', async () => {
						const result = await lint({
							code: `
								a { color: rgba(12 122 231 / 0.2) }
							`,
							config,
						});

						const { warnings } = result.results[0];
						const colorFunctionNotationWarning = warnings.find(warning => warning.rule === 'color-function-notation');

						expect(colorFunctionNotationWarning.text).toContain(
							'Expected legacy color-function notation (color-function-notation)'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/color-hex-length */
				describe('color-hex-length', () => {
					it('should report an error for short hexadecimal color codes', async () => {
						const result = await lint({
							code: `
								.example {
									color: #ffffff;
								}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const colorHexLengthWarning = warnings.find(warning => warning.rule === 'color-hex-length');

						expect(colorHexLengthWarning.text).toContain('Expected "#ffffff" to be "#fff" (color-hex-length)');
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/hue-degree-notation */
				describe('hue-degree-notation', () => {
					it('should report an error for incorrect hue degree notation', async () => {
						const result = await lint({
							code: `
								a { color: hsl(198 28% 50%) }
							`,
							config,
						});

						const { warnings } = result.results[0];
						const hueDegreeNotationWarning = warnings.find(warning => warning.rule === 'hue-degree-notation');

						expect(hueDegreeNotationWarning.text).toContain('Expected "198" to be "198deg" (hue-degree-notation)');
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/keyframe-selector-notation */
				describe('keyframe-selector-notation', () => {
					it('should report an error for incorrect keyframe selector notation', async () => {
						const result = await lint({
							code: `
							@keyframes slidein {
								from {}
								0% {}
							}
						`,
							config,
						});

						const { warnings } = result.results[0];
						const keyframeSelectorNotationWarning = warnings.find(
							warning => warning.rule === 'keyframe-selector-notation'
						);

						expect(keyframeSelectorNotationWarning.text).toContain(
							'Expected "from" to be "0%" (keyframe-selector-notation)'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/media-feature-range-notation */
				describe('media-feature-range-notation', () => {
					it('should report an error for incorrect media feature range notation', async () => {
						const result = await lint({
							code: '@media (min-width: 1px) and (max-width: 2px) {}',
							config,
						});

						const { warnings } = result.results[0];
						const mediaFeatureRangeNotationWarning = warnings.find(
							warning => warning.rule === 'media-feature-range-notation'
						);

						expect(mediaFeatureRangeNotationWarning.text).toContain(
							'Expected "context" media feature range notation (media-feature-range-notation)'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/list/selector-not-notation */
				describe('selector-not-notation', () => {
					it('should report an error for selectors with incorrect notation', async () => {
						const result = await lint({
							code: `
								:not(a, div) {}
							`,
							config,
						});

						const { warnings } = result.results[0];
						const selectorNotationWarning = warnings.find(warning => warning.rule === 'selector-not-notation');

						expect(selectorNotationWarning.text).toContain(
							'Expected simple :not() pseudo-class notation (selector-not-notation)'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/selector-pseudo-element-colon-notation */
				describe('selector-pseudo-element-colon-notation', () => {
					it('should report an error for pseudo-elements with double colons', async () => {
						const result = await lint({
							code: 'a:before { color: pink; }',
							config,
						});

						const { warnings } = result.results[0];

						const pseudoElementColonWarning = warnings.find(
							warning => warning.rule === 'selector-pseudo-element-colon-notation'
						);

						expect(pseudoElementColonWarning.text).toContain(
							'Expected double colon pseudo-element notation (selector-pseudo-element-colon-notation)'
						);
					});
				});
			});

			describe('pattern', () => {
				/** @see https://stylelint.io/user-guide/rules/custom-media-pattern */
				describe('custom-media-pattern', () => {
					it('should report an error for custom media query names that do not match the pattern', async () => {
						const result = await lint({
							code: `
								@custom-media --small-viewport (max-width: 30em);
								@custom-media --LargeViewport (min-width: 60em);
							`,
							config,
						});

						const { warnings } = result.results[0];

						const customMediaPatternWarning = warnings.find(warning => warning.rule === 'custom-media-pattern');

						expect(customMediaPatternWarning.text).toContain(
							'Expected custom media query name "--LargeViewport" to be kebab-case'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/custom-property-pattern */
				describe('custom-property-pattern', () => {
					it('should report an error for custom properties with invalid names', async () => {
						const result = await lint({
							code: ':root { --booBar: 0; }',
							config,
						});

						const { warnings } = result.results[0];

						const customPropertyPatternWarning = warnings.find(warning => warning.rule === 'custom-property-pattern');

						expect(customPropertyPatternWarning.text).toContain(
							'Expected custom property name "--booBar" to be kebab-cas'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/keyframes-name-pattern */
				describe('keyframes-name-pattern', () => {
					it('should report an error for keyframes with invalid names', async () => {
						const result = await lint({
							code: '@keyframes FOO-bar {}',
							config,
						});

						const { warnings } = result.results[0];

						const keyframesNamePatternWarning = warnings.find(warning => warning.rule === 'keyframes-name-pattern');

						expect(keyframesNamePatternWarning.text).toContain('Expected keyframe name "FOO-bar" to be kebab-case');
					});
				});

				/** @see https://stylelint.io/user-guide/rules/selector-class-pattern */
				describe('selector-class-pattern', () => {
					it('should report an error for selectors with invalid class names', async () => {
						const result = await lint({
							code: '.foo-BAR {}',
							config,
						});

						const { warnings } = result.results[0];

						const selectorClassPatternWarning = warnings.find(warning => warning.rule === 'selector-class-pattern');

						expect(selectorClassPatternWarning.text).toContain('Expected class selector ".foo-BAR" to be kebab-case');
					});
				});

				/** @see https://stylelint.io/user-guide/rules/selector-id-pattern */
				describe('selector-id-pattern', () => {
					it('should report an error for selectors with invalid ID names', async () => {
						const result = await lint({
							code: '#foo-BAR {}',
							config,
						});

						const { warnings } = result.results[0];

						const selectorIdPatternWarning = warnings.find(warning => warning.rule === 'selector-id-pattern');

						expect(selectorIdPatternWarning.text).toContain('Expected id selector "#foo-BAR" to be kebab-case');
					});
				});
			});

			describe('quotes', () => {
				/** @see https://stylelint.io/user-guide/rules/font-family-name-quotes */
				describe('font-family-name-quotes', () => {
					it('should report an error for font family names without quotes', async () => {
						const result = await lint({
							code: 'a { font-family: Times New Roman, Times, serif; }',
							config,
						});

						const { warnings } = result.results[0];

						const fontFamilyNameQuotesWarning = warnings.find(warning => warning.rule === 'font-family-name-quotes');

						expect(fontFamilyNameQuotesWarning.text).toContain(
							'Expected quotes around "Times New Roman" (font-family-name-quotes)'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/function-url-quotes */
				describe('function-url-quotes', () => {
					it('should report an error for unquoted URL in a function', async () => {
						const result = await lint({
							code: "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
							config,
						});

						const { warnings } = result.results[0];

						const functionUrlQuotesWarning = warnings.find(warning => warning.rule === 'function-url-quotes');

						expect(functionUrlQuotesWarning.text).toContain(
							'Expected quotes around "url" function argument (function-url-quotes)'
						);
					});
				});

				/** @see https://stylelint.io/user-guide/rules/selector-attribute-quotes */
				describe('selector-attribute-quotes', () => {
					it('should report an error for unquoted attribute value in a selector', async () => {
						const result = await lint({
							code: '[title=flower] {}',
							config,
						});

						const { warnings } = result.results[0];

						const attributeQuotesWarning = warnings.find(warning => warning.rule === 'selector-attribute-quotes');

						expect(attributeQuotesWarning.text).toContain(
							'Expected quotes around "flower" (selector-attribute-quotes)'
						);
					});
				});
			});

			describe('redundant', () => {
				/** @see https://stylelint.io/user-guide/rules/declaration-block-no-redundant-longhand-properties */
				describe('declaration-block-no-redundant-longhand-properties', () => {
					it('should report an error for redundant longhand properties', async () => {
						const result = await lint({
							code: `
								a {
									margin-top: 1px;
									margin-right: 2px;
									margin-bottom: 3px;
									margin-left: 4px;
								}
							`,
							config,
						});

						const { warnings } = result.results[0];

						const redundantLonghandPropertiesWarning = warnings.find(
							warning => warning.rule === 'declaration-block-no-redundant-longhand-properties'
						);

						expect(redundantLonghandPropertiesWarning).toBeFalsy();
					});
				});

				/** @see https://stylelint.io/user-guide/rules/shorthand-property-no-redundant-values */
				describe('shorthand-property-no-redundant-values', () => {
					it('should report an error for shorthand properties with redundant values', async () => {
						const result = await lint({
							code: 'a { margin: 1px 1px; }',
							config,
						});

						const { warnings } = result.results[0];

						const redundantShorthandValuesWarning = warnings.find(
							warning => warning.rule === 'shorthand-property-no-redundant-values'
						);

						expect(redundantShorthandValuesWarning.text).toContain(
							'Expected "1px 1px" to be "1px" (shorthand-property-no-redundant-values)'
						);
					});
				});
			});

			describe('whitespace inside', () => {
				/** @see https://stylelint.io/user-guide/rules/comment-whitespace-inside */
				describe('comment-whitespace-inside', () => {
					it('should report an error for comments with extra whitespace inside', async () => {
						const result = await lint({
							code: '/*comment*/',
							config,
						});

						const { warnings } = result.results[0];

						const commentWhitespaceInsideWarning = warnings.find(
							warning => warning.rule === 'comment-whitespace-inside'
						);

						expect(commentWhitespaceInsideWarning.text).toContain(
							'Expected whitespace after "/*" (comment-whitespace-inside)'
						);
					});
				});
			});
		});
	});

	describe('built-in rules', () => {
		describe('at-rule', () => {
			/** @see https://stylelint.io/user-guide/rules/at-rule-property-required-list/ */
			describe('at-rule-property-required-list', () => {
				it('should report an error for @font-face without font-display', async () => {
					const result = await lint({
						code: `
							@font-face {
							    font-family: 'foo';
							    src: url('./fonts/foo.woff2') format('woff2');
							}
						`,
						config,
					});

					const { warnings } = result.results[0];

					const customMediaPatternWarning = warnings.find(warning => warning.rule === 'at-rule-property-required-list');

					expect(customMediaPatternWarning.text).toContain(
						'Expected property "font-display" for at-rule "font-face" (at-rule-property-required-list'
					);
				});
			});
		});

		describe('color', () => {
			/** @see https://stylelint.io/user-guide/rules/color-no-hex/ */
			describe('color-no-hex', () => {
				it('should report an error for hex color usage', async () => {
					const result = await lint({
						code: `
							a { color: #fff1aa; }
						`,
						config,
					});

					const { warnings } = result.results[0];

					const customMediaPatternWarning = warnings.find(warning => warning.rule === 'color-no-hex');

					expect(customMediaPatternWarning.text).toContain('Unexpected hex color "#fff1aa" (color-no-hex)');
				});
			});
		});

		describe('function', () => {
			/** @see https://stylelint.io/user-guide/rules/function-disallowed-list/ */
			describe('function-disallowed-list', () => {
				it('should report an error for using the rgb function', async () => {
					const result = await lint({
						code: `
							.element {
							    color: rgb(0, 0, 0);
							}
						`,
						config,
					});

					const { warnings } = result.results[0];

					const customMediaPatternWarning = warnings.find(warning => warning.rule === 'function-disallowed-list');

					expect(customMediaPatternWarning.text).toContain('Unexpected function "rgb" (function-disallowed-list)');
				});
			});

			/** @see https://stylelint.io/user-guide/rules/function-url-no-scheme-relative/ */
			describe('function-url-no-scheme-relative', () => {
				it('should report an error for using scheme-relative URLs', async () => {
					const result = await lint({
						code: `
							a {
							  background: url("//www.google.com/file.jpg");
							}
						`,
						config,
					});

					const { warnings } = result.results[0];

					const customMediaPatternWarning = warnings.find(
						warning => warning.rule === 'function-url-no-scheme-relative'
					);

					expect(customMediaPatternWarning.text).toContain(
						'Unexpected scheme-relative url (function-url-no-scheme-relative)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/function-url-scheme-disallowed-list/ */
			describe('function-url-scheme-disallowed-list', () => {
				it('should report an error for URLs with the "ftp" scheme', async () => {
					const result = await lint({
						code: `
							a { background-image: url("ftp://www.example.com/file.jpg"); }
						`,
						config,
					});

					const ftpWarning = result.results[0].warnings.find(
						warning => warning.rule === 'function-url-scheme-disallowed-list'
					);
					expect(ftpWarning.text).toContain('Unexpected URL scheme "ftp:" (function-url-scheme-disallowed-list)');
				});

				it('should report an error for URLs with the "http" scheme', async () => {
					const result = await lint({
						code: 'a { background-image: url("http://www.example.com/file.jpg"); }',
						config,
					});

					const httpWarning = result.results[0].warnings.find(
						warning => warning.rule === 'function-url-scheme-disallowed-list'
					);
					expect(httpWarning.text).toContain('Unexpected URL scheme "http:" (function-url-scheme-disallowed-list)');
				});

				it('should report an error for URLs with the "https" scheme', async () => {
					const result = await lint({
						code: 'a { background-image: url("https://www.example.com/file.jpg"); }',
						config,
					});

					const httpsWarning = result.results[0].warnings.find(
						warning => warning.rule === 'function-url-scheme-disallowed-list'
					);
					expect(httpsWarning.text).toContain('Unexpected URL scheme "https:" (function-url-scheme-disallowed-list)');
				});
			});
		});

		describe('rule', () => {
			/** @see https://stylelint.io/user-guide/rules/rule-selector-property-disallowed-list */
			describe('rule-selector-property-disallowed-list', () => {
				it('should report an error for using the font size for the ".ri-" class', async () => {
					const result = await lint({
						code: `
							.ri-icon {
							    font-size: 12px;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'rule-selector-property-disallowed-list');

					expect(warning.text).toContain(
						'Unexpected property "font-size" for selector ".ri-icon" (rule-selector-property-disallowed-list)'
					);
				});

				it('should report an error for using the font size for the "[class*=\'ri-\']" selector', async () => {
					const result = await lint({
						code: `
							[class*='ri-'] {
							    font-size: 12px;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'rule-selector-property-disallowed-list');

					expect(warning.text).toContain(
						'Unexpected property "font-size" for selector "[class*=\'ri-\']" (rule-selector-property-disallowed-list)'
					);
				});

				it('should report an error for using the font size for the "i" tag', async () => {
					const result = await lint({
						code: `
							i {
							    font-size: 12px;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'rule-selector-property-disallowed-list');

					expect(warning.text).toContain(
						'Unexpected property "font-size" for selector "i" (rule-selector-property-disallowed-list)'
					);
				});
			});
		});

		describe('selector', () => {
			/** @see https://stylelint.io/user-guide/rules/selector-disallowed-list */
			describe('selector-disallowed-list', () => {
				it('should report an error for using the ".container" class', async () => {
					const result = await lint({
						code: `
							.container {
							    color: red;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-disallowed-list');

					expect(warning.text).toContain('Unexpected selector ".container" (selector-disallowed-list)');
				});

				it('should report an error for using the "i" tag', async () => {
					const result = await lint({
						code: `
							i {
							    color: red;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-disallowed-list');

					expect(warning.text).toContain('Unexpected selector "i" (selector-disallowed-list)');
				});

				it('should report an error for using the ".g-col" class', async () => {
					const result = await lint({
						code: `
							.g-col-24 {
							    color: red;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-disallowed-list');

					expect(warning.text).toContain('Unexpected selector ".g-col-24" (selector-disallowed-list)');
				});

				it('should report an error for using the ".col" class', async () => {
					const result = await lint({
						code: `
							.col-24 {
							    color: red;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-disallowed-list');

					expect(warning.text).toContain('Unexpected selector ".col-24" (selector-disallowed-list)');
				});

				it('should report an error for using the ".grid" class', async () => {
					const result = await lint({
						code: `
							.grid {
							    color: red;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-disallowed-list');

					expect(warning.text).toContain('Unexpected selector ".grid" (selector-disallowed-list)');
				});

				it('should report an error for using the "[data-test]" attribute', async () => {
					const result = await lint({
						code: `
							[data-test="test"]{
							    color: red;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-disallowed-list');

					expect(warning.text).toContain('Unexpected selector "[data-test="test"]" (selector-disallowed-list)');
				});

				it('should report an error for using the "[data-po]" attribute', async () => {
					const result = await lint({
						code: `
							[data-po="test"]{
							    color: red;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-disallowed-list');

					expect(warning.text).toContain('Unexpected selector "[data-po="test"]" (selector-disallowed-list)');
				});
			});

			/** @see https://stylelint.io/user-guide/rules/selector-no-qualifying-type */
			describe('selector-no-qualifying-type', () => {
				it('should report an error for using the "input.button" type and class combination', async () => {
					const result = await lint({
						code: `
							input.button {
								color: blue;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-no-qualifying-type');

					expect(warning.text).toContain(
						'Unexpected qualifying type selector "input.button" (selector-no-qualifying-type)'
					);
				});

				it('should report an error for using the "ul.list" type and class combination', async () => {
					const result = await lint({
						code: `
							input[type='button'] {
								margin: 0
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-no-qualifying-type');

					expect(warning.text).toContain(
						'Unexpected qualifying type selector "input[type=\'button\']" (selector-no-qualifying-type)'
					);
				});
			});
		});

		describe('unknown', () => {
			/** @see https://stylelint.io/user-guide/rules/at-rule-no-unknown */
			describe('at-rule-no-unknown', () => {
				it('should report an error for unknown at-rule', async () => {
					const result = await lint({
						code: `
							@some-mixin {
							    color: red;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'at-rule-no-unknown');

					expect(warning.text).toContain('Unexpected unknown at-rule "@some-mixin" (at-rule-no-unknown)');
				});
			});

			/** @see https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown */
			describe('declaration-property-value-no-unknown', () => {
				it('should report an error for unknown at-rule', async () => {
					const result = await lint({
						code: `
							a { top: red; }
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'declaration-property-value-no-unknown');

					expect(warning.text).toContain(
						'Unexpected unknown value "red" for property "top" (declaration-property-value-no-unknown)'
					);
				});
			});
		});

		describe('max & min', () => {
			/** @see https://stylelint.io/user-guide/rules/max-nesting-depth*/
			describe('max-nesting-depth', () => {
				xit('should report an error for nesting depth more than 3', async () => {
					const result = await lint({
						code: `
							.a-parent {
								.a-1 {
									.a-2 {
										.a-3 {
											.a-4 {
												color: red;
											}
										}
									}
								}
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'max-nesting-depth');

					expect(warning.text).toContain('Expected nesting depth to be no more than 3');
				});

				it('should not report an error for nesting depth 3', async () => {
					const result = await lint({
						code: `
							.a-parent {
								.a-1 {
									.a-2 {
										.a-3 {
												color: red;
										}
									}
								}
							}
						`,
						config, // Assuming config is already defined in the scope
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'max-nesting-depth');

					expect(warning).toBeFalsy();
				});

				it('should not report an error for nesting depth more than 3 with "@include"', async () => {
					const result = await lint({
						code: `
							.a-parent {
								.a-1 {
									.a-2 {
										.a-3 {
											@include mixin {
												color: red;
											}
										}
									}
								}
							}
						`,
						config, // Assuming config is already defined in the scope
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'max-nesting-depth');

					expect(warning).toBeFalsy();
				});

				it('should not report an error for nesting depth more than 3 with "@media"', async () => {
					const result = await lint({
						code: `
							.a-parent {
								.a-1 {
									.a-2 {
										.a-3 {
											@media (min-width: 768px) {
												color: red;
											}
										}
									}
								}
							}
						`,
						config, // Assuming config is already defined in the scope
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'max-nesting-depth');

					expect(warning).toBeFalsy();
				});

				it('should not report an error for nesting depth more than 3 with pseudoclass', async () => {
					const result = await lint({
						code: `
							.a-parent {
								.a-1 {
									.a-2 {
										.a-3 {
											&:hover {
												color: red;
											}
										}
									}
								}
							}
						`,
						config, // Assuming config is already defined in the scope
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'max-nesting-depth');

					expect(warning).toBeFalsy();
				});

				it('should not report an error for nesting depth more than 3 with pseudoelement', async () => {
					const result = await lint({
						code: `
							.a-parent {
								.a-1 {
									.a-2 {
										.a-3 {
											::before {
												color: red;
											}
										}
									}
								}
							}
						`,
						config, // Assuming config is already defined in the scope
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'max-nesting-depth');

					expect(warning).toBeFalsy();
				});

				it('should not report an error for nesting depth more than 3 with "&" pseudoelement', async () => {
					const result = await lint({
						code: `
							.a-parent {
								.a-1 {
									.a-2 {
										.a-3 {
											&::before {
												color: red;
											}
										}
									}
								}
							}
						`,
						config, // Assuming config is already defined in the scope
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'max-nesting-depth');

					expect(warning).toBeFalsy();
				});
			});

			/** @see https://stylelint.io/user-guide/rules/max-nesting-depth*/
			describe('selector-max-attribute', () => {
				it('should report an error when more than 1 attribute selectors are used', async () => {
					const result = await lint({
						code: `
							[type="text"][name="message"] {
								color: red;
							}
						`,
						config, // Assuming config is already defined in the scope
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-max-attribute');

					expect(warning.text).toContain(
						'Expected "[type="text"][name="message"]" to have no more than 1 attribute selector (selector-max-attribute)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/max-nesting-id*/
			describe('selector-max-id', () => {
				it('should report an error when more than 1 attribute selectors are used', async () => {
					const result = await lint({
						code: `
							#selector {
								#selector-2 {
									color: red;
								}
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'selector-max-id');

					expect(warning.text).toContain(
						'Expected "#selector #selector-2" to have no more than 1 ID selector (selector-max-id)'
					);
				});
			});

			/** @see https://stylelint.io/user-guide/rules/time-min-milliseconds*/
			describe('time-min-milliseconds', () => {
				it('should report an error when more than 1 attribute selectors are used', async () => {
					const result = await lint({
						code: `
							#selector {
								animation: 49ms;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'time-min-milliseconds');

					expect(warning.text).toContain('Expected a minimum of 50 milliseconds (time-min-milliseconds)');
				});
			});
		});

		describe('notation', () => {
			/** @see https://stylelint.io/user-guide/rules/font-weight-notation*/
			describe('font-weight-notation', () => {
				it('should report an error when more than 1 attribute selectors are used', async () => {
					const result = await lint({
						code: `
							#selector {
								font-weight: bold;
							}
						`,
						config,
					});

					const { warnings } = result.results[0];
					const warning = warnings.find(warning => warning.rule === 'font-weight-notation');

					expect(warning.text).toContain('Expected "bold" to be "700" (font-weight-notation)');
				});
			});
		});
	});
});
