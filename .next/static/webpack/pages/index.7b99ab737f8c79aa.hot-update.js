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

/***/ "./components/templates/HomeTemplate/index.js":
/*!****************************************************!*\
  !*** ./components/templates/HomeTemplate/index.js ***!
  \****************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"HomeTemplate\": function() { return /* binding */ HomeTemplate; }\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _organisms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../organisms */ \"./components/organisms/index.js\");\n/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles */ \"./components/templates/HomeTemplate/styles.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__);\nvar _jsxFileName = \"C:\\\\Users\\\\artiko\\\\Documents\\\\CASPER\\\\CasperLabs-UniswapV2Interface\\\\components\\\\templates\\\\HomeTemplate\\\\index.js\",\n    _this = undefined;\n\n\n\n\n\nvar HomeTemplate = function HomeTemplate(_ref) {\n  var title = _ref.title,\n      _ref$url = _ref.url,\n      url = _ref$url === void 0 ? 'https://via.placeholder.com/50' : _ref$url,\n      content = _ref.content,\n      _ref$isAnchor = _ref.isAnchor,\n      isAnchor = _ref$isAnchor === void 0 ? false : _ref$isAnchor,\n      _ref$to = _ref.to,\n      to = _ref$to === void 0 ? '/' : _ref$to,\n      _ref$insideMessage = _ref.insideMessage,\n      insideMessage = _ref$insideMessage === void 0 ? \"Analytics\" : _ref$insideMessage;\n  var InfoBoxArrayCopy = [{\n    infoBoxTitle: \"$ 3.81\",\n    infoBoxSmall: \"$CSPR Price\"\n  }, {\n    infoBoxTitle: \"$ 2.04b\",\n    infoBoxSmall: \"Total Liquidity\"\n  }, {\n    infoBoxTitle: \"$ 171.15b\",\n    infoBoxSmall: \"Total Volume\"\n  }, {\n    infoBoxTitle: \"2,601\",\n    infoBoxSmall: \"Total Pairs\"\n  }];\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_styles__WEBPACK_IMPORTED_MODULE_2__.Container, {\n    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_organisms__WEBPACK_IMPORTED_MODULE_1__.NavBar, {\n      title: title,\n      url: url,\n      content: content,\n      isAnchor: isAnchor,\n      to: to,\n      insideMessage: insideMessage\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 13,\n      columnNumber: 7\n    }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_organisms__WEBPACK_IMPORTED_MODULE_1__.Hero, {\n      HeroTitle: \"Discover your DeFi treasure!\",\n      HeroMarkedword: \"DeFi\",\n      InfoBoxArray: InfoBoxArrayCopy\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 14,\n      columnNumber: 7\n    }, _this)]\n  }, void 0, true, {\n    fileName: _jsxFileName,\n    lineNumber: 12,\n    columnNumber: 5\n  }, _this);\n};\n_c = HomeTemplate;\n\nvar _c;\n\n$RefreshReg$(_c, \"HomeTemplate\");\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL3RlbXBsYXRlcy9Ib21lVGVtcGxhdGUvaW5kZXguanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTs7QUFDTyxJQUFNSSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxPQUF5SDtBQUFBLE1BQXRIQyxLQUFzSCxRQUF0SEEsS0FBc0g7QUFBQSxzQkFBL0dDLEdBQStHO0FBQUEsTUFBL0dBLEdBQStHLHlCQUF6RyxnQ0FBeUc7QUFBQSxNQUF2RUMsT0FBdUUsUUFBdkVBLE9BQXVFO0FBQUEsMkJBQTlEQyxRQUE4RDtBQUFBLE1BQTlEQSxRQUE4RCw4QkFBbkQsS0FBbUQ7QUFBQSxxQkFBNUNDLEVBQTRDO0FBQUEsTUFBNUNBLEVBQTRDLHdCQUF2QyxHQUF1QztBQUFBLGdDQUFsQ0MsYUFBa0M7QUFBQSxNQUFsQ0EsYUFBa0MsbUNBQWxCLFdBQWtCO0FBQ25KLE1BQU1DLGdCQUFnQixHQUFHLENBQ3ZCO0FBQUVDLElBQUFBLFlBQVksRUFBRSxRQUFoQjtBQUEwQkMsSUFBQUEsWUFBWSxFQUFFO0FBQXhDLEdBRHVCLEVBRXZCO0FBQUVELElBQUFBLFlBQVksRUFBRSxTQUFoQjtBQUEyQkMsSUFBQUEsWUFBWSxFQUFFO0FBQXpDLEdBRnVCLEVBR3ZCO0FBQUVELElBQUFBLFlBQVksRUFBRSxXQUFoQjtBQUE2QkMsSUFBQUEsWUFBWSxFQUFFO0FBQTNDLEdBSHVCLEVBSXZCO0FBQUVELElBQUFBLFlBQVksRUFBRSxPQUFoQjtBQUF5QkMsSUFBQUEsWUFBWSxFQUFFO0FBQXZDLEdBSnVCLENBQXpCO0FBTUEsc0JBQ0UsOERBQUMsOENBQUQ7QUFBQSw0QkFDRSw4REFBQyw4Q0FBRDtBQUFRLFdBQUssRUFBRVIsS0FBZjtBQUFzQixTQUFHLEVBQUVDLEdBQTNCO0FBQWdDLGFBQU8sRUFBRUMsT0FBekM7QUFBa0QsY0FBUSxFQUFFQyxRQUE1RDtBQUFzRSxRQUFFLEVBQUVDLEVBQTFFO0FBQThFLG1CQUFhLEVBQUVDO0FBQTdGO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFERixlQUVFLDhEQUFDLDRDQUFEO0FBQU0sZUFBUyxFQUFFLDhCQUFqQjtBQUFpRCxvQkFBYyxFQUFDLE1BQWhFO0FBQXVFLGtCQUFZLEVBQUVDO0FBQXJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FERjtBQU1ELENBYk07S0FBTVAiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy90ZW1wbGF0ZXMvSG9tZVRlbXBsYXRlL2luZGV4LmpzPzk5MDIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBOYXZCYXIsIEhlcm8gfSBmcm9tICcuLi8uLi9vcmdhbmlzbXMnXHJcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gJy4vc3R5bGVzJ1xyXG5leHBvcnQgY29uc3QgSG9tZVRlbXBsYXRlID0gKHsgdGl0bGUsIHVybCA9ICdodHRwczovL3ZpYS5wbGFjZWhvbGRlci5jb20vNTAnLCBjb250ZW50LCBpc0FuY2hvciA9IGZhbHNlLCB0byA9ICcvJywgaW5zaWRlTWVzc2FnZSA9IFwiQW5hbHl0aWNzXCIgfSkgPT4ge1xyXG4gIGNvbnN0IEluZm9Cb3hBcnJheUNvcHkgPSBbXHJcbiAgICB7IGluZm9Cb3hUaXRsZTogXCIkIDMuODFcIiwgaW5mb0JveFNtYWxsOiBcIiRDU1BSIFByaWNlXCIgfSxcclxuICAgIHsgaW5mb0JveFRpdGxlOiBcIiQgMi4wNGJcIiwgaW5mb0JveFNtYWxsOiBcIlRvdGFsIExpcXVpZGl0eVwiIH0sXHJcbiAgICB7IGluZm9Cb3hUaXRsZTogXCIkIDE3MS4xNWJcIiwgaW5mb0JveFNtYWxsOiBcIlRvdGFsIFZvbHVtZVwiIH0sXHJcbiAgICB7IGluZm9Cb3hUaXRsZTogXCIyLDYwMVwiLCBpbmZvQm94U21hbGw6IFwiVG90YWwgUGFpcnNcIiB9LFxyXG4gIF1cclxuICByZXR1cm4gKFxyXG4gICAgPENvbnRhaW5lcj5cclxuICAgICAgPE5hdkJhciB0aXRsZT17dGl0bGV9IHVybD17dXJsfSBjb250ZW50PXtjb250ZW50fSBpc0FuY2hvcj17aXNBbmNob3J9IHRvPXt0b30gaW5zaWRlTWVzc2FnZT17aW5zaWRlTWVzc2FnZX0gLz5cclxuICAgICAgPEhlcm8gSGVyb1RpdGxlPXtcIkRpc2NvdmVyIHlvdXIgRGVGaSB0cmVhc3VyZSFcIn0gSGVyb01hcmtlZHdvcmQ9XCJEZUZpXCIgSW5mb0JveEFycmF5PXtJbmZvQm94QXJyYXlDb3B5fSAvPlxyXG4gICAgPC9Db250YWluZXI+XHJcbiAgKVxyXG59XHJcbiJdLCJuYW1lcyI6WyJSZWFjdCIsIk5hdkJhciIsIkhlcm8iLCJDb250YWluZXIiLCJIb21lVGVtcGxhdGUiLCJ0aXRsZSIsInVybCIsImNvbnRlbnQiLCJpc0FuY2hvciIsInRvIiwiaW5zaWRlTWVzc2FnZSIsIkluZm9Cb3hBcnJheUNvcHkiLCJpbmZvQm94VGl0bGUiLCJpbmZvQm94U21hbGwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/templates/HomeTemplate/index.js\n");

/***/ })

});