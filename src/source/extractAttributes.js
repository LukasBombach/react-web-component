"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Takes in a node attributes map and returns an object with camelCased properties and values
 * @param nodeMap
 * @returns {{}}
 */
module.exports = function extractAttributes(nodeMap) {
  if (!nodeMap.attributes) {
    return {};
  }

  var obj = {};
  var attribute = void 0;
  var attributesAsNodeMap = [].concat(_toConsumableArray(nodeMap.attributes));
  var attributes = attributesAsNodeMap.map(function (attribute) {
    return _defineProperty({}, attribute.name, attribute.value);
  });

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      attribute = _step.value;

      var key = Object.keys(attribute)[0];
      var camelCasedKey = key.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
      });
      obj[camelCasedKey] = attribute[key];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return obj;
};