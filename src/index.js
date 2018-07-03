const ReactDOM = require('react-dom');
const retargetEvents = require('react-shadow-dom-retarget-events');
const getStyleElementsFromReactWebComponentStyleLoader = require('./getStyleElementsFromReactWebComponentStyleLoader');

require('@webcomponents/shadydom');
require('@webcomponents/custom-elements');

module.exports = {
  /**
   * todo fix jsdoc type of app
   * @param {*} app
   * @param {string} tagName
   */
  create: function(app, tagName) {

    var appInstance;

    const lifeCycleHooks = {
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
        if (instanceMethod && appInstance[instanceMethod]) {
            appInstance[instanceMethod].apply(appInstance, instanceParams)
        }
    }

    const proto = class extends HTMLElement {
      connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const mountPoint = document.createElement('div');
        const styles = getStyleElementsFromReactWebComponentStyleLoader();
        const webComponentInstance = this;
        for (var i = 0; i < styles.length; i++) {
          shadowRoot.appendChild(styles[i].cloneNode(true));
        }
        shadowRoot.appendChild(mountPoint);
        ReactDOM.render(app, mountPoint, function () {
          appInstance = this;
          callConstructorHook(webComponentInstance);
          callLifeCycleHook('connectedCallback');
        });
        retargetEvents(shadowRoot);
      }

      disconnectedCallback() {
        callLifeCycleHook('disconnectedCallback');
      }

      attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
        callLifeCycleHook('attributeChangedCallback', [attributeName, oldValue, newValue, namespace]);
      }

      adoptedCallback(oldDocument, newDocument) {
        callLifeCycleHook('adoptedCallback', [oldDocument, newDocument]);
      }
    };

    customElements.define(tagName, proto);
  },
};
