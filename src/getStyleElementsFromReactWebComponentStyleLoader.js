export default function getStyleElementsFromReactWebComponentStyleLoader() {
  try {
    return require('style-loader/export').styleElements;
  } catch (e) {
    return [];
  }
}
