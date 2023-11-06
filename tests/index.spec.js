const { lint } = require('stylelint');
const config = require('../.stylelintrc.js');

it('should report an error for CSS properties not allowed by the config', async () => {
	const result = await lint({
		code: `
			p {
				margin: 0;
				bottom: 0;
				padding: 0;
			}
		`,
		config,
	});

	const { errored, warnings } = result.results[0];

	expect(errored).toBeTruthy();
	expect(warnings[0].text).toEqual('Expected "bottom" to come before "margin" (order/properties-order)');
});
