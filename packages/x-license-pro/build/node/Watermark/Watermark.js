"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Watermark = Watermark;

var React = _interopRequireWildcard(require("react"));

var _useLicenseVerifier = require("../useLicenseVerifier");

var _licenseStatus = require("../utils/licenseStatus");

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getLicenseErrorMessage(licenseStatus) {
  switch (licenseStatus) {
    case _licenseStatus.LicenseStatus.Expired:
      return 'MUI X: License key expired';

    case _licenseStatus.LicenseStatus.Invalid:
      return 'MUI X: Invalid license key';

    case _licenseStatus.LicenseStatus.NotFound:
      return 'MUI X: Missing license key';

    default:
      throw new Error('MUI: Unhandled MUI X license status.');
  }
}

function Watermark(props) {
  const {
    packageName,
    releaseInfo
  } = props;
  const licenseStatus = (0, _useLicenseVerifier.useLicenseVerifier)(packageName, releaseInfo);

  if (licenseStatus === _licenseStatus.LicenseStatus.Valid) {
    return null;
  }

  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    style: {
      position: 'absolute',
      pointerEvents: 'none',
      color: '#8282829e',
      zIndex: 100000,
      width: '100%',
      textAlign: 'center',
      bottom: '50%',
      right: 0,
      letterSpacing: 5,
      fontSize: 24
    },
    children: getLicenseErrorMessage(licenseStatus)
  });
}