// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../dateTime.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fullDaysFactor = 86400000;
var date = new Date(0);

exports.tDateToDateTime = function (input) {
  return input * fullDaysFactor;
};

exports.dateTimeToTDate = function (input) {
  return input / fullDaysFactor;
};

exports.tDateTimeToString = function (input, alsoMonth, alsoDay) {
  if (isNaN(input)) return undefined;
  date.setTime(input);
  var year = date.getUTCFullYear().toString().padStart(4, '0');
  if (!alsoMonth) return year;
  var month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  if (!alsoDay) return "".concat(year, "-").concat(month);
  var day = date.getUTCDate().toString().padStart(2, '0');
  return "".concat(year, "-").concat(month, "-").concat(day);
};

exports.tDateToString = function (input, alsoMonth, alsoDay) {
  if (isNaN(input)) return undefined;
  return exports.tDateTimeToString(exports.tDateToDateTime(input), alsoMonth, alsoDay);
};

exports.stringToTDateTime = function (input, expectMonth, expectDay) {
  if (!input) return undefined;
  var splitted = input.split('-').filter(function (s) {
    return s.trim();
  });
  if (expectDay && splitted.length < 3) return undefined;else if (expectMonth && splitted.length < 2) return undefined;
  var asNumbers = splitted.map(function (s) {
    return parseInt(s);
  });

  if (splitted[0].length < 4) {
    if (asNumbers[0] < 70) {
      asNumbers[0] += 2000;
    } else if (asNumbers[0] < 100) {
      asNumbers[0] += 1900;
    }
  }

  while (asNumbers.length < 3) {
    asNumbers.push(1);
  }

  if (asNumbers[1] < 1 || asNumbers[1] > 12) return undefined;
  if (asNumbers[2] < 1 || asNumbers[2] > 31) return undefined;
  asNumbers[1]--;
  date.setTime(0);
  date.setUTCFullYear(asNumbers[0]);
  date.setUTCMonth(asNumbers[1]);
  date.setUTCDate(asNumbers[2]);
  return date.getTime();
};

exports.stringToTDate = function (input, expectMonth, expectDay) {
  if (!input) return undefined;
  var value = exports.stringToTDateTime(input, expectMonth, expectDay);
  if (value === undefined) return undefined;
  return exports.dateTimeToTDate(value);
};

exports.tTimeToString = function (input, alsoSeconds, alsoMilliseconds) {
  var separator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';
  if (isNaN(input)) return undefined;
  var date = new Date(input);
  var hours = date.getUTCHours().toString().padStart(2, '0');
  var minutes = date.getUTCMinutes().toString().padStart(2, '0');
  var result = "".concat(hours, ":").concat(minutes);
  if (!alsoSeconds) return result;
  var seconds = date.getUTCSeconds().toString().padStart(2, '0');
  result += ":".concat(seconds);
  if (!alsoMilliseconds) return result;
  var milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
  return "".concat(result).concat(separator).concat(milliseconds);
};

exports.stringToTTime = function (input, expectSeconds) {
  if (!input) return undefined;
  var splitted = input.split(':').filter(function (s) {
    return s.trim();
  });
  if (splitted.length < 2) return undefined;
  if (expectSeconds && splitted.length < 3) return undefined;
  var asNumbers = splitted.map(function (s) {
    return parseInt(s);
  });

  while (asNumbers.length < 3) {
    asNumbers.push(0);
  }

  if (asNumbers[0] < 0 || asNumbers[0] > 23) return undefined;
  if (asNumbers[1] < 0 || asNumbers[1] > 59) return undefined;
  if (asNumbers[2] < 0 || asNumbers[2] >= 60) return undefined;
  date.setTime(0);
  date.setUTCHours(asNumbers[0]);
  date.setUTCMinutes(asNumbers[1]);
  date.setUTCSeconds(asNumbers[2]);
  return date.getTime();
};
},{}],"../../number.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.numberToString = function (num) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  var str = decimals < 0 ? "".concat(num) : num.toFixed(decimals);
  var splitted = str.split('.');
  var integerPart = splitted[0];
  var sign = '';

  if (integerPart.startsWith('-')) {
    integerPart = integerPart.substr(1);
    sign = '-';
  }

  var tripplets = [];

  while (integerPart.length) {
    var cutOff = integerPart.length - 3;
    if (cutOff < 0) cutOff = 0;
    tripplets.unshift(integerPart.substr(cutOff));
    integerPart = integerPart.substr(0, cutOff);
  }

  var result = "".concat(sign).concat(tripplets.join(' '));
  if (!decimals || !splitted[1]) return result;
  return "".concat(result).concat(separator).concat(splitted[1]);
};

exports.stringToNumber = function (str) {
  var result = parseFloat(str.replace(/\s/g, '').replace(/\,/g, '.'));
  if (isNaN(result)) return undefined;
  return result;
};
},{}],"../../debouncers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.runIfInactive = function (callback) {
  var timeInMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
  var debounceId = -1;
  return function (sureToActivate) {
    if (debounceId >= 0) clearTimeout(debounceId);

    if (sureToActivate !== false) {
      if (sureToActivate === true) {
        callback();
        debounceId = -1;
      } else {
        debounceId = setTimeout(function () {
          callback();
          debounceId = -1;
        }, timeInMs);
      }
    }
  };
};
},{}],"../../dom.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var dateTime_1 = require("./dateTime");

var number_1 = require("./number");

var debouncers_1 = require("./debouncers");

var doc = document;

var createElement = function createElement(tagName) {
  return doc.createElement(tagName);
};

var createElementWC = function createElementWC(tagName, optionsOrChild, children) {
  var element = createElement(tagName);

  if (optionsOrChild) {
    if (optionsOrChild instanceof HTMLElement) {
      element.appendChild(optionsOrChild);
    } else if (optionsOrChild.constructor === String) {
      element.append(optionsOrChild);
    } else {
      exports.setAttributes(element, optionsOrChild);
    } // @ts-ignore


    element.append.apply(element, _toConsumableArray(children));
  }

  return element;
};

var createElementWO = function createElementWO(tagName, options) {
  var element = createElement(tagName);
  exports.setAttributes(element, options);
  return element;
}; // =====================================================================================================================


var componentIndex = 0;

exports.component = function (definition) {
  var tagName = 'c-' + (componentIndex++).toString(32);
  customElements.define(tagName, definition);
  return function (optionsOrChild) {
    for (var _len = arguments.length, children = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      children[_key - 1] = arguments[_key];
    }

    return createElementWC(tagName, optionsOrChild, children);
  };
};

exports.cpt = exports.component;

exports.setAttributes = function (element, options) {
  if (options) {
    for (var name in options) {
      if (name.startsWith('on')) {
        // @ts-ignore
        element[name] = options[name];
      } else if (name === '$') {
        for (var _name in options.$) {
          // @ts-ignore
          element[_name] = options.$[_name];
        }
      } else if (name === 'c') {
        if (options[name] instanceof Array) {
          element.className = options[name].join(' ');
        } else {
          element.className = options[name];
        }
      } else {
        element.setAttribute(name, options[name]);
      }
    }
  }
};

exports.removeChildren = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}; // =====================================================================================================================
//
// =====================================================================================================================


exports.open = function (constrFun, targetElement, options) {
  var element = constrFun(options);
  targetElement.appendChild(element);
  return element;
};

exports.close = function (element) {
  // @ts-ignore
  element.parentNode.removeChild(element);
};

exports.show = function (element) {
  element.style.display = element.__displayBackup || '';
  delete element.__displayBackup;
};

exports.hide = function (element) {
  element.__displayBackup = element.style.display;
  element.style.display = 'none';
}; // =====================================================================================================================
//
// =====================================================================================================================


