"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./components/organisms/Hero/index.js":
/*!********************************************!*\
  !*** ./components/organisms/Hero/index.js ***!
  \********************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Hero\": function() { return /* binding */ Hero; }\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _molecules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../molecules */ \"./components/molecules/index.js\");\n/* harmony import */ var _InfoBoxes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../InfoBoxes */ \"./components/organisms/InfoBoxes/index.js\");\n/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ \"./components/organisms/Hero/styles.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__);\nvar _jsxFileName = \"C:\\\\Users\\\\artiko\\\\Documents\\\\CASPER\\\\CasperLabs-UniswapV2Interface\\\\components\\\\organisms\\\\Hero\\\\index.js\",\n    _this = undefined;\n\n\n\n\n\n\nvar Hero = function Hero(_ref) {\n  var HeroTitle = _ref.HeroTitle,\n      HeroMarkedword = _ref.HeroMarkedword,\n      InfoBoxArray = _ref.InfoBoxArray;\n  var url = 'https://via.placeholder.com/350';\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_styles__WEBPACK_IMPORTED_MODULE_3__.HeroStyles, {\n    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_molecules__WEBPACK_IMPORTED_MODULE_1__.MarkedTitle, {\n      title: HeroTitle,\n      markedword: HeroMarkedword\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 10,\n      columnNumber: 13\n    }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_styles__WEBPACK_IMPORTED_MODULE_3__.HeroIMGStyles, {\n      src: url\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 11,\n      columnNumber: 13\n    }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_InfoBoxes__WEBPACK_IMPORTED_MODULE_2__.InfoBoxes, {\n      InfoBoxArray: InfoBoxArray\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 12,\n      columnNumber: 13\n    }, _this)]\n  }, void 0, true, {\n    fileName: _jsxFileName,\n    lineNumber: 9,\n    columnNumber: 9\n  }, _this);\n};\n_c = Hero;\n\nvar _c;\n\n$RefreshReg$(_c, \"Hero\");\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL29yZ2FuaXNtcy9IZXJvL2luZGV4LmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7O0FBQ08sSUFBTUssSUFBSSxHQUFHLFNBQVBBLElBQU8sT0FBaUQ7QUFBQSxNQUE5Q0MsU0FBOEMsUUFBOUNBLFNBQThDO0FBQUEsTUFBbkNDLGNBQW1DLFFBQW5DQSxjQUFtQztBQUFBLE1BQW5CQyxZQUFtQixRQUFuQkEsWUFBbUI7QUFDakUsTUFBTUMsR0FBRyxHQUFHLGlDQUFaO0FBQ0Esc0JBQ0ksOERBQUMsK0NBQUQ7QUFBQSw0QkFDSSw4REFBQyxtREFBRDtBQUFhLFdBQUssRUFBRUgsU0FBcEI7QUFBK0IsZ0JBQVUsRUFBRUM7QUFBM0M7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQURKLGVBRUksOERBQUMsa0RBQUQ7QUFBZSxTQUFHLEVBQUVFO0FBQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFGSixlQUdJLDhEQUFDLGlEQUFEO0FBQVcsa0JBQVksRUFBRUQ7QUFBekI7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUhKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQURKO0FBT0gsQ0FUTTtLQUFNSCIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL29yZ2FuaXNtcy9IZXJvL2luZGV4LmpzPzJhZTciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBNYXJrZWRUaXRsZSB9IGZyb20gJy4uLy4uL21vbGVjdWxlcydcclxuaW1wb3J0IHsgSW5mb0JveGVzIH0gZnJvbSAnLi4vSW5mb0JveGVzJ1xyXG5cclxuaW1wb3J0IHtIZXJvU3R5bGVzLEhlcm9JTUdTdHlsZXN9IGZyb20gJy4vc3R5bGVzJ1xyXG5leHBvcnQgY29uc3QgSGVybyA9ICh7IEhlcm9UaXRsZSwgSGVyb01hcmtlZHdvcmQsIEluZm9Cb3hBcnJheSB9KSA9PiB7XHJcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly92aWEucGxhY2Vob2xkZXIuY29tLzM1MCdcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPEhlcm9TdHlsZXM+XHJcbiAgICAgICAgICAgIDxNYXJrZWRUaXRsZSB0aXRsZT17SGVyb1RpdGxlfSBtYXJrZWR3b3JkPXtIZXJvTWFya2Vkd29yZH0gLz5cclxuICAgICAgICAgICAgPEhlcm9JTUdTdHlsZXMgc3JjPXt1cmx9IC8+XHJcbiAgICAgICAgICAgIDxJbmZvQm94ZXMgSW5mb0JveEFycmF5PXtJbmZvQm94QXJyYXl9IC8+XHJcbiAgICAgICAgPC9IZXJvU3R5bGVzPlxyXG4gICAgKVxyXG59XHJcbiJdLCJuYW1lcyI6WyJSZWFjdCIsIk1hcmtlZFRpdGxlIiwiSW5mb0JveGVzIiwiSGVyb1N0eWxlcyIsIkhlcm9JTUdTdHlsZXMiLCJIZXJvIiwiSGVyb1RpdGxlIiwiSGVyb01hcmtlZHdvcmQiLCJJbmZvQm94QXJyYXkiLCJ1cmwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/organisms/Hero/index.js\n");

/***/ })

});