'use strict';var ReactDOM=require('react-dom'),retargetEvents=require('react-shadow-dom-retarget-events'),getStyleElementsFromReactWebComponentStyleLoader=require('./getStyleElementsFromReactWebComponentStyleLoader');module.exports={create:function create(a,b){function c(a){f.webComponentConstructed&&f.webComponentConstructed.apply(f,[a])}function d(a,b){var c=g[a];c&&f[c]&&f[c].apply(f,b||[])}var e=!(2<arguments.length&&arguments[2]!==void 0)||arguments[2],f=void 0,g={attachedCallback:'webComponentAttached',connectedCallback:'webComponentConnected',disconnectedCallback:'webComponentDisconnected',attributeChangedCallback:'webComponentAttributeChanged',adoptedCallback:'webComponentAdopted'},h=Object.create(HTMLElement.prototype,{attachedCallback:{value:function value(){var b=this,g=b;if(e){b=b.createShadowRoot(),g=document.createElement('div');var h=getStyleElementsFromReactWebComponentStyleLoader();h.forEach(function(a){b.appendChild(a.cloneNode(b))}),b.appendChild(g)}ReactDOM.render(a,g,function(){f=this,c(b),d('attachedCallback')}),retargetEvents(b)}},connectedCallback:{value:function value(){d('connectedCallback')}},disconnectedCallback:{value:function value(){d('disconnectedCallback')}},attributeChangedCallback:{value:function value(a,b,c,e){d('attributeChangedCallback',[a,b,c,e])}},adoptedCallback:{value:function value(a,b){d('adoptedCallback',[a,b])}}});document.registerElement(b,{prototype:h})}};