exports.onAnyChange = function (element, callback) {
  var oldValue, oldSelectionStart, oldSelectionEnd;
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
    element.addEventListener(event, function () {
      if (callback(this.value)) {
        oldValue = this.value;
        oldSelectionStart = this.selectionStart;
        oldSelectionEnd = this.selectionEnd;
      } else if (oldValue !== undefined) {
        this.value = oldValue;

        if (this.type !== 'email') {
          // firefox doesn't work with this for some reason
          this.setSelectionRange(oldSelectionStart, oldSelectionEnd);
        }
      } // TODO: remove that console.log as soon as it will be not necesarry
      // @ts-ignore


      console.log(this, this.type, this.value, this.ivalue); //, (new Date(this.ivalue)).toISOString());
    });
  });
};

exports.assignIValue = function (element, setter, getter) {
  var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'ivalue';
  Object.defineProperty(element, name, {
    get: getter,
    set: setter
  });
};

exports.getAttributesObserver = function (element) {
  var attributes = {};
  var observer = new MutationObserver(function (mutation) {
    mutation.forEach(function (m) {
      // @ts-ignore
      if (attributes[m.attributeName]) {
        // @ts-ignore
        attributes[m.attributeName](element.getAttribute(m.attributeName));
      }
    });
  });
  observer.observe(element, {
    attributes: true
  });
  return attributes;
}; // ---------------------------------------------------------------------------------------------------------------------
// while typing validators


var wtvRegexYM = /^(\d{0,4}([\-](\d{1,2})?)?)?$/;
var wtvRegexYMD = /^(\d{1,4}([\-](\d{0,2}([\-](\d{1,2})?)?)?)?)?$/;
var wtvRegexHM = /^(\d{0,2}([\:](\d{1,2})?)?)?$/;
var wtvRegexHMS = /^(\d{1,2}([\:](\d{1,2}([\:](\d{1,2})?)?)?)?)?$/;
var wtvRegexTel = /^([+])?(\d+\s){0,5}(\d*)$/;
var wtvRegexEmail = /^([\w\-\_]+\.)*(([\w\-\_]+)(@(([\w\-\_]+\.)*([\w\-\_]*))?)?)?$/;
var wtvRegexText = /^(\S+(\s\S+)*\s?)?$/;
var wtvRegexInteger = /^([+-]\s?)?(\d+\s)*(\d*)$/;
var wtvRegexReal = /^([+-]\s?)?(\d+\s)*(\d*)([\.\,](\d*)?)?$/;

var getWtvRegexNumber = function getWtvRegexNumber(decimals) {
  if (decimals < 0) return wtvRegexReal;
  if (decimals === 0) return wtvRegexInteger;
  return new RegExp("^([+-]s?)?(\\d+\\s)*(\\d*)([\\.\\,](\\d{0,".concat(decimals, "})?)?$"));
}; // when entered validators:


var wevYM = '\\d{4}-\\d{2}';
var wevYMD = wevYM + '-\\d{2}';
var wevHM = '\\d{2}:\\d{2}';
var wevHMS = wevYM + ':\\d{2}';
var wevHMSM = wevHMS + '[\.\,]\\d{3}';
var wevTel = "([+])?(\\d+\\s){0,5}(\\d+)"; // const wevEmail = /^([\w\-\_]+\.)*([\w\-\_]+)@{1}([\w\-\_]+\.)+([\w\-\_]{2,})$/

var wevEmail = "((\\w|[-_])+\\.)*((\\w|[-_])+)@((\\w|[-_])+\\.)+((\\w|[-_]){2,})";
var wevText = "\\S+(\\s\\S+)*";
var wevPassword = ".{6,}";

var getWevNumber = function getWevNumber(decimals) {
  if (decimals === 0) return "([+-])?((\\d+\\s)*\\d+)+";
  return "([+-])?((\\d+\\s)*\\d+)+([\\.,]\\d+)?";
};

var createInputElement = function createInputElement(type, pattern) {
  var input = createElement('input');
  input.setAttribute('type', type);
  if (pattern) input.setAttribute('pattern', pattern);
  return input;
}; // ---------------------------------------------------------------------------------------------------------------------


exports.iyyyymmdd = function (options) {
  var input = createInputElement('date', wevYMD);
  exports.assignIValue(input, function (value) {
    // @ts-ignore
    this.value = dateTime_1.tDateToString(value, true, true);
  }, function () {
    // @ts-ignore
    return dateTime_1.stringToTDate(this.value, true, true);
  });
  if (options) exports.setAttributes(input, options);
  var correctValue = debouncers_1.runIfInactive(function () {
    var value = dateTime_1.stringToTDate(input.value, true, true);
    if (value !== undefined) input.value = dateTime_1.tDateToString(value, true, true);
  }, 1000);
  exports.onAnyChange(input, function (v) {
    correctValue();
    return wtvRegexYMD.test(v);
  });
  return input;
};

exports.iyyyymm = function (options) {
  var input = createInputElement('month', wevYM);
  exports.assignIValue(input, function (value) {
    this.value = dateTime_1.tDateToString(value, true);
  }, function () {
    return dateTime_1.stringToTDate(this.value, true);
  });
  if (options) exports.setAttributes(input, options);
  var correctValue = debouncers_1.runIfInactive(function () {
    var value = dateTime_1.stringToTDate(input.value, true);
    if (value !== undefined) input.value = dateTime_1.tDateToString(value, true);
  }, 1000);
  exports.onAnyChange(input, function (v) {
    correctValue();
    return wtvRegexYM.test(v);
  });
  return input;
};

exports.ihhmm = function (options) {
  var input = createInputElement('text', wevHM);
  exports.assignIValue(input, function (value) {
    this.value = dateTime_1.tTimeToString(value);
  }, function () {
    return dateTime_1.stringToTTime(this.value);
  });
  if (options) exports.setAttributes(input, options);
  var correctValue = debouncers_1.runIfInactive(function () {
    var value = dateTime_1.stringToTTime(input.value);
    if (value !== undefined) input.value = dateTime_1.tTimeToString(value);
  }, 1000);
  exports.onAnyChange(input, function (v) {
    correctValue();
    return wtvRegexHM.test(v);
  });
  return input;
};

exports.inumber = function (options) {
  var input = createInputElement('text');
  exports.assignIValue(input, function (value) {
    this.value = number_1.numberToString(value, decimals);
  }, function () {
    return number_1.stringToNumber(this.value);
  });
  var decimals = -1000000;
  var wevNumber;
  var wtvRegexNumber;

  var setDecimals = function setDecimals() {
    wevNumber = getWevNumber(decimals);
    wtvRegexNumber = getWtvRegexNumber(decimals);
    input.setAttribute('pattern', wevNumber);
  };

  var ao = exports.getAttributesObserver(input);

  ao.decimals = function (value) {
    decimals = parseInt(value);
    if (isNaN(decimals)) decimals = -1;
    setDecimals();
    correctValue(true); // force immediate correction
  };

  if (options) {
    exports.setAttributes(input, options);
  }

  if (decimals <= -1000000) {
    decimals = -1;
    setDecimals();
  }

  var correctValue = debouncers_1.runIfInactive(function () {
    var value = number_1.stringToNumber(input.value);
    if (value !== undefined) input.value = number_1.numberToString(value, decimals);
  }, 1000);
  exports.onAnyChange(input, function (v) {
    correctValue();
    return wtvRegexNumber.test(v);
  });
  return input;
};

exports.itel = function (options) {
  var input = createInputElement('tel', wevTel);
  exports.assignIValue(input, function (value) {
    this.value = value;
  }, function () {
    return this.value.trim();
  });
  if (options) exports.setAttributes(input, options);
  var correctValue = debouncers_1.runIfInactive(function () {
    input.value = input.value.trim();
  }, 1000);
  exports.onAnyChange(input, function (v) {
    correctValue();
    return wtvRegexTel.test(v);
  });
  return input;
};

exports.iemail = function (options) {
  var input = createInputElement('email', wevEmail);
  exports.assignIValue(input, function (value) {
    this.value = value;
  }, function () {
    return this.value;
  });
  if (options) exports.setAttributes(input, options);
  exports.onAnyChange(input, function (v) {
    return wtvRegexEmail.test(v);
  });
  return input;
};

