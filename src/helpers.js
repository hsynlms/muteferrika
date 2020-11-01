'use strict'

const helpers = {
  /**
   * Casts the primitive value to the automatically detected type
   * @param value The primitive value that will be casted
   * @returns Auto casted value
   */
  typeCast: value => {
    // return not supported type values
    if (
      typeof value !== 'number' &&
      typeof value !== 'boolean' &&
      typeof value !== 'string'
    ) return value

    // validation
    if (typeof value === 'string' && !value.trim()) {
      return value
    }

    // auto-casting
    if (/^\d+$/.test(value)) {
      return parseInt(value, 10)
    } else if (/^\d+\.\d+$/.test(value)) {
      return parseFloat(value)
    } else if (/^(true|false)$/.test(value)) {
      return value === 'true'
    }

    return value.toString()
  },
  /**
   * Returns string literal level escaped RegExp string
   * @param {String} shortCodesArr Name of all the shortcode tags intended to be parsed
   * @returns {String} Escaped string literal level RegExp string
   */
  escapeRegExp: string => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')
  },
  /**
   * Returns shortcode tag parser regexp object
   * @param {Array} shortCodesArr Name of all the shortcode tags intended to be parsed
   * @param {String} flags RegExp flags
   * @returns {RegExp} A Regexp object instance
   */
  getShortCodeTagRegex: (shortCodesArr, flags = '') => {
    // https://core.trac.wordpress.org/browser/tags/5.5.2/src/wp-includes/shortcodes.php#L226
    // eslint-disable-next-line
    const regexps = [/\[(\[?)/, /(?![\w-])([^\]\/]*(?:\/(?!\])[^\]\/]*)*?)(?:(\/)\]|\](?:([^\[]*(?:\[(?!\/\2\])[^\[]*)*)\[\/\2\])?)(\]?)/]

    return new RegExp(
      `${regexps[0].source}(${shortCodesArr.join('|')})${regexps[1].source}`,
      flags
    )
  },
  /**
   * Returns shortcode tag attribute parser regexp object
   * @param {String} flags RegExp flags
   * @returns {RegExp} A Regexp object
   */
  getShortCodeAttrRegexp: (flags = '') => {
    // https://core.trac.wordpress.org/browser/tags/5.5.2/src/wp-includes/shortcodes.php#L499
    const regexp = /([\w-]+)\s*=\s*"([^"]*)"(?:\s|$)|([\w-]+)\s*=\s*'([^']*)'(?:\s|$)|([\w-]+)\s*=\s*([^\s'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|'([^']*)'(?:\s|$)|(\S+)(?:\s|$)/

    return new RegExp(
      regexp.source,
      flags
    )
  }
}

module.exports = helpers
