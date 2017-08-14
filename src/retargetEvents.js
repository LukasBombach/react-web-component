module.exports = function retargetEvents(shadowRoot) {
  const events = 'onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp'.split(
    ' '
  );

  function dispatchEvent(event, eventType, itemProps) {
    if (itemProps[eventType]) {
      itemProps[eventType](event);
    } else if (itemProps.children) {
      for (var i in itemProps.children) {
        if (itemProps.children.hasOwnProperty(i) && itemProps.children[i].props) dispatchEvent(event, eventType, itemProps.children[i].props);
      }
    }
  }

  // Compatible with v0.14 & 15
  function findReactInternal(item) {
    for (var i in item) {
      if (item.hasOwnProperty(i) && i.indexOf('_reactInternal') !== -1) {
        return item[i];
      }
    }
  }
  for (var i in events) {
    const eventType = events[i];
    const transformedEventType = eventType.replace(/^on/, '').toLowerCase();
    shadowRoot.addEventListener(transformedEventType, event => {
      const internalComponent = findReactInternal(event.target);
      if (
        internalComponent &&
        internalComponent._currentElement &&
        internalComponent._currentElement.props
      ) {
        dispatchEvent(
          event,
          eventType,
          internalComponent._currentElement.props
        );
      }
    });
  }
};