exports.itext = function (options) {
  var input = createInputElement('text', wevText);
  exports.assignIValue(input, function (value) {
    this.value = value;
  }, function () {
    return this.value.trim();
  });
  if (options) exports.setAttributes(input, options);
  var correctValue = debouncers_1.runIfInactive(function () {
    input.value = input.value.trim();
  }, 1000);
  exports.onAnyChange(input, function (v) {
    correctValue();
    return wtvRegexText.test(v);
  });
  return input;
};

exports.ipassword = function (options) {
  var input = createInputElement('password', wevPassword);
  exports.assignIValue(input, function (value) {
    this.value = value;
  }, function () {
    return this.value;
  });
  if (options) exports.setAttributes(input, options);
  return input;
};

exports.icheckbox = function (options) {
  var input = createInputElement('checkbox');
  exports.assignIValue(input, function (value) {
    this.checked = value;
  }, function () {
    return this.checked;
  });
  if (options) exports.setAttributes(input, options);
  return input;
};

var setKeyAndValueOfTsmElement = function setKeyAndValueOfTsmElement(el, v, k, key, valueFrom, keyFrom, valueDest) {
  if (valueFrom !== undefined) {
    // @ts-ignore
    el[valueDest] = v[valueFrom];
  } else {
    // @ts-ignore
    el[valueDest] = v;
  }

  if (keyFrom !== undefined) {
    el.setAttribute(key, v[keyFrom]);
  } else {
    el.setAttribute(key, k);
  }
};

var getKeyOfTsmElement = function getKeyOfTsmElement(el, key, asNumber) {
  var keyName = el.getAttribute(key);

  if (asNumber) {
    return parseFloat(keyName);
  }

  return keyName;
};

var getValueOfTsmElement = function getValueOfTsmElement(el) {
  var valueDest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ivalue';
  // @ts-ignore
  return el[valueDest];
};

exports.iarray = function (decoratorOptions) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var input = decoratorOptions.rootElement ? decoratorOptions.rootElement() : createElement('div');
  var decorator = decoratorOptions.decorator,
      decorOptions = decoratorOptions.options;
  var keyDest = options.keyDest,
      keyFrom = options.keyFrom,
      valueFrom = options.valueFrom,
      recycle = options.recycle,
      keyIsNumeric = options.keyIsNumeric,
      valueDest = options.valueDest,
      availableAs = options.availableAs;
  keyDest = keyDest || 'ikey';
  valueDest = valueDest || 'ivalue';

  var getDecoratorElement = function getDecoratorElement(v, k) {
    var el = decorator();
    if (decorOptions) exports.setAttributes(el, decorOptions);
    setKeyAndValueOfTsmElement(el, v, k, keyDest, valueFrom, keyFrom, valueDest);
    return el;
  }; // let value: any[] = [];


  exports.assignIValue(input, function (arr) {
    // value = arr;
    if (recycle) {
      while (arr.length < input.children.length) {
        input.removeChild(input.lastChild);
      }

      var ivalueReassignLength = input.children.length;
      var toAppend = [];

      for (var i = ivalueReassignLength; arr.length > i; i++) {
        toAppend.push(getDecoratorElement(arr[i], i));
      }

      input.append.apply(input, toAppend);

      for (var _i = 0; _i < ivalueReassignLength; _i++) {
        setKeyAndValueOfTsmElement(input.children[_i], arr[_i], _i, keyDest, valueFrom, keyFrom);
      }
    } else {
      exports.removeChildren(input);
      input.append.apply(input, _toConsumableArray(arr.map(function (v, k) {
        return getDecoratorElement(v, k);
      })));
    }
  }, function () {
    var result = [];
    var children = input.children;

    for (var i = 0; i < children.length; i++) {
      // result[getKeyOfTsmElement(<TsmElement>children[i], key, keyIsNumeric)] = getValueOfTsmElement(<TsmElement>children[i], valueDest);
      result[i] = getValueOfTsmElement(children[i], valueDest);
    }

    return result;
  }, availableAs);
  if (options) exports.setAttributes(input, options);
  return input;
};

exports.ioption = function (options) {
  var input = exports.option();
  exports.assignIValue(input, function (value) {
    this.value = value;
  }, function () {
    return this.value;
  });
  if (options) exports.setAttributes(input, options);
  return input;
};

exports.iselect = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var input = exports.iarray({
    decorator: exports.option,
    rootElement: exports.select
  }, Object.assign({
    keyDest: 'value',
    valueDest: 'innerText',
    availableAs: 'ivalues'
  }, options));
  exports.assignIValue(input, function (value) {
    this.value = value;
  }, function () {
    return this.value;
  });
  if (options) exports.setAttributes(input, options);
  return input;
}; // =====================================================================================================================
//
// =====================================================================================================================


exports.shadow = function (t) {
  var sh = t.attachShadow({
    mode: 'open'
  });

  for (var _len2 = arguments.length, children = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    children[_key2 - 1] = arguments[_key2];
  }

  sh.append.apply(sh, children);
  return sh;
};

exports.body = function () {
  var _doc$body;

  return (_doc$body = doc.body).append.apply(_doc$body, arguments);
};

exports.text = function () {
  var txt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return doc.createTextNode(txt);
}; // =====================================================================================================================


exports.a = function (optionsOrChild) {
  for (var _len3 = arguments.length, children = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    children[_key3 - 1] = arguments[_key3];
  }

  return createElementWC('a', optionsOrChild, children);
};

exports.abbr = function (optionsOrChild) {
  for (var _len4 = arguments.length, children = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    children[_key4 - 1] = arguments[_key4];
  }

  return createElementWC('abbr', optionsOrChild, children);
};

exports.acronym = function (optionsOrChild) {
  for (var _len5 = arguments.length, children = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    children[_key5 - 1] = arguments[_key5];
  }

  return createElementWC('acronym', optionsOrChild, children);
};

exports.address = function (optionsOrChild) {
  for (var _len6 = arguments.length, children = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    children[_key6 - 1] = arguments[_key6];
  }

  return createElementWC('address', optionsOrChild, children);
};

exports.applet = function (optionsOrChild) {
  for (var _len7 = arguments.length, children = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    children[_key7 - 1] = arguments[_key7];
  }

  return createElementWC('applet', optionsOrChild, children);
};

exports.area = function (options) {
  return createElementWO('area', options);
};

exports.article = function (optionsOrChild) {
  for (var _len8 = arguments.length, children = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
    children[_key8 - 1] = arguments[_key8];
  }

  return createElementWC('article', optionsOrChild, children);
};

exports.aside = function (optionsOrChild) {
  for (var _len9 = arguments.length, children = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
    children[_key9 - 1] = arguments[_key9];
  }

  return createElementWC('aside', optionsOrChild, children);
};

exports.audio = function (optionsOrChild) {
  for (var _len10 = arguments.length, children = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
    children[_key10 - 1] = arguments[_key10];
  }

  return createElementWC('audio', optionsOrChild, children);
};

exports.b = function (optionsOrChild) {
  for (var _len11 = arguments.length, children = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
    children[_key11 - 1] = arguments[_key11];
  }

  return createElementWC('b', optionsOrChild, children);
};

exports.base = function (options) {
  return createElementWO('base', options);
};

exports.basefont = function (optionsOrChild) {
  for (var _len12 = arguments.length, children = new Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
    children[_key12 - 1] = arguments[_key12];
  }

  return createElementWC('basefont', optionsOrChild, children);
};

exports.bdi = function (optionsOrChild) {
  for (var _len13 = arguments.length, children = new Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
    children[_key13 - 1] = arguments[_key13];
  }

  return createElementWC('bdi', optionsOrChild, children);
};

exports.bdo = function (optionsOrChild) {
  for (var _len14 = arguments.length, children = new Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
    children[_key14 - 1] = arguments[_key14];
  }

  return createElementWC('bdo', optionsOrChild, children);
};

exports.big = function (optionsOrChild) {
  for (var _len15 = arguments.length, children = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
    children[_key15 - 1] = arguments[_key15];
  }

  return createElementWC('big', optionsOrChild, children);
};

