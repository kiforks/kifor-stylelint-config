class RuleHelper {
	/**
	 * Checks if the given object conforms to the RuleAt interface.
	 * @param obj - The object to be checked.
	 * @returns true if obj is a RuleAt type, false otherwise.
	 * @example For isRuleAt({ type: 'at-rule', parameter: 'example' }), returns true.
	 */
	static isRuleAt(obj) {
		return typeof obj === 'object' && obj !== null && 'type' in obj && 'parameter' in obj;
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
		return RuleHelper.createSelectors(pseudoClasses.map(element => `^&:${element}`));
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
		return RuleHelper.createSelectors(pseudoElements.map(element => `^&::${element}`));
	}
}
const ORDER_CONTENT_PSEUDO_CLASSES = OrderContentHelper.createPseudoClasses([
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
	'root',
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
const ORDER_CONTENT_PSEUDO_CLASS_INCLUDES = RuleHelper.createIncludes(['hover', 'active', 'focus']);
const ORDER_CONTENT_SELECTORS = RuleHelper.createSelectors([
	'^[a-z]',
	// example: 'div'
	'^\\*',
	// example: '*'
	'^\\.\\w+',
	// example: '.class'
	'^\\w+\\[\\w+',
	// example: 'input[type]'
	'^\\w+\\[\\w+\\$=',
	// example: 'input[type$="text"]'
	'^\\w+\\[\\w+\\^=',
	// example: 'input[type^="text"]'
	'^\\w+\\[\\w+\\*=',
	// example: 'input[type*="text"]'
	'^\\w+\\[\\w+\\~=',
	// example: 'input[type~="text"]'
	'^\\w+\\[\\w+\\|=',
	// example: 'input[type|="text"]'
	'^\\w+\\[\\w+="\\w+"]',
	// example: 'input[type="text"]'
	'^\\[\\w+',
	// example: '[attr]'
	'^\\[\\w+\\$=',
	// example: '[attr$=value]'
	'^\\[\\w+\\^=',
	// example: '[attr^=value]'
	'^\\[\\w+\\*=',
	// example: '[attr*=value]'
	'^\\[\\w+\\~=',
	// example: '[attr~=value]'
	'^\\[\\w+\\|=',
	// example: '[attr|=value]'
	'^\\>',
	// example: '> child'
	'^\\+',
	// example: '+ sibling'
	'^\\~',
	// example: '~ sibling'
	'^#',
	// example: '#id'
	'^&\\.\\w+',
	// example: '&.class'
	'^&\\[\\w+',
	// example: '&[attr]'
	'^&\\[\\w+\\$=',
	// example: '[attr$=value]'
	'^&\\[\\w+\\^=',
	// example: '[attr^=value]'
	'^&\\[\\w+\\*=',
	// example: '[attr*=value]'
	'^&\\[\\w+\\~=',
	// example: '[attr~=value]'
	'^&\\[\\w+\\|=',
	// example: '[attr|=value]'
	'^&',
	// example: '&'
	'^&:not',
	// example: '&:not(.class)'
]);
const _MediaConfig = class _MediaConfig {};
_MediaConfig.BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
_MediaConfig.DEVICES = ['desktop', 'mobile'];
_MediaConfig.PREFIX = '^media-';
let MediaConfig = _MediaConfig;
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
class RegExpHelper {
	/**
	 * Creates a RegExp based on the provided string, inserting a wildcard pattern for flexible matching.
	 * @param parameter - The string to be converted into a RegExp.
	 * @returns A RegExp object based on the input string, enhanced with wildcard patterns.
	 * @example For makeRegex('color: (blue)'), returns a RegExp matching /color: \(blue[\s\S]*\)/.
	 */
	static makeRegex(parameter) {
		const lastOpeningIndex = parameter.lastIndexOf('(');
		const closingIndex = parameter.indexOf(')', lastOpeningIndex);
		const hasValidParenthesis = lastOpeningIndex !== -1 && closingIndex !== -1;
		const modifiedParameter = hasValidParenthesis
			? `${parameter.substring(0, closingIndex)}[\\s\\S]*${parameter.substring(closingIndex)}`
			: `${parameter}[\\s\\S]*`;
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
			if (isAtRule && typeof rule.parameter === 'string') {
				return {
					...rule,
					parameter: RegExpHelper.makeRegex(rule.parameter).source,
				};
			}
			return rule;
		});
	}
}
const ORDER_CONFIG = [
	/**
	 * CSS charset rule:
	 * @example: @charset "UTF-8";
	 */
	RuleHelper.createAtRule('charset'),
	/**
	 * CSS import rule:
	 * @example: @import url("fineprint.css");
	 */
	RuleHelper.createAtRule('import'),
	/**
	 * CSS font-face rule:
	 * @example: @font-face { font-family: 'Graublau Web'; src: url('GraublauWeb.woff') format('woff'); }
	 */
	RuleHelper.createAtRule('font-face'),
	/**
	 * CSS font-feature-values rule:
	 * @example: @font-feature-values Font Family Name { @styleset { style1 value1, style2 value2, ... } }
	 */
	RuleHelper.createAtRule('font-feature-values'),
	/**
	 * CSS font-palette-values rule:
	 * @example: @font-palette-values Font Family Name { base-palette: ...; override-palette: ...; }
	 */
	RuleHelper.createAtRule('font-palette-values'),
	/**
	 * CSS keyframes rule:
	 * @example: @keyframes slide { from { transform: translateX(0%); } to { transform: translateX(100%); } }
	 */
	RuleHelper.createAtRule('keyframes'),
	/**
	 * CSS layer rule (specific to Firefox):
	 * @example: @layer base, components { ... }
	 */
	RuleHelper.createAtRule('layer'),
	/**
	 * CSS property rule:
	 * @example: @property --main-bg-color { syntax: '<color>'; initial-value: #c0ffee; inherits: false; }
	 */
	RuleHelper.createAtRule('property'),
	/**
	 * CSS counter-style rule:
	 * @example: @counter-style custom { system: cyclic; symbols: '*' '+' '-' }
	 */
	RuleHelper.createAtRule('counter-style'),
	/**
	 * CSS namespace rule:
	 * @example: @namespace svg url(http://www.w3.org/2000/svg);
	 */
	RuleHelper.createAtRule('namespace'),
	/**
	 * Custom properties:
	 * @example: --property: 10px;
	 */
	'custom-properties',
	/**
	 * Dollar variables:
	 * @example: $variable: 12px !default;
	 */
	'dollar-variables',
	/**
	 * SCSS includes that has prefix reset:
	 * @example: @include reset-list;
	 */
	RuleHelper.createInclude('^reset'),
	/**
	 * CSS declarations:
	 * @example: display: block;
	 */
	'declarations',
	/**
	 * SCSS extend
	 * @example: @extend .some-class
	 */
	RuleHelper.createAtRule('extend'),
	/**
	 * SCSS includes
	 * @example: @include some-mixin;
	 */
	RuleHelper.createInclude('include'),
	/**
	 * SCSS pseudo classes includes:
	 * @example: @include hover;
	 */
	...ORDER_CONTENT_PSEUDO_ELEMENT_INCLUDES,
	/**
	 * SCSS pseudo elements includes:
	 * @example: @include before-mixin;
	 */
	...ORDER_CONTENT_PSEUDO_CLASS_INCLUDES,
	/**
	 * CSS pseudo classes:
	 * @example: &:hover {}
	 */
	...ORDER_CONTENT_PSEUDO_CLASSES,
	/**
	 * CSS pseudo elements:
	 * @example: &::before {}
	 */
	...ORDER_CONTENT_PSEUDO_ELEMENTS,
	/**
	 * CSS selectors:
	 * @example: div {}
	 */
	...ORDER_CONTENT_SELECTORS,
	/**
	 * SCSS Media includes for specific devices:
	 * @example: @include media-desktop;
	 */
	...MediaRuleHelper.createDeviceRulesOrder(MediaConfig.DEVICES),
	/**
	 * SCSS Media includes for minimum breakpoints:
	 * @example: @include media-min(md);
	 */
	...MediaRuleHelper.createBreakpointRulesOrder('min', MediaConfig.BREAKPOINTS),
	/**
	 * SCSS Media includes for maximum breakpoints:
	 * @example: @include media-max(md);
	 */
	...MediaRuleHelper.createBreakpointRulesOrder('max', MediaConfig.BREAKPOINTS),
	/**
	 * SCSS Media includes for specific breakpoints:
	 * @example: @include media-only(md);
	 */
	...MediaRuleHelper.createBreakpointRulesOrder('only', MediaConfig.BREAKPOINTS),
	/**
	 * SCSS Media includes for range between breakpoints:
	 * @example: @include media-between(md, lg);
	 */
	...MediaRuleHelper.createBreakpointBetweenRulesOrder(MediaConfig.BREAKPOINTS),
	/**
	 * Media queries:
	 * @example: @media (min-width: 768px) {}
	 */
	...ORDER_CONTENT_MEDIA_QUERY,
	/**
	 * CSS page rule:
	 * @example: @page :first { margin: 2in }
	 */
	RuleHelper.createAtRule('page'),
	/**
	 * CSS container rule:
	 * @example: @container (min-width: 100%) { ... }
	 */
	RuleHelper.createAtRule('container'),
	/**
	 * CSS supports rule:
	 * @example: @supports (display: grid) { ... }
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
const ORDER_PROPERTIES = [...position, ...blockModel, ...typography, ...decoration, ...animation, ...miscellanea];
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
const RULE_NO_UNKNOWN = ['mixin', 'include', 'extend', 'content', 'each', 'function', 'return', 'if', 'else'];
const index = {
	/**
	 * Docs:
	 * @see https://stylelint.io/user-guide/rules
	 */
	extends: ['stylelint-config-standard'],
	customSyntax: 'postcss-scss',
	ignoreFiles: ['**/*.css'],
	plugins: ['stylelint-order'],
	rules: {
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
		'declaration-block-no-redundant-longhand-properties': false,
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
		/* Other */
		'max-nesting-depth': [
			3,
			{
				'ignore': ['blockless-at-rules', 'pseudo-classes'],
				'ignoreRules': ['/^&::/', '/^::/'],
				'ignoreAtRules': ['/^\\include/', '/^\\media/'],
			},
		],
	},
};
export { index as default };
