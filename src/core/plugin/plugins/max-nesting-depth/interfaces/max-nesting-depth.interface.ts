export interface MaxNestingDepthOptions {
	ignore?: string[];
	ignoreAtRules?: Array<(value: unknown) => value is RegExp>;
	ignorePseudoClasses?: Array<(value: unknown) => value is RegExp>;
	ignoreRules?: Array<(value: unknown) => value is RegExp>;
}
