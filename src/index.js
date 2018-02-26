const ReactDOM = require('react-dom');
const retargetEvents = require('react-shadow-dom-retarget-events');
const getStyleElementsFromReactWebComponentStyleLoader = require('./getStyleElementsFromReactWebComponentStyleLoader');

module.exports = {
  /**
   * @param {function} app
   * @param {string} tagName - the name of the web component
   * @param {boolean} optOutFromShadowRoot - default value is false
   */
  create: function(app, tagName, optOutFromShadowRoot) {

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
      if (instanceMethod && appInstance[instanceMethod]) {
        appInstance[instanceMethod].apply(appInstance, instanceParams)
      }
    }

    const proto = Object.create(HTMLElement.prototype, {
      attachedCallback: {
        value: function() {
          let webComponentInstance = this;
          let mountPoint = webComponentInstance;

          if (!optOutFromShadowRoot) {
            // Re-assign the webComponentInstance / "this" to the newly created shadow root
            webComponentInstance = webComponentInstance.createShadowRoot();
            // Re-assign the mountPoint to the newly created "div" element
            mountPoint = document.createElement('div');

            const styles = getStyleElementsFromReactWebComponentStyleLoader();

            for (let i = 0; i < styles.length; i++) {
              webComponentInstance.appendChild(styles[i].cloneNode(webComponentInstance));
            }

            webComponentInstance.appendChild(mountPoint);
          }

          ReactDOM.render(app, mountPoint, function () {
            appInstance = this;
            callConstructorHook(webComponentInstance);
            callLifeCycleHook('attachedCallback');
          });

          retargetEvents(webComponentInstance);
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
