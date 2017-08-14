module.exports = function getStyleElementsFromReactWebComponentStyleLoader() {
  try {
    return require('react-web-component-style-loader/export').styleElements;
  } catch (e) {
    return [];
  }
};
