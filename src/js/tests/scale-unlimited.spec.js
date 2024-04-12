import stylelint from 'stylelint';

import config from '../../../.stylelintrc.js';
import { getWarning } from './spec-helpers.js';

const lint = stylelint.lint;

describe('scale-unlimited', () => {
	describe('declaration-strict-value', () => {
		const ruleName = 'scale-unlimited/declaration-strict-value';

		describe('invalid', () => {
			it('should report when there is no variable for "color" property', async () => {
				const result = await lint({
					code: `
						p {
						  color: red;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning.text).toBe(`Expected variable or keyword for \"red\" of \"color\" (${ruleName})`);
			});

			it('should report should report when there is no variable for "background-color" property', async () => {
				const result = await lint({
					code: `
						p {
						  background-color: red;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning.text).toBe(`Expected variable or keyword for \"red\" of \"background-color\" (${ruleName})`);
			});

			it('should report should report when there is no variable for "font-family" property', async () => {
				const result = await lint({
					code: `
						p {
						  font-family: Arial, Helvetica, sans-serif;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning.text).toBe(`Expected variable or keyword for \"Arial,\" of \"font-family\" (${ruleName})`);
			});

			it('should report should report when there is no variable for "font-size" property', async () => {
				const result = await lint({
					code: `
						p {
						  font-size: 12px;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning.text).toBe(`Expected variable or keyword for \"12px\" of \"font-size\" (${ruleName})`);
			});

			it('should report should report when there is no variable for "line-height" property', async () => {
				const result = await lint({
					code: `
						p {
						  line-height: 12px;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning.text).toBe(`Expected variable or keyword for \"12px\" of \"line-height\" (${ruleName})`);
			});

			it('should report should report when there is no variable for "stroke" property', async () => {
				const result = await lint({
					code: `
						p {
						  stroke: red;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning.text).toBe(`Expected variable or keyword for \"red\" of \"stroke\" (${ruleName})`);
			});

			it('should report should report when there is no variable for "fill" property', async () => {
				const result = await lint({
					code: `
						p {
						  fill: red;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning.text).toBe(`Expected variable or keyword for \"red\" of \"fill\" (${ruleName})`);
			});
		});

		describe('valid', () => {
			it('should not report when ignored value was used for property', async () => {
				const result = await lint({
					code: `
						p {
						  color: rgba(0, 0, 0, 50%);
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning).toBeFalsy();
			});

			it('should not report when ignored value was used for property', async () => {
				const result = await lint({
					code: `
						p {
						  color: inherit;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning).toBeFalsy();
			});

			it('should not report when ignored value was used for property', async () => {
				const result = await lint({
					code: `
						p {
						  color: initial;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning).toBeFalsy();
			});

			it('should not report when ignored value was used for property', async () => {
				const result = await lint({
					code: `
						p {
						  color: none;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning).toBeFalsy();
			});

			it('should not report when ignored value was used for property', async () => {
				const result = await lint({
					code: `
						p {
						  color: transparent;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning).toBeFalsy();
			});

			it('should not report when ignored value was used for property', async () => {
				const result = await lint({
					code: `
						p {
						  line-height: 0;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning).toBeFalsy();
			});

			it('should not report when ignored value was used for property', async () => {
				const result = await lint({
					code: `
						p {
						  line-height: 1;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning).toBeFalsy();
			});

			it('should not report when ignored value was used for property', async () => {
				const result = await lint({
					code: `
						p {
						  background-image: url('some-file.jpg');
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning).toBeFalsy();
			});

			it('should not report when variable was used', async () => {
				const result = await lint({
					code: `
						p {
						  font-size: $some-var;
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning).toBeFalsy();
			});

			it('should not report when variable was used', async () => {
				const result = await lint({
					code: `
						p {
						  font-size: var(--some-var);
						}
					`,
					config,
				});

				const warning = getWarning(result, ruleName);

				expect(warning).toBeFalsy();
			});
		});
	});
});
