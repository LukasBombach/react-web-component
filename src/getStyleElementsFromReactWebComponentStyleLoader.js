module.exports = function getStyleElementsFromReactWebComponentStyleLoader() {
  try {
    return require('react-web-component-style-loader/exports').styleElements;
  } catch (e) {
    return [];
  }
};
