const fs = require('fs');
const pathUtils = require('path');
const snapConfig = require('./snap.config.json');

const bundlePath = pathUtils.join(snapConfig.dist, snapConfig.outfileName);

let bundleString = fs.readFileSync(bundlePath, 'utf8');

// Alias `window` as `self`
bundleString = 'var self = window;\n'.concat(bundleString);

// Remove 'use asm' tokens; they cause pointless console warnings

bundleString = bundleString.replaceAll(
  "a=c6",
  "a=globalThis",
);

bundleString = bundleString.replaceAll(
  ";undefined=cxl;undefined=[]",
  "",
);

bundleString = bundleString.replaceAll(
    "c6.",
    "globalThis.",
  );

bundleString = bundleString.replaceAll(
    "b=c6",
    "b=globalThis",
  );
bundleString = bundleString.replaceAll(
    "bGk=c6",
    "bGk=globalThis",
  );

fs.writeFileSync(bundlePath, bundleString);