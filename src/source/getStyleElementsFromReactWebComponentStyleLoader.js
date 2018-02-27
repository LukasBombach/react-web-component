'use strict';

/**
 * An optional library which is conditionally added
 * @returns {[]}
 */
module.exports = function () {
  try {
    return require('react-web-component-style-loader/exports').styleElements;
  } catch (e) {
    return [];
  }
};