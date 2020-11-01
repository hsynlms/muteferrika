'use strict'

// get required node modules
const helpers = require('./helpers')

class Muteferrika {
  // shortcode list
  #_shortcodes = []

  /**
   * Adds given shortcode to the shortcode list to be used in rendering process
   * @param name Name of the shortcode
   * @param callback Shortcode renderer callback function. This function will be invoked with an array that holds all the shortcode tag attributes as the only argument
   */
  add (name, callback) {
    // validation
    if (typeof name !== 'string') {
      throw new TypeError(`"name" is expected to be a string but got: ${typeof name}`)
    }

    // remove space from start and end of the shortcode name
    const _name = name.trim()

    // validations
    if (!_name) throw new TypeError('"name" cannot be empty')
    if (typeof callback !== 'function') {
      throw new TypeError(`"callback" is expected to be a function but got: ${typeof callback}`)
    }

    // check the existence of the given shortcode
    if (
      this.#_shortcodes
        .filter(x => x.name === _name)
        .length
    ) {
      throw new Error(`A same name shortcode does already exist: ${_name}`)
    }

    // add shortcode to the list
    this.#_shortcodes =
      this.#_shortcodes.concat({
        name,
        callback
      })
  }

  /**
   * Removes given shortcode from the shortcode list
   * @param name Name of the shortcode
   */
  remove (name) {
    // validation
    if (typeof name !== 'string') {
      throw new TypeError(`"name" is expected to be a string but got: ${typeof name}`)
    }

    // remove space from start and end of the shortcode name
    const _name = name.trim()

    // validation
    if (!_name) throw new TypeError('"name" cannot be empty')

    // remove the shortcode from list
    this.#_shortcodes =
      this.#_shortcodes.filter(x => x.name !== _name)
  }

  /**
   * Clears shortcode list
   */
  clear () {
    // clear the shortcode list
    this.#_shortcodes = []
  }

  /**
   * Overrides callback function of the given shortcode
   * @returns {Boolean} Indicates success of the overriding process
   */
  override (name, callback) {
    // validation
    if (typeof name !== 'string') {
      throw new TypeError(`"name" is expected to be a string but got: ${typeof name}`)
    }

    // remove space chars from start and end of the shortcode name
    const _name = name.trim()

    // validation
    if (!_name) throw new TypeError('"name" cannot be empty')
    if (typeof callback !== 'function') {
      throw new TypeError(`"callback" is expected to be a function but got: ${typeof callback}`)
    }

    // get the shortcode
    const shortcode =
      this.#_shortcodes.filter(x => x.name === _name)

    if (!shortcode.length) return false

    // override the callback function
    shortcode[0].callback = callback

    return true
  }

  /**
   * Returns defined shortcodes
   * @returns {Array} List of shortcodes
   */
  shortcodes () {
    let mutatedList = []

    // loop all shortcodes
    this.#_shortcodes.forEach(x => {
      mutatedList =
        mutatedList.concat(
          Object.assign({}, x)
        )
    })

    // return the mutated list
    return mutatedList
  }

  /**
   * Returns rendered output content
   * @param content The source content needs to be rendered which contains shortcodes
   * @returns {String} Rendered output text
   */
  render (content) {
    // validation
    if (typeof content !== 'string') {
      throw new TypeError(`"context" is expected to be a string but got: ${typeof content}`)
    }
    if (!content.trim()) return content

    let output = content

    // parse shortcode tags
    const tagNames = this.#_shortcodes.map(x => x.name)
    const tagRegexp = helpers.getShortCodeTagRegex(tagNames, 'gmi')
    const tagMatches = [...RegExp.prototype[Symbol.matchAll].call(tagRegexp, output)]

    // get shortcode tag parser regexp
    const tagAttrRegexp = helpers.getShortCodeAttrRegexp('gmi')

    // invoke all found shortcode callback functions
    // and render them
    tagMatches.forEach(x => {
      // render the shortcode if its not espaced by double brackets
      const isEscaped = x[1].trim() === '[' && x[6].trim() === ']'
      if (isEscaped) {
        // make the shortcode not getting rendered
        output =
          output.replace(
            new RegExp(
              helpers.escapeRegExp(x[0].trim()),
              'gmi'
            ),
            x[0].trim()
              .replace(/\[+/g, '&#91;')
              .replace(/\]+/g, '&#93;')
          )

        return
      }

      // get the shortcode
      const shortcode =
        this.#_shortcodes.filter(shortcode => shortcode.name === x[2].trim())[0]

      const fullMatch = x[0].trim()
      const rawAttributes = x[3]
      let data =
        typeof x[5] !== 'undefined'
          ? x[5].trim()
          : ''

      // validation
      if (data) {
        // render nested tags
        const nestedTagMatches = [...RegExp.prototype[Symbol.matchAll].call(tagRegexp, data)]

        if (nestedTagMatches.length) {
          data = this.render(data)
        }
      }

      // reveal the tag attributes
      const tagAttrMatches =
        [...RegExp.prototype[Symbol.matchAll].call(tagAttrRegexp, rawAttributes)]

      const attributes =
        tagAttrMatches
          .filter(attr => typeof attr[1] !== 'undefined' && typeof attr[2] !== 'undefined')
          .reduce(
            (acc, attr) => {
              acc[attr[1].trim()] = helpers.typeCast(attr[2].trim())
              return acc
            },
            {}
          )

      // invoke the shortcode callback and get the result
      const scOutput =
        shortcode.callback.call(null, attributes, data)

      // validations
      if (scOutput && typeof scOutput === 'string') {
        // replace the shortcode full match with the output from the original text
        output =
          output.replace(
            new RegExp(
              helpers.escapeRegExp(fullMatch),
              'gmi'
            ),
            scOutput
          )
      }
    })

    // return the output
    return output
  }
}

module.exports = Muteferrika
