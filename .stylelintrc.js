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

/**
 * Provides configuration settings for media queries in a responsive design context.
 */
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

class OrderHelper {
	/**
	 * Checks if the given object conforms to the Rule interface.
	 * @param obj - The object to be checked.
	 * @returns true if obj is a Rule type, false otherwise.
	 * @example For isRule({ type: 'rule', selector: '.example' }), returns true.
	 */
	static isRule(obj) {
		const isObject = typeof obj === 'object' && obj !== null;
		return isObject && 'type' in obj && obj.type === 'rule';
	}
	/**
	 * Checks if the given object conforms to the OrderAtRule interface.
	 * @param obj - The object to be checked.
	 * @returns true if obj is a OrderAtRule type, false otherwise.
	 * @example For isAtRule({ type: 'at-rule', name: 'font-feature-values' }), returns true.
	 */
	static isAtRule(obj) {
		const isObject = typeof obj === 'object' && obj !== null;
		return isObject && 'type' in obj && obj.type === 'at-rule';
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
		return selectors.map(selector => OrderHelper.createSelector(selector));
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
		return mixins.map(mixin => OrderHelper.createInclude(mixin));
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
		return parameters.map(parameter => OrderHelper.createAtRule(name, parameter));
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
	 * @example: For getBreakpointPrefixParameter('min'), the output is: '^media-min'.
	 */
	static getRuleFullBreakpointPrefix(prefix) {
		return `${MediaConfig.PREFIX}${prefix}`;
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
		return OrderHelper.createInclude(MediaRuleHelper.getDevicePrefixParameter(device));
	}
	/**
	 * @param prefix - Type of breakpoint prefix.
	 * @param breakpoint - Media breakpoint value.
	 * @example: For createBreakpointRuleOrder('min', 'sm'), the output is:
	 * { type: 'at-rule', name: 'include', parameter: '^media-min(sm)' }.
	 */
	static createBreakpointRuleOrder(prefix, breakpoint) {
		return OrderHelper.createInclude(MediaRuleHelper.getBreakpointPrefixParameter(prefix, breakpoint));
	}
	/**
	 * @param breakpointFrom - Media breakpoint value (e.g., 'xs', 'sm').
	 * @param breakpointTo - Media breakpoint value (e.g., 'xs', 'sm').
	 * @example: For createBreakpointBetweenRuleOrder('xs', 'sm'), the output is:
	 * { type: 'at-rule', name: 'include', parameter: '^media-between(xs, sm)' }.
	 */
	static createBreakpointBetweenRuleOrder(breakpointFrom, breakpointTo) {
		return OrderHelper.createInclude(MediaRuleHelper.getBreakpointBetweenPrefixParameter(breakpointFrom, breakpointTo));
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

class OrderRegExpHelper {
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
			const isAtRule = OrderHelper.isAtRule(rule) && rule.type === 'at-rule';
			return isAtRule && typeof rule.parameter === 'string'
				? {
						...rule,
						parameter: OrderRegExpHelper.makeRegex(rule.parameter).source,
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
	 * @returns An array of AtRule objects representing the created media feature at-rules.
	 *
	 * @example
	 * For createMediaFeatures(['max-width: 768px', 'min-resolution: 2dppx']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'media', parameter: '(max-width: 768px)' },
	 *    { type: 'at-rule', name: 'media', parameter: '(min-resolution: 2dppx)' }
	 * ].
	 */
	static createMediaFeatures(features) {
		return OrderHelper.createAtRules(
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
		const ampCollection = OrderHelper.createSelectors(pseudoClasses.map(element => `^&:${element}`));
		const collection = OrderHelper.createSelectors(pseudoClasses.map(element => `^:${element}`));
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
		const ampCollection = OrderHelper.createSelectors(pseudoElements.map(element => `^&::${element}`));
		const collection = OrderHelper.createSelectors(pseudoElements.map(element => `^::${element}`));
		return [...collection, ...ampCollection];
	}
}

const ORDER_CONTENT_MEDIA_QUERY = [
	OrderHelper.createAtRule('media'),
	/*
	 * Standard media types
	 * */
	...OrderHelper.createAtRules('media', ['all', 'print', 'screen', 'speech']),
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

const ORDER_CONTENT_PSEUDO_CLASS_INCLUDES = OrderHelper.createIncludes(['hover', 'active', 'focus']);

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

const ORDER_CONTENT_PSEUDO_ELEMENT_INCLUDES = OrderHelper.createIncludes([
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

const ORDER_CONTENT_SELECTORS = OrderHelper.createSelectors([
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
	OrderHelper.createAtRule('charset'),
	/**
	 * CSS import rule:
	 * @example @import url("fineprint.css");
	 */
	OrderHelper.createAtRule('import'),
	/**
	 * CSS font-face rule:
	 * @example @font-face { font-family: 'Graublau Web'; src: url('GraublauWeb.woff') format('woff'); }
	 */
	OrderHelper.createAtRule('font-face'),
	/**
	 * CSS font-feature-values rule:
	 * @example @font-feature-values Font Family Name { @styleset { style1 value1, style2 value2, ... } }
	 */
	OrderHelper.createAtRule('font-feature-values'),
	/**
	 * CSS font-palette-values rule:
	 * @example @font-palette-values Font Family Name { base-palette: ...; override-palette: ...; }
	 */
	OrderHelper.createAtRule('font-palette-values'),
	/**
	 * CSS keyframes rule:
	 * @example @keyframes slide { from { transform: translateX(0%); } to { transform: translateX(100%); } }
	 */
	OrderHelper.createAtRule('keyframes'),
	/**
	 * CSS layer rule (specific to Firefox):
	 * @example @layer base, components { ... }
	 */
	OrderHelper.createAtRule('layer'),
	/**
	 * CSS property rule:
	 * @example @property --main-bg-color { syntax: '<color>'; initial-value: #c0ffee; inherits: false; }
	 */
	OrderHelper.createAtRule('property'),
	/**
	 * CSS counter-style rule:
	 * @example @counter-style custom { system: cyclic; symbols: '*' '+' '-' }
	 */
	OrderHelper.createAtRule('counter-style'),
	/**
	 * CSS namespace rule:
	 * @example @namespace svg url(http://www.w3.org/2000/svg);
	 */
	OrderHelper.createAtRule('namespace'),
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
	OrderHelper.createInclude('^reset'),
	/**
	 * CSS declarations:
	 * @example display: block;
	 */
	'declarations',
	/**
	 * SCSS extend
	 * @example @extend .some-class
	 */
	OrderHelper.createAtRule('extend'),
	/**
	 * SCSS includes
	 * @example @include some-mixin;
	 */
	OrderHelper.createInclude('include'),
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
	OrderHelper.createAtRule('page'),
	/**
	 * CSS container rule:
	 * @example @container (min-width: 100%) { ... }
	 */
	OrderHelper.createAtRule('container'),
	/**
	 * CSS supports rule:
	 * @example @supports (display: grid) { ... }
	 */
	OrderHelper.createAtRule('supports'),
];
const ORDER_CONTENT = OrderRegExpHelper.paramToRegex(ORDER_CONFIG);

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
	static isInvalidSyntaxBlock(rule) {
		const hasRuleBlock = PluginHelper.hasBlock(rule);
		const isNotStandardSyntaxRule = PluginHelper.isRule(rule) && !PluginHelper.isStandardSyntaxRule(rule);
		return !hasRuleBlock || isNotStandardSyntaxRule;
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
	static isChildPluginAtRule(child) {
		return PluginHelper.isAtRule(child);
	}
	static isValidChildPluginRule(child) {
		return PluginHelper.isRule(child) || PluginHelper.isAtRule(child);
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
 * An abstract base class for creating plugins. This class provides a structured approach to
 * implementing custom plugins for a system (like a linter or a compiler). Each plugin
 * derived from this base class must define specific rules and behaviors.
 *
 * @abstract
 * The class is abstract and intended to be extended by specific plugin implementations.
 * It contains abstract methods and properties that must be defined by the extending class.
 */
class PluginBase {
	constructor() {
		/**
		 * Indicates whether the options are expected to be an array. Defaults to false.
		 */
		this.isArrayOptions = false;
	}
	/**
	 * Returns the full rule name, including the namespace.
	 */
	get name() {
		return `${PluginConfig.NAMESPACE}/${this.ruleName}`;
	}
	/**
	 * Constructs the rule messages object for this plugin.
	 */
	get messages() {
		return ruleMessages(this.name, {
			expected: this.message,
		});
	}
	/**
	 * Creates a rule plugin that can be used within the stylelint configuration.
	 * @returns The constructed plugin with the defined rule and configuration.
	 */
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
	/**
	 * Orchestrates the validation, rule checking, and reporting based on the provided plugin data.
	 */
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
		this.isValidOptions = (options, secondaryOptions) =>
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
		if (!this.isValidOptions(mainOptions, optionalOptions)) return;
		this.checkRule(result, maxDepth, secondaryOptions);
		this.checkAtRule(result, maxDepth, secondaryOptions);
	}
	check({ options: maxDepth, secondaryOptions, rule }) {
		const isIgnoreAtRule = this.isIgnoreAtRule(rule, secondaryOptions);
		const isIgnoreRule = this.isIgnoreRule(rule, secondaryOptions);
		if (isIgnoreAtRule || isIgnoreRule || PluginHelper.isInvalidSyntaxBlock(rule)) return;
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

/**
 * The PluginConfigHelper class provides static methods to create and validate plugin configuration
 * rules and at-rules for CSS processing. It offers functionality to work with stylelint rules and
 * configurations, aiding in the creation and validation of custom plugin configurations.
 */
class PluginConfigHelper {
	/**
	 * Determines if all elements in the array are AtRule objects.
	 *
	 * @param array - The array to be checked.
	 * @returns True if all elements are AtRule objects, false otherwise.
	 * @example
	 * PluginConfigHelper.areAtRules([{ name: 'media', params: '(min-width: 500px)' }, { name: 'charset', params: '"utf-8"' }]); // returns true
	 */
	static areAtRules(array) {
		return Array.isArray(array) && array.every(element => PluginConfigHelper.isAtRule(element));
	}
	/**
	 * Determines if all elements in the array are Rule objects.
	 *
	 * @param array - The array to be checked.
	 * @returns True if all elements are Rule objects, false otherwise.
	 * @example
	 * PluginConfigHelper.areRules([{ selector: '.example' }, { selector: '#id' }]); // returns true
	 */
	static areRules(array) {
		return Array.isArray(array) && array.every(element => PluginConfigHelper.isRule(element));
	}
	/**
	 * Checks if the provided object is a Rule.
	 *
	 * @param obj - The object to be checked.
	 * @returns True if the object is a Rule, false otherwise.
	 * @example
	 * PluginConfigHelper.isRule({ selector: '.example' }); // returns true
	 */
	static isRule(obj) {
		return typeof obj === 'object' && obj !== null && 'selector' in obj;
	}
	/**
	 * Checks if the provided object is an AtRule.
	 *
	 * @param obj - The object to be checked.
	 * @returns True if the object is an AtRule, false otherwise.
	 * @example
	 * PluginConfigHelper.isAtRule({ name: 'media', params: '(min-width: 500px)' }); // returns true
	 */
	static isAtRule(obj) {
		return typeof obj === 'object' && obj !== null && 'name' in obj;
	}
	/**
	 * Validates whether the provided data is a valid rule configuration.
	 *
	 * @param array - The data to validate.
	 * @returns True if the data is a valid rule configuration, false otherwise.
	 * @example PluginConfigHelper.isValidRuleData([{ selector: '.example' }, { name: 'media', params: '(max-width: 600px)' }]);
	 * // returns true
	 */
	static isValidRuleData(array) {
		return (
			Array.isArray(array) &&
			array.every(element => PluginConfigHelper.isRule(element) || PluginConfigHelper.isAtRule(element))
		);
	}
	/**
	 * Creates an AtRule include object with specified parameters.
	 *
	 * @param params - The parameters for the AtRule.
	 * @returns An AtRule include object.
	 * @example
	 * PluginConfigHelper.createAtRuleInclude('^media-'); // returns { name: 'include', params: '^media-' }
	 */
	static createAtRuleInclude(params) {
		return params
			? {
					name: 'include',
					params,
				}
			: { name: 'include' };
	}
	/**
	 * Creates a Rule object with a specified selector.
	 *
	 * @param selector - The selector for the rule.
	 * @returns A Rule object.
	 * @example
	 * PluginConfigHelper.createRule('.example'); // returns { selector: '.example' }
	 */
	static createRule(selector) {
		return {
			selector,
		};
	}
	/**
	 * Creates an AtRule object with specified name and parameters.
	 *
	 * @param name - The name of the AtRule.
	 * @param params - The parameters of the AtRule.
	 * @returns An AtRule object.
	 * @example
	 * PluginConfigHelper.createAtRule('media', '(min-width: 500px)'); // returns { name: 'media', params: '(min-width: 500px)' }
	 */
	static createAtRule(name, params) {
		return params
			? {
					name,
					params,
				}
			: { name };
	}
	/**
	 * Creates an array of Rule objects from an array of selectors.
	 *
	 * @param selectors - An array of selectors.
	 * @returns An array of Rule objects.
	 * @example
	 * PluginConfigHelper.createRules(['.example', '#id']); // returns [{ selector: '.example' }, { selector: '#id' }]
	 */
	static createRules(selector) {
		return selector.map(selector => PluginConfigHelper.createRule(selector));
	}
	/**
	 * Creates an array of AtRule objects from a name and an array of parameters.
	 *
	 * @param name - The name for the AtRules.
	 * @param params - An array of parameters.
	 * @returns An array of AtRule objects.
	 * @example PluginConfigHelper.createAtRulesFromParams('media', ['(min-width: 500px)', '(max-width: 1000px)']);
	 * // returns [{ name: 'media', params: '(min-width: 500px)' }, { name: 'media', params: '(max-width: 1000px)' }]
	 */
	static createAtRulesFromParams(name, params) {
		return params.map(param => PluginConfigHelper.createAtRule(name, param));
	}
	/**
	 * Creates an array of AtRule include objects from an array of parameters.
	 *
	 * @param params - An array of parameters for the include AtRules.
	 * @returns An array of AtRule include objects.
	 * @example
	 * PluginConfigHelper.createAtRuleIncludes(['^media-', '^print-']); // returns [{ name: 'include', params: '^media-' }, { name: 'include', params: '^print-' }]
	 */
	static createAtRuleIncludes(params) {
		return PluginConfigHelper.createAtRulesFromParams('include', params);
	}
	/**
	 * Retrieves validation data for a given rule, determining if the rule conforms to the provided configuration.
	 *
	 * @param rule - The rule to validate.
	 * @param configData - The configuration data against which the rule is validated.
	 * @returns Validation data if the rule is valid, null otherwise.
	 * @example
	 * PluginConfigHelper.getValidationData(rule, [{ selector: '.example' }]);
	 * // returns the validation data for '.example'
	 */
	static getValidationData(rule, configData) {
		if (PluginHelper.isRule(rule)) {
			const ruleConfigData = Array.isArray(configData) ? PluginConfigHelper.getRuleOptions(configData) : configData;
			return PluginConfigHelper.getValidationRule(rule, ruleConfigData);
		}
		const atRuleConfigData = Array.isArray(configData) ? PluginConfigHelper.getAtRuleOptions(configData) : configData;
		return PluginConfigHelper.getValidationAtRule(rule, atRuleConfigData);
	}
	/**
	 * Retrieves validation data for a CSS rule based on the plugin configuration.
	 *
	 * @param rule - The CSS rule to validate.
	 * @param configData - The plugin configuration for rules.
	 * @returns Validation data for the rule, or null if it does not conform to the configuration.
	 * @example
	 * PluginConfigHelper.getValidationRule(rule, { selector: '.example' });
	 * // returns validation data for '.example'
	 */
	static getValidationRule(rule, configData) {
		const { selector } = rule;
		const validationRule = Array.isArray(configData)
			? configData.find(option => PluginHelper.matchesStringOrRegExp(selector, option.selector))
			: PluginHelper.matchesStringOrRegExp(selector, configData.selector) && configData;
		return validationRule
			? {
					rule: validationRule,
					messageName: `${validationRule.selector}`,
					messageFormattedName: `${validationRule.selector}`,
				}
			: null;
	}
	/**
	 * Retrieves validation data for an AtRule based on the plugin configuration.
	 *
	 * @param rule - The AtRule to validate.
	 * @param configData - The plugin configuration for at-rules.
	 * @returns Validation data for the AtRule, or null if it does not conform to the configuration.
	 * @example
	 * PluginConfigHelper.getValidationAtRule(atRule, { name: 'media', params: '(min-width: 500px)' });
	 * // returns validation data for the 'media' AtRule
	 */
	static getValidationAtRule(rule, configData) {
		const validationRule = Array.isArray(configData)
			? configData.find(option => PluginConfigHelper.isValidationAtRule(rule, option))
			: PluginConfigHelper.isValidationAtRule(rule, configData) && configData;
		if (!validationRule) return null;
		const messageName = validationRule.params
			? `"${validationRule.name} ${validationRule.params}"`
			: `"${validationRule.name}"`;
		const messageFormattedName = validationRule.params ? `"@${rule.name} ${rule.params}"` : `"@${rule.name}"`;
		return {
			rule: validationRule,
			messageName,
			messageFormattedName,
		};
	}
	/**
	 * Filters and returns an array of Rule configurations from the given plugin configuration options.
	 *
	 * @param options - The array of plugin configuration options.
	 * @returns An array of Rule configurations.
	 * @example
	 * PluginConfigHelper.getRuleOptions([{ selector: '.example' }, { name: 'media', params: '(max-width: 600px)' }]);
	 * // returns [{ selector: '.example' }]
	 */
	static getRuleOptions(options) {
		return options.filter(option => PluginConfigHelper.isRule(option));
	}
	/**
	 * Filters and returns an array of AtRule configurations from the given plugin configuration options.
	 *
	 * @param options - The array of plugin configuration options.
	 * @returns An array of AtRule configurations.
	 * @example
	 * PluginConfigHelper.getAtRuleOptions([{ selector: '.example' }, { name: 'media', params: '(max-width: 600px)' }]);
	 * // returns [{ name: 'media', params: '(max-width: 600px)' }]
	 */
	static getAtRuleOptions(options) {
		return options.filter(option => PluginConfigHelper.isAtRule(option));
	}
	/**
	 * Determines if a given AtRule object matches a specified validation AtRule configuration.
	 *
	 * @param rule - The AtRule object to be checked.
	 * @param option - The validation AtRule configuration to match against.
	 * @returns True if the AtRule object matches the validation configuration, false otherwise.
	 * @example
	 * // Given a plain AtRule object and a corresponding validation rule
	 * const atRule = { name: 'media', params: '(max-width: 600px)' };
	 * const validationRule = { name: 'media', params: '(max-width: 600px)' };
	 * PluginConfigHelper.isValidationAtRule(atRule, validationRule);
	 * // returns true
	 *
	 * @example
	 * // If the AtRule object doesn't match the validation rule's parameters
	 * const atRuleDifferentParams = { name: 'media', params: '(min-width: 300px)' };
	 * PluginConfigHelper.isValidationAtRule(atRuleDifferentParams, validationRule);
	 * // returns false
	 */
	static isValidationAtRule({ name, params }, option) {
		const hasParams = !!params && !!option.params;
		const isMatchedName = !!PluginHelper.matchesStringOrRegExp(name, option.name);
		const isMatchedParams = hasParams && !!PluginHelper.matchesStringOrRegExp(params, option.params);
		return hasParams ? isMatchedName && isMatchedParams : isMatchedName;
	}
}

class PluginMediaConfig {
	/**
	 * Mixin for applying media prefix in CSS rules.
	 * @example for PluginMediaConfig.MEDIA_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-' }.
	 */
	static {
		this.MEDIA_PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(MediaConfig.PREFIX);
	}
	/**
	 * Regular expression mixin for matching media prefix in CSS rules.
	 * @example for PluginMediaConfig.MEDIA_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-/ }.
	 */
	static {
		this.MEDIA_PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(new RegExp(MediaConfig.PREFIX));
	}
	/**
	 * Mixin for creating minimum width media queries.
	 * @example for PluginMediaConfig.MEDIA_MIN_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-min' }.
	 */
	static {
		this.MEDIA_MIN_PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(
			MediaRuleHelper.getRuleFullBreakpointPrefix('min')
		);
	}
	/**
	 * Mixin for creating maximum width media queries.
	 * @example for PluginMediaConfig.MEDIA_MAX_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-max' }.
	 */
	static {
		this.MEDIA_MAX_PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(
			MediaRuleHelper.getRuleFullBreakpointPrefix('max')
		);
	}
	/**
	 * Mixin for media queries targeting a specific breakpoint only.
	 * @example for PluginMediaConfig.MEDIA_ONLY_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-only' }.
	 */
	static {
		this.MEDIA_ONLY_PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(
			MediaRuleHelper.getRuleFullBreakpointPrefix('only')
		);
	}
	/**
	 * Mixin for media queries targeting a range of breakpoints.
	 * @example for PluginMediaConfig.MEDIA_BETWEEN_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-between' }.
	 */
	static {
		this.MEDIA_BETWEEN_PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(
			MediaRuleHelper.getRuleFullBreakpointPrefix('between')
		);
	}
	/**
	 * Regular expression mixin for creating minimum width media queries.
	 * @example for PluginMediaConfig.MEDIA_MIN_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-min/ }.
	 */
	static {
		this.MEDIA_MIN_PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(
			new RegExp(MediaRuleHelper.getRuleFullBreakpointPrefix('min'))
		);
	}
	/**
	 * Regular expression mixin for creating maximum width media queries.
	 * @example for PluginMediaConfig.MEDIA_MAX_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-max/ }.
	 */
	static {
		this.MEDIA_MAX_PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(
			new RegExp(MediaRuleHelper.getRuleFullBreakpointPrefix('max'))
		);
	}
	/**
	 * Regular expression mixin for media queries targeting a specific breakpoint only.
	 * @example for PluginMediaConfig.MEDIA_ONLY_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-only/ }.
	 */
	static {
		this.MEDIA_ONLY_PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(
			new RegExp(MediaRuleHelper.getRuleFullBreakpointPrefix('only'))
		);
	}
	/**
	 * Regular expression mixin for media queries targeting a range of breakpoints.
	 * @example for PluginMediaConfig.MEDIA_BETWEEN_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-between/ }.
	 */
	static {
		this.MEDIA_BETWEEN_PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(
			new RegExp(MediaRuleHelper.getRuleFullBreakpointPrefix('between'))
		);
	}
}

class PluginNoDuplicateAtRule extends PluginBase {
	constructor() {
		super(...arguments);
		this.isArrayOptions = true;
		this.ruleName = 'no-duplicate-at-rule';
		this.violatedNodes = [];
		this.message = name => `Unexpected duplicate at-rule ${name} at the same nesting level`;
	}
	initialize({ options, result }) {
		const mainOptions = { actual: options, possible: PluginConfigHelper.areAtRules };
		if (!this.isValidOptions(mainOptions)) return;
		this.checkAtRule(result, options);
	}
	check({ rule, options }) {
		if (PluginHelper.isInvalidSyntaxBlock(rule)) return;
		const validationRule = PluginConfigHelper.getValidationAtRule(rule, options);
		const parent = rule.parent;
		if (!validationRule || !parent) return;
		parent.walk(child => {
			const isInvalidChild = !PluginHelper.isChildPluginAtRule(child) || child === rule || child.parent !== parent;
			if (isInvalidChild) return;
			const childValidationRule = PluginConfigHelper.getValidationAtRule(child, validationRule.rule);
			if (!childValidationRule) return;
			const isNameMatched = childValidationRule.rule === validationRule.rule;
			if (!isNameMatched || this.violatedNodes.includes(child)) return;
			const messageArgs = [childValidationRule.messageName];
			this.reportProblem({ node: child, messageArgs });
			this.violatedNodes.push(rule);
		});
	}
}

const pluginNoDuplicateAtRuleProvider = () => {
	return {
		provide: PluginNoDuplicateAtRule,
		options: [
			/**
			 * SCSS Media at-rules for minimum breakpoints:
			 * @example @include media-min(md);
			 */
			PluginMediaConfig.MEDIA_MIN_PREFIX_REGEXP_MIXIN,
			/**
			 * SCSS Media at-rules for maximum breakpoints:
			 * @example @include media-max(md);
			 */
			PluginMediaConfig.MEDIA_MAX_PREFIX_REGEXP_MIXIN,
			/**
			 * SCSS Media at-rules for specific breakpoints:
			 * @example @include media-only(md);
			 */
			PluginMediaConfig.MEDIA_ONLY_PREFIX_REGEXP_MIXIN,
			/**
			 * SCSS Media at-rules for range between breakpoints:
			 * @example @include media-between(md, lg);
			 */
			PluginMediaConfig.MEDIA_BETWEEN_PREFIX_REGEXP_MIXIN,
		],
	};
};

class PluginNoSelfNesting extends PluginBase {
	constructor() {
		super(...arguments);
		this.isArrayOptions = true;
		this.ruleName = 'no-self-nesting';
		this.message = (nestedName, scopeName) =>
			`Nesting is not allowed for child selector '${nestedName}' under parent selector '${scopeName}' when they match the specified pattern.`;
	}
	initialize({ options, result }) {
		const mainOptions = { actual: options, possible: PluginConfigHelper.isValidRuleData };
		if (!this.isValidOptions(mainOptions)) return;
		this.checkRule(result, options);
		this.checkAtRule(result, options);
	}
	check({ rule, options }) {
		if (PluginHelper.isInvalidSyntaxBlock(rule)) return;
		const validationRule = PluginConfigHelper.getValidationData(rule, options);
		const childNodes = rule.nodes;
		if (!validationRule || !childNodes?.length) return;
		rule.walk(child => {
			if (!PluginHelper.isValidChildPluginRule(child)) return;
			const childValidationRule = PluginConfigHelper.getValidationData(child, options);
			if (!childValidationRule) return;
			const isNameMatched = childValidationRule.rule === validationRule.rule;
			if (!isNameMatched) return;
			const messageArgs = [childValidationRule.messageFormattedName, validationRule.messageName];
			this.reportProblem({ node: child, messageArgs });
		});
	}
}

const pluginNoSelfNestingProvider = () => {
	return {
		provide: PluginNoSelfNesting,
		options: [
			PluginConfigHelper.createRule('body'),
			PluginConfigHelper.createRule('html'),
			PluginConfigHelper.createRule('main'),
			PluginConfigHelper.createRule('h1'),
			PluginConfigHelper.createRule(/^:host/),
			PluginConfigHelper.createRule(/^&:host/),
			PluginConfigHelper.createRule(/^::ng-deep/),
			PluginConfigHelper.createRule(/^&::ng-deep/),
			/**
			 * SCSS Media at-rules for breakpoints:
			 * @example @include media-min(md);
			 */
			PluginMediaConfig.MEDIA_PREFIX_REGEXP_MIXIN,
		],
	};
};

const plugins = [pluginMaxNestingDepthProvider(), pluginNoSelfNestingProvider(), pluginNoDuplicateAtRuleProvider()];

/**
 * Decorator for enriching a configuration class with additional plugins and rules.
 * This decorator modifies the class to include new plugins and their corresponding rules,
 * merging them with any existing plugins and rules.
 *
 * @param config Configuration object specifying plugins and their options.
 * @returns The class augmented with the specified plugins and rules.
 *
 * @example
 * Applying the `Plugin` decorator to the `Configuration` class:
 *
 * @Plugin({
 *   providers: [
 *     {
 *       provide: PluginNoSelfNesting,
 *       options: { someOption: 'value' },
 *     },
 *     {
 *       provide: PluginMaxNestingDepth,
 *       options: { someOption: 'value-2' },
 *     },
 *   ],
 * })
 * class Configuration implements Config {
 *   public plugins = ['stylelint-order'];
 *   public rules = {
 *     'color-no-hex': true,
 *   };
 * }
 *
 * Instantiating Configuration results in an object like this:
 *
 * Configuration {
 *   plugins: [
 *     'stylelint-order',
 *     { ruleName: 'no-self-nesting', rule: [Function] },
 *     { ruleName: 'max-nesting-depth', rule: [Function] }
 *   ],
 *   rules: {
 *     'color-no-hex': true,
 *     'no-self-nesting': { someOption: 'value' },
 *     'max-nesting-depth': { someOption: 'value-2' }
 *   }
 * }
 */
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
			'selector-nested-pattern': '^(?:&:?[^&]+|[^&:]+)$',
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
