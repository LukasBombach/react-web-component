'use strict';

var ReactDOM = require('react-dom');
var retargetEvents = require('react-shadow-dom-retarget-events');
var getStyleElementsFromReactWebComponentStyleLoader = require('./getStyleElementsFromReactWebComponentStyleLoader');
var extractAttributes = require('./extractAttributes');

module.exports = {
  /**
   * @param {JSX.Element} app
   * @param {string} tagName - The name of the web component. Has to be minus "-" delimited.
   * @param {boolean} useShadowDom - If the value is set to "true" the web component will use the `shadowDom`. The default value is true.
   */
  create: function create(app, tagName) {
    var useShadowDom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var appInstance = void 0;

    var lifeCycleHooks = {
      attachedCallback: 'webComponentAttached',
      connectedCallback: 'webComponentConnected',
      disconnectedCallback: 'webComponentDisconnected',
      attributeChangedCallback: 'webComponentAttributeChanged',
      adoptedCallback: 'webComponentAdopted'
    };

    function callConstructorHook(webComponentInstance) {
      if (appInstance['webComponentConstructed']) {
        appInstance['webComponentConstructed'].apply(appInstance, [webComponentInstance]);
      }
    }

    function callLifeCycleHook(hook, params) {
      var instanceParams = params || [];
      var instanceMethod = lifeCycleHooks[hook];

      if (instanceMethod && appInstance && appInstance[instanceMethod]) {
        appInstance[instanceMethod].apply(appInstance, instanceParams);
      }
    }

    var proto = Object.create(HTMLElement.prototype, {
      attachedCallback: {
        value: function value() {
          var webComponentInstance = this;
          var mountPoint = webComponentInstance;

          if (useShadowDom) {
            // Re-assign the webComponentInstance (this) to the newly created shadowRoot
            webComponentInstance = webComponentInstance.createShadowRoot();

            // Re-assign the mountPoint to the newly created "div" element
            mountPoint = document.createElement('div');

            // Move all of the styles assigned to the react component inside of the shadowRoot.
            // By default this is not used, only if the library is explicitly installed
            var styles = getStyleElementsFromReactWebComponentStyleLoader();
            styles.forEach(function (style) {
              webComponentInstance.appendChild(style.cloneNode(webComponentInstance));
            });

            webComponentInstance.appendChild(mountPoint);

            retargetEvents(webComponentInstance);
          }

          ReactDOM.render(app, mountPoint, function () {
            appInstance = this;
            appInstance.props = extractAttributes(webComponentInstance);

            callConstructorHook(webComponentInstance);
            callLifeCycleHook('attachedCallback');
          });
        }
      },
      connectedCallback: {
        value: function value() {
          callLifeCycleHook('connectedCallback');
        }
      },
      disconnectedCallback: {
        value: function value() {
          callLifeCycleHook('disconnectedCallback');
        }
      },
      attributeChangedCallback: {
        value: function value(attributeName, oldValue, newValue, namespace) {
          callLifeCycleHook('attributeChangedCallback', [attributeName, oldValue, newValue, namespace]);
        }
      },
      adoptedCallback: {
        value: function value(oldDocument, newDocument) {
          callLifeCycleHook('adoptedCallback', [oldDocument, newDocument]);
        }
      }
    });

    document.registerElement(tagName, { prototype: proto });
  }
};