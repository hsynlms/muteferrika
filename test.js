'use strict'

// get required node modules
const Muteferrika = require('./src/index')

// noop function
const noop = () => {}

// custom callback function
const customCb = () => {
  return 'test'
}

// test cases

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
test('render some shortcodes', () => {
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
    ibrahim.render(
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
test('render nothing', () => {
  const ibrahim = new Muteferrika()

  ibrahim.add('nothing', customCb)

  const response = ibrahim.render('')

  // eslint-disable-next-line
  expect(response).toBe('')
})

// eslint-disable-next-line
test('render only a space character', () => {
  const ibrahim = new Muteferrika()

  ibrahim.add('nothing', customCb)

  const response = ibrahim.render(' ')

  // eslint-disable-next-line
  expect(response).toBe(' ')
})

// eslint-disable-next-line
test('multiple Muteferrika instances', () => {
  const ibrahim1 = new Muteferrika()
  const ibrahim2 = new Muteferrika()

  ibrahim1.add('test', () => {
    return 'ibrahim 1 rendered'
  })

  ibrahim2.add('test', () => {
    return 'ibrahim 2 rendered'
  })

  const response1 = ibrahim1.render('[test]')
  const response2 = ibrahim2.render('[test]')

  // eslint-disable-next-line
  expect(response1).not.toEqual(response2)
  // eslint-disable-next-line
  expect(response1).toBe('ibrahim 1 rendered')
  // eslint-disable-next-line
  expect(response2).toBe('ibrahim 2 rendered')
})

// eslint-disable-next-line
test('not render escaped shortcode', () => {
  const ibrahim = new Muteferrika()

  ibrahim.add('test', customCb)

  const response = ibrahim.render('[[test]]')

  // eslint-disable-next-line
  expect(response).toBe('&#91;test&#93;')
})

// eslint-disable-next-line
test('render repeated (same tag names) shortcodes', () => {
  const ibrahim = new Muteferrika()

  ibrahim.add('test', customCb)
  ibrahim.add('ibrahim', customCb)

  const response = ibrahim.render('[[test]].[test]#[test]<br />[[ibrahim]]')

  // eslint-disable-next-line
  expect(response).toBe('&#91;test&#93;.test#test<br />&#91;ibrahim&#93;')
})

// eslint-disable-next-line
test('render nested shortcodes', () => {
  const ibrahim = new Muteferrika()

  ibrahim.add('parent', (attrs, data) => data)
  ibrahim.add('child', customCb)

  const response = ibrahim.render('[parent][child][/parent]')

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
test('bulk shortcode add', () => {
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

  const response = ibrahim.render('[parent][child][/parent]')
  const list = ibrahim.shortcodes()

  // eslint-disable-next-line
  expect(list.map(x => x.name)).toEqual(['parent', 'child'])
  // eslint-disable-next-line
  expect(response).toBe('test')
})

// eslint-disable-next-line
test('shortcode name starts and ends with space', () => {
  const ibrahim = new Muteferrika()

  ibrahim.add(' spaced-name ', customCb)

  const response = ibrahim.render('[spaced-name]')

  // eslint-disable-next-line
  expect(response).toBe('test')
})

// eslint-disable-next-line
test('shortcode attribute casted type validations', done => {
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

  ibrahim.render('[test int="1" bool="true" float="47.21" str="selda bagcan"]')
})

// validation tests

// eslint-disable-next-line
test('add() method - "name" validation', () => {
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
})

// eslint-disable-next-line
test('add() method - "callback" validation', () => {
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
test('remove() method - "name" validation', () => {
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
})

// eslint-disable-next-line
test('override() method - "name" validation', () => {
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
})

// eslint-disable-next-line
test('override() method - "callback" validation', () => {
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
test('render() method - "text" validation', () => {
  const ibrahim = new Muteferrika()

  // eslint-disable-next-line
  expect(() => {
    ibrahim.render({})
  }).toThrow()

  // eslint-disable-next-line
  expect(() => {
    ibrahim.render([])
  }).toThrow()

  // eslint-disable-next-line
  expect(() => {
    ibrahim.render(1)
  }).toThrow()

  // eslint-disable-next-line
  expect(() => {
    ibrahim.render(false)
  }).toThrow()
})

// eslint-disable-next-line
test('addRange() method - "shortcodes" validation', () => {
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
    ibrahim.addRange([{ rame: 'test', callback: noop }])
  }).toThrow()

  // eslint-disable-next-line
  expect(() => {
    ibrahim.addRange([{ name: 'test', callmeback: noop }])
  }).toThrow()
})
