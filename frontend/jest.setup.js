require('@testing-library/jest-dom');
require('text-encoding-polyfill');
require('util');
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