exports.blockquote = function (optionsOrChild) {
  for (var _len16 = arguments.length, children = new Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) {
    children[_key16 - 1] = arguments[_key16];
  }

  return createElementWC('blockquote', optionsOrChild, children);
};

exports.br = function (options) {
  return createElementWO('br', options);
};

exports.button = function (optionsOrChild) {
  for (var _len17 = arguments.length, children = new Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
    children[_key17 - 1] = arguments[_key17];
  }

  return createElementWC('button', optionsOrChild, children);
};

exports.canvas = function (optionsOrChild) {
  for (var _len18 = arguments.length, children = new Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
    children[_key18 - 1] = arguments[_key18];
  }

  return createElementWC('canvas', optionsOrChild, children);
};

exports.caption = function (optionsOrChild) {
  for (var _len19 = arguments.length, children = new Array(_len19 > 1 ? _len19 - 1 : 0), _key19 = 1; _key19 < _len19; _key19++) {
    children[_key19 - 1] = arguments[_key19];
  }

  return createElementWC('caption', optionsOrChild, children);
};

exports.center = function (optionsOrChild) {
  for (var _len20 = arguments.length, children = new Array(_len20 > 1 ? _len20 - 1 : 0), _key20 = 1; _key20 < _len20; _key20++) {
    children[_key20 - 1] = arguments[_key20];
  }

  return createElementWC('center', optionsOrChild, children);
};

exports.cite = function (optionsOrChild) {
  for (var _len21 = arguments.length, children = new Array(_len21 > 1 ? _len21 - 1 : 0), _key21 = 1; _key21 < _len21; _key21++) {
    children[_key21 - 1] = arguments[_key21];
  }

  return createElementWC('cite', optionsOrChild, children);
};

exports.code = function (optionsOrChild) {
  for (var _len22 = arguments.length, children = new Array(_len22 > 1 ? _len22 - 1 : 0), _key22 = 1; _key22 < _len22; _key22++) {
    children[_key22 - 1] = arguments[_key22];
  }

  return createElementWC('code', optionsOrChild, children);
};

exports.col = function (options) {
  return createElementWO('col', options);
};

exports.colgroup = function (optionsOrChild) {
  for (var _len23 = arguments.length, children = new Array(_len23 > 1 ? _len23 - 1 : 0), _key23 = 1; _key23 < _len23; _key23++) {
    children[_key23 - 1] = arguments[_key23];
  }

  return createElementWC('colgroup', optionsOrChild, children);
};

exports.command = function (options) {
  return createElementWO('command', options);
};

exports.datalist = function (optionsOrChild) {
  for (var _len24 = arguments.length, children = new Array(_len24 > 1 ? _len24 - 1 : 0), _key24 = 1; _key24 < _len24; _key24++) {
    children[_key24 - 1] = arguments[_key24];
  }

  return createElementWC('datalist', optionsOrChild, children);
};

exports.dd = function (optionsOrChild) {
  for (var _len25 = arguments.length, children = new Array(_len25 > 1 ? _len25 - 1 : 0), _key25 = 1; _key25 < _len25; _key25++) {
    children[_key25 - 1] = arguments[_key25];
  }

  return createElementWC('dd', optionsOrChild, children);
};

exports.del = function (optionsOrChild) {
  for (var _len26 = arguments.length, children = new Array(_len26 > 1 ? _len26 - 1 : 0), _key26 = 1; _key26 < _len26; _key26++) {
    children[_key26 - 1] = arguments[_key26];
  }

  return createElementWC('del', optionsOrChild, children);
};

exports.details = function (optionsOrChild) {
  for (var _len27 = arguments.length, children = new Array(_len27 > 1 ? _len27 - 1 : 0), _key27 = 1; _key27 < _len27; _key27++) {
    children[_key27 - 1] = arguments[_key27];
  }

  return createElementWC('details', optionsOrChild, children);
};

exports.dfn = function (optionsOrChild) {
  for (var _len28 = arguments.length, children = new Array(_len28 > 1 ? _len28 - 1 : 0), _key28 = 1; _key28 < _len28; _key28++) {
    children[_key28 - 1] = arguments[_key28];
  }

  return createElementWC('dfn', optionsOrChild, children);
};

exports.dir = function (optionsOrChild) {
  for (var _len29 = arguments.length, children = new Array(_len29 > 1 ? _len29 - 1 : 0), _key29 = 1; _key29 < _len29; _key29++) {
    children[_key29 - 1] = arguments[_key29];
  }

  return createElementWC('dir', optionsOrChild, children);
};

exports.div = function (optionsOrChild) {
  for (var _len30 = arguments.length, children = new Array(_len30 > 1 ? _len30 - 1 : 0), _key30 = 1; _key30 < _len30; _key30++) {
    children[_key30 - 1] = arguments[_key30];
  }

  return createElementWC('div', optionsOrChild, children);
};

exports.dl = function (optionsOrChild) {
  for (var _len31 = arguments.length, children = new Array(_len31 > 1 ? _len31 - 1 : 0), _key31 = 1; _key31 < _len31; _key31++) {
    children[_key31 - 1] = arguments[_key31];
  }

  return createElementWC('dl', optionsOrChild, children);
};

exports.dt = function (optionsOrChild) {
  for (var _len32 = arguments.length, children = new Array(_len32 > 1 ? _len32 - 1 : 0), _key32 = 1; _key32 < _len32; _key32++) {
    children[_key32 - 1] = arguments[_key32];
  }

  return createElementWC('dt', optionsOrChild, children);
};

exports.em = function (optionsOrChild) {
  for (var _len33 = arguments.length, children = new Array(_len33 > 1 ? _len33 - 1 : 0), _key33 = 1; _key33 < _len33; _key33++) {
    children[_key33 - 1] = arguments[_key33];
  }

  return createElementWC('em', optionsOrChild, children);
};

exports.embed = function (options) {
  return createElementWO('embed', options);
};

exports.fieldset = function (optionsOrChild) {
  for (var _len34 = arguments.length, children = new Array(_len34 > 1 ? _len34 - 1 : 0), _key34 = 1; _key34 < _len34; _key34++) {
    children[_key34 - 1] = arguments[_key34];
  }

  return createElementWC('fieldset', optionsOrChild, children);
};

exports.figcaption = function (optionsOrChild) {
  for (var _len35 = arguments.length, children = new Array(_len35 > 1 ? _len35 - 1 : 0), _key35 = 1; _key35 < _len35; _key35++) {
    children[_key35 - 1] = arguments[_key35];
  }

  return createElementWC('figcaption', optionsOrChild, children);
};

exports.figure = function (optionsOrChild) {
  for (var _len36 = arguments.length, children = new Array(_len36 > 1 ? _len36 - 1 : 0), _key36 = 1; _key36 < _len36; _key36++) {
    children[_key36 - 1] = arguments[_key36];
  }

  return createElementWC('figure', optionsOrChild, children);
};

exports.font = function (optionsOrChild) {
  for (var _len37 = arguments.length, children = new Array(_len37 > 1 ? _len37 - 1 : 0), _key37 = 1; _key37 < _len37; _key37++) {
    children[_key37 - 1] = arguments[_key37];
  }

  return createElementWC('font', optionsOrChild, children);
};

exports.footer = function (optionsOrChild) {
  for (var _len38 = arguments.length, children = new Array(_len38 > 1 ? _len38 - 1 : 0), _key38 = 1; _key38 < _len38; _key38++) {
    children[_key38 - 1] = arguments[_key38];
  }

  return createElementWC('footer', optionsOrChild, children);
};

exports.form = function (optionsOrChild) {
  for (var _len39 = arguments.length, children = new Array(_len39 > 1 ? _len39 - 1 : 0), _key39 = 1; _key39 < _len39; _key39++) {
    children[_key39 - 1] = arguments[_key39];
  }

  return createElementWC('form', optionsOrChild, children);
};

exports.frame = function (optionsOrChild) {
  for (var _len40 = arguments.length, children = new Array(_len40 > 1 ? _len40 - 1 : 0), _key40 = 1; _key40 < _len40; _key40++) {
    children[_key40 - 1] = arguments[_key40];
  }

  return createElementWC('frame', optionsOrChild, children);
};

