# jQuery Filter List

The jQuery Filter List plugin displays active input values in a list.

## Usage

Call .filterlist() on any element.

```js
$('.some-container-or-containers').filterlist();
```

This will read and copy every descendant `.filterlist-input` value into any descendant `.filterlist-filters` containers as list items (`.filterlist-item`) in an unorganized list (`.filterlist-list`).

## Features

Items may be removed from the list (and unselected from their corresponding input) by either clicking the delete button or by pressing enter when the delete button is focused.

Delete buttons may be navigated between with keyboard controls.

## Compatibility

Tested functionally in Chrome 31, Firefox 25, Safari 7, iOS 7 Safari, and Internet Explorer 8+.

Tested functionally alongside [Bootstrap](https://github.com/twbs/bootstrap/) and [bootstrap-select](https://github.com/silviomoreto/bootstrap-select).
