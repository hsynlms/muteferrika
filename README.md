# Muteferrika
> A simple and lightweight shortcode rendering engine.

[![NPM](https://nodei.co/npm/muteferrika.png)](https://nodei.co/npm/muteferrika/)

`Muteferrika` is a rendering engine which has no dependency and gives you full control of how your shortcodes are getting rendered. Create your shortcodes, let Muteferrika know them, and get the rendered output. It's that much simple. It also supports nested shortcodes, yeey!

Wheel is not reinvented, instead [Wordpress](https://wordpress.org) shortcode and shortcode attribute parser regular expressions are used in the engine.

## Methods

| Name        | Parameters           | Description                                                                               |
| ---         | ---                  | ---                                                                                       |
| add         | `name`, `calback`     | Adds given shortcode to the shortcode list to be used in rendering process. `name` is the unique shortcode identifier name in string type and can contain hyphens and dashes. Whenever the shortcode identifier name found in the given context, they all will be rendered through the `callback` function. And the callback function should return the rendered shortcode output. |
| remove      | `name`               | Removes given shortcode from the shortcode list. `name` is the unique shortcode identifier name in string type. Removed shortcodes will not be rendered in the given context. |
| clear       | -                    | Clears shortcode list. |
| override    | `name`, `calback`    | Overrides callback function of the given shortcode. `name` is the shortcode identifier name in string type. |
| shortcodes  | -                    | Returns defined shortcodes. |
| render      | `content`            | Renders defined shortcodes in the given content. `content` must be in string type and can contain hyphens and dashes. |

## Examples

```js
// get required modules
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

## Installation
`npm install muteferrika`

## Contribution
Contributions and pull requests are kindly welcomed!

## License
This project is licensed under the terms of the [MIT license](https://github.com/hsynlms/muteferrika/blob/master/LICENSE).