exports.frameset = function (optionsOrChild) {
  for (var _len41 = arguments.length, children = new Array(_len41 > 1 ? _len41 - 1 : 0), _key41 = 1; _key41 < _len41; _key41++) {
    children[_key41 - 1] = arguments[_key41];
  }

  return createElementWC('frameset', optionsOrChild, children);
};

exports.h1 = function (optionsOrChild) {
  for (var _len42 = arguments.length, children = new Array(_len42 > 1 ? _len42 - 1 : 0), _key42 = 1; _key42 < _len42; _key42++) {
    children[_key42 - 1] = arguments[_key42];
  }

  return createElementWC('h1', optionsOrChild, children);
};

exports.h6 = function (optionsOrChild) {
  for (var _len43 = arguments.length, children = new Array(_len43 > 1 ? _len43 - 1 : 0), _key43 = 1; _key43 < _len43; _key43++) {
    children[_key43 - 1] = arguments[_key43];
  }

  return createElementWC('h6', optionsOrChild, children);
};

exports.head = function (optionsOrChild) {
  for (var _len44 = arguments.length, children = new Array(_len44 > 1 ? _len44 - 1 : 0), _key44 = 1; _key44 < _len44; _key44++) {
    children[_key44 - 1] = arguments[_key44];
  }

  return createElementWC('head', optionsOrChild, children);
};

exports.header = function (optionsOrChild) {
  for (var _len45 = arguments.length, children = new Array(_len45 > 1 ? _len45 - 1 : 0), _key45 = 1; _key45 < _len45; _key45++) {
    children[_key45 - 1] = arguments[_key45];
  }

  return createElementWC('header', optionsOrChild, children);
};

exports.hgroup = function (optionsOrChild) {
  for (var _len46 = arguments.length, children = new Array(_len46 > 1 ? _len46 - 1 : 0), _key46 = 1; _key46 < _len46; _key46++) {
    children[_key46 - 1] = arguments[_key46];
  }

  return createElementWC('hgroup', optionsOrChild, children);
};

exports.hr = function (options) {
  return createElementWO('hr', options);
};

exports.Tsm = function (optionsOrChild) {
  for (var _len47 = arguments.length, children = new Array(_len47 > 1 ? _len47 - 1 : 0), _key47 = 1; _key47 < _len47; _key47++) {
    children[_key47 - 1] = arguments[_key47];
  }

  return createElementWC('Tsm', optionsOrChild, children);
};

exports.i = function (optionsOrChild) {
  for (var _len48 = arguments.length, children = new Array(_len48 > 1 ? _len48 - 1 : 0), _key48 = 1; _key48 < _len48; _key48++) {
    children[_key48 - 1] = arguments[_key48];
  }

  return createElementWC('i', optionsOrChild, children);
};

exports.iframe = function (optionsOrChild) {
  for (var _len49 = arguments.length, children = new Array(_len49 > 1 ? _len49 - 1 : 0), _key49 = 1; _key49 < _len49; _key49++) {
    children[_key49 - 1] = arguments[_key49];
  }

  return createElementWC('iframe', optionsOrChild, children);
};

exports.img = function (options) {
  return createElementWO('img', options);
};

exports.input = function (options) {
  return createElementWO('input', options);
};

exports.ins = function (optionsOrChild) {
  for (var _len50 = arguments.length, children = new Array(_len50 > 1 ? _len50 - 1 : 0), _key50 = 1; _key50 < _len50; _key50++) {
    children[_key50 - 1] = arguments[_key50];
  }

  return createElementWC('ins', optionsOrChild, children);
};

exports.kbd = function (optionsOrChild) {
  for (var _len51 = arguments.length, children = new Array(_len51 > 1 ? _len51 - 1 : 0), _key51 = 1; _key51 < _len51; _key51++) {
    children[_key51 - 1] = arguments[_key51];
  }

  return createElementWC('kbd', optionsOrChild, children);
};

exports.keygen = function (options) {
  return createElementWO('keygen', options);
};

exports.label = function (optionsOrChild) {
  for (var _len52 = arguments.length, children = new Array(_len52 > 1 ? _len52 - 1 : 0), _key52 = 1; _key52 < _len52; _key52++) {
    children[_key52 - 1] = arguments[_key52];
  }

  return createElementWC('label', optionsOrChild, children);
};

exports.legend = function (optionsOrChild) {
  for (var _len53 = arguments.length, children = new Array(_len53 > 1 ? _len53 - 1 : 0), _key53 = 1; _key53 < _len53; _key53++) {
    children[_key53 - 1] = arguments[_key53];
  }

  return createElementWC('legend', optionsOrChild, children);
};

exports.li = function (optionsOrChild) {
  for (var _len54 = arguments.length, children = new Array(_len54 > 1 ? _len54 - 1 : 0), _key54 = 1; _key54 < _len54; _key54++) {
    children[_key54 - 1] = arguments[_key54];
  }

  return createElementWC('li', optionsOrChild, children);
};

exports.link = function (options) {
  return createElementWO('link', options);
};

exports.map = function (optionsOrChild) {
  for (var _len55 = arguments.length, children = new Array(_len55 > 1 ? _len55 - 1 : 0), _key55 = 1; _key55 < _len55; _key55++) {
    children[_key55 - 1] = arguments[_key55];
  }

  return createElementWC('map', optionsOrChild, children);
};

exports.mark = function (optionsOrChild) {
  for (var _len56 = arguments.length, children = new Array(_len56 > 1 ? _len56 - 1 : 0), _key56 = 1; _key56 < _len56; _key56++) {
    children[_key56 - 1] = arguments[_key56];
  }

  return createElementWC('mark', optionsOrChild, children);
};

exports.menu = function (optionsOrChild) {
  for (var _len57 = arguments.length, children = new Array(_len57 > 1 ? _len57 - 1 : 0), _key57 = 1; _key57 < _len57; _key57++) {
    children[_key57 - 1] = arguments[_key57];
  }

  return createElementWC('menu', optionsOrChild, children);
};

exports.meta = function (options) {
  return createElementWO('meta', options);
};

exports.meter = function (optionsOrChild) {
  for (var _len58 = arguments.length, children = new Array(_len58 > 1 ? _len58 - 1 : 0), _key58 = 1; _key58 < _len58; _key58++) {
    children[_key58 - 1] = arguments[_key58];
  }

  return createElementWC('meter', optionsOrChild, children);
};

exports.nav = function (optionsOrChild) {
  for (var _len59 = arguments.length, children = new Array(_len59 > 1 ? _len59 - 1 : 0), _key59 = 1; _key59 < _len59; _key59++) {
    children[_key59 - 1] = arguments[_key59];
  }

  return createElementWC('nav', optionsOrChild, children);
};

exports.noframes = function (optionsOrChild) {
  for (var _len60 = arguments.length, children = new Array(_len60 > 1 ? _len60 - 1 : 0), _key60 = 1; _key60 < _len60; _key60++) {
    children[_key60 - 1] = arguments[_key60];
  }

  return createElementWC('noframes', optionsOrChild, children);
};

exports.noscript = function (optionsOrChild) {
  for (var _len61 = arguments.length, children = new Array(_len61 > 1 ? _len61 - 1 : 0), _key61 = 1; _key61 < _len61; _key61++) {
    children[_key61 - 1] = arguments[_key61];
  }

  return createElementWC('noscript', optionsOrChild, children);
};

exports.object = function (optionsOrChild) {
  for (var _len62 = arguments.length, children = new Array(_len62 > 1 ? _len62 - 1 : 0), _key62 = 1; _key62 < _len62; _key62++) {
    children[_key62 - 1] = arguments[_key62];
  }

  return createElementWC('object', optionsOrChild, children);
};

exports.ol = function (optionsOrChild) {
  for (var _len63 = arguments.length, children = new Array(_len63 > 1 ? _len63 - 1 : 0), _key63 = 1; _key63 < _len63; _key63++) {
    children[_key63 - 1] = arguments[_key63];
  }

  return createElementWC('ol', optionsOrChild, children);
};

