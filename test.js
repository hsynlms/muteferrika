'use strict'

// get required node modules
const Muteferrika = require('./src/index')

// helper functions
const noop = () => {}

const customCb = () => {
  return 'test'
}

const customAsyncCb = async () => {
  return Promise.resolve('test')
}

// eslint-disable-next-line
describe(
  'functionality tests',
  () => {
    // eslint-disable-next-line
    test('duplicate shortcode not allowed', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('duplicate_shortcode', noop)

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add('duplicate_shortcode', noop)
      }).toThrow()
    })

    // eslint-disable-next-line
    test('clear shortcode list', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('shortcode_first', noop)
      ibrahim.add('shortcode_second', noop)

      ibrahim.clear()

      // eslint-disable-next-line
      expect(ibrahim.shortcodes()).toEqual([])
    })

    // eslint-disable-next-line
    test('add a shortcode', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('shortcode_test', noop)

      // eslint-disable-next-line
      expect(ibrahim.shortcodes())
        .toEqual([
          { name: 'shortcode_test', callback: noop }
        ])
    })

    // eslint-disable-next-line
    test('remove a shortcode', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('shortcode_first', noop)
      ibrahim.add('shortcode_second', noop)

      ibrahim.remove('shortcode_second')

      // eslint-disable-next-line
      expect(ibrahim.shortcodes()).toEqual([{ name: 'shortcode_first', callback: noop }])
    })

    // eslint-disable-next-line
    test('get shortcode list', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('shortcode_first', noop)
      ibrahim.add('shortcode_second', noop)

      // eslint-disable-next-line
      expect(ibrahim.shortcodes().map(x => x.name)).toEqual(['shortcode_first', 'shortcode_second'])
    })

    // eslint-disable-next-line
    test('override an existing shortcode callback function', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('shortcode_first', noop)
      ibrahim.add('shortcode_second', noop)

      const response =
        ibrahim.override('shortcode_second', customCb)

      // eslint-disable-next-line
      expect(response).toBe(true)
      // eslint-disable-next-line
      expect(ibrahim.shortcodes().map(x => x.callback)).toEqual([noop, customCb])
    })

    // eslint-disable-next-line
    test('override non-existing shortcode callback function', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('shortcode_first', noop)
      ibrahim.add('shortcode_second', noop)

      const response =
        ibrahim.override('shortcode_third', customCb)

      // eslint-disable-next-line
      expect(response).toBe(false)
      // eslint-disable-next-line
      expect(ibrahim.shortcodes().map(x => x.callback)).toEqual([noop, noop])
    })

    // eslint-disable-next-line
    test('asynchronously render some shortcodes', async () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('image', async (attrs, data) => {
        return `<img src="${attrs.src}" alt=""/>`
      })

      ibrahim.add('entry_header', async (attrs, data) => {
        return `<h1 id="${attrs.id}" class="${attrs.class}">${data}</h1>`
      })

      ibrahim.add('entry-content1', (attrs, data) => {
        return `<p id="ec1" style="${attrs.style}">${data}</p>`
      })

      ibrahim.add('empty', async (attrs, data) => {
        return 'nothing'
      })

      ibrahim.add('c_hr1', (attrs, data) => {
        return '<hr />'
      })

      ibrahim.add('async', async (attrs, data) => {
        return data
      })

      const response =
        await ibrahim.render(
          `
          [image src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Ahmet_Kaya.jpg"]
          lorem ipsum dolor sit amet.
          [entry_header id="ahmetKaya" class="married-with-gulten-kaya-hayaloglu" no_effect="true"]43th birthday[/entry_header]
          <hr />
          [entry-content1 style="font-size: 15px;"]He was of mixed Kurdish-Turkish origin and often identified himself as a "Kurd of Turkey".[/entry-content1]
          [c_hr1]
          [empty][/empty]
          [async][empty][/async]
          `
        )

      // eslint-disable-next-line
      expect(response)
        .toBe(
          `
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Ahmet_Kaya.jpg" alt=""/>
          lorem ipsum dolor sit amet.
          <h1 id="ahmetKaya" class="married-with-gulten-kaya-hayaloglu">43th birthday</h1>
          <hr />
          <p id="ec1" style="font-size: 15px;">He was of mixed Kurdish-Turkish origin and often identified himself as a "Kurd of Turkey".</p>
          <hr />
          nothing
          nothing
          `
        )
    })

    // eslint-disable-next-line
    test('synchronously render some shortcodes', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('image', (attrs, data) => {
        return `<img src="${attrs.src}" alt=""/>`
      })

      ibrahim.add('entry_header', (attrs, data) => {
        return `<h1 id="${attrs.id}" class="${attrs.class}">${data}</h1>`
      })

      ibrahim.add('entry-content1', (attrs, data) => {
        return `<p id="ec1" style="${attrs.style}">${data}</p>`
      })

      ibrahim.add('empty', (attrs, data) => {
        return 'nothing'
      })

      ibrahim.add('c_hr1', (attrs, data) => {
        return '<hr />'
      })

      const response =
        ibrahim.renderSync(
          `
          [image src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Ahmet_Kaya.jpg"]
          lorem ipsum dolor sit amet.
          [entry_header id="ahmetKaya" class="married-with-gulten-kaya-hayaloglu" no_effect="true"]43th birthday[/entry_header]
          <hr />
          [entry-content1 style="font-size: 15px;"]He was of mixed Kurdish-Turkish origin and often identified himself as a "Kurd of Turkey".[/entry-content1]
          [c_hr1]
          [empty][/empty]
          `
        )

      // eslint-disable-next-line
      expect(response)
        .toBe(
          `
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Ahmet_Kaya.jpg" alt=""/>
          lorem ipsum dolor sit amet.
          <h1 id="ahmetKaya" class="married-with-gulten-kaya-hayaloglu">43th birthday</h1>
          <hr />
          <p id="ec1" style="font-size: 15px;">He was of mixed Kurdish-Turkish origin and often identified himself as a "Kurd of Turkey".</p>
          <hr />
          nothing
          `
        )
    })

    // eslint-disable-next-line
    test('asynchronously render nothing', async () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('nothing', customAsyncCb)

      const response =
        await ibrahim.render('')

      // eslint-disable-next-line
      expect(response).toBe('')
    })

    // eslint-disable-next-line
    test('synchronously render nothing', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('nothing', customCb)

      const response = ibrahim.renderSync('')

      // eslint-disable-next-line
      expect(response).toBe('')
    })

    // eslint-disable-next-line
    test('render only a space character', async () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('nothing', customCb)

      const response =
        await ibrahim.render(' ')

      // eslint-disable-next-line
      expect(response).toBe(' ')
    })

    // eslint-disable-next-line
    test('multiple Muteferrika instances', async () => {
      const ibrahim1 = new Muteferrika()
      const ibrahim2 = new Muteferrika()

      ibrahim1.add('test', () => {
        return 'ibrahim 1 rendered'
      })

      ibrahim2.add('test', () => {
        return 'ibrahim 2 rendered'
      })

      const response1 =
        await ibrahim1.render('[test]')
      const response2 =
        await ibrahim2.render('[test]')

      // eslint-disable-next-line
      expect(response1).not.toEqual(response2)
      // eslint-disable-next-line
      expect(response1).toBe('ibrahim 1 rendered')
      // eslint-disable-next-line
      expect(response2).toBe('ibrahim 2 rendered')
    })

    // eslint-disable-next-line
    test('not render escaped shortcode', async () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('test', customCb)

      const response =
        await ibrahim.render('[[test]]')

      // eslint-disable-next-line
      expect(response).toBe('&#91;test&#93;')
    })

    // eslint-disable-next-line
    test('render repeated (same tag names) shortcodes', async () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('test', customCb)
      ibrahim.add('ibrahim', customCb)

      const response =
        await ibrahim.render('[[test]].[test]#[test]<br />[[ibrahim]]')

      // eslint-disable-next-line
      expect(response).toBe('&#91;test&#93;.test#test<br />&#91;ibrahim&#93;')
    })

    // eslint-disable-next-line
    test('render nested shortcodes', async () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('parent', (attrs, data) => data)
      ibrahim.add('child', customCb)

      const response =
        await ibrahim.render('[parent][child][/parent]')

      // eslint-disable-next-line
      expect(response).toBe('test')
    })

    // eslint-disable-next-line
    test('shortcode list mutation', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('parent', noop)
      ibrahim.add('child', customCb)

      const list1 = ibrahim.shortcodes()
      list1[0].name = 'changed'

      const list2 = ibrahim.shortcodes()

      // eslint-disable-next-line
      expect(list1.map(x => x.name)).not.toEqual(list2.map(x => x.name))
    })

    // eslint-disable-next-line
    test('bulk shortcode add', async () => {
      const ibrahim = new Muteferrika()

      ibrahim.addRange([
        {
          name: 'parent',
          callback: (attrs, data) => data
        },
        {
          name: 'child',
          callback: customCb
        }
      ])

      const response =
        await ibrahim.render('[parent][child][/parent]')
      const list = ibrahim.shortcodes()

      // eslint-disable-next-line
      expect(list.map(x => x.name)).toEqual(['parent', 'child'])
      // eslint-disable-next-line
      expect(response).toBe('test')
    })

    // eslint-disable-next-line
    test('shortcode name starts and ends with space', async () => {
      const ibrahim = new Muteferrika()

      ibrahim.add(' spaced-name ', customCb)

      const response =
        await ibrahim.render('[spaced-name]')

      // eslint-disable-next-line
      expect(response).toBe('test')
    })

    // eslint-disable-next-line
    test('shortcode attribute casted type validations', async done => {
      const ibrahim = new Muteferrika()

      ibrahim.add('test', (attrs, data) => {
        // eslint-disable-next-line
        expect(typeof attrs.int).toBe('number')
        // eslint-disable-next-line
        expect(typeof attrs.bool).toBe('boolean')
        // eslint-disable-next-line
        expect(typeof attrs.float).toBe('number')
        // eslint-disable-next-line
        expect(typeof attrs.str).toBe('string')

        done()
      })

      await ibrahim.render('[test int="1" bool="true" float="47.21" str="selda bagcan"]')
    })
  }
)

