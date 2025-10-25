/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wagmi/chains */ \"wagmi/chains\");\n/* harmony import */ var wagmi_providers_public__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! wagmi/providers/public */ \"wagmi/providers/public\");\n/* harmony import */ var _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @rainbow-me/rainbowkit */ \"@rainbow-me/rainbowkit\");\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @rainbow-me/rainbowkit/styles.css */ \"./node_modules/@rainbow-me/rainbowkit/dist/index.css\");\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_7__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__, wagmi__WEBPACK_IMPORTED_MODULE_3__, wagmi_chains__WEBPACK_IMPORTED_MODULE_4__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_5__, _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__]);\n([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__, wagmi__WEBPACK_IMPORTED_MODULE_3__, wagmi_chains__WEBPACK_IMPORTED_MODULE_4__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_5__, _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\nconst { chains, publicClient } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.configureChains)([\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_4__.mainnet,\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_4__.polygon,\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_4__.optimism,\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_4__.arbitrum\n], [\n    (0,wagmi_providers_public__WEBPACK_IMPORTED_MODULE_5__.publicProvider)()\n]);\nconst { connectors } = (0,_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__.getDefaultWallets)({\n    appName: \"Fundora\",\n    projectId: \"ebb1631ee5816afdbf496918c3802f7e\",\n    chains\n});\nconst wagmiConfig = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.createConfig)({\n    autoConnect: true,\n    connectors,\n    publicClient\n});\nconst queryClient = new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClient();\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_3__.WagmiConfig, {\n        config: wagmiConfig,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClientProvider, {\n            client: queryClient,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_6__.RainbowKitProvider, {\n                chains: chains,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\User\\\\Documents\\\\GitHub\\\\Fundora\\\\fundora-frontend\\\\pages\\\\_app.js\",\n                    lineNumber: 33,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\User\\\\Documents\\\\GitHub\\\\Fundora\\\\fundora-frontend\\\\pages\\\\_app.js\",\n                lineNumber: 32,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\User\\\\Documents\\\\GitHub\\\\Fundora\\\\fundora-frontend\\\\pages\\\\_app.js\",\n            lineNumber: 31,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\User\\\\Documents\\\\GitHub\\\\Fundora\\\\fundora-frontend\\\\pages\\\\_app.js\",\n        lineNumber: 30,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBOEI7QUFDMEM7QUFDTjtBQUNDO0FBQ1o7QUFDdUI7QUFDcEM7QUFFMUMsTUFBTSxFQUFFWSxNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHVCxzREFBZUEsQ0FDOUM7SUFBQ0MsaURBQU9BO0lBQUVDLGlEQUFPQTtJQUFFQyxrREFBUUE7SUFBRUMsa0RBQVFBO0NBQUMsRUFDdEM7SUFBQ0Msc0VBQWNBO0NBQUc7QUFHcEIsTUFBTSxFQUFFSyxVQUFVLEVBQUUsR0FBR0gseUVBQWlCQSxDQUFDO0lBQ3ZDSSxTQUFTO0lBQ1RDLFdBQVc7SUFDWEo7QUFDRjtBQUVBLE1BQU1LLGNBQWNkLG1EQUFZQSxDQUFDO0lBQy9CZSxhQUFhO0lBQ2JKO0lBQ0FEO0FBQ0Y7QUFFQSxNQUFNTSxjQUFjLElBQUluQiw4REFBV0E7QUFFcEIsU0FBU29CLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDbEQscUJBQ0UsOERBQUNwQiw4Q0FBV0E7UUFBQ3FCLFFBQVFOO2tCQUNuQiw0RUFBQ2hCLHNFQUFtQkE7WUFBQ3VCLFFBQVFMO3NCQUMzQiw0RUFBQ1Qsc0VBQWtCQTtnQkFBQ0UsUUFBUUE7MEJBQzFCLDRFQUFDUztvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLbEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mdW5kb3JhLWZyb250ZW5kLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xyXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcclxuaW1wb3J0IHsgV2FnbWlDb25maWcsIGNyZWF0ZUNvbmZpZywgY29uZmlndXJlQ2hhaW5zIH0gZnJvbSAnd2FnbWknXHJcbmltcG9ydCB7IG1haW5uZXQsIHBvbHlnb24sIG9wdGltaXNtLCBhcmJpdHJ1bSB9IGZyb20gJ3dhZ21pL2NoYWlucydcclxuaW1wb3J0IHsgcHVibGljUHJvdmlkZXIgfSBmcm9tICd3YWdtaS9wcm92aWRlcnMvcHVibGljJ1xyXG5pbXBvcnQgeyBSYWluYm93S2l0UHJvdmlkZXIsIGdldERlZmF1bHRXYWxsZXRzIH0gZnJvbSAnQHJhaW5ib3ctbWUvcmFpbmJvd2tpdCdcclxuaW1wb3J0ICdAcmFpbmJvdy1tZS9yYWluYm93a2l0L3N0eWxlcy5jc3MnXHJcblxyXG5jb25zdCB7IGNoYWlucywgcHVibGljQ2xpZW50IH0gPSBjb25maWd1cmVDaGFpbnMoXHJcbiAgW21haW5uZXQsIHBvbHlnb24sIG9wdGltaXNtLCBhcmJpdHJ1bV0sXHJcbiAgW3B1YmxpY1Byb3ZpZGVyKCldXHJcbilcclxuXHJcbmNvbnN0IHsgY29ubmVjdG9ycyB9ID0gZ2V0RGVmYXVsdFdhbGxldHMoe1xyXG4gIGFwcE5hbWU6ICdGdW5kb3JhJyxcclxuICBwcm9qZWN0SWQ6ICdlYmIxNjMxZWU1ODE2YWZkYmY0OTY5MThjMzgwMmY3ZScsXHJcbiAgY2hhaW5zLFxyXG59KVxyXG5cclxuY29uc3Qgd2FnbWlDb25maWcgPSBjcmVhdGVDb25maWcoe1xyXG4gIGF1dG9Db25uZWN0OiB0cnVlLFxyXG4gIGNvbm5lY3RvcnMsXHJcbiAgcHVibGljQ2xpZW50LFxyXG59KVxyXG5cclxuY29uc3QgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8V2FnbWlDb25maWcgY29uZmlnPXt3YWdtaUNvbmZpZ30+XHJcbiAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxyXG4gICAgICAgIDxSYWluYm93S2l0UHJvdmlkZXIgY2hhaW5zPXtjaGFpbnN9PlxyXG4gICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgICAgIDwvUmFpbmJvd0tpdFByb3ZpZGVyPlxyXG4gICAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+XHJcbiAgICA8L1dhZ21pQ29uZmlnPlxyXG4gIClcclxufVxyXG4iXSwibmFtZXMiOlsiUXVlcnlDbGllbnQiLCJRdWVyeUNsaWVudFByb3ZpZGVyIiwiV2FnbWlDb25maWciLCJjcmVhdGVDb25maWciLCJjb25maWd1cmVDaGFpbnMiLCJtYWlubmV0IiwicG9seWdvbiIsIm9wdGltaXNtIiwiYXJiaXRydW0iLCJwdWJsaWNQcm92aWRlciIsIlJhaW5ib3dLaXRQcm92aWRlciIsImdldERlZmF1bHRXYWxsZXRzIiwiY2hhaW5zIiwicHVibGljQ2xpZW50IiwiY29ubmVjdG9ycyIsImFwcE5hbWUiLCJwcm9qZWN0SWQiLCJ3YWdtaUNvbmZpZyIsImF1dG9Db25uZWN0IiwicXVlcnlDbGllbnQiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJjb25maWciLCJjbGllbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@rainbow-me/rainbowkit":
/*!*****************************************!*\
  !*** external "@rainbow-me/rainbowkit" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@rainbow-me/rainbowkit");;

/***/ }),

/***/ "@tanstack/react-query":
/*!****************************************!*\
  !*** external "@tanstack/react-query" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@tanstack/react-query");;

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi");;

/***/ }),

/***/ "wagmi/chains":
/*!*******************************!*\
  !*** external "wagmi/chains" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/chains");;

/***/ }),

/***/ "wagmi/providers/public":
/*!*****************************************!*\
  !*** external "wagmi/providers/public" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/providers/public");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@rainbow-me"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();