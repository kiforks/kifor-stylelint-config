export const stylelintMock = <T = unknown>(
	plugin?: T
): {
	default: {
		createPlugin: () => Nullable<T>;
		utils: {
			report: jest.Mock<any, any, any>;
			ruleMessages: jest.Mock<any, any, any>;
			validateOptions: jest.Mock<any, any, any>;
		};
	};
} => ({
	default: {
		createPlugin: () => plugin,
		utils: {
			ruleMessages: jest.fn().mockReturnValue('Mocked ruleMessages'),
			validateOptions: jest.fn().mockReturnValue(true),
			report: jest.fn().mockImplementation(() => 'Mocked report'),
		},
	},
});
