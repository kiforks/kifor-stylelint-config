import stylelint from 'stylelint';

import config from '../../../../../../.stylelintrc.js';
import { getWarning } from '../../../../../js/tests/spec-helpers.js';

const lint = stylelint.lint;

describe('PluginNoNesting', () => {
	const ruleName = 'kifor-stylelint/no-nesting';

	it('should report an error for nesting selector', async () => {
		const result = await lint({
			code: `
				.class {
					&::ng-deep {
						h1 {
							margin: 0;
							
							p {
								margin: 0;
								
								h1 {
									margin: 0;
								}
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning.text).toBe(`Nesting of "h1" within "h1" is not allowed. (${ruleName})`);
	});

	it('should report an error for nesting at-rule', async () => {
		const result = await lint({
			code: `
				.class {
					@include media-min(md) { 
						margin: 0;
						
						p {
							margin: 0;
							
							@include media-max(sm) { 
								margin: 0;
								
								@include media-max(lg) { 
									margin: 0;
								}
							}
						}
					}
				}
			`,
			config,
		});

		result.results.forEach(item => {
			item.warnings.forEach((warning, index) => {
				if (warning.rule === ruleName) {
					if (!index)
						expect(warning.text).toBe(
							`Nesting of "@include media-max(sm)" within "@include media-min(md)" is not allowed. (${ruleName})`
						);
					if (index)
						expect(warning.text).toBe(
							`Nesting of "@include media-max(lg)" within "@include media-max(sm)" is not allowed. (${ruleName})`
						);
				}
			});
		});
	});

	it('should not report an error for invalid nesting selector', async () => {
		const result = await lint({
			code: `
				.class {
					&::ng-deep {
						h1 {
							margin: 0;
							
							p {
								margin: 0;
								
								h2 {
									margin: 0;
								}
							}
						}
					}
				}
			`,
			config,
		});

		expect(getWarning(result, ruleName)).toBeFalsy();
	});
});
