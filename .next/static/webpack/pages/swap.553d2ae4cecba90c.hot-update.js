"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/swap",{

/***/ "./components/templates/NavegableTemplate/index.js":
/*!*********************************************************!*\
  !*** ./components/templates/NavegableTemplate/index.js ***!
  \*********************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"NavegableTemplate\": function() { return /* binding */ NavegableTemplate; }\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles */ \"./components/templates/NavegableTemplate/styles.js\");\n/* harmony import */ var _organisms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../organisms */ \"./components/organisms/index.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__);\nvar _jsxFileName = \"C:\\\\Users\\\\artiko\\\\Documents\\\\CASPER\\\\CasperLabs-UniswapV2Interface\\\\components\\\\templates\\\\NavegableTemplate\\\\index.js\",\n    _this = undefined;\n\n\n\n\n\nvar NavegableTemplate = function NavegableTemplate(_ref) {\n  var title = _ref.title,\n      url = _ref.url,\n      content = _ref.content,\n      isAnchor = _ref.isAnchor,\n      to = _ref.to,\n      insideMessage = _ref.insideMessage,\n      handler = _ref.handler,\n      listOfLinks = _ref.listOfLinks,\n      children = _ref.children;\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_styles__WEBPACK_IMPORTED_MODULE_1__.Container, {\n    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_organisms__WEBPACK_IMPORTED_MODULE_2__.NavBar, {\n      title: title,\n      url: url,\n      content: content,\n      isAnchor: isAnchor,\n      to: to,\n      insideMessage: insideMessage,\n      handler: handler,\n      listOfLinks: listOfLinks\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 8,\n      columnNumber: 13\n    }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(\"div\", {\n      children: \"main\"\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 9,\n      columnNumber: 13\n    }, _this)]\n  }, void 0, true, {\n    fileName: _jsxFileName,\n    lineNumber: 7,\n    columnNumber: 9\n  }, _this);\n};\n_c = NavegableTemplate;\n\nvar _c;\n\n$RefreshReg$(_c, \"NavegableTemplate\");\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL3RlbXBsYXRlcy9OYXZlZ2FibGVUZW1wbGF0ZS9pbmRleC5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQTtBQUNBOztBQUNPLElBQU1HLGlCQUFpQixHQUFHLFNBQXBCQSxpQkFBb0IsT0FBeUY7QUFBQSxNQUF0RkMsS0FBc0YsUUFBdEZBLEtBQXNGO0FBQUEsTUFBL0VDLEdBQStFLFFBQS9FQSxHQUErRTtBQUFBLE1BQTFFQyxPQUEwRSxRQUExRUEsT0FBMEU7QUFBQSxNQUFqRUMsUUFBaUUsUUFBakVBLFFBQWlFO0FBQUEsTUFBdkRDLEVBQXVELFFBQXZEQSxFQUF1RDtBQUFBLE1BQW5EQyxhQUFtRCxRQUFuREEsYUFBbUQ7QUFBQSxNQUFwQ0MsT0FBb0MsUUFBcENBLE9BQW9DO0FBQUEsTUFBNUJDLFdBQTRCLFFBQTVCQSxXQUE0QjtBQUFBLE1BQWZDLFFBQWUsUUFBZkEsUUFBZTtBQUN0SCxzQkFDSSw4REFBQyw4Q0FBRDtBQUFBLDRCQUNJLDhEQUFDLDhDQUFEO0FBQVEsV0FBSyxFQUFFUixLQUFmO0FBQXNCLFNBQUcsRUFBRUMsR0FBM0I7QUFBZ0MsYUFBTyxFQUFFQyxPQUF6QztBQUFrRCxjQUFRLEVBQUVDLFFBQTVEO0FBQXNFLFFBQUUsRUFBRUMsRUFBMUU7QUFBOEUsbUJBQWEsRUFBRUMsYUFBN0Y7QUFBNEcsYUFBTyxFQUFFQyxPQUFySDtBQUE4SCxpQkFBVyxFQUFFQztBQUEzSTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBREosZUFFSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUZKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQURKO0FBTUgsQ0FQTTtLQUFNUiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL3RlbXBsYXRlcy9OYXZlZ2FibGVUZW1wbGF0ZS9pbmRleC5qcz8zMWVkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gJy4vc3R5bGVzJ1xyXG5pbXBvcnQgeyBOYXZCYXIgfSBmcm9tICcuLi8uLi9vcmdhbmlzbXMnXHJcbmV4cG9ydCBjb25zdCBOYXZlZ2FibGVUZW1wbGF0ZSA9ICh7IHRpdGxlLCB1cmwsIGNvbnRlbnQsIGlzQW5jaG9yLCB0bywgaW5zaWRlTWVzc2FnZSwgaGFuZGxlcixsaXN0T2ZMaW5rcywgY2hpbGRyZW4gfSkgPT4ge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8Q29udGFpbmVyPlxyXG4gICAgICAgICAgICA8TmF2QmFyIHRpdGxlPXt0aXRsZX0gdXJsPXt1cmx9IGNvbnRlbnQ9e2NvbnRlbnR9IGlzQW5jaG9yPXtpc0FuY2hvcn0gdG89e3RvfSBpbnNpZGVNZXNzYWdlPXtpbnNpZGVNZXNzYWdlfSBoYW5kbGVyPXtoYW5kbGVyfSBsaXN0T2ZMaW5rcz17bGlzdE9mTGlua3N9IC8+XHJcbiAgICAgICAgICAgIDxkaXY+bWFpbjwvZGl2PlxyXG4gICAgICAgIDwvQ29udGFpbmVyPlxyXG4gICAgKVxyXG59XHJcbiJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbnRhaW5lciIsIk5hdkJhciIsIk5hdmVnYWJsZVRlbXBsYXRlIiwidGl0bGUiLCJ1cmwiLCJjb250ZW50IiwiaXNBbmNob3IiLCJ0byIsImluc2lkZU1lc3NhZ2UiLCJoYW5kbGVyIiwibGlzdE9mTGlua3MiLCJjaGlsZHJlbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/templates/NavegableTemplate/index.js\n");

/***/ })

});