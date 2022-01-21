/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  constructor(value) {
    this.value = value;
    this.arr = [];
  }
}

const cssSelectorBuilder = {
  element(value) {
    let res;
    if (!this.value) {
      res = new Selector(value);
      res.arr.push(0);
    } else {
      if (this.arr.includes(0)) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    Object.setPrototypeOf(res, cssSelectorBuilder);
    return res;
  },

  id(value) {
    let res;
    if (!this.value) {
      res = new Selector(`#${value}`);
      res.arr.push(1);
    } else {
      if (this.value.includes('#')) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      if (this.arr[this.arr.length - 1] > 1) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      res = new Selector(`${this.value}#${value}`);
      this.arr.push(1);
      res.arr = [...this.arr];
    }
    Object.setPrototypeOf(res, cssSelectorBuilder);
    return res;
  },

  class(value) {
    let res;
    if (!this.value) {
      res = new Selector(`.${value}`);
      res.arr.push(2);
    } else {
      res = new Selector(`${this.value}.${value}`);
      if (this.arr[this.arr.length - 1] > 2) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      this.arr.push(2);
      res.arr = [...this.arr];
    }
    Object.setPrototypeOf(res, cssSelectorBuilder);
    return res;
  },

  attr(value) {
    let res;
    if (!this.value) {
      res = new Selector(`[${value}]`);
      res.arr.push(3);
    } else {
      res = new Selector(`${this.value}[${value}]`);
      if (this.arr[this.arr.length - 1] > 3) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      this.arr.push(3);
      res.arr = [...this.arr];
    }
    Object.setPrototypeOf(res, cssSelectorBuilder);
    return res;
  },

  pseudoClass(value) {
    let res;
    if (!this.value) {
      res = new Selector(`:${value}`);
      res.arr.push(4);
    } else {
      res = new Selector(`${this.value}:${value}`);
      if (this.arr[this.arr.length - 1] > 4) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      this.arr.push(4);
      res.arr = [...this.arr];
    }
    Object.setPrototypeOf(res, cssSelectorBuilder);
    return res;
  },

  pseudoElement(value) {
    let res;
    if (!this.value) {
      res = new Selector(`::${value}`);
      res.arr.push(5);
    } else {
      if (this.value.includes('::')) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      res = new Selector(`${this.value}::${value}`);
      this.arr.push(5);
      res.arr = [...this.arr];
    }
    Object.setPrototypeOf(res, cssSelectorBuilder);
    return res;
  },

  combine(selector1, combinator, selector2) {
    const selector = new Selector(`${selector1.value} ${combinator} ${selector2.value}`);
    Object.setPrototypeOf(selector, cssSelectorBuilder);
    return selector;
  },
  stringify() {
    if (!this.value) return '';
    return this.value;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
