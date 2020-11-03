'use strict'

// get required node modules
const helpers = require('./helpers')

/**
 * Muteferrika class
 */
function Muteferrika () {
  // private field(s)
  this._shortcodes = []

  // private method(s)
  this._fetchTags = function (content) {
    // parse shortcode tags
    const tagNames = this._shortcodes.map(x => x.name)
    const tagRegexp = helpers.getShortCodeTagRegex(tagNames, 'gmi')
    const tagMatches = [...RegExp.prototype[Symbol.matchAll].call(tagRegexp, content)]

    return {
      tagNames,
      tagRegexp,
      tagMatches
    }
  }

  this._tagParser = function (tag, tagRegexp, output) {
    // render the shortcode if its not espaced by double brackets
    const isEscaped = tag[1].trim() === '[' && tag[6].trim() === ']'
    if (isEscaped) {
      // make the shortcode not getting rendered
      return output.replace(
        new RegExp(
          helpers.escapeRegExp(tag[0].trim()),
          'gmi'
        ),
        tag[0].trim()
          .replace(/\[+/g, '&#91;')
          .replace(/\]+/g, '&#93;')
      )
    }

    // get the shortcode
    const shortcode =
      this._shortcodes.filter(shortcode => shortcode.name === tag[2].trim())[0]

    const fullMatch = tag[0].trim()
    const rawAttributes = tag[3]
    const rawData =
      typeof tag[5] !== 'undefined'
        ? tag[5].trim()
        : ''

    return {
      shortcode,
      fullMatch,
      rawAttributes,
      rawData
    }
  }

  this._fetchTagAttributes = function (rawAttributes) {
    // get shortcode tag parser regexp
    const tagAttrRegexp = helpers.getShortCodeAttrRegexp('gmi')

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

    return { attributes }
  }

  this._prepFinalOutput = function (fullMatch, shortcodeOutput, finalOutput) {
    // validations
    if (shortcodeOutput && typeof shortcodeOutput === 'string') {
      // replace the shortcode full match with the output from the original text
      return finalOutput.replace(
        new RegExp(
          helpers.escapeRegExp(fullMatch),
          'gmi'
        ),
        shortcodeOutput
      )
    }

    return finalOutput
  }
}

/**
 * Adds given shortcode to the shortcode list to be used in rendering process
 * @param {string} name Name of the shortcode
 * @param {function} callback Shortcode renderer callback function
 */
Muteferrika.prototype.add = function (name, callback) {
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
    this._shortcodes
      .filter(x => x.name === _name)
      .length
  ) {
    throw new Error(`A same name shortcode does already exist: ${_name}`)
  }

  // add shortcode to the list
  this._shortcodes =
    this._shortcodes.concat({
      name: _name,
      callback
    })
}

/**
 * Adds given shortcodes to the shortcode list to be used in rendering process
 * @param {array} shortcodes List of the shortcodes
 */
Muteferrika.prototype.addRange = function (shortcodes) {
  // validation
  if (!Array.isArray(shortcodes)) {
    throw new TypeError(`"shortcodes" is expected to be an array but got: ${typeof name}`)
  }

  // loop shortcodes
  shortcodes.forEach(shortcode => {
    // validate shortcode fields
    if (!('name' in shortcode) ||
        typeof shortcode.name !== 'string' ||
        !shortcode.name.trim()) {
      throw new TypeError('"name" may not be provided, may not in string type or may be empty')
    }

    if (!('callback' in shortcode) ||
        typeof shortcode.callback !== 'function') {
      throw new TypeError('"callback" may not be provided or may not be a function')
    }

    // remove space from start and end of the shortcode name
    const _name = shortcode.name.trim()

    // check the existence of the given shortcode
    if (
      this._shortcodes
        .filter(x => x.name === _name)
        .length
    ) {
      throw new Error(`A same name shortcode does already exist: ${_name}`)
    }

    // add shortcode to the list
    this._shortcodes =
      this._shortcodes.concat({
        name: _name,
        callback: shortcode.callback
      })
  })
}

/**
 * Removes given shortcode from the shortcode list
 * @param {string} name Name of the shortcode
 */