exports.optgroup = function (optionsOrChild) {
  for (var _len64 = arguments.length, children = new Array(_len64 > 1 ? _len64 - 1 : 0), _key64 = 1; _key64 < _len64; _key64++) {
    children[_key64 - 1] = arguments[_key64];
  }

  return createElementWC('optgroup', optionsOrChild, children);
};

exports.option = function (optionsOrChild) {
  for (var _len65 = arguments.length, children = new Array(_len65 > 1 ? _len65 - 1 : 0), _key65 = 1; _key65 < _len65; _key65++) {
    children[_key65 - 1] = arguments[_key65];
  }

  return createElementWC('option', optionsOrChild, children);
};

exports.output = function (optionsOrChild) {
  for (var _len66 = arguments.length, children = new Array(_len66 > 1 ? _len66 - 1 : 0), _key66 = 1; _key66 < _len66; _key66++) {
    children[_key66 - 1] = arguments[_key66];
  }

  return createElementWC('output', optionsOrChild, children);
};

exports.p = function (optionsOrChild) {
  for (var _len67 = arguments.length, children = new Array(_len67 > 1 ? _len67 - 1 : 0), _key67 = 1; _key67 < _len67; _key67++) {
    children[_key67 - 1] = arguments[_key67];
  }

  return createElementWC('p', optionsOrChild, children);
};

exports.param = function (options) {
  return createElementWO('param', options);
};

exports.pre = function (optionsOrChild) {
  for (var _len68 = arguments.length, children = new Array(_len68 > 1 ? _len68 - 1 : 0), _key68 = 1; _key68 < _len68; _key68++) {
    children[_key68 - 1] = arguments[_key68];
  }

  return createElementWC('pre', optionsOrChild, children);
};

exports.progress = function (optionsOrChild) {
  for (var _len69 = arguments.length, children = new Array(_len69 > 1 ? _len69 - 1 : 0), _key69 = 1; _key69 < _len69; _key69++) {
    children[_key69 - 1] = arguments[_key69];
  }

  return createElementWC('progress', optionsOrChild, children);
};

exports.q = function (optionsOrChild) {
  for (var _len70 = arguments.length, children = new Array(_len70 > 1 ? _len70 - 1 : 0), _key70 = 1; _key70 < _len70; _key70++) {
    children[_key70 - 1] = arguments[_key70];
  }

  return createElementWC('q', optionsOrChild, children);
};

exports.rp = function (optionsOrChild) {
  for (var _len71 = arguments.length, children = new Array(_len71 > 1 ? _len71 - 1 : 0), _key71 = 1; _key71 < _len71; _key71++) {
    children[_key71 - 1] = arguments[_key71];
  }

  return createElementWC('rp', optionsOrChild, children);
};

exports.rt = function (optionsOrChild) {
  for (var _len72 = arguments.length, children = new Array(_len72 > 1 ? _len72 - 1 : 0), _key72 = 1; _key72 < _len72; _key72++) {
    children[_key72 - 1] = arguments[_key72];
  }

  return createElementWC('rt', optionsOrChild, children);
};

exports.ruby = function (optionsOrChild) {
  for (var _len73 = arguments.length, children = new Array(_len73 > 1 ? _len73 - 1 : 0), _key73 = 1; _key73 < _len73; _key73++) {
    children[_key73 - 1] = arguments[_key73];
  }

  return createElementWC('ruby', optionsOrChild, children);
};

exports.s = function (optionsOrChild) {
  for (var _len74 = arguments.length, children = new Array(_len74 > 1 ? _len74 - 1 : 0), _key74 = 1; _key74 < _len74; _key74++) {
    children[_key74 - 1] = arguments[_key74];
  }

  return createElementWC('s', optionsOrChild, children);
};

exports.samp = function (optionsOrChild) {
  for (var _len75 = arguments.length, children = new Array(_len75 > 1 ? _len75 - 1 : 0), _key75 = 1; _key75 < _len75; _key75++) {
    children[_key75 - 1] = arguments[_key75];
  }

  return createElementWC('samp', optionsOrChild, children);
};

exports.script = function (optionsOrChild) {
  for (var _len76 = arguments.length, children = new Array(_len76 > 1 ? _len76 - 1 : 0), _key76 = 1; _key76 < _len76; _key76++) {
    children[_key76 - 1] = arguments[_key76];
  }

  return createElementWC('script', optionsOrChild, children);
};

exports.section = function (optionsOrChild) {
  for (var _len77 = arguments.length, children = new Array(_len77 > 1 ? _len77 - 1 : 0), _key77 = 1; _key77 < _len77; _key77++) {
    children[_key77 - 1] = arguments[_key77];
  }

  return createElementWC('section', optionsOrChild, children);
};

exports.select = function (optionsOrChild) {
  for (var _len78 = arguments.length, children = new Array(_len78 > 1 ? _len78 - 1 : 0), _key78 = 1; _key78 < _len78; _key78++) {
    children[_key78 - 1] = arguments[_key78];
  }

  return createElementWC('select', optionsOrChild, children);
};

exports.small = function (optionsOrChild) {
  for (var _len79 = arguments.length, children = new Array(_len79 > 1 ? _len79 - 1 : 0), _key79 = 1; _key79 < _len79; _key79++) {
    children[_key79 - 1] = arguments[_key79];
  }

  return createElementWC('small', optionsOrChild, children);
};

exports.source = function (options) {
  return createElementWO('source', options);
};

exports.span = function (optionsOrChild) {
  for (var _len80 = arguments.length, children = new Array(_len80 > 1 ? _len80 - 1 : 0), _key80 = 1; _key80 < _len80; _key80++) {
    children[_key80 - 1] = arguments[_key80];
  }

  return createElementWC('span', optionsOrChild, children);
};

exports.strike = function (optionsOrChild) {
  for (var _len81 = arguments.length, children = new Array(_len81 > 1 ? _len81 - 1 : 0), _key81 = 1; _key81 < _len81; _key81++) {
    children[_key81 - 1] = arguments[_key81];
  }

  return createElementWC('strike', optionsOrChild, children);
};

exports.strong = function (optionsOrChild) {
  for (var _len82 = arguments.length, children = new Array(_len82 > 1 ? _len82 - 1 : 0), _key82 = 1; _key82 < _len82; _key82++) {
    children[_key82 - 1] = arguments[_key82];
  }

  return createElementWC('strong', optionsOrChild, children);
};

exports.style = function (optionsOrChild) {
  for (var _len83 = arguments.length, children = new Array(_len83 > 1 ? _len83 - 1 : 0), _key83 = 1; _key83 < _len83; _key83++) {
    children[_key83 - 1] = arguments[_key83];
  }

  return createElementWC('style', optionsOrChild, children);
};

exports.sub = function (optionsOrChild) {
  for (var _len84 = arguments.length, children = new Array(_len84 > 1 ? _len84 - 1 : 0), _key84 = 1; _key84 < _len84; _key84++) {
    children[_key84 - 1] = arguments[_key84];
  }

  return createElementWC('sub', optionsOrChild, children);
};

exports.summary = function (optionsOrChild) {
  for (var _len85 = arguments.length, children = new Array(_len85 > 1 ? _len85 - 1 : 0), _key85 = 1; _key85 < _len85; _key85++) {
    children[_key85 - 1] = arguments[_key85];
  }

  return createElementWC('summary', optionsOrChild, children);
};

exports.sup = function (optionsOrChild) {
  for (var _len86 = arguments.length, children = new Array(_len86 > 1 ? _len86 - 1 : 0), _key86 = 1; _key86 < _len86; _key86++) {
    children[_key86 - 1] = arguments[_key86];
  }

  return createElementWC('sup', optionsOrChild, children);
};

exports.table = function (optionsOrChild) {
  for (var _len87 = arguments.length, children = new Array(_len87 > 1 ? _len87 - 1 : 0), _key87 = 1; _key87 < _len87; _key87++) {
    children[_key87 - 1] = arguments[_key87];
  }

  return createElementWC('table', optionsOrChild, children);
};

