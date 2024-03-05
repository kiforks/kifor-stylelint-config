import stylelint from 'stylelint';

import config from '../../../../../../.stylelintrc.js';
import { getWarning } from '../../../../../js/tests/spec-helpers.js';

const lint = stylelint.lint;

/** @see https://stylelint.io/user-guide/rules/max-nesting-depth */
describe('PluginMaxNestingDepth', () => {
	const NAMESPACE = 'kifor-stylelint';
	const ruleName = `${NAMESPACE}/max-nesting-depth`;

	it('should report an error for nesting depth more than 3', async () => {
		const result = await lint({
			code: `
				.parent {
					.child-1 {
						.child-2 {
							.child-3 {
								.child-4 {
									color: red;
								}
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning.text).toBe(`Expected nesting depth to be no more than 3 (${ruleName})`);
	});

	it('should not report an error for nesting depth less than 3', async () => {
		const result = await lint({
			code: `
				.parent {
					.child-1 {
						.child-2 {
							.child-3 {
								color: red;
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning).toBeNull();
	});

	it('should not report an error for nesting depth more than 3 with "@include"', async () => {
		const result = await lint({
			code: `
				.parent {
					.child-1 {
						.child-2 {
							.child-3 {
								@include mixin {
									color: red;
								}
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning).toBeNull();
	});

	it('should not report an error for nesting depth more than 3 with "@media"', async () => {
		const result = await lint({
			code: `
				.parent {
					.child-1 {
						.child-2 {
							.child-3 {
								@media mixin {
									color: red;
								}
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning).toBeNull();
	});

	it('should not report an error for nesting depth more than 3 with pseudo-element "&::"', async () => {
		const result = await lint({
			code: `
				.parent {
					.child-1 {
						.child-2 {
							.child-3 {
								&::before {
									color: red;
								}
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning).toBeNull();
	});

	it('should not report an error for nesting depth more than 3 with pseudo-element "::"', async () => {
		const result = await lint({
			code: `
				.parent {
					.child-1 {
						.child-2 {
							.child-3 {
								::before {
									color: red;
								}
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning).toBeNull();
	});

	it('should not report an error for blockless at-rules when ignoring blockless-at-rules', async () => {
		const result = await lint({
			code: `
				.parent {
					.child-1 {
						.child-2 {
							.child-3 {
								@media (min-width: 500px) {
									color: red;
								}
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning).toBeNull();
	});

	it('should not report an error for pseudo-classes when ignoring pseudo-classes', async () => {
		const result = await lint({
			code: `
				.parent {
					.child-1 {
						.child-2 {
							.child-3 {
								&:hover {
									color: red;
								}
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning).toBeNull();
	});

	it('should not report an error for host when ignoring host selector', async () => {
		const result = await lint({
			code: `
				:host {
					.child-1 {
						.child-2 {
							.child-3 {
								.child-4 {
									color: red;
								}
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning).toBeNull();
	});

	it('should report an error for host when ignoring host selector', async () => {
		const result = await lint({
			code: `
				:host {
					.child-1 {
						.child-2 {
							.child-3 {
								.child-4 {
									.child-5 {
										color: red;
									}
								}
							}
						}
					}
				}
			`,
			config,
		});

		const warning = getWarning(result, ruleName);

		expect(warning.text).toBe(`Expected nesting depth to be no more than 3 (${ruleName})`);
	});
});
