import ReactDOM from 'react-dom';
import retargetEvents from './retargetEvents';
import getStyleElementsFromReactWebComponentStyleLoader from './getStyleElementsFromReactWebComponentStyleLoader';

export default {
  /**
   * todo fix jsdoc type of app and options
   * @param {*} app
   * @param {string} tagName
   * @param {Object} [options]
   */
  create: function(app, tagName, options) {
    const proto = Object.create(HTMLElement.prototype, {
      attachedCallback: {
        value: function() {
          const shadowRoot = this.createShadowRoot();
          const mountPoint = document.createElement('div');
          getStyleElementsFromReactWebComponentStyleLoader().forEach(style =>
            shadowRoot.appendChild(style)
          );
          shadowRoot.appendChild(mountPoint);
          ReactDOM.render(app, mountPoint);
          retargetEvents(shadowRoot);
        },
      },
    });
    document.registerElement(tagName, { prototype: proto });
  },
};