exports.tbody = function (optionsOrChild) {
  for (var _len88 = arguments.length, children = new Array(_len88 > 1 ? _len88 - 1 : 0), _key88 = 1; _key88 < _len88; _key88++) {
    children[_key88 - 1] = arguments[_key88];
  }

  return createElementWC('tbody', optionsOrChild, children);
};

exports.td = function (optionsOrChild) {
  for (var _len89 = arguments.length, children = new Array(_len89 > 1 ? _len89 - 1 : 0), _key89 = 1; _key89 < _len89; _key89++) {
    children[_key89 - 1] = arguments[_key89];
  }

  return createElementWC('td', optionsOrChild, children);
};

exports.textarea = function (optionsOrChild) {
  for (var _len90 = arguments.length, children = new Array(_len90 > 1 ? _len90 - 1 : 0), _key90 = 1; _key90 < _len90; _key90++) {
    children[_key90 - 1] = arguments[_key90];
  }

  return createElementWC('textarea', optionsOrChild, children);
};

exports.tfoot = function (optionsOrChild) {
  for (var _len91 = arguments.length, children = new Array(_len91 > 1 ? _len91 - 1 : 0), _key91 = 1; _key91 < _len91; _key91++) {
    children[_key91 - 1] = arguments[_key91];
  }

  return createElementWC('tfoot', optionsOrChild, children);
};

exports.th = function (optionsOrChild) {
  for (var _len92 = arguments.length, children = new Array(_len92 > 1 ? _len92 - 1 : 0), _key92 = 1; _key92 < _len92; _key92++) {
    children[_key92 - 1] = arguments[_key92];
  }

  return createElementWC('th', optionsOrChild, children);
};

exports.thead = function (optionsOrChild) {
  for (var _len93 = arguments.length, children = new Array(_len93 > 1 ? _len93 - 1 : 0), _key93 = 1; _key93 < _len93; _key93++) {
    children[_key93 - 1] = arguments[_key93];
  }

  return createElementWC('thead', optionsOrChild, children);
};

exports.time = function (optionsOrChild) {
  for (var _len94 = arguments.length, children = new Array(_len94 > 1 ? _len94 - 1 : 0), _key94 = 1; _key94 < _len94; _key94++) {
    children[_key94 - 1] = arguments[_key94];
  }

  return createElementWC('time', optionsOrChild, children);
};

exports.title = function (optionsOrChild) {
  for (var _len95 = arguments.length, children = new Array(_len95 > 1 ? _len95 - 1 : 0), _key95 = 1; _key95 < _len95; _key95++) {
    children[_key95 - 1] = arguments[_key95];
  }

  return createElementWC('title', optionsOrChild, children);
};

exports.tr = function (optionsOrChild) {
  for (var _len96 = arguments.length, children = new Array(_len96 > 1 ? _len96 - 1 : 0), _key96 = 1; _key96 < _len96; _key96++) {
    children[_key96 - 1] = arguments[_key96];
  }

  return createElementWC('tr', optionsOrChild, children);
};

exports.track = function (options) {
  return createElementWO('track', options);
};

exports.tt = function (optionsOrChild) {
  for (var _len97 = arguments.length, children = new Array(_len97 > 1 ? _len97 - 1 : 0), _key97 = 1; _key97 < _len97; _key97++) {
    children[_key97 - 1] = arguments[_key97];
  }

  return createElementWC('tt', optionsOrChild, children);
};

exports.u = function (optionsOrChild) {
  for (var _len98 = arguments.length, children = new Array(_len98 > 1 ? _len98 - 1 : 0), _key98 = 1; _key98 < _len98; _key98++) {
    children[_key98 - 1] = arguments[_key98];
  }

  return createElementWC('u', optionsOrChild, children);
};

exports.ul = function (optionsOrChild) {
  for (var _len99 = arguments.length, children = new Array(_len99 > 1 ? _len99 - 1 : 0), _key99 = 1; _key99 < _len99; _key99++) {
    children[_key99 - 1] = arguments[_key99];
  }

  return createElementWC('ul', optionsOrChild, children);
};

exports.variable = function (optionsOrChild) {
  for (var _len100 = arguments.length, children = new Array(_len100 > 1 ? _len100 - 1 : 0), _key100 = 1; _key100 < _len100; _key100++) {
    children[_key100 - 1] = arguments[_key100];
  }

  return createElementWC('var', optionsOrChild, children);
};

exports.video = function (optionsOrChild) {
  for (var _len101 = arguments.length, children = new Array(_len101 > 1 ? _len101 - 1 : 0), _key101 = 1; _key101 < _len101; _key101++) {
    children[_key101 - 1] = arguments[_key101];
  }

  return createElementWC('video', optionsOrChild, children);
};

exports.wbr = function (options) {
  return createElementWO('wbr', options);
};

exports.h2 = function (optionsOrChild) {
  for (var _len102 = arguments.length, children = new Array(_len102 > 1 ? _len102 - 1 : 0), _key102 = 1; _key102 < _len102; _key102++) {
    children[_key102 - 1] = arguments[_key102];
  }

  return createElementWC('h2', optionsOrChild, children);
};

exports.h3 = function (optionsOrChild) {
  for (var _len103 = arguments.length, children = new Array(_len103 > 1 ? _len103 - 1 : 0), _key103 = 1; _key103 < _len103; _key103++) {
    children[_key103 - 1] = arguments[_key103];
  }

  return createElementWC('h3', optionsOrChild, children);
};

exports.h4 = function (optionsOrChild) {
  for (var _len104 = arguments.length, children = new Array(_len104 > 1 ? _len104 - 1 : 0), _key104 = 1; _key104 < _len104; _key104++) {
    children[_key104 - 1] = arguments[_key104];
  }

  return createElementWC('h4', optionsOrChild, children);
};

exports.h5 = function (optionsOrChild) {
  for (var _len105 = arguments.length, children = new Array(_len105 > 1 ? _len105 - 1 : 0), _key105 = 1; _key105 < _len105; _key105++) {
    children[_key105 - 1] = arguments[_key105];
  }

  return createElementWC('h5', optionsOrChild, children);
};

exports.menuitem = function (options) {
  return createElementWO('menuitem', options);
};

exports.slot = function (optionsOrChild) {
  for (var _len106 = arguments.length, children = new Array(_len106 > 1 ? _len106 - 1 : 0), _key106 = 1; _key106 < _len106; _key106++) {
    children[_key106 - 1] = arguments[_key106];
  }

  return createElementWC('slot', optionsOrChild, children);
};
},{"./dateTime":"../../dateTime.ts","./number":"../../number.ts","./debouncers":"../../debouncers.ts"}],"../../tss.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var debouncers_1 = require("./debouncers");

var keyframeIndex = 0;
var styleIndex = 0;
var styleUrl;
var stylesRuleList = '';
var debounceId = -1;
var styleNamePrefix = '_TSS';
var keyframeNamePrefix = '_TSSK';
var styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
document.head.appendChild(styleLink);

var compileCSS = function compileCSS() {
  console.log(stylesRuleList);
  var blob = new Blob([stylesRuleList], {
    type: 'text/css'
  });
  styleLink.href = styleUrl = window.URL.createObjectURL(blob);
  var event = document.createEvent("HTMLEvents");
  event.initEvent("hrefchanged", true, true);
  styleLink.dispatchEvent(event);
  debounceId = -1;
};

var compile = debouncers_1.runIfInactive(compileCSS, 15);

var replaceChar = function replaceChar(text, charToReplace, callback) {
  var result = '';
  var position = 0,
      i = 0,
      singleQuote = false,
      doubleQoute = false;

  for (; i < text.length; i++) {
    var char = text[i];

    if (singleQuote) {
      if (char === '\\') i++;else if (char === "'") singleQuote = false;
    } else if (doubleQoute) {
      if (char === '\\') i++;else if (char === '"') doubleQoute = false;
    } else if (char === charToReplace) {
      result += text.substring(position, i) + callback();
    } else if (char === '"') {
      doubleQoute = true;
    } else if (char === "'") {
      singleQuote = true;
    }
  }

  return result + text.substring(position, i);
};

