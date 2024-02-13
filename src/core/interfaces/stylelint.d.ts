declare module 'stylelint/lib/utils/hasBlock.mjs' {
	import { Container } from 'postcss';
	export default function hasBlock(statement: Container): boolean;
}

declare module 'stylelint/lib/utils/isStandardSyntaxRule.mjs' {
	import { Rule } from 'postcss';

	export default function isStandardSyntaxRule(rule: Rule | any): boolean;
}

declare module 'stylelint/lib/utils/optionsMatches.mjs' {
	export default function optionsMatches(options: { [x: string]: any }, propertyName: string, input: unknown): boolean;
}

declare module 'stylelint/lib/utils/typeGuards.mjs' {
	import { Node, Root, Rule, AtRule, Comment, Declaration, Document } from 'postcss';
	import { Node as ValueParserNode, FunctionNode } from 'postcss-value-parser';

	export function isRoot(node: Node): node is Root;
	export function isRule(node: Node): node is Rule;
	export function isAtRule(node: Node): node is AtRule;
	export function isComment(node: Node): node is Comment;
	export function isDeclaration(node: Node): node is Declaration;
	export function isDocument(node: Node): node is Document;
	export function isValueFunction(node: ValueParserNode): node is FunctionNode;
	export function hasSource(node: Node): node is Node & { source: import('postcss').Source };
}

declare module 'stylelint/lib/utils/validateTypes.mjs' {
	/**
	 * Checks if the value is a boolean or a Boolean object.
	 */
	export function isBoolean(value: unknown): value is boolean;

	/**
	 * Checks if the value is a function or a Function object.
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	export function isFunction(value: unknown): value is Function;

	/**
	 * Checks if the value is *nullish*.
	 */
	export function isNullish(value: unknown): value is null | undefined;

	/**
	 * Checks if the value is a number or a Number object.
	 */
	export function isNumber(value: unknown): value is number;

	/**
	 * Checks if the value is an object.
	 */
	export function isObject(value: unknown): value is object;

	/**
	 * Checks if the value is a regular expression.
	 */
	export function isRegExp(value: unknown): value is RegExp;

	/**
	 * Checks if the value is a string or a String object.
	 */
	export function isString(value: unknown): value is string;

	/**
	 * Checks if the value is a plain object.
	 */
	export function isPlainObject(value: unknown): value is Record<string, unknown>;

	/**
	 * Assert that the value is truthy.
	 */
	export function assert(value: unknown, message?: string): asserts value;

	/**
	 * Assert that the value is a function or a Function object.
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	export function assertFunction(value: unknown): asserts value is Function;

	/**
	 * Assert that the value is a number or a Number object.
	 */
	export function assertNumber(value: unknown): asserts value is number;

	/**
	 * Assert that the value is a string or a String object.
	 */
	export function assertString(value: unknown): asserts value is string;
}
