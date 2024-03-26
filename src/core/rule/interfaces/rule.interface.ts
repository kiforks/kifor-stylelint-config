export interface RuleAt<P extends RuleRegExp = RuleRegExp> {
	hasBlock?: boolean;
	name: RuleRegExp;
	parameter?: P;
	type: 'at-rule';
}

export interface Rule {
	name?: string;
	selector: RuleRegExp;
	type: 'rule';
}
