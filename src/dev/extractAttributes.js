const camelCasedAttribute = require('./camelCasedAttribute');

/**
 * Takes in a node attributes map and returns an object with camelCased properties and values
 * @param nodeMap
 * @returns {{}}
 */
module.exports = function extractAttributes(nodeMap) {
  if (!nodeMap.attributes) {
    return {};
  }

  let obj = {};
  let attribute;
  const attributesAsNodeMap = [...nodeMap.attributes];
  const attributes = attributesAsNodeMap.map((attribute) => ({ [attribute.name]: attribute.value }));

  for (attribute of attributes) {
    const key = Object.keys(attribute)[0];
    const camelCasedKey = camelCasedAttribute(key);
    obj[camelCasedKey] = attribute[key];
  }

  return obj;
};
