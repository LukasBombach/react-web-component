module.exports = function retargetEvents(shadowRoot) {

  const events = 'onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp'.split(' ')

  for (const eventType of events) {
    const transformedEventType = eventType.replace(/^on/, '').toLowerCase();

    shadowRoot.addEventListener(transformedEventType, function (event) {
      for (const item of event.path) {
        const internalComponent = findReactInternal(item);

        if (internalComponent && internalComponent._currentElement && internalComponent._currentElement.props) {
          dispatchEvent(event, eventType, internalComponent._currentElement.props);
        }

        if (item === shadowRoot) {
          break;
        }
      }
    });
  }
};

function findReactInternal(item) {
  let instance;
  for (let key in item) {
    if (item.hasOwnProperty(key) && key.indexOf('_reactInternal') !== -1) {
      instance = item[key];
      break;
    }
  }
  return instance;
}

function dispatchEvent(event, eventType, itemProps) {
  if (itemProps[eventType]) {
    itemProps[eventType](event);
  }
}
