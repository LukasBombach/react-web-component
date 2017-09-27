const ReactDOM = require('react-dom');
const retargetEvents = require('react-shadow-dom-retarget-events');
const getStyleElementsFromReactWebComponentStyleLoader = require('./getStyleElementsFromReactWebComponentStyleLoader');

module.exports = {
  /**
   * todo fix jsdoc type of app
   * @param {*} app
   * @param {string} tagName
   */
  create: function(app, tagName) {

    var appInstance;

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
        if (instanceMethod && appInstance[instanceMethod]) {
            appInstance[instanceMethod].apply(appInstance, instanceParams)
        }
    }

    const proto = Object.create(HTMLElement.prototype, {
      attachedCallback: {
        value: function() {
          const shadowRoot = this.createShadowRoot();
          const mountPoint = document.createElement('div');
          const styles = getStyleElementsFromReactWebComponentStyleLoader();
          const webComponentInstance = this;
          for (var i = 0; i < styles.length; i++) {
            shadowRoot.appendChild(styles[i])
          }
          shadowRoot.appendChild(mountPoint);
          ReactDOM.render(app, mountPoint, function () {
              appInstance = this;
              callConstructorHook(webComponentInstance);
              callLifeCycleHook('attachedCallback');
          });
          retargetEvents(shadowRoot);
        },
      },
      connectedCallback: {
        value: function() {
          callLifeCycleHook('connectedCallback');
        },
      },
      disconnectedCallback: {
        value: function() {
          callLifeCycleHook('disconnectedCallback');
        },
      },
      attributeChangedCallback: {
        value: function(attributeName, oldValue, newValue, namespace) {
          callLifeCycleHook('attributeChangedCallback', [attributeName, oldValue, newValue, namespace]);
        },
      },
      adoptedCallback: {
        value: function(oldDocument, newDocument) {
          callLifeCycleHook('adoptedCallback', [oldDocument, newDocument]);
        },
      },
    });
    document.registerElement(tagName, { prototype: proto });
  },
};
