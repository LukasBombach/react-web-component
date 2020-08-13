/**
 * Takes in a node attributes map and returns an object with camelCased properties and values
 * @param attribute
 * @returns {{}}
 */
module.exports = function camelCasedAttribute(attribute) {
  return attribute.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
};
