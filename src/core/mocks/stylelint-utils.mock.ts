export const stylelintUtilsMock = {
	default: {
		utils: {
			ruleMessages: jest.fn().mockReturnValue('Mocked ruleMessages'),
			validateOptions: jest.fn().mockReturnValue(true),
			report: jest.fn().mockImplementation(() => 'Mocked report'),
		},
	},
};
