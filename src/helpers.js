'use strict'

const helpers = {
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
