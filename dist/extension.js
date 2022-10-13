/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const vscode = __webpack_require__(1);
const resourceRe = /^(?<match>(?<prefix>\s*(?<dataOrResource>resource|data)\s+")(?<resourceType>[^"]+))"/;
const resourceLineMatcher = (line) => {
    const matchResult = resourceRe.exec(line.text);
    if (!matchResult) {
        return;
    }
    ;
    const { prefix, dataOrResource, resourceType, match } = matchResult.groups || {};
    const prefixLength = prefix.length;
    const matchLength = match.length;
    return {
        range: new vscode.Range(new vscode.Position(line.lineNumber, prefixLength), new vscode.Position(line.lineNumber, matchLength)),
        dataOrResource: dataOrResource,
        resourceType
    };
};
const resourceTypeToProviderAndName = (resourceType) => {
    const re = /^(?<provider>[^_]+)_(?<name>.*)$/;
    const m = re.exec(resourceType);
    if (!m) {
        return;
    }
    const { provider = "", name = "" } = m.groups || {};
    return { provider, name };
};
const getLineMatchResultUri = ({ dataOrResource, resourceType }) => {
    const { provider, name } = resourceTypeToProviderAndName(resourceType) || {};
    if (!provider || !name) {
        return;
    }
    return vscode.Uri.parse(`https://www.terraform.io/docs/providers/${provider}/${dataOrResource.charAt(0)}/${name}`);
};
function isNotUndefined(v) {
    return v !== undefined;
}
const linkProvider = {
    provideDocumentLinks(document, token) {
        const res = [];
        for (let ln = 0; ln < document.lineCount; ln++) {
            const lineMatchResult = resourceLineMatcher(document.lineAt(ln));
            console.log("LINE", document.lineAt(ln));
            if (lineMatchResult) {
                console.log("LMR", lineMatchResult);
                res.push(lineMatchResult);
            }
        }
        return res.map(lmr => {
            const uri = getLineMatchResultUri(lmr);
            if (!uri) {
                return;
            }
            const ln = new vscode.DocumentLink(lmr.range, uri);
            ln.tooltip = uri.toString();
            return ln;
        }).filter(isNotUndefined);
    }
};
function activate(context) {
    const disposeLinkProvider = vscode.languages.registerDocumentLinkProvider('terraform', linkProvider);
    context.subscriptions.push(disposeLinkProvider);
}
exports.activate = activate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map