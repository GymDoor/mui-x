import * as React from 'react';
import { useLicenseVerifier } from '../useLicenseVerifier';
import { LicenseStatus } from '../utils/licenseStatus';
import { jsx as _jsx } from "react/jsx-runtime";

function getLicenseErrorMessage(licenseStatus) {
  switch (licenseStatus) {
    case LicenseStatus.Expired:
      return 'MUI X: License key expired';

    case LicenseStatus.Invalid:
      return 'MUI X: Invalid license key';

    case LicenseStatus.NotFound:
      return 'MUI X: Missing license key';

    default:
      throw new Error('MUI: Unhandled MUI X license status.');
  }
}

export function Watermark(props) {
  var packageName = props.packageName,
      releaseInfo = props.releaseInfo;
  var licenseStatus = useLicenseVerifier(packageName, releaseInfo);

  if (licenseStatus === LicenseStatus.Valid) {
    return null;
  }

  return /*#__PURE__*/_jsx("div", {
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