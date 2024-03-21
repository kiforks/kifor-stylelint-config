import parser from 'postcss-selector-parser';
import stylelint from 'stylelint';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

function __decorate(decorators, target, key, desc) {
	var c = arguments.length,
		r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
		d;
	if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
		r = Reflect.decorate(decorators, target, key, desc);
	else
		for (var i = decorators.length - 1; i >= 0; i--)
			if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === 'function'
	? SuppressedError
	: function (error, suppressed, message) {
			var e = new Error(message);
			return (e.name = 'SuppressedError'), (e.error = error), (e.suppressed = suppressed), e;
		};

const RULE_NO_UNKNOWN = ['mixin', 'include', 'extend', 'content', 'each', 'function', 'return', 'if', 'else'];

const RULE_PROPERTY_UNIT_ALLOWED_LIST = {
	'width': ['px', '%'],
	'min-width': ['px', '%'],
	'max-width': ['px', '%'],
	'height': ['px', '%'],
	'min-height': ['px', '%'],
	'max-height': ['px', '%'],
	'/^padding/': ['px', '%'],
	'/^margin/': ['px', '%'],
	'top': ['px', '%'],
	'right': ['px', '%'],
	'bottom': ['px', '%'],
	'left': ['px', '%'],
	'grid-auto-columns': ['px', '%', 'fr'],
	'grid-auto-rows': ['px', '%', 'fr'],
	'grid-template-columns': ['px', '%', 'fr'],
	'grid-template-rows': ['px', '%'],
	'gap': ['px', '%'],
	'grid-gap': ['px', '%'],
	'grid-column-gap': ['px', '%'],
	'grid-row-gap': ['px', '%'],
	'column-gap': ['px', '%'],
	'flex-basis': ['px', '%'],
	'border': ['px'],
	'border-width': ['px'],
	'/^border-(top|right|bottom|left)/': ['px'],
	'/^border-(top|right|bottom|left)-width/': ['px'],
	'outline-width': ['px'],
	'box-shadow': ['px'],
	'text-shadow': ['px'],
	'background-position': ['px', '%'],
	'background-size': ['px', '%'],
	'object-position': ['px', '%'],
	'border-radius': ['px', '%'],
	'/^border-(top|bottom)-(left|right)-radius/': ['px', '%'],
	'font-size': [],
	'line-height': [],
	'animation': ['ms'],
	'animation-duration': ['ms'],
	'transition-duration': ['ms'],
	'transition': ['ms'],
};

const RULE_UNIT_ALLOWED_LIST = ['px', 'rem', 'deg', 'fr', '%', 'ms', 'vw', 'vh', 'vmin', 'vmax'];

class MediaConfig {
	static {
		this.BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
	}
	static {
		this.DEVICES = ['desktop', 'mobile'];
	}
	static {
		this.NAME = 'media';
	}
	static {
		this.PREFIX = `^${MediaConfig.NAME}-`;
	}
}

class RuleHelper {
	/**
	 * Checks if the given object conforms to the Rule interface.
	 * @param obj - The object to be checked.
	 * @returns true if obj is a Rule type, false otherwise.
	 * @example For isRule({ type: 'rule', selector: '.example' }), returns true.
	 */
	static isRule(obj) {
		const isObject = typeof obj === 'object' && obj !== null;
		const hasType = isObject && 'type' in obj;
		const isTypeRule = hasType && obj['type'] === 'rule';
		const hasSelector = isTypeRule && 'selector' in obj;
		return isTypeRule && hasSelector;
	}
	/**
	 * Checks if the given object conforms to the RuleAt interface.
	 * @param obj - The object to be checked.
	 * @returns true if obj is a RuleAt type, false otherwise.
	 * @example For isRuleAt({ type: 'at-rule', name: 'font-feature-values' }), returns true.
	 */
	static isRuleAt(obj) {
		const isObject = typeof obj === 'object' && obj !== null;
		const hasType = isObject && 'type' in obj;
		const isTypeAtRule = hasType && obj['type'] === 'at-rule';
		const ruleAtObj = isTypeAtRule ? obj : null;
		const hasName =
			ruleAtObj && 'name' in ruleAtObj && (typeof ruleAtObj.name === 'string' || ruleAtObj.name instanceof RegExp);
		const hasParameter =
			ruleAtObj &&
			'parameter' in ruleAtObj &&
			(typeof ruleAtObj.parameter === 'string' || ruleAtObj.parameter instanceof RegExp);
		return isTypeAtRule && !!(hasName || hasParameter);
	}
	/**
	 * Checks if all elements in the given array are of type Rule or RuleAt.
	 * @param array - The array to be checked.
	 * @returns true if all elements are either Rule or RuleAt, false otherwise.
	 * @example For areRulesOrRuleAts([{ type: 'rule', selector: '.example' }, { type: 'at-rule', parameter: 'print' }]), returns true.
	 */
	static areRulesOrRuleAts(array) {
		return Array.isArray(array) && array.every(element => RuleHelper.isRule(element) || RuleHelper.isRuleAt(element));
	}
	/**
	 * Creates an at-rule with a given name and parameter.
	 * @param name - The name of the at-rule (e.g., 'media', 'include', etc.).
	 * @param parameter - The parameter for the at-rule (e.g., 'screen and (max-width: 768px)', 'mixinName', etc.).
	 * @example: For createAtRule('media', 'screen and (max-width: 768px)'), the output is:
	 * { type: 'at-rule', name: 'media', parameter: 'screen and (max-width: 768px)' }.
	 */
	static createAtRule(name, parameter) {
		return parameter
			? {
					type: 'at-rule',
					name,
					parameter,
				}
			: {
					type: 'at-rule',
					name,
				};
	}
	/**
	 * Creates a standard CSS rule with a given selector.
	 * @param selector - The CSS selector string or regular expression.
	 * @example: For createSelector('.myClass'), the output is:
	 * { type: 'rule', selector: '.myClass' }.
	 */
	static createSelector(selector) {
		return {
			type: 'rule',
			selector,
		};
	}
	/**
	 * Creates an @include rule with a given mixin parameter.
	 * @param mixin - The mixin parameter string or regular expression.
	 * @example: For createInclude('mixinName'), the output is:
	 * { type: 'at-rule', name: 'include', parameter: 'mixinName' }.
	 */
	static createInclude(mixin) {
		return {
			type: 'at-rule',
			name: 'include',
			parameter: mixin,
		};
	}
	/**
	 * Creates an array of standard CSS rules with given selectors.
	 * @param selectors - Array of CSS selector strings or regular expressions.
	 * @example: For createSelectors(['.class1', '.class2']), the output is:
	 * [
	 *    { type: 'rule', selector: '.class1' },
	 *    { type: 'rule', selector: '.class2' }
	 * ].
	 */
	static createSelectors(selectors) {
		return selectors.map(selector => RuleHelper.createSelector(selector));
	}
	/**
	 * Creates an array of @include rules with given mixin parameters.
	 * @param mixins - Array of mixin parameters strings or regular expressions.
	 * @example: For createIncludes(['mixin1', 'mixin2']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'include', parameter: 'mixin1' },
	 *    { type: 'at-rule', name: 'include', parameter: 'mixin2' }
	 * ].
	 */
	static createIncludes(mixins) {
		return mixins.map(mixin => RuleHelper.createInclude(mixin));
	}
	/**
	 * Creates an array of at-rules with a given name and an array of parameters.
	 * @param name - The name of the at-rule (e.g., 'media', 'include', etc.).
	 * @param parameters - An array of parameters for the at-rule
	 * @example: For createAtRules('media', ['screen and (max-width: 768px)', 'print']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'media', parameter: 'screen and (max-width: 768px)' },
	 *    { type: 'at-rule', name: 'media', parameter: 'print' }
	 * ].
	 */
	static createAtRules(name, parameters) {
		return parameters.map(parameter => RuleHelper.createAtRule(name, parameter));
	}
}

class MediaRuleHelper {
	/**
	 * Generates a device-specific media rule prefix.
	 * @param device - Type of device (e.g., 'mobile' or 'desktop').
	 * @example: For getDevicePrefixParameter('mobile'), the output is: '^media-mobile'.
	 */
	static getDevicePrefixParameter(device) {
		return `${MediaConfig.PREFIX}${device}`;
	}
	/**
	 * Generates a breakpoint-specific media rule prefix.
	 * @param prefix - Type of breakpoint prefix (e.g., 'min', 'max').
	 * @param breakpoint - Media breakpoint value (e.g., 'xs', 'sm').
	 * @example: For getBreakpointPrefixParameter('min', 'sm'), the output is: '^media-min(sm)'.
	 */
	static getBreakpointPrefixParameter(prefix, breakpoint) {
		return `${MediaConfig.PREFIX}${prefix}(${breakpoint})`;
	}
	/**
	 * @param breakpointFrom - Media breakpoint value (e.g., 'xs', 'sm').
	 * @param breakpointTo - Media breakpoint value (e.g., 'xs', 'sm').
	 * @example: For getBreakpointBetweenPrefixParameter('xs', 'sm'), the output is: '^media-between(xs, sm)'.
	 */
	static getBreakpointBetweenPrefixParameter(breakpointFrom, breakpointTo) {
		return `${MediaConfig.PREFIX}between(${breakpointFrom}, ${breakpointTo})`;
	}
	/**
	 * @param device - Type of device.
	 * @example: For createDeviceRuleOrder('mobile'), the output is: { type: 'at-rule', name: 'include', parameter: '^media-mobile' }.
	 */
	static createDeviceRuleOrder(device) {
		return RuleHelper.createInclude(MediaRuleHelper.getDevicePrefixParameter(device));
	}
	/**
	 * @param prefix - Type of breakpoint prefix.
	 * @param breakpoint - Media breakpoint value.
	 * @example: For createBreakpointRuleOrder('min', 'sm'), the output is:
	 * { type: 'at-rule', name: 'include', parameter: '^media-min(sm)' }.
	 */
	static createBreakpointRuleOrder(prefix, breakpoint) {
		return RuleHelper.createInclude(MediaRuleHelper.getBreakpointPrefixParameter(prefix, breakpoint));
	}
	/**
	 * @param breakpointFrom - Media breakpoint value (e.g., 'xs', 'sm').
	 * @param breakpointTo - Media breakpoint value (e.g., 'xs', 'sm').
	 * @example: For createBreakpointBetweenRuleOrder('xs', 'sm'), the output is:
	 * { type: 'at-rule', name: 'include', parameter: '^media-between(xs, sm)' }.
	 */
	static createBreakpointBetweenRuleOrder(breakpointFrom, breakpointTo) {
		return RuleHelper.createInclude(MediaRuleHelper.getBreakpointBetweenPrefixParameter(breakpointFrom, breakpointTo));
	}
	/**
	 * @param devices - Array of devices.
	 * @example: For createDeviceRulesOrder(['mobile', 'desktop']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'include', parameter: '^media-mobile' },
	 *    { type: 'at-rule', name: 'include', parameter: '^media-desktop' }
	 * ].
	 */
	static createDeviceRulesOrder(devices) {
		return devices.map(value => MediaRuleHelper.createDeviceRuleOrder(value));
	}
	/**
	 * @param prefix - Type of breakpoint prefix.
	 * @param breakpoints - Array of media breakpoints.
	 * @example: For createBreakpointRulesOrder('min', ['sm', 'md']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'include', parameter: '^media-min(sm)' },
	 *    { type: 'at-rule', name: 'include', parameter: '^media-min(md)' }
	 * ].
	 */
	static createBreakpointRulesOrder(prefix, breakpoints) {
		return breakpoints.map(value => MediaRuleHelper.createBreakpointRuleOrder(prefix, value));
	}
	/**
	 * @param breakpoints - Array of media breakpoints.
	 * @example: For createBreakpointBetweenRulesOrder(['xs', 'sm', 'md']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'include', parameter: '^media-between(xs, sm)' },
	 *    { type: 'at-rule', name: 'include', parameter: '^media-between(xs, md)' },
	 *    { type: 'at-rule', name: 'include', parameter: '^media-between(sm, md)' },
	 * ].
	 */
	static createBreakpointBetweenRulesOrder(breakpoints) {
		return breakpoints.flatMap((current, idx, arr) =>
			arr.slice(idx + 1).map(next => MediaRuleHelper.createBreakpointBetweenRuleOrder(current, next))
		);
	}
}

class RegExpHelper {
	/**
	 * Creates a RegExp based on the provided string, inserting a wildcard pattern for flexible matching.
	 * @param parameter - The string to be converted into a RegExp.
	 * @returns A RegExp object based on the input string, enhanced with wildcard patterns.
	 * @example For makeRegex('color: (blue)'), returns a RegExp matching /color: \(blue[\s\S]*\)/.
	 */
	static makeRegex(parameter) {
		// Search for the last opening parenthesis
		const lastOpeningIndex = parameter.lastIndexOf('(');
		// Find the corresponding closing parenthesis
		const closingIndex = parameter.indexOf(')', lastOpeningIndex);
		// Validate existence of both parenthesis
		const hasValidParenthesis = lastOpeningIndex !== -1 && closingIndex !== -1;
		// Insert [\s\S]* before the closing parenthesis
		const modifiedParameter = hasValidParenthesis
			? `${parameter.substring(0, closingIndex)}[\\s\\S]*${parameter.substring(closingIndex)}`
			: `${parameter}[\\s\\S]*`;
		// Escape special characters
		const escapedParameter = modifiedParameter.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
		return new RegExp(escapedParameter);
	}
	/**
	 * Transforms the 'parameter' field of each rule in the array into a RegExp source string for flexible matching.
	 * @param rules - An array of objects, potentially containing 'parameter' fields.
	 * @returns The same array of objects with 'parameter' fields converted to RegExp source strings.
	 * @example For paramToRegex([
	 *   { type: 'at-rule', name: 'include', parameter: '^media-min(xs)' },
	 *   { type: 'at-rule', name: 'media', parameter: '(width)' }
	 * ]),
	 * output is [
	 *   { type: 'at-rule', name: 'include', parameter: ^media-min\(xs[\s\S]*\) },
	 *   { type: 'at-rule', name: 'media', parameter: \(width[\s\S]*\) }
	 * ].
	 */
	static paramToRegex(rules) {
		return rules.map(rule => {
			const isAtRule = RuleHelper.isRuleAt(rule) && rule.type === 'at-rule';
			return isAtRule && typeof rule.parameter === 'string'
				? {
						...rule,
						parameter: RegExpHelper.makeRegex(rule.parameter).source,
					}
				: rule;
		});
	}
}

class OrderContentHelper {
	/**
	 * Creates an array of media feature at-rules based on the provided features.
	 * Each feature is wrapped in parentheses before being passed to the RuleHelper's createAtRules method.
	 *
	 * @param features - An array of string representing the media features (e.g., 'max-width: 768px', 'min-resolution: 2dppx').
	 * @returns An array of RuleAt objects representing the created media feature at-rules.
	 *
	 * @example
	 * For createMediaFeatures(['max-width: 768px', 'min-resolution: 2dppx']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'media', parameter: '(max-width: 768px)' },
	 *    { type: 'at-rule', name: 'media', parameter: '(min-resolution: 2dppx)' }
	 * ].
	 */
	static createMediaFeatures(features) {
		return RuleHelper.createAtRules(
			'media',
			features.map(feature => `(${feature})`)
		);
	}
	/**
	 * Creates an array of pseudo class rules based on the provided pseudo class strings.
	 * Each pseudo class is prefixed with "^&:" before being passed to the RuleHelper's createSelectors method.
	 *
	 * @param pseudoClasses - An array of strings representing the pseudo classes (e.g., 'hover', 'active').
	 * @returns An array of Rule objects representing the created pseudo class rules.
	 *
	 * @example
	 * For createPseudoClasses(['hover', 'active']), the output is:
	 * [
	 *    { type: 'rule', selector: '^&:hover' },
	 *    { type: 'rule', selector: '^&:active' }
	 * ].
	 */
	static createPseudoClasses(pseudoClasses) {
		const ampCollection = RuleHelper.createSelectors(pseudoClasses.map(element => `^&:${element}`));
		const collection = RuleHelper.createSelectors(pseudoClasses.map(element => `^:${element}`));
		return [...collection, ...ampCollection];
	}
	/**
	 * Creates an array of pseudo-element rules based on the provided pseudo-element strings.
	 * Each pseudo-element is prefixed with "^&::" before being passed to the RuleHelper's createSelectors method.
	 *
	 * @param pseudoElements - An array of strings representing the pseudo-elements (e.g., 'before', 'after').
	 * @returns An array of Rule objects representing the created pseudo-element rules.
	 *
	 * @example
	 * For createPseudoElements(['before', 'after']), the output is:
	 * [
	 *    { type: 'rule', selector: '^&::before' },
	 *    { type: 'rule', selector: '^&::after' }
	 * ].
	 */
	static createPseudoElements(pseudoElements) {
		const ampCollection = RuleHelper.createSelectors(pseudoElements.map(element => `^&::${element}`));
		const collection = RuleHelper.createSelectors(pseudoElements.map(element => `^::${element}`));
		return [...collection, ...ampCollection];
	}
}

const ORDER_CONTENT_MEDIA_QUERY = [
	RuleHelper.createAtRule('media'),
	/*
	 * Standard media types
	 * */
	...RuleHelper.createAtRules('media', ['all', 'print', 'screen', 'speech']),
	/**
	 * Features related to the device display
	 */
	...OrderContentHelper.createMediaFeatures([
		'width',
		'min-width',
		'max-width',
		'min-width and max-width',
		'orientation: portrait',
		'orientation: landscape',
		'aspect-ratio',
		'min-aspect-ratio and max-aspect-ratio',
		'color',
		'min-color and max-color',
		'color-index',
		'min-color-index and max-color-index',
		'monochrome',
		'min-monochrome and max-monochrome',
		'resolution',
		'min-resolution and max-resolution',
		'scan: interlace',
		'scan: progressive',
		'grid',
		'update-frequency',
		'overflow-block',
		'overflow-inline',
		'pointer: none',
		'pointer: coarse',
		'pointer: fine',
		'hover: none',
		'hover: hover',
		'any-pointer: none',
		'any-pointer: coarse',
		'any-pointer: fine',
		'any-hover: none',
		'any-hover: hover',
		'light-level: dim',
		'light-level: normal',
		'light-level: washed',
		'scripting: none',
		'scripting: initial-only',
		'scripting: enabled',
		'device-width',
		'device-height',
		'device-aspect-ratio',
		'-webkit-device-pixel-ratio',
		'-webkit-transform-3d',
		'-webkit-transform-2d',
		'-webkit-transition',
		'-webkit-animation',
	]),
	/*
	 * Deprecated or non-standard features
	 * */
	...OrderContentHelper.createMediaFeatures(['device-width', 'device-height', 'device-aspect-ratio']),
];

const ORDER_CONTENT_PSEUDO_CLASS_INCLUDES = RuleHelper.createIncludes(['hover', 'active', 'focus']);

const ORDER_CONTENT_PSEUDO_CLASSES = OrderContentHelper.createPseudoClasses([
	'root',
	'first',
	'first-child',
	'first-of-type',
	'lang',
	'last-child',
	'last-of-type',
	'nth-last-child',
	'nth-last-of-type',
	'nth-child',
	'nth-of-type',
	'only-child',
	'only-of-type',
	'hover',
	'focus',
	'active',
	'visited',
	'invalid',
	'valid',
	'empty',
	'target',
	'enabled',
	'disabled',
	'checked',
	'is',
	'where',
	'has',
	'dir',
	'default',
	'optional',
	'required',
	'read-only',
	'read-write',
	'scope',
	'placeholder-shown',
	'autofill',
	'indeterminate',
	'[a-z]',
]);

const ORDER_CONTENT_PSEUDO_ELEMENT_INCLUDES = RuleHelper.createIncludes([
	// before
	'before-clean',
	'before',
	'before-hover',
	'before-active',
	// after
	'after-clean',
	'after',
	'after-hover',
	'after-active',
	// before-after
	'before-after-clean',
	'before-after',
	'before-after-hover',
	'before-after-active',
]);

const ORDER_CONTENT_PSEUDO_ELEMENTS = OrderContentHelper.createPseudoElements([
	'first-letter',
	'before',
	'after',
	'placeholder',
	'first-line',
	'selection',
	'backdrop',
	'marker',
	'spelling-error',
	'grammar-error',
	'cue',
	'file-selector-button',
	'highlight',
	'slotted',
	'target-text',
	'-webkit-input-placeholder',
	'-moz-placeholder',
	'-ms-input-placeholder',
	'-ms-clear',
	'-ms-reveal',
	'-webkit-search-cancel-button',
	'-webkit-search-decoration',
	'-webkit-search-results-button',
	'-webkit-search-results-decoration',
	'-webkit-slider-runnable-track',
	'-webkit-slider-thumb',
	'-webkit-media-controls-panel',
	'-webkit-media-controls-play-button',
	'-webkit-media-controls-volume-slider',
	'[a-z]',
]);

const ORDER_CONTENT_SELECTORS = RuleHelper.createSelectors([
	'^[a-z]', // example: 'div'
	'^\\*', // example: '*'
	'^\\.\\w+', // example: '.class'
	'^\\w+\\[\\w+', // example: 'input[type]'
	'^\\w+\\[\\w+\\$=', // example: 'input[type$="text"]'
	'^\\w+\\[\\w+\\^=', // example: 'input[type^="text"]'
	'^\\w+\\[\\w+\\*=', // example: 'input[type*="text"]'
	'^\\w+\\[\\w+\\~=', // example: 'input[type~="text"]'
	'^\\w+\\[\\w+\\|=', // example: 'input[type|="text"]'
	'^\\w+\\[\\w+="\\w+"]', // example: 'input[type="text"]'
	'^\\[\\w+', // example: '[attr]'
	'^\\[\\w+\\$=', // example: '[attr$=value]'
	'^\\[\\w+\\^=', // example: '[attr^=value]'
	'^\\[\\w+\\*=', // example: '[attr*=value]'
	'^\\[\\w+\\~=', // example: '[attr~=value]'
	'^\\[\\w+\\|=', // example: '[attr|=value]'
	'^\\>', // example: '> child'
	'^\\+', // example: '+ sibling'
	'^\\~', // example: '~ sibling'
	'^#', // example: '#id'
	'^&\\.\\w+', // example: '&.class'
	'^&\\[\\w+', // example: '&[attr]'
	'^&\\[\\w+\\$=', // example: '[attr$=value]'
	'^&\\[\\w+\\^=', // example: '[attr^=value]'
	'^&\\[\\w+\\*=', // example: '[attr*=value]'
	'^&\\[\\w+\\~=', // example: '[attr~=value]'
	'^&\\[\\w+\\|=', // example: '[attr|=value]'
	'^&', // example: '&'
	'^&:not', // example: '&:not(.class)'
]);

/**
 * The ORDER_CONTENT array defines the order of various SCSS elements in a structured manner.
 * This is crucial for maintaining a consistent and readable codebase.
 * Each section is clearly demarcated and utilizes helper functions from the 'Rule' module
 * to create rules or selectors as needed. This structure aids in keeping the stylesheet organized
 * and easy to navigate, ensuring that similar rule types are grouped together.
 *
 * Documentation:
 * @see https://github.com/hudochenkov/stylelint-order/blob/master/rules/order/README.md
 */
const ORDER_CONFIG = [
	/**
	 * CSS charset rule:
	 * @example @charset "UTF-8";
	 */
	RuleHelper.createAtRule('charset'),
	/**
	 * CSS import rule:
	 * @example @import url("fineprint.css");
	 */
	RuleHelper.createAtRule('import'),
	/**
	 * CSS font-face rule:
	 * @example @font-face { font-family: 'Graublau Web'; src: url('GraublauWeb.woff') format('woff'); }
	 */
	RuleHelper.createAtRule('font-face'),
	/**
	 * CSS font-feature-values rule:
	 * @example @font-feature-values Font Family Name { @styleset { style1 value1, style2 value2, ... } }
	 */
	RuleHelper.createAtRule('font-feature-values'),
	/**
	 * CSS font-palette-values rule:
	 * @example @font-palette-values Font Family Name { base-palette: ...; override-palette: ...; }
	 */
	RuleHelper.createAtRule('font-palette-values'),
	/**
	 * CSS keyframes rule:
	 * @example @keyframes slide { from { transform: translateX(0%); } to { transform: translateX(100%); } }
	 */
	RuleHelper.createAtRule('keyframes'),
	/**
	 * CSS layer rule (specific to Firefox):
	 * @example @layer base, components { ... }
	 */
	RuleHelper.createAtRule('layer'),
	/**
	 * CSS property rule:
	 * @example @property --main-bg-color { syntax: '<color>'; initial-value: #c0ffee; inherits: false; }
	 */
	RuleHelper.createAtRule('property'),
	/**
	 * CSS counter-style rule:
	 * @example @counter-style custom { system: cyclic; symbols: '*' '+' '-' }
	 */
	RuleHelper.createAtRule('counter-style'),
	/**
	 * CSS namespace rule:
	 * @example @namespace svg url(http://www.w3.org/2000/svg);
	 */
	RuleHelper.createAtRule('namespace'),
	/**
	 * Custom properties:
	 * @example --property: 10px;
	 */
	'custom-properties',
	/**
	 * Dollar variables:
	 * @example $variable: 12px !default;
	 */
	'dollar-variables',
	/**
	 * SCSS includes that has prefix reset:
	 * @example @include reset-list;
	 */
	RuleHelper.createInclude('^reset'),
	/**
	 * CSS declarations:
	 * @example display: block;
	 */
	'declarations',
	/**
	 * SCSS extend
	 * @example @extend .some-class
	 */
	RuleHelper.createAtRule('extend'),
	/**
	 * SCSS includes
	 * @example @include some-mixin;
	 */
	RuleHelper.createInclude('include'),
	/**
	 * SCSS pseudo classes includes:
	 * @example @include hover;
	 */
	...ORDER_CONTENT_PSEUDO_ELEMENT_INCLUDES,
	/**
	 * SCSS pseudo elements includes:
	 * @example @include before-mixin;
	 */
	...ORDER_CONTENT_PSEUDO_CLASS_INCLUDES,
	/**
	 * CSS pseudo classes:
	 * @example &:hover {}
	 */
	...ORDER_CONTENT_PSEUDO_CLASSES,
	/**
	 * CSS pseudo elements:
	 * @example &::before {}
	 */
	...ORDER_CONTENT_PSEUDO_ELEMENTS,
	/**
	 * CSS selectors:
	 * @example div {}
	 */
	...ORDER_CONTENT_SELECTORS,
	/**
	 * SCSS Media includes for specific devices:
	 * @example @include media-desktop;
	 */
	...MediaRuleHelper.createDeviceRulesOrder(MediaConfig.DEVICES),
	/**
	 * SCSS Media includes for minimum breakpoints:
	 * @example @include media-min(md);
	 */
	...MediaRuleHelper.createBreakpointRulesOrder('min', MediaConfig.BREAKPOINTS),
	/**
	 * SCSS Media includes for maximum breakpoints:
	 * @example @include media-max(md);
	 */
	...MediaRuleHelper.createBreakpointRulesOrder('max', MediaConfig.BREAKPOINTS),
	/**
	 * SCSS Media includes for specific breakpoints:
	 * @example @include media-only(md);
	 */
	...MediaRuleHelper.createBreakpointRulesOrder('only', MediaConfig.BREAKPOINTS),
	/**
	 * SCSS Media includes for range between breakpoints:
	 * @example @include media-between(md, lg);
	 */
	...MediaRuleHelper.createBreakpointBetweenRulesOrder(MediaConfig.BREAKPOINTS),
	/**
	 * Media queries:
	 * @example @media (min-width: 768px) {}
	 */
	...ORDER_CONTENT_MEDIA_QUERY,
	/**
	 * CSS page rule:
	 * @example @page :first { margin: 2in }
	 */
	RuleHelper.createAtRule('page'),
	/**
	 * CSS container rule:
	 * @example @container (min-width: 100%) { ... }
	 */
	RuleHelper.createAtRule('container'),
	/**
	 * CSS supports rule:
	 * @example @supports (display: grid) { ... }
	 */
	RuleHelper.createAtRule('supports'),
];
const ORDER_CONTENT = RegExpHelper.paramToRegex(ORDER_CONFIG);

const ORDER_PROPERTIES_CONFIG = {
	position: ['content', 'position', 'top', 'right', 'bottom', 'left', 'z-index'],
	blockModel: [
		'display',
		'-webkit-flex',
		'-ms-flex',
		'flex',
		'-webkit-flex-grow',
		'flex-grow',
		'-webkit-flex-shrink',
		'flex-shrink',
		'-webkit-flex-basis',
		'flex-basis',
		'-webkit-flex-flow',
		'flex-flow',
		'-webkit-flex-direction',
		'-ms-flex-direction',
		'flex-direction',
		'-webkit-flex-wrap',
		'flex-wrap',
		'place-content',
		'-webkit-justify-content',
		'justify-content',
		'-webkit-align-content',
		'align-content',
		'-webkit-align-items',
		'align-items',
		'-webkit-dist',
		'-ms-flex-dist',
		'order',
		'-ms-grid-row-align',
		'-webkit-align-self',
		'align-self',
		'-ms-grid-column-align',
		'justify-self',
		'grid',
		'grid-area',
		'grid-auto-columns',
		'grid-auto-flow',
		'grid-auto-rows',
		'grid-column',
		'grid-column-end',
		'-ms-grid-column-span',
		'grid-column-gap',
		'-ms-grid-column',
		'grid-column-start',
		'grid-gap',
		'gap',
		'grid-row',
		'grid-row-end',
		'-ms-grid-row-span',
		'grid-row-gap',
		'-ms-grid-row',
		'grid-row-start',
		'grid-template',
		'grid-template-areas',
		'-ms-grid-columns',
		'grid-template-columns',
		'-ms-grid-rows',
		'grid-template-rows',
		'float',
		'clear',
		'-webkit-box-sizing',
		'-moz-box-sizing',
		'box-sizing',
		'width',
		'min-width',
		'max-width',
		'height',
		'min-height',
		'max-height',
		'margin',
		'margin-top',
		'margin-right',
		'margin-bottom',
		'margin-left',
		'padding',
		'padding-top',
		'padding-right',
		'padding-bottom',
		'padding-left',
		'overflow',
		'-ms-overflow-x',
		'overflow-x',
		'-ms-overflow-y',
		'overflow-y',
		'-webkit-overflow-scrolling',
		'-ms-overflow-style',
		'list-style',
		'list-style-position',
		'list-style-type',
		'list-style-image',
		'border-collapse',
		'border-spacing',
		'table-layout',
		'empty-cells',
		'caption-side',
	],
	typography: [
		'font',
		'font-weight',
		'font-size',
		'line-height',
		'font-family',
		'vertical-align',
		'text-align',
		'direction',
		'color',
		'text-transform',
		'text-decoration',
		'font-style',
		'font-variant',
		'font-size-adjust',
		'font-stretch',
		'font-effect',
		'font-emphasize',
		'font-emphasize-position',
		'font-emphasize-style',
		'-webkit-font-smoothing',
		'-moz-osx-font-smoothing',
		'font-smooth',
		'-webkit-text-align-last',
		'-moz-text-align-last',
		'-ms-text-align-last',
		'text-align-last',
		'letter-spacing',
		'word-spacing',
		'white-space',
		'text-emphasis',
		'text-emphasis-color',
		'text-emphasis-style',
		'text-emphasis-position',
		'text-indent',
		'-ms-text-justify',
		'text-justify',
		'-ms-writing-mode',
		'text-outline',
		'text-wrap',
		'-ms-text-overflow',
		'text-overflow',
		'text-overflow-ellipsis',
		'text-overflow-mode',
		'text-orientation',
		'-ms-word-wrap',
		'word-wrap',
		'-ms-word-break',
		'word-break',
		'-moz-tab-size',
		'-o-tab-size',
	],
	decoration: [
		'overflow-wrap',
		'tab-size',
		'-webkit-hyphens',
		'-moz-hyphens',
		'hyphens',
		'unicode-bidi',
		'columns',
		'column-count',
		'column-fill',
		'column-gap',
		'column-rule',
		'column-rule-color',
		'column-rule-style',
		'column-rule-width',
		'column-span',
		'column-width',
		'text-shadow',
		'page-break-after',
		'page-break-before',
		'page-break-inside',
		'src',
		'background',
		'background-color',
		'background-image',
		'background-repeat',
		'background-position',
		'-ms-background-position-x',
		'background-position-x',
		'-ms-background-position-y',
		'background-position-y',
		'-webkit-background-size',
		'-moz-background-size',
		'-o-background-size',
		'background-size',
		'-webkit-background-clip',
		'-moz-background-clip',
		'background-clip',
		'background-origin',
		'background-attachment',
		'box-decoration-break',
		'background-blend-mode',
		'border',
		'border-width',
		'border-style',
		'border-color',
		'border-top',
		'border-top-width',
		'border-top-style',
		'border-top-color',
		'border-right',
		'border-right-width',
		'border-right-style',
		'border-right-color',
		'border-bottom',
		'border-bottom-width',
		'border-bottom-style',
		'border-bottom-color',
		'border-left',
		'border-left-width',
		'border-left-style',
		'border-left-color',
		'-webkit-border-radius',
		'-moz-border-radius',
		'border-radius',
		'-webkit-border-top-left-radius',
		'-moz-border-radius-topleft',
		'border-top-left-radius',
		'-webkit-border-top-right-radius',
		'-moz-border-radius-topright',
		'border-top-right-radius',
		'-webkit-border-bottom-right-radius',
		'-moz-border-radius-bottomright',
		'border-bottom-right-radius',
		'-webkit-border-bottom-left-radius',
		'-moz-border-radius-bottomleft',
		'border-bottom-left-radius',
		'-webkit-border-image',
		'-moz-border-image',
		'-o-border-image',
		'border-image',
		'-webkit-border-image-source',
		'-moz-border-image-source',
		'-o-border-image-source',
		'border-image-source',
		'-webkit-border-image-slice',
		'-moz-border-image-slice',
		'-o-border-image-slice',
		'border-image-slice',
		'-webkit-border-image-width',
		'-moz-border-image-width',
		'-o-border-image-width',
		'border-image-width',
		'-webkit-border-image-outset',
		'-moz-border-image-outset',
		'-o-border-image-outset',
		'border-image-outset',
		'-webkit-border-image-repeat',
		'-moz-border-image-repeat',
		'-o-border-image-repeat',
		'border-image-repeat',
		'outline',
		'outline-width',
		'outline-style',
		'outline-color',
		'outline-offset',
		'-webkit-box-shadow',
		'-moz-box-shadow',
		'box-shadow',
		'-webkit-transform',
		'-moz-transform',
		'-ms-transform',
		'-o-transform',
		'transform',
		'-webkit-transform-origin',
		'-moz-transform-origin',
		'-ms-transform-origin',
		'-o-transform-origin',
		'transform-origin',
		'-webkit-backface-visibility',
		'-moz-backface-visibility',
		'backface-visibility',
		'-webkit-perspective',
		'-moz-perspective',
		'perspective',
		'-webkit-perspective-origin',
		'-moz-perspective-origin',
		'perspective-origin',
		'-webkit-transform-style',
		'-moz-transform-style',
		'transform-style',
		'visibility',
		'cursor',
		'opacity',
		'interpolation-mode',
		'-webkit-filter',
		'filter',
		'backdrop-filter',
	],
	animation: [
		'-webkit-transition',
		'-moz-transition',
		'-ms-transition',
		'-o-transition',
		'transition',
		'-webkit-transition-delay',
		'-moz-transition-delay',
		'-ms-transition-delay',
		'-o-transition-delay',
		'transition-delay',
		'-webkit-transition-timing-function',
		'-moz-transition-timing-function',
		'-ms-transition-timing-function',
		'-o-transition-timing-function',
		'transition-timing-function',
		'-webkit-transition-duration',
		'-moz-transition-duration',
		'-ms-transition-duration',
		'-o-transition-duration',
		'transition-duration',
		'-webkit-transition-property',
		'-moz-transition-property',
		'-ms-transition-property',
		'-o-transition-property',
		'transition-property',
		'-webkit-animation',
		'-moz-animation',
		'-ms-animation',
		'-o-animation',
		'animation',
		'-webkit-animation-name',
		'-moz-animation-name',
		'-ms-animation-name',
		'-o-animation-name',
		'animation-name',
		'-webkit-animation-duration',
		'-moz-animation-duration',
		'-ms-animation-duration',
		'-o-animation-duration',
		'animation-duration',
		'-webkit-animation-play-state',
		'-moz-animation-play-state',
		'-ms-animation-play-state',
		'-o-animation-play-state',
		'animation-play-state',
		'-webkit-animation-timing-function',
		'-moz-animation-timing-function',
		'-ms-animation-timing-function',
		'-o-animation-timing-function',
		'animation-timing-function',
		'-webkit-animation-delay',
		'-moz-animation-delay',
		'-ms-animation-delay',
		'-o-animation-delay',
		'animation-delay',
		'-webkit-animation-iteration-count',
		'-moz-animation-iteration-count',
		'-ms-animation-iteration-count',
		'-o-animation-iteration-count',
		'animation-iteration-count',
		'-webkit-animation-direction',
		'-moz-animation-direction',
		'-ms-animation-direction',
		'-o-animation-direction',
		'animation-direction',
		'-webkit-animation-fill-mode',
		'-moz-animation-fill-mode',
		'-ms-animation-fill-mode',
		'-o-animation-fill-mode',
		'animation-fill-mode',
	],
	miscellanea: [
		'contain',
		'appearance',
		'clip',
		'clip-path',
		'counter-reset',
		'counter-increment',
		'resize',
		'-webkit-user-select',
		'-moz-user-select',
		'-ms-user-select',
		'user-select',
		'-webkit-tap-highlight-color',
		'nav-index',
		'nav-up',
		'nav-right',
		'nav-down',
		'nav-left',
		'pointer-events',
		'quotes',
		'touch-action',
		'will-change',
		'zoom',
		'fill',
		'fill-rule',
		'clip-rule',
		'stroke',
		'aspect-ratio',
		'accent-color',
	],
};

const { position, blockModel, typography, decoration, animation, miscellanea } = ORDER_PROPERTIES_CONFIG;
/**
 * Declarations of logically related properties are grouped in the following order:
 *
 * Positioning
 * Block Model
 * Typography
 * Decoration
 * Animation
 * Miscellaneous
 *
 * Positioning comes first because it affects the positioning of blocks in the document flow.
 * The Block Model comes next as it defines the dimensions and placement of blocks.
 *
 * All other declarations that change the appearance of the inner parts of blocks and do not affect other blocks come last.
 */
const ORDER_PROPERTIES = [...position, ...blockModel, ...typography, ...decoration, ...animation, ...miscellanea];

/**
 * All of these methods are the utilities version of stylelint
 * @see https://github.com/stylelint/stylelint/tree/main/lib/utils
 *
 * Since this is a copied version of the original functions, there are no tests for this helper.
 * This is done purely to be able to test our .ts files, because .mjs files are not allowed.
 */
class PluginHelper {
	static validateSyntaxBlock(rule) {
		const hasRuleBlock = PluginHelper.hasBlock(rule);
		const isNotStandardSyntaxRule = PluginHelper.isRule(rule) && !PluginHelper.isStandardSyntaxRule(rule);
		return !hasRuleBlock || isNotStandardSyntaxRule;
	}
	static getRuleName(node) {
		return PluginHelper.isRule(node) ? node.selector : node.name;
	}
	static getRuleParams(node) {
		return PluginHelper.isAtRule(node) ? node.params : null;
	}
	static isRoot(node) {
		return node.type === 'root';
	}
	static isParentRoot(node) {
		return !!node?.parent && PluginHelper.isRoot(node.parent);
	}
	static isRule(node) {
		return node.type === 'rule';
	}
	static isAtRule(node) {
		return node.type === 'atrule';
	}
	static isComment(node) {
		return node.type === 'comment';
	}
	static isDeclaration(node) {
		return node.type === 'decl';
	}
	static isDocument(node) {
		return node.type === 'document';
	}
	static isValueFunction(node) {
		return node.type === 'function';
	}
	static hasSource(node) {
		return Boolean(node.source);
	}
	static hasBlock(statement) {
		return statement.nodes !== undefined;
	}
	static isStandardSyntaxRule(rule) {
		if (rule.type !== 'rule') {
			return false;
		}
		if ('extend' in rule && rule.extend) {
			return false;
		}
		return PluginHelper.isStandardSyntaxSelector(rule.selector);
	}
	static isStandardSyntaxSelector(selector) {
		if (PluginHelper.hasInterpolation(selector)) {
			return false;
		}
		return !(
			selector.startsWith('%') ||
			selector.endsWith(':') ||
			/:extend(?:\(.*?\))?/.test(selector) ||
			/\.[\w-]+\(.*\).+/.test(selector) ||
			(selector.endsWith(')') && !selector.includes(':')) ||
			/\(@.*\)$/.test(selector) ||
			selector.includes('<%') ||
			selector.includes('%>') ||
			selector.includes('//')
		);
	}
	static hasInterpolation(string) {
		return (
			PluginHelper.hasLessInterpolation(string) ||
			PluginHelper.hasScssInterpolation(string) ||
			PluginHelper.hasTplInterpolation(string) ||
			PluginHelper.hasPsvInterpolation(string)
		);
	}
	static hasLessInterpolation(string) {
		return /@\{.+?}/.test(string);
	}
	static hasPsvInterpolation(string) {
		return /\$\(.+?\)/.test(string);
	}
	static hasScssInterpolation(string) {
		return /#\{.+?}/s.test(string);
	}
	static hasTplInterpolation(string) {
		return /\{.+?}/s.test(string);
	}
	/**
	 * Compares a string to a second value that, if it fits a certain convention,
	 * is converted to a regular expression before the comparison.
	 * If it doesn't fit the convention, then two strings are compared.
	 *
	 * Any strings starting and ending with `/` are interpreted
	 * as regular expressions.
	 */
	static matchesStringOrRegExp(input, comparison) {
		if (!Array.isArray(input)) {
			return PluginHelper.testAgainstStringOrRegExpOrArray(input, comparison);
		}
		for (const inputItem of input) {
			const testResult = PluginHelper.testAgainstStringOrRegExpOrArray(inputItem, comparison);
			if (testResult) {
				return testResult;
			}
		}
		return false;
	}
	/**
	 * Check if an options object's propertyName contains a user-defined string or
	 * regex that matches the passed-in input.
	 */
	static optionsMatches(options, propertyName, input) {
		if (!options || typeof input !== 'string') {
			return false;
		}
		const propertyValue = options[propertyName];
		if (propertyValue instanceof RegExp || Array.isArray(propertyValue)) {
			return !!PluginHelper.matchesStringOrRegExp(input, propertyValue);
		}
		return false;
	}
	static isBoolean(value) {
		return typeof value === 'boolean' || value instanceof Boolean;
	}
	// eslint-disable-next-line @typescript-eslint/ban-types
	static isFunction(value) {
		return typeof value === 'function' || value instanceof Function;
	}
	static isNullish(value) {
		return value == null;
	}
	static isNumber(value) {
		return typeof value === 'number' || value instanceof Number;
	}
	static isObject(value) {
		return value !== null && typeof value === 'object';
	}
	static isRegExp(value) {
		return value instanceof RegExp;
	}
	static isString(value) {
		return typeof value === 'string' || value instanceof String;
	}
	static isPlainObject(value) {
		return PluginHelper._isPlainObject(value);
	}
	static assert(value, message) {
		// eslint-disable-next-line no-console
		console.assert(value, message);
	}
	// eslint-disable-next-line @typescript-eslint/ban-types
	static assertFunction(value) {
		// eslint-disable-next-line no-console
		console.assert(PluginHelper.isFunction(value), `"${value}" must be a function`);
	}
	static assertNumber(value) {
		// eslint-disable-next-line no-console
		console.assert(PluginHelper.isNumber(value), `"${value}" must be a number`);
	}
	static assertString(value) {
		// eslint-disable-next-line no-console
		console.assert(PluginHelper.isString(value), `"${value}" must be a string`);
	}
	// Internal helper method to check if an object is plain
	static _isPlainObject(o) {
		if (!PluginHelper.isObject(o)) return false;
		const obj = o;
		const ctor = obj.constructor;
		if (ctor === undefined) return true;
		const prot = ctor.prototype;
		if (!PluginHelper.isObject(prot)) return false;
		return Object.prototype.hasOwnProperty.call(prot, 'isPrototypeOf');
	}
	static testAgainstStringOrRegExpOrArray(value, comparison) {
		if (!Array.isArray(comparison)) {
			return PluginHelper.testAgainstStringOrRegExp(value, comparison);
		}
		for (const comparisonItem of comparison) {
			const testResult = PluginHelper.testAgainstStringOrRegExp(value, comparisonItem);
			if (testResult) {
				return testResult;
			}
		}
		return false;
	}
	static testAgainstStringOrRegExp(value, comparison) {
		if (comparison instanceof RegExp) {
			const match = value.match(comparison);
			return match ? { match: value, pattern: comparison, substring: match[0] || '' } : false;
		}
		const firstComparisonChar = comparison[0];
		const lastComparisonChar = comparison[comparison.length - 1];
		const secondToLastComparisonChar = comparison[comparison.length - 2];
		const comparisonIsRegex =
			firstComparisonChar === '/' &&
			(lastComparisonChar === '/' || (secondToLastComparisonChar === '/' && lastComparisonChar === 'i'));
		const hasCaseInsensitiveFlag = comparisonIsRegex && lastComparisonChar === 'i';
		if (comparisonIsRegex) {
			const regexPattern = hasCaseInsensitiveFlag ? comparison.slice(1, -2) : comparison.slice(1, -1);
			const regexFlags = hasCaseInsensitiveFlag ? 'i' : '';
			const valueMatch = value.match(new RegExp(regexPattern, regexFlags));
			return valueMatch ? { match: value, pattern: comparison, substring: valueMatch[0] || '' } : false;
		}
		return value === comparison ? { match: value, pattern: comparison, substring: value } : false;
	}
}

class PluginConfig {
	static {
		this.NAMESPACE = 'kifor-stylelint';
	}
	static {
		this.REPOSITORY_URL = 'https://github.com/kiforks/kifor-stylelint-config';
	}
}

const {
	utils: { ruleMessages, validateOptions, report },
} = stylelint;
/**
 * @private used only for development
 */
class PluginBase {
	constructor() {
		this.isArrayOptions = false;
	}
	get name() {
		return `${PluginConfig.NAMESPACE}/${this.ruleName}`;
	}
	get messages() {
		return ruleMessages(this.name, {
			expected: this.message,
		});
	}
	createRule() {
		const ruleBase = (options, secondaryOptions, context) => (root, result) =>
			this.render({ options, secondaryOptions, context, result, root });
		const config = {
			ruleName: this.name,
			messages: this.messages,
			meta: { url: PluginConfig.REPOSITORY_URL },
			primaryOptionArray: this.isArrayOptions,
		};
		const rule = Object.assign(ruleBase, config);
		return stylelint.createPlugin(this.name, rule);
	}
	render({ options, secondaryOptions, context, result, root }) {
		const checkStatement = (result, options, secondaryOptions) => rule =>
			this.check({
				rule,
				result,
				options,
				secondaryOptions: secondaryOptions || {},
			});
		this.checkRule = (result, options, secondaryOptions) => {
			root.walkRules(checkStatement(result, options, secondaryOptions));
		};
		this.checkAtRule = (result, options, secondaryOptions) => {
			root.walkAtRules(checkStatement(result, options, secondaryOptions));
		};
		this.validateOptions = (options, secondaryOptions) =>
			secondaryOptions
				? validateOptions(result, this.name, options, secondaryOptions)
				: validateOptions(result, this.name, options);
		this.reportProblem = problem =>
			report({ ruleName: this.name, result, message: this.messages.expected, ...problem });
		this.initialize({ options, root, result, secondaryOptions, context });
	}
}

/**
 * Source was taken from:
 * @see https://github.com/stylelint/stylelint/blob/main/lib/rules/max-nesting-depth/README.md
 */
class PluginMaxNestingDepth extends PluginBase {
	constructor() {
		super(...arguments);
		this.ruleName = 'max-nesting-depth';
		this.isIgnoreHostSelector = false;
		this.message = depth => `Expected nesting depth to be no more than ${depth}`;
	}
	initialize({ options: maxDepth, secondaryOptions, result }) {
		const possibleValues = [PluginHelper.isString, PluginHelper.isRegExp];
		const possibleSecondary = {
			ignore: ['blockless-at-rules', 'pseudo-classes'],
			ignoreAtRules: possibleValues,
			ignoreRules: possibleValues,
			ignorePseudoClasses: possibleValues,
			ignoreHostSelectors: possibleValues,
		};
		const mainOptions = { actual: maxDepth, possible: [PluginHelper.isNumber] };
		const optionalOptions = {
			optional: true,
			actual: secondaryOptions,
			possible: possibleSecondary,
		};
		if (!this.validateOptions(mainOptions, optionalOptions)) return;
		this.checkRule(result, maxDepth, secondaryOptions);
		this.checkAtRule(result, maxDepth, secondaryOptions);
	}
	check({ options: maxDepth, secondaryOptions, rule }) {
		const isIgnoreAtRule = this.isIgnoreAtRule(rule, secondaryOptions);
		const isIgnoreRule = this.isIgnoreRule(rule, secondaryOptions);
		if (isIgnoreAtRule || isIgnoreRule || PluginHelper.validateSyntaxBlock(rule)) return;
		const nestingDepth = this.nestingDepth(rule, 0, secondaryOptions);
		if (nestingDepth === 0) this.isIgnoreHostSelector = this.isIgnoreHostSelectors(rule, secondaryOptions);
		const depth = this.isIgnoreHostSelector ? maxDepth + 1 : maxDepth;
		if (nestingDepth <= depth) return;
		this.reportProblem({ node: rule, messageArgs: [maxDepth] });
	}
	nestingDepth(node, level, secondaryOptions) {
		const parent = node.parent;
		if (!parent) {
			return 0;
		}
		const isParentRoot = PluginHelper.isRoot(parent);
		const isGrandparentRootAndParentAtRule =
			PluginHelper.isAtRule(parent) && parent.parent && PluginHelper.isRoot(parent.parent);
		// The nesting maxDepth level's computation has finished
		// when this function, recursively called, receives
		// a node that is not nested -- a direct child of the
		// root node
		if (isParentRoot || isGrandparentRootAndParentAtRule) {
			return level;
		}
		const isIgnoreAtRule = this.isIgnoreAtRule(parent, secondaryOptions);
		const ignoresBlocklessAtRules =
			PluginHelper.optionsMatches(secondaryOptions, 'ignore', 'blockless-at-rules') &&
			PluginHelper.isAtRule(node) &&
			node.every(child => !PluginHelper.isDeclaration(child));
		const ignoresPseudoClasses =
			PluginHelper.optionsMatches(secondaryOptions, 'ignore', 'pseudo-classes') &&
			PluginHelper.isRule(node) &&
			this.containsPseudoClassesOnly(node.selector);
		const ignoresSpecificPseudoClassesOrRules =
			PluginHelper.isRule(node) && this.containsIgnoredPseudoClassesOrRulesOnly(node.selectors, secondaryOptions);
		const isIgnoreRule =
			isIgnoreAtRule || ignoresBlocklessAtRules || ignoresPseudoClasses || ignoresSpecificPseudoClassesOrRules;
		// Unless any of the conditions above apply, we want to
		// add 1 to the nesting maxDepth level and then check the parent,
		// continuing to add and move up the hierarchy
		// until we hit the root node
		return this.nestingDepth(parent, isIgnoreRule ? level : level + 1, secondaryOptions);
	}
	isIgnoreRule(node, secondaryOptions) {
		return PluginHelper.isRule(node) && PluginHelper.optionsMatches(secondaryOptions, 'ignoreRules', node.selector);
	}
	isIgnoreAtRule(node, secondaryOptions) {
		return PluginHelper.isAtRule(node) && PluginHelper.optionsMatches(secondaryOptions, 'ignoreAtRules', node.name);
	}
	isIgnoreHostSelectors(node, secondaryOptions) {
		return (
			PluginHelper.isParentRoot(node) &&
			PluginHelper.isRule(node) &&
			PluginHelper.optionsMatches(secondaryOptions, 'ignoreHostSelectors', node.selector)
		);
	}
	containsPseudoClassesOnly(selector) {
		const normalized = parser().processSync(selector, { lossless: false });
		const selectors = normalized.split(',');
		return selectors.every(item => this.extractPseudoRule(item));
	}
	containsIgnoredPseudoClassesOrRulesOnly(selectors, secondaryOptions) {
		const ignorePseudoClasses = secondaryOptions?.ignorePseudoClasses;
		const ignoreRules = secondaryOptions?.ignoreRules;
		const hasIgnoredEntities = !!ignorePseudoClasses || !!ignoreRules;
		return secondaryOptions && hasIgnoredEntities && this.allSelectorsMatchIgnoredRules(selectors, secondaryOptions);
	}
	allSelectorsMatchIgnoredRules(selectors, secondaryOptions) {
		return selectors.every(selector => {
			const ignoresRules =
				secondaryOptions?.ignoreRules && PluginHelper.optionsMatches(secondaryOptions, 'ignoreRules', selector);
			const ignorePseudoClasses = secondaryOptions?.ignorePseudoClasses;
			if (ignoresRules) return true;
			if (!ignorePseudoClasses) return false;
			const pseudoRule = this.extractPseudoRule(selector);
			return pseudoRule && PluginHelper.optionsMatches(secondaryOptions, 'ignorePseudoClasses', pseudoRule);
		});
	}
	extractPseudoRule(selector) {
		// Check if the selector starts with '&:' and does not have a double colon '::' indicating a pseudo-element
		const startsWithPseudoClass = selector.startsWith('&:') && selector[2] !== ':';
		// Extract and return the pseudo-rule part of the selector if the above condition is true, otherwise return undefined
		return startsWithPseudoClass ? selector.slice(2) : undefined;
	}
}

const pluginMaxNestingDepthProvider = () => {
	return {
		provide: PluginMaxNestingDepth,
		options: [
			3,
			{
				ignore: ['pseudo-classes'],
				ignoreRules: ['/^&::/', '/^::/'],
				ignoreAtRules: ['/^\\include/', '/^\\media/'],
				ignoreHostSelectors: [/:host/],
			},
		],
	};
};

class PluginNoSelfNesting extends PluginBase {
	constructor() {
		super(...arguments);
		this.isArrayOptions = true;
		this.ruleName = 'no-self-nesting';
		this.message = (scopeName, nestedName) =>
			`Nesting is not allowed for child selector '${nestedName}' under parent selector '${scopeName}' when they match the specified pattern.`;
	}
	initialize({ options, result }) {
		const mainOptions = { actual: options, possible: RuleHelper.areRulesOrRuleAts };
		if (!this.validateOptions(mainOptions)) return;
		this.checkRule(result, options);
		this.checkAtRule(result, options);
	}
	check({ rule, options }) {
		if (PluginHelper.validateSyntaxBlock(rule)) return;
		const nestedData = this.getNestingData(rule, options);
		if (!nestedData) return;
		const messageArgs = [nestedData.scopeName, nestedData.violatedName];
		this.reportProblem({ node: nestedData.violatedNode, messageArgs });
	}
	getNestingData(node, options) {
		const validationRuleName = PluginHelper.getRuleName(node);
		const validationRuleParams = PluginHelper.getRuleParams(node);
		const validationRule = options.find(option => {
			if (RuleHelper.isRule(option)) {
				return PluginHelper.matchesStringOrRegExp(validationRuleName, option.selector);
			}
			const hasParams = !!validationRuleParams && !!option.parameter;
			const isMatchedName = !!PluginHelper.matchesStringOrRegExp(validationRuleName, option.name);
			const isMatchedParams = hasParams && !!PluginHelper.matchesStringOrRegExp(validationRuleParams, option.parameter);
			return hasParams ? isMatchedName && isMatchedParams : isMatchedName;
		});
		if (!validationRule) return null;
		const childNodes = node.nodes;
		if (!childNodes?.length) return null;
		const childMatchNodes = [];
		node.walk(child => {
			const isValidRule = PluginHelper.isRule(child) || PluginHelper.isAtRule(child);
			if (!isValidRule) return;
			if (RuleHelper.isRule(validationRule) && PluginHelper.isRule(child)) {
				PluginHelper.matchesStringOrRegExp(child.selector, validationRule.selector) && childMatchNodes.push(child);
			}
			if (RuleHelper.isRuleAt(validationRule) && PluginHelper.isAtRule(child)) {
				const hasParams = !!validationRule.parameter && !!child.params;
				const isMatched = !!PluginHelper.matchesStringOrRegExp(child.name, validationRule.name);
				const isMatchedParams =
					hasParams && !!PluginHelper.matchesStringOrRegExp(child.params, validationRule.parameter);
				hasParams
					? isMatched && isMatchedParams && childMatchNodes.push(child)
					: isMatched && childMatchNodes.push(child);
			}
		});
		const violatedNode = childMatchNodes.find(item => !!item);
		if (!violatedNode) return null;
		const scopeName = this.getMessageName(validationRuleName, validationRuleParams);
		const violatedName = PluginHelper.getRuleName(violatedNode);
		const violatedParams = PluginHelper.getRuleParams(violatedNode);
		const violatedMessageName = this.getMessageName(violatedName, violatedParams);
		return violatedNode && { scopeName, violatedNode, violatedName: violatedMessageName };
	}
	getMessageName(name, params) {
		return params ? `@${name} ${params}` : name;
	}
}

const pluginNoSelfNestingProvider = () => {
	return {
		provide: PluginNoSelfNesting,
		options: [
			RuleHelper.createSelector('body'),
			RuleHelper.createSelector('html'),
			RuleHelper.createSelector('main'),
			RuleHelper.createSelector('h1'),
			RuleHelper.createSelector(/^:host/),
			RuleHelper.createSelector(/^&:host/),
			RuleHelper.createSelector(/^::ng-deep/),
			RuleHelper.createSelector(/^&::ng-deep/),
			RuleHelper.createInclude(/^media-/),
		],
	};
};

const plugins = [pluginMaxNestingDepthProvider(), pluginNoSelfNestingProvider()];

const Plugin = config => {
	return constructor => {
		return class extends constructor {
			constructor(...args) {
				super(...args);
				const currentPlugins = this.plugins || [];
				const currentRules = this.rules;
				this.plugins = [...currentPlugins, ...config.providers.map(({ provide }) => new provide().createRule())];
				this.rules = Object.assign(
					{},
					currentRules,
					...config.providers.map(({ options }, index) => {
						const ruleName = new config.providers[index].provide().name;
						return { [ruleName]: options };
					})
				);
			}
		};
	};
};

/**
 * Docs:
 * @see https://stylelint.io/user-guide/rules
 */
let Configuration = class Configuration {
	constructor() {
		this.extends = ['stylelint-config-standard'];
		this.customSyntax = 'postcss-scss';
		this.ignoreFiles = ['**/*.css'];
		this.plugins = [
			/**
			 * @name order/order
			 * @name order/properties-order
			 * @see https://www.npmjs.com/package/stylelint-order
			 */
			'stylelint-order',
		];
		this.rules = {
			/* At-rule */
			'at-rule-no-unknown': [
				true,
				{
					'ignoreAtRules': RULE_NO_UNKNOWN,
				},
			],
			'at-rule-property-required-list': {
				'font-face': ['font-display', 'font-family', 'font-style'],
			},
			/* Color */
			'color-function-notation': ['legacy', { 'ignore': ['with-var-inside'] }],
			'color-no-hex': true,
			/* Declaration block */
			'declaration-block-no-duplicate-properties': true,
			'declaration-block-no-redundant-longhand-properties': null,
			/* Declaration property */
			'declaration-property-unit-allowed-list': RULE_PROPERTY_UNIT_ALLOWED_LIST,
			'declaration-property-value-no-unknown': true,
			/* Function */
			'function-disallowed-list': ['rgb'],
			'function-url-no-scheme-relative': true,
			'function-url-scheme-disallowed-list': ['ftp', '/^http/'],
			/* Media feature */
			'media-feature-name-no-vendor-prefix': true,
			'media-feature-name-unit-allowed-list': RULE_PROPERTY_UNIT_ALLOWED_LIST,
			/* Rule */
			'rule-selector-property-disallowed-list': {
				'/ri\\-/': ['font-size'],
				'/^\\.ri-/': ['font-size'],
				'i': ['font-size'],
			},
			/* Selector */
			'selector-disallowed-list': [
				'i',
				'/^\\.container/',
				'/^\\.g-col/',
				'/^\\.col/',
				'/^\\.grid/',
				'/\\[data-test.+]/',
				'/\\[data-po.+]/',
			],
			'selector-max-attribute': 1,
			'selector-max-id': 1,
			'selector-no-qualifying-type': true,
			'selector-not-notation': 'simple',
			'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['ng-deep'] }],
			/* Time */
			'time-min-milliseconds': 50,
			/* Unit */
			'unit-allowed-list': RULE_UNIT_ALLOWED_LIST,
			/* Plugin */
			'order/order': ORDER_CONTENT,
			'order/properties-order': [
				{
					properties: ORDER_PROPERTIES,
				},
			],
			/* Notation */
			'font-weight-notation': 'numeric',
		};
	}
};
Configuration = __decorate([Plugin({ providers: plugins })], Configuration);
var index = { ...new Configuration() };

export { index as default };
//# sourceMappingURL=.stylelintrc.js.map