var mediaWrapper = function mediaWrapper(media, content) {
  return media ? "@media ".concat(media, "{").concat(content, "}") : content;
};

var prepareContent = function prepareContent(style) {
  var checkOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var propertiesList = [];
  var options = {};

  for (var name in style) {
    if (checkOptions[name]) {
      options[name] = style[name];
    } else {
      (function () {
        var propName = name.replace(/\_/g, '-');

        if (Array.isArray(style[name])) {
          style[name].forEach(function (v) {
            propertiesList.push("".concat(propName, ":").concat(v, ";"));
          });
        } else {
          propertiesList.push("".concat(propName, ":").concat(style[name], ";"));
        }
      })();
    }
  }

  return {
    content: propertiesList.join(''),
    options: options
  };
};

var prepareStyle = function prepareStyle(tsStyles) {
  var styleName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : styleNamePrefix + (styleIndex++).toString(32);
  var result = '';
  tsStyles.forEach(function (style) {
    var _prepareContent = prepareContent(style, {
      MEDIA: 1,
      SELECTOR: 1
    }),
        content = _prepareContent.content,
        options = _prepareContent.options;

    var MEDIA = options.MEDIA,
        SELECTOR = options.SELECTOR;
    MEDIA = MEDIA;
    SELECTOR = SELECTOR || [];
    var cssSelector;

    if (SELECTOR.length) {
      // length is for both, string and array
      if (SELECTOR.constructor === String) SELECTOR = [SELECTOR];
      cssSelector = SELECTOR.map(function (s) {
        s = s.trim();
        if (s.startsWith('=')) return replaceChar(s.substr(1), '@', function () {
          return '.' + styleName;
        });
        if (s.startsWith('<')) return "".concat(s.substr(1), " .").concat(styleName);
        return ".".concat(styleName, " ").concat(s);
      }).join(',');
    } else {
      cssSelector = '.' + styleName;
    }

    var styleText = "".concat(cssSelector, "{").concat(content, "}");
    styleText = mediaWrapper(MEDIA, styleText);
    result += styleText;
  });
  exports.postCss(result, styleName);
  return styleName;
};

var prepareFrames = function prepareFrames(tsStyles) {
  var keyframeName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : keyframeNamePrefix + (keyframeIndex++).toString(32);
  var stylesPerMedia = {};
  tsStyles.forEach(function (style) {
    var _prepareContent2 = prepareContent(style, {
      MEDIA: 1,
      SELECTOR: 1
    }),
        content = _prepareContent2.content,
        options = _prepareContent2.options;

    var MEDIA = options.MEDIA,
        SELECTOR = options.SELECTOR;
    MEDIA = MEDIA || '';
    SELECTOR = SELECTOR || [];
    var keySelector;

    if (SELECTOR.length) {
      // length is for both, string and array
      keySelector = SELECTOR.constructor === String ? SELECTOR : SELECTOR.join(',');
    } else {
      throw new Error('Missing selector');
    }

    if (!stylesPerMedia[MEDIA]) stylesPerMedia[MEDIA] = [];
    stylesPerMedia[MEDIA].push({
      keySelector: keySelector,
      content: content
    });
  });
  var result = '';

  for (var media in stylesPerMedia) {
    console.log(media);
    result += mediaWrapper(media, "@keyframes ".concat(keyframeName, "{") + stylesPerMedia[media].map(function (spm) {
      return "".concat(spm.keySelector, "{").concat(spm.content, "};");
    }).join('')) + '}';
  }

  exports.postCss(result, keyframeName);
  return keyframeName;
};

var prepareFont = function prepareFont(tsStyles) {
  var result = '';
  tsStyles.forEach(function (style) {
    var _prepareContent3 = prepareContent(style, {
      MEDIA: 1
    }),
        content = _prepareContent3.content,
        options = _prepareContent3.options;

    var MEDIA = options.MEDIA;
    result += mediaWrapper(MEDIA, "@fontface{" + content + '}');
  });
  exports.postCss(result);
};

exports.postCss = function (style, name) {
  if (style) {
    stylesRuleList += style;
    compile();
  }
};

exports.childOf = function (parent) {
  parent = parent.trim();
  if (parent.startsWith(styleNamePrefix)) return "<." + parent;
  return '<' + parent;
};

exports.query = function (q) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  var i = 0;
  return '=' + replaceChar(q, '%', function () {
    return '.' + params[i++];
  });
};

exports.join = function () {
  for (var _len2 = arguments.length, styleList = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    styleList[_key2] = arguments[_key2];
  }

  return Object.assign.apply(Object, [{}].concat(styleList));
};

exports.globalStyles = function () {
  var link = styleLink.cloneNode();
  styleLink.addEventListener('hrefchanged', function () {
    link.href = styleUrl;
  });
  return link;
};

exports.tss = function (styleNameOrStyle) {
  for (var _len3 = arguments.length, styleList = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    styleList[_key3 - 1] = arguments[_key3];
  }

  if (styleNameOrStyle.constructor === String) {
    return prepareStyle(styleList, styleNameOrStyle);
  }

  if (styleNameOrStyle) styleList.unshift(styleNameOrStyle);
  return prepareStyle(styleList);
};

exports.tssFrames = function (keyframeNameOrStyle) {
  for (var _len4 = arguments.length, styleList = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    styleList[_key4 - 1] = arguments[_key4];
  }

  if (keyframeNameOrStyle.constructor === String) {
    return prepareFrames(styleList, keyframeNameOrStyle);
  }

  if (keyframeNameOrStyle) styleList.unshift(keyframeNameOrStyle);
  return prepareFrames(styleList);
};

exports.tssFont = function () {
  for (var _len5 = arguments.length, styleList = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    styleList[_key5] = arguments[_key5];
  }

  return prepareFont(styleList);
};
},{"./debouncers":"../../debouncers.ts"}],"editor.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var dom_1 = require("../../dom");

var tss_1 = require("../../tss");

var taStyle = tss_1.tss({
  width: "50%",
  height: "90%"
});

var feedInitial = function feedInitial(src, dst) {
  src.value = "";
  dst.value = ":=) ".concat(src.value, " (=:)");
};

var Editor =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(Editor, _HTMLElement);

  function Editor() {
    var _this;

    _classCallCheck(this, Editor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Editor).call(this));
    var source = dom_1.textarea({
      class: taStyle
    });
    var destination = dom_1.textarea({
      class: taStyle
    });
    var btnTranslate = dom_1.button({
      onclick: function onclick() {
        destination.value = ":=) ".concat(source.value, " (=:)");
      }
    }, "Add smileys");
    feedInitial(source, destination);
    dom_1.shadow(_assertThisInitialized(_this), tss_1.globalStyles(), dom_1.div(source, destination), btnTranslate, dom_1.iyyyymmdd(), dom_1.iyyyymm(), dom_1.ihhmm(), dom_1.inumber({
      decimals: 2
    }), dom_1.itel(), dom_1.iemail(), dom_1.itext(), dom_1.icheckbox(), dom_1.br(), // iarray({decorator: itext}, {$:{ivalue: ['abcd', 'efgh']}} ),
    dom_1.iselect({
      $: {
        ivalues: ['option 1', 'option 2'],
        ivalue: 1
      }
    }));
    return _this;
  }

  return Editor;
}(_wrapNativeSuper(HTMLElement));

exports.editor = dom_1.cpt(Editor);
},{"../../dom":"../../dom.ts","../../tss":"../../tss.ts"}],"main.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var dom_1 = require("../../dom");

var editor_1 = require("./editor");

var main = function main() {
  dom_1.body(editor_1.editor());
};

main();
},{"../../dom":"../../dom.ts","./editor":"editor.ts"}],"../../../../../../../../usr/local/share/.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "39771" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../../usr/local/share/.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.js.map