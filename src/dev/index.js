const React = require('react');
const ReactDOM = require('react-dom');
const retargetEvents = require('react-shadow-dom-retarget-events');
const getStyleElementsFromReactWebComponentStyleLoader = require('./getStyleElementsFromReactWebComponentStyleLoader');
const extractAttributes = require('./extractAttributes');

require('@webcomponents/shadydom');
require('@webcomponents/custom-elements');

module.exports = {
  /**
   * @param {JSX.Element} app
   * @param {string} tagName - The name of the web component. Has to be minus "-" delimited.
   * @param {boolean} useShadowDom - If the value is set to "true" the web component will use the `shadowDom`. The default value is true.
   */
  create: (app, tagName, useShadowDom = true) => {
    let appInstance;

    const lifeCycleHooks = {
      attachedCallback: 'webComponentAttached',
      connectedCallback: 'webComponentConnected',
      disconnectedCallback: 'webComponentDisconnected',
      attributeChangedCallback: 'webComponentAttributeChanged',
      adoptedCallback: 'webComponentAdopted'
    };

    function callConstructorHook(webComponentInstance) {
      if (appInstance['webComponentConstructed']) {
        appInstance['webComponentConstructed'].apply(appInstance, [webComponentInstance])
      }
    }

    function callLifeCycleHook(hook, params) {
      const instanceParams = params || [];
      const instanceMethod = lifeCycleHooks[hook];

      if (instanceMethod && appInstance && appInstance[instanceMethod]) {
        appInstance[instanceMethod].apply(appInstance, instanceParams);
      }
    }

    const proto = class extends HTMLElement {
      connectedCallback() {
        const webComponentInstance = this;
        let mountPoint = webComponentInstance;

        if (useShadowDom) {
          // Re-assign the webComponentInstance (this) to the newly created shadowRoot
          const shadowRoot = webComponentInstance.attachShadow({ mode: 'open' });
          // Re-assign the mountPoint to the newly created "div" element
          mountPoint = document.createElement('div');

          // Move all of the styles assigned to the react component inside of the shadowRoot.
          // By default this is not used, only if the library is explicitly installed
          const styles = getStyleElementsFromReactWebComponentStyleLoader();
          styles.forEach((style) => {
            shadowRoot.appendChild(style.cloneNode(shadowRoot));
          });

          shadowRoot.appendChild(mountPoint);

          retargetEvents(shadowRoot);
        }

        ReactDOM.render(React.cloneElement(app, extractAttributes(webComponentInstance)) , mountPoint, () => {
          appInstance = this;

          callConstructorHook(webComponentInstance);
          callLifeCycleHook('connectedCallback');
        });
      }
      disconnectedCallback () {
          callLifeCycleHook('disconnectedCallback');
      }
      attributeChangedCallback (attributeName, oldValue, newValue, namespace) {
        callLifeCycleHook('attributeChangedCallback', [attributeName, oldValue, newValue, namespace]);
      }
      adoptedCallback (oldDocument, newDocument) {
        callLifeCycleHook('adoptedCallback', [oldDocument, newDocument]);
      }
    }

    customElements.define(tagName, proto);
  },
};
