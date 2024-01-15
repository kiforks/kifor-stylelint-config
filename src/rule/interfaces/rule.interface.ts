export type RuleString = string | RegExp;

export interface RuleAt<P extends RuleString = RuleString> {
	hasBlock?: boolean;
	name?: RuleString;
	parameter?: P;
	type: 'at-rule';
}

export interface Rule {
	name?: string;
	selector?: RuleString;
	type: 'rule';
}
