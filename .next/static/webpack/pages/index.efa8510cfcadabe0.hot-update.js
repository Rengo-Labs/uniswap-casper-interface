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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Hero\": function() { return /* binding */ Hero; }\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _molecules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../molecules */ \"./components/molecules/index.js\");\n/* harmony import */ var _InfoBoxes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../InfoBoxes */ \"./components/organisms/InfoBoxes/index.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__);\nvar _jsxFileName = \"C:\\\\Users\\\\artiko\\\\Documents\\\\CASPER\\\\CasperLabs-UniswapV2Interface\\\\components\\\\organisms\\\\Hero\\\\index.js\",\n    _this = undefined;\n\n\n\n\n\nvar Hero = function Hero(_ref) {\n  var HeroTitle = _ref.HeroTitle,\n      HeroMarkedword = _ref.HeroMarkedword,\n      InfoBoxArray = _ref.InfoBoxArray;\n  var url = 'https://via.placeholder.com/50';\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(\"div\", {\n    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_molecules__WEBPACK_IMPORTED_MODULE_1__.MarkedTitle, {\n      title: HeroTitle,\n      markedword: HeroMarkedword\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 8,\n      columnNumber: 13\n    }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(\"img\", {\n      src: url\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 9,\n      columnNumber: 13\n    }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_InfoBoxes__WEBPACK_IMPORTED_MODULE_2__.InfoBoxes, {\n      InfoBoxArray: InfoBoxArray\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 10,\n      columnNumber: 13\n    }, _this)]\n  }, void 0, true, {\n    fileName: _jsxFileName,\n    lineNumber: 7,\n    columnNumber: 9\n  }, _this);\n};\n_c = Hero;\n\nvar _c;\n\n$RefreshReg$(_c, \"Hero\");\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL29yZ2FuaXNtcy9IZXJvL2luZGV4LmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBQ08sSUFBTUcsSUFBSSxHQUFHLFNBQVBBLElBQU8sT0FBNkM7QUFBQSxNQUEzQ0MsU0FBMkMsUUFBM0NBLFNBQTJDO0FBQUEsTUFBakNDLGNBQWlDLFFBQWpDQSxjQUFpQztBQUFBLE1BQWxCQyxZQUFrQixRQUFsQkEsWUFBa0I7QUFDN0QsTUFBTUMsR0FBRyxHQUFHLGdDQUFaO0FBQ0Esc0JBQ0k7QUFBQSw0QkFDSSw4REFBQyxtREFBRDtBQUFhLFdBQUssRUFBRUgsU0FBcEI7QUFBK0IsZ0JBQVUsRUFBRUM7QUFBM0M7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQURKLGVBRUk7QUFBSyxTQUFHLEVBQUVFO0FBQVY7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUZKLGVBR0ksOERBQUMsaURBQUQ7QUFBVyxrQkFBWSxFQUFFRDtBQUF6QjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBSEo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBREo7QUFPSCxDQVRNO0tBQU1IIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2NvbXBvbmVudHMvb3JnYW5pc21zL0hlcm8vaW5kZXguanM/MmFlNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IE1hcmtlZFRpdGxlIH0gZnJvbSAnLi4vLi4vbW9sZWN1bGVzJ1xyXG5pbXBvcnQgeyBJbmZvQm94ZXMgfSBmcm9tICcuLi9JbmZvQm94ZXMnXHJcbmV4cG9ydCBjb25zdCBIZXJvID0gKHtIZXJvVGl0bGUsSGVyb01hcmtlZHdvcmQsSW5mb0JveEFycmF5fSkgPT4ge1xyXG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vdmlhLnBsYWNlaG9sZGVyLmNvbS81MCdcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE1hcmtlZFRpdGxlIHRpdGxlPXtIZXJvVGl0bGV9IG1hcmtlZHdvcmQ9e0hlcm9NYXJrZWR3b3JkfSAvPlxyXG4gICAgICAgICAgICA8aW1nIHNyYz17dXJsfSAvPlxyXG4gICAgICAgICAgICA8SW5mb0JveGVzIEluZm9Cb3hBcnJheT17SW5mb0JveEFycmF5fS8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApXHJcbn1cclxuIl0sIm5hbWVzIjpbIlJlYWN0IiwiTWFya2VkVGl0bGUiLCJJbmZvQm94ZXMiLCJIZXJvIiwiSGVyb1RpdGxlIiwiSGVyb01hcmtlZHdvcmQiLCJJbmZvQm94QXJyYXkiLCJ1cmwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/organisms/Hero/index.js\n");

/***/ })

});