Muteferrika.prototype.remove = function (name) {
  // validation
  if (typeof name !== 'string') {
    throw new TypeError(`"name" is expected to be a string but got: ${typeof name}`)
  }

  // remove space from start and end of the shortcode name
  const _name = name.trim()

  // validation
  if (!_name) throw new TypeError('"name" cannot be empty')

  // remove the shortcode from list
  this._shortcodes =
    this._shortcodes.filter(x => x.name !== _name)
}

/**
 * Clears shortcode list
 */
Muteferrika.prototype.clear = function () {
  // clear the shortcode list
  this._shortcodes = []
}

/**
 * Overrides callback function of the given shortcode
 * @param {string} name Name of the shortcode
 * @param {function} callback New shortcode renderer callback function
 * @returns {boolean} Indicates success of the overriding process
 */
Muteferrika.prototype.override = function (name, callback) {
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
    this._shortcodes.filter(x => x.name === _name)

  if (!shortcode.length) return false

  // override the callback function
  shortcode[0].callback = callback

  return true
}

/**
 * Returns defined shortcodes
 * @returns {array} List of shortcodes
 */
Muteferrika.prototype.shortcodes = function () {
  let mutatedList = []

  // loop all shortcodes
  this._shortcodes.forEach(x => {
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
 * @async
 * @param {string} content The source content needs to be rendered which contains shortcodes
 * @returns {Promise<string>} Rendered output string
 */
Muteferrika.prototype.render = async function (content) {
  // validation
  if (typeof content !== 'string') {
    throw new TypeError(`"context" is expected to be a string but got: ${typeof content}`)
  }
  if (!content.trim()) return content

  let output = content

  // fetch matched tags
  const {
    tagMatches,
    tagRegexp
  } = this._fetchTags(output)

  // invoke all found shortcode callback functions
  // and render them
  for (let i = 0; i < tagMatches.length; i++) {
    // parse the tag
    const parsedTag =
      this._tagParser(tagMatches[i], tagRegexp, output)

    if (typeof parsedTag === 'string') {
      output = parsedTag
      continue
    }

    const {
      shortcode,
      fullMatch,
      rawAttributes,
      rawData
    } = parsedTag

    let data = rawData

    // validation
    if (data) {
      // render nested tags
      const nestedTagMatches =
        [...RegExp.prototype[Symbol.matchAll].call(tagRegexp, data)]

      if (nestedTagMatches.length) {
        data = await this.render(data)
      }
    }

    // fetch the tag attributes
    const { attributes } =
      this._fetchTagAttributes(rawAttributes)

    // invoke the shortcode callback and get the result
    const scOutput =
      await shortcode.callback(attributes, data)

    // process final output
    output =
      this._prepFinalOutput(
        fullMatch,
        scOutput,
        output
      )
  }

  // return the output
  return output
}

/**
 * Returns rendered output content
 * @param {string} content The source content needs to be rendered which contains shortcodes
 * @returns {string} Rendered output string
 */
Muteferrika.prototype.renderSync = function (content) {
  // validation
  if (typeof content !== 'string') {
    throw new TypeError(`"context" is expected to be a string but got: ${typeof content}`)
  }
  if (!content.trim()) return content

  let output = content

  // fetch matched tags
  const {
    tagMatches,
    tagRegexp
  } = this._fetchTags(output)

  // invoke all found shortcode callback functions
  // and render them
  for (let i = 0; i < tagMatches.length; i++) {
    // parse the tag
    const parsedTag =
      this._tagParser(tagMatches[i], tagRegexp, output)

    if (typeof parsedTag === 'string') {
      output = parsedTag
      continue
    }

    const {
      shortcode,
      fullMatch,
      rawAttributes,
      rawData
    } = parsedTag

    let data = rawData

    // validation
    if (data) {
      // render nested tags
      const nestedTagMatches =
        [...RegExp.prototype[Symbol.matchAll].call(tagRegexp, data)]

      if (nestedTagMatches.length) {
        data = this.renderSync(data)
      }
    }

    // fetch the tag attributes
    const { attributes } =
      this._fetchTagAttributes(rawAttributes)

    // invoke the shortcode callback and get the result
    const scOutput =
      shortcode.callback(attributes, data)

    // process final output
    output =
      this._prepFinalOutput(
        fullMatch,
        scOutput,
        output
      )
  }

  // return the output
  return output
}

module.exports = Muteferrika
