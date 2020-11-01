# Muteferrika
> A simple and lightweight shortcode rendering engine.

[![NPM](https://nodei.co/npm/muteferrika.png)](https://nodei.co/npm/muteferrika/)

`Muteferrika` is a rendering engine which has no dependency and gives you full control of how your shortcodes are getting rendered. Create your shortcodes, let Muteferrika know them, and get the rendered output. It's that much simple. It also supports nested shortcodes, yeey!

Wheel is not reinvented, instead [Wordpress](https://wordpress.org) shortcode and shortcode attribute parser regular expressions are used in the engine.

## Features

- Supports creating multiple instances
- Supports self-closing, enclosing and nested shortcodes
- Supports shortcode attribute parsing with automatic type casting (primitive types)
- Supports bulk shortcode insert
- Supports overriding a shortcode callback function at runtime
- [Standard JS](https://github.com/standard/standard) compatible source code
- Comprehensive unit tests

## Installation
`npm install muteferrika`

## Usage

```js
// ES5 syntax
const ibrahim = require('muteferrika')

// ES6 syntax
import ibrahim from 'muteferrika'
```

## Examples

```js
// get required modules ES5
const ibrahim = require('muteferrika')

// define a shortcode
ibrahim.add('entry_image', (attrs, data) => {
  return `<img src="${attrs.src}" alt="${data}"/>`
})

const response =
  ibrahim.render('lorem ipsum [entry_image src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Ibrahim_M%C3%BCteferrika.jpg"]Ibrahim Muteferrika[/entry_image] dolor sit amet.')

console.log(response)

/*
output:
lorem ipsum <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Ibrahim_M%C3%BCteferrika.jpg" alt="Ibrahim Muteferrika"/> dolor sit amet
*/
```

Nested shortcode example:

```js
// get required modules
const ibrahim = require('muteferrika')

ibrahim.add('parent', (attrs, data) => {
  return data
})

ibrahim.add('child', (attrs, data) => {
  return 'you said nested?'
})

const response = ibrahim.render('[parent]so, [child][/parent]')

console.log(response)

/*
output:
so, you said nested?
*/
```

## API

### `Muteferrika.add(name, callback)`

Adds given shortcode to the shortcode list to be used in rendering process.

`name` is the unique shortcode identifier name in string type and can contain hyphen(s) and dash(es).

`callback` is the handler function that renders shortcode and returns the output. The handler function receives (attrs, data). `data` will be passed to the handler function if the shortcode is enclosed.

### `Muteferrika.addRange(shortcodes)`

Adds given shortcodes to the shortcode list to be used in rendering process. Each shortcode item should contain `name` and `callback` fields.

### `Muteferrika.remove(name)`

Removes the given shortcode from the shortcode list.

`name` is the unique shortcode identifier name in string type.

### `Muteferrika.clear()`

Clears/removes all shortcodes from the list.

### `Muteferrika.override(name, callback)`

Overrides callback function of the given shortcode.

`name` is the unique shortcode identifier name in string type and can contain hyphen(s) and dash(es).

`callback` is new handler function that renders shortcode and returns the output.

### `Muteferrika.shortcodes()`

Returns defined shortcode list.

### `Muteferrika.render(content)`

Renders defined shortcodes in the given content through callback functions. `content` must be in string type.

## Contribution
Contributions and pull requests are kindly welcomed!

## License
This project is licensed under the terms of the [MIT license](https://github.com/hsynlms/muteferrika/blob/master/LICENSE).
