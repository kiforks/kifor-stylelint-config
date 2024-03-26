type Nullable<T> = T | null | undefined;

type RuleRegExp = string | RegExp;
type RegExpStringMatchedElement = { match: string; pattern: string | RegExp; substring: string };
type RegExpStringMatchedData = false | RegExpStringMatchedElement;
