# Muteferrika
> A simple and lightweight shortcode rendering engine.

[![NPM](https://nodei.co/npm/muteferrika.png)](https://nodei.co/npm/muteferrika/)

`Muteferrika` is a rendering engine with no dependency that gives you full control of how your shortcodes are getting rendered. Create your shortcodes, let Muteferrika know them, and get the rendered output. It's that much simple. It also supports nested shortcodes, yeey!

Wheel is not reinvented, instead [Wordpress](https://wordpress.org) shortcode and shortcode attribute parser regular expressions are used in the engine.

## Features

- Supports creating multiple instances
- Supports self-closing, enclosing and nested shortcodes
- Supports shortcode attribute parsing with automatic type casting (primitive types)
- Supports bulk shortcode insert
- Supports overriding a shortcode callback function at runtime
- Supports sync and async rendering
- [Standard](https://github.com/standard/standard) style source code
- Comprehensive unit tests
- No dependency!

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
const ibrahim = require('muteferrika')

// define a shortcode
ibrahim.add('entry_image', async (attrs, data) => {
  return `<img src="${attrs.src}" alt="${data}"/>`
})

const response =
  await ibrahim.render('lorem ipsum [entry_image src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Ibrahim_M%C3%BCteferrika.jpg"]Ibrahim Muteferrika[/entry_image] dolor sit amet.')

console.log(response)

/*
output:
lorem ipsum <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Ibrahim_M%C3%BCteferrika.jpg" alt="Ibrahim Muteferrika"/> dolor sit amet
*/
```

Nested shortcode example:

```js
const ibrahim = require('muteferrika')

ibrahim.add('parent', (attrs, data) => {
  return data
})

ibrahim.add('child', (attrs, data) => {
  return 'you said nested?'
})

const response = ibrahim.renderSync('[parent]so, [child][/parent]')

console.log(response)

/*
output:
so, you said nested?
*/
```

## API

### `Muteferrika.add(name, callback)`

Adds given shortcode to the shortcode list to be used in rendering process.

`name` is the unique shortcode name and can contain hyphen(s) and dash(es).

`callback` is the shortcode handler function that renders shortcode and returns the output. The handler function receives (attrs, data). `attrs` is an object that holds all the shortcode attributes, `data` is a string that holds all the content in enclosed/nested shortcodes.

### `Muteferrika.addRange(shortcodes)`

Adds given shortcodes to the shortcode list. Each array item must contain `name` and `callback` properties.

```js
{
  name: string,
  callback: function
}
: Array
```

### `Muteferrika.remove(name)`

Removes the given shortcode from the shortcode list.

`name` is the unique shortcode name and can contain hyphen(s) and dash(es).

### `Muteferrika.clear()`

Clears/removes all shortcodes from the list.

### `Muteferrika.override(name, callback)`

Overrides the shortcode handler function of the given shortcode.

`name` is the unique shortcode name and can contain hyphen(s) and dash(es).

`callback` is the new shortcode handler function.

### `Muteferrika.shortcodes()`

Returns defined shortcodes list.

```js
{
  name: string,
  callback: function
}
: Array
```

### `Muteferrika.render(content)`

Asynchronously renders the shortcodes in the given content through shortcode (sync and async) handler functions.

`content` must be a string.

### `Muteferrika.renderSync(content)`

Synchronously renders the shortcodes in the given content through shortcode (sync and async) handler functions.

`content` must be a string.

## Contribution
Contributions and pull requests are kindly welcomed!

## License
This project is licensed under the terms of the [MIT license](https://github.com/hsynlms/muteferrika/blob/master/LICENSE).
