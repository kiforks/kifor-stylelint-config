# kifor-stylelint/no-self-nesting

Prevents nesting of child selectors in the parent if they match the given pattern.

<!-- prettier-ignore -->
```css
a { a { top: 0; } }
/** ↑
 * This is a nested selector that matched with parent */
```

This rule works by checking for 'self-nesting' nesting of child selectors compared to parent selectors. Here's how it works:

<!-- prettier-ignore -->
```css
a { /* parent selector */
  & a { /* nested child selector */
    & .foo {
      @media print { 
        & a { /* nested child selector */
          color: pink;
        }
      }
    }
  }
}
```

This rule integrates into this core the functionality.

## Options

### `kifor-stylelint/no-self-nesting: ["/regex/", /regex/, "string"]`

For example:

```json
[".my-selector", "/^.ignored-sel/"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
.my-selector { /* parent */
  .foo {
    .my-selector { /* child */
      & > .bar {}
    }
  }
}
```

<!-- prettier-ignore -->
```css
.ignored-selector {  /* parent */
  @media print {
    .ignored-selector { /* child */
      & .bar {}
    }
  }
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
.my-selector { /* parent */
  & .my-selector-2 {
    &__foo {} 
  }
}
```

<!-- prettier-ignore -->
```css
.ignored-selector { /* parent */
  & .foo { 
    &__foo {} 
  }
}
```
