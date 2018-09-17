/**
 * An optional library which is conditionally added
 * @returns {[]}
 */
module.exports = () => {
  try {
    return require('react-web-component-style-loader/exports').styleElements;
  } catch (e) {
    return [];
  }
};