// eslint-disable-next-line
describe(
  'argument(s) of the public method(s) validation tests',
  () => {
    // eslint-disable-next-line
    test('add() - "name" validation', () => {
      const ibrahim = new Muteferrika()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add({}, noop)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add('', noop)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add([], noop)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add(1, noop)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add(false, noop)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add(' ', noop)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add(noop, noop)
      }).toThrow()
    })

    // eslint-disable-next-line
    test('add() - "callback" validation', () => {
      const ibrahim = new Muteferrika()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add('test1', {})
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add('test2', '')
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add('test3', [])
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add('test4', 1)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.add('test5', false)
      }).toThrow()
    })

    // eslint-disable-next-line
    test('addRange() - "shortcodes" validation', () => {
      const ibrahim = new Muteferrika()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.addRange({})
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.addRange('')
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.addRange(1)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.addRange(false)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.addRange(noop)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.addRange([{ rame: 'test', callback: noop }])
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.addRange([{ name: 'test', callmeback: noop }])
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.addRange([{ name: 'test', callback: noop }, { name: 'test2', callmeback: noop }])
      }).toThrow()
    })

    // eslint-disable-next-line
    test('remove() - "name" validation', () => {
      const ibrahim = new Muteferrika()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.remove({})
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.remove('')
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.remove([])
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.remove(1)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.remove(false)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.remove(' ')
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.remove(noop)
      }).toThrow()
    })

    // eslint-disable-next-line
    test('override() - "name" validation', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('test', noop)

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override({}, customCb)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override('', customCb)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override([], customCb)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override(1, customCb)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override(false, customCb)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override(' ', customCb)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override(noop, customCb)
      }).toThrow()
    })

    // eslint-disable-next-line
    test('override() - "callback" validation', () => {
      const ibrahim = new Muteferrika()

      ibrahim.add('test', noop)

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override('test', {})
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override('test', '')
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override('test', [])
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override('test', 1)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.override('test', false)
      }).toThrow()
    })

    // eslint-disable-next-line
    test('render() - "content" validation', async () => {
      const ibrahim = new Muteferrika()

      async function asyncRender (arg) {
        await ibrahim.render(arg)
      }

      // eslint-disable-next-line
      await expect(asyncRender({})).rejects.toBeTruthy()

      // eslint-disable-next-line
      await expect(asyncRender([])).rejects.toBeTruthy()

      // eslint-disable-next-line
      await expect(asyncRender(1)).rejects.toBeTruthy()

      // eslint-disable-next-line
      await expect(asyncRender(false)).rejects.toBeTruthy()

      // eslint-disable-next-line
      await expect(asyncRender(noop)).rejects.toBeTruthy()
    })

    // eslint-disable-next-line
    test('renderSync() - "content" validation', () => {
      const ibrahim = new Muteferrika()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.renderSync({})
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.renderSync([])
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.renderSync(1)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.renderSync(false)
      }).toThrow()

      // eslint-disable-next-line
      expect(() => {
        ibrahim.renderSync(noop)
      }).toThrow()
    })
  }
)
