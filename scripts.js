var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.makeIterator=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;
$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};
$jscomp.Symbol=function(){var a=0;return function(b){return $jscomp.SYMBOL_PREFIX+(b||"")+a++}}();$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))}});$jscomp.initSymbolIterator=function(){}};
$jscomp.initSymbolAsyncIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.asyncIterator;a||(a=$jscomp.global.Symbol.asyncIterator=$jscomp.global.Symbol("asyncIterator"));$jscomp.initSymbolAsyncIterator=function(){}};$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};
$jscomp.iteratorFromArray=function(a,b){$jscomp.initSymbolIterator();a instanceof String&&(a+="");var c=0,d={next:function(){if(c<a.length){var e=c++;return{value:b(e,a[e]),done:!1}}d.next=function(){return{done:!0,value:void 0}};return d.next()}};d[Symbol.iterator]=function(){return d};return d};
$jscomp.polyfill=function(a,b,c,d){if(b){c=$jscomp.global;a=a.split(".");for(d=0;d<a.length-1;d++){var e=a[d];e in c||(c[e]={});c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};$jscomp.polyfill("Array.prototype.keys",function(a){return a?a:function(){return $jscomp.iteratorFromArray(this,function(a){return a})}},"es6","es3");$jscomp.owns=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)};
$jscomp.assign="function"==typeof Object.assign?Object.assign:function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(d)for(var e in d)$jscomp.owns(d,e)&&(a[e]=d[e])}return a};$jscomp.polyfill("Object.assign",function(a){return a||$jscomp.assign},"es6","es3");$jscomp.findInternal=function(a,b,c){a instanceof String&&(a=String(a));for(var d=a.length,e=0;e<d;e++){var h=a[e];if(b.call(c,h,e,a))return{i:e,v:h}}return{i:-1,v:void 0}};
$jscomp.polyfill("Array.prototype.find",function(a){return a?a:function(a,c){return $jscomp.findInternal(this,a,c).v}},"es6","es3");(function(a){function b(){a.replacePluginUrls();a.replaceConfigTable();a.addNavBurgerEvent()}"complete"===document.readyState||"interactive"===document.readyState?setTimeout(b,0):document.addEventListener("DOMContentLoaded",b)})(window.Dprint||(window.Dprint={}));
(function(a){a.addNavBurgerEvent=function(){var a=document.getElementById("navbarBurger");a.addEventListener("click",function(){a.classList.toggle("is-active");document.getElementById(a.dataset.target).classList.toggle("is-active")})}})(window.Dprint||(window.Dprint={}));
(function(a){function b(){for(var a=[],e=document.getElementsByClassName("plugin-config-table"),b=0;b<e.length;b++){var g=e.item(b);a.push({element:g,url:g.dataset.url})}return a}function c(a){return fetch(a).then(function(a){return a.json()}).then(function(a){function e(a){null==b[a]&&(b[a]={astSpecificProperties:[]})}for(var b={},d=0,c=$jscomp.makeIterator(Object.keys(a.properties)),f=c.next();!f.done;f=c.next())if(f=f.value,"$schema"!==f&&"deno"!==f&&"locked"!==f){var k=a.properties[f];if(k.$ref){var l=
a.definitions[f];null!=l?(e(f),b[f]=Object.assign(b[f],l),b[f].order=d++,b[f].name=f):(k=k.$ref.replace("#/definitions/",""),e(k),b[k].astSpecificProperties.push(f))}else e(f),b[f]=Object.assign(b[f],k),b[f].order=d++,b[f].name=f}a=[];d=Object.keys(b);for(c=0;c<d.length;c++)a.push(b[d[c]]);a.sort(function(a,b){return a.order-b.order});return a})}a.replaceConfigTable=function(){var a=b();0<a.length&&a.forEach(function(a){c(a.url).then(function(b){function e(a){return"string"===typeof a?'"'+a+'"':a.toString()}
console.log(b);var d=a.element;d.innerHTML='<p>This information was auto generated from <a href="'+a.url+'">'+a.url+"</a>.</p>";b.forEach(function(a){var b=document.createElement("div");d.appendChild(b);var c=document.createElement("h2");"preferSingleLine"===a.name&&(a.name+=" (Very Experimental)");c.textContent=a.name;b.appendChild(c);c=document.createElement("p");c.textContent=a.description;b.appendChild(c);var h=document.createElement("ul");b.appendChild(h);if(a.oneOf)a.oneOf.forEach(function(b){var c=
document.createElement("li");h.appendChild(c);var d=document.createElement("strong");d.textContent=e(b.const);c.appendChild(d);null!=b.description&&0<b.description.length&&c.append(" - "+b.description);b.const===a.default&&c.append(" (Default)")});else{c=document.createElement("li");h.appendChild(c);var g=document.createElement("strong");g.textContent="Type: ";c.appendChild(g);c.append(a.type);c=document.createElement("li");h.appendChild(c);g=document.createElement("strong");g.textContent="Default: ";
c.appendChild(g);c.append(e(a.default))}if(null!=a.astSpecificProperties&&0<a.astSpecificProperties.length){c=document.createElement("p");c.textContent="AST node specific configuration property names:";b.appendChild(c);var m=document.createElement("ul");b.appendChild(m);a.astSpecificProperties.forEach(function(a){var b=document.createElement("li");b.textContent=e(a);m.appendChild(b)})}})})})}})(window.Dprint||(window.Dprint={}));
(function(a){function b(){for(var a=document.getElementsByClassName("hljs-string"),b=[],c=0;c<a.length;c++){var g=a.item(c);switch(g.textContent){case '"https://plugins.dprint.dev/typescript-x.x.x.wasm"':case '"https://plugins.dprint.dev/rustfmt-x.x.x.wasm"':case '"https://plugins.dprint.dev/json-x.x.x.wasm"':b.push(g)}}return b}function c(){function a(a,b){a=a.latest.find(function(a){return a.name===b});if(null==a)throw Error("Could not find plugin with name "+b);return a.url}return fetch("https://plugins.dprint.dev/info.json").then(function(a){return a.json()}).then(function(b){if(1!==
b.schemaVersion)throw Error("Expected schema version 1, but found "+b.schemaVersion);return{typescript:a(b,"dprint-plugin-typescript"),json:a(b,"dprint-plugin-json"),rustfmt:a(b,"dprint-plugin-rustfmt")}})}a.replacePluginUrls=function(){var a=b();0<a.length&&c().then(function(b){for(var c=0;c<a.length;c++){var d=a[c];switch(d.textContent){case '"https://plugins.dprint.dev/typescript-x.x.x.wasm"':d.textContent='"'+b.typescript+'"';break;case '"https://plugins.dprint.dev/json-x.x.x.wasm"':d.textContent=
'"'+b.json+'"';break;case '"https://plugins.dprint.dev/rustfmt-x.x.x.wasm"':d.textContent='"'+b.rustfmt+'"'}}})}})(window.Dprint||(window.Dprint={}));