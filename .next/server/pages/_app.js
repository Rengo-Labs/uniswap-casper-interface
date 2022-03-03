"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 174:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _app)
});

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(689);
// EXTERNAL MODULE: external "styled-components"
var external_styled_components_ = __webpack_require__(518);
;// CONCATENATED MODULE: ./contexts/ThemeContext/themes.js

const lightTheme = {
  PrimaryColor: 'rgba(255,255,255,1)',
  MainColor: 'rgba(0,62,145,1)',
  StrongColor: 'rgba(3,46,121,1)',
  StrongColor2: 'rgba(3,70,166,1)',
  StrongColor3: 'rgba(3,52,138,1)',
  SecondaryColor: 'rgba(0,187,233,1)',
  TertiaryColor: 'rgba(255,204,0,1)',
  backgroundColor: 'linear-gradient(to bottom, rgba(0,187,233,.8), rgba(0,62,145,1))'
};
const darkTheme = {
  PrimaryColor: 'rgba(255,255,255,1)'
};
const GlobalStyles = (0,external_styled_components_.createGlobalStyle)(["#__next{height:100%;width:100%;}body{height:100vh;width:100vw;margin:0;box-sizing:border-box;color:", ";}"], props => props.theme.PrimaryColor);
// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
;// CONCATENATED MODULE: ./contexts/ThemeContext/index.js





const ThemeProviderContext = /*#__PURE__*/(0,external_react_.createContext)(null);
const ThemeContext = props => {
  const {
    0: theme,
    1: setTheme
  } = (0,external_react_.useState)('light');

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  return /*#__PURE__*/jsx_runtime_.jsx(ThemeProviderContext.Provider, {
    value: {
      themeToggler: themeToggler
    },
    children: /*#__PURE__*/(0,jsx_runtime_.jsxs)(external_styled_components_.ThemeProvider, {
      theme: theme === 'light' ? lightTheme : darkTheme,
      children: [/*#__PURE__*/jsx_runtime_.jsx(GlobalStyles, {}), props.children]
    })
  });
};
;// CONCATENATED MODULE: ./pages/_app.tsx
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




const MyApp = ({
  Component,
  pageProps,
  auth
}) => {
  return /*#__PURE__*/jsx_runtime_.jsx(ThemeContext, {
    children: /*#__PURE__*/jsx_runtime_.jsx(Component, _objectSpread({}, pageProps))
  });
};

/* harmony default export */ const _app = (MyApp);

/***/ }),

/***/ 689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 518:
/***/ ((module) => {

module.exports = require("styled-components");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(174));
module.exports = __webpack_exports__;

})();