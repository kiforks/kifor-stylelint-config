import { MediaConfig } from '../../../../../media/configs/media/media.config';

import { MediaRuleHelper } from '../../../../../media/helpers/media-rule-helper/media-rule.helper';
import { OrderRegExpHelper } from '../../../../helpers/order-reg-exp/order-reg-exp.helper';
import { OrderHelper } from '../../../../helpers/order/order.helper';

import { ORDER_CONTENT_MEDIA_QUERY } from '../order-content-media-query/order-content-media-query.constant';
import { ORDER_CONTENT_PSEUDO_CLASS_INCLUDES } from '../order-content-pseudo-class-includes/order-content-pseudo-class-includes.constant';
import { ORDER_CONTENT_PSEUDO_CLASSES } from '../order-content-pseudo-classes/order-content-pseudo-classes.constant';
import { ORDER_CONTENT_PSEUDO_ELEMENT_INCLUDES } from '../order-content-pseudo-elements-includes/order-content-pseudo-elements-includes.constant';
import { ORDER_CONTENT_PSEUDO_ELEMENTS } from '../order-content-pseudo-elements/order-content-pseudo-elements.constant';
import { ORDER_CONTENT_SELECTORS } from '../order-content-selectors/order-content-selectors.constant';

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
export const ORDER_CONFIG = [
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
	...MediaRuleHelper.createDeviceOrderRules(MediaConfig.DEVICES),
	/**
	 * SCSS Media includes for minimum breakpoints:
	 * @example @include media-min(md);
	 */
	...MediaRuleHelper.createBreakpointOrderRules('min', MediaConfig.BREAKPOINTS),
	/**
	 * SCSS Media includes for maximum breakpoints:
	 * @example @include media-max(md);
	 */
	...MediaRuleHelper.createBreakpointOrderRules('max', MediaConfig.BREAKPOINTS),
	/**
	 * SCSS Media includes for specific breakpoints:
	 * @example @include media-only(md);
	 */
	...MediaRuleHelper.createBreakpointOrderRules('only', MediaConfig.BREAKPOINTS),
	/**
	 * SCSS Media includes for range between breakpoints:
	 * @example @include media-between(md, lg);
	 */
	...MediaRuleHelper.createBreakpointBetweenOrderRules(MediaConfig.BREAKPOINTS),
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

export const ORDER_CONTENT = OrderRegExpHelper.parametersToWildcardRegex(ORDER_CONFIG);
