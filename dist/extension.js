/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/simple-totp/dist/converters/alphabet.js":
/*!**************************************************************!*\
  !*** ./node_modules/simple-totp/dist/converters/alphabet.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BASE32_PADDING = exports.BASE32_ALPHABET = void 0;
exports.BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
exports.BASE32_PADDING = "=";
//# sourceMappingURL=alphabet.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/converters/ascii_to_u8a.js":
/*!******************************************************************!*\
  !*** ./node_modules/simple-totp/dist/converters/ascii_to_u8a.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ascii_to_u8a = void 0;
const ascii_to_u8a = (str) => {
    const result = new Uint8Array(str.length).map((_, i) => str.codePointAt(i) ?? 0);
    return result;
};
exports.ascii_to_u8a = ascii_to_u8a;
//# sourceMappingURL=ascii_to_u8a.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/converters/base32_to_u8a.js":
/*!*******************************************************************!*\
  !*** ./node_modules/simple-totp/dist/converters/base32_to_u8a.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.base32_to_u8a = void 0;
const alphabet_1 = __webpack_require__(/*! ./alphabet */ "./node_modules/simple-totp/dist/converters/alphabet.js");
const shiftNumber = (n, shift) => {
    if (shift == 0)
        return n;
    if (shift < 0)
        return n >> Math.abs(shift);
    if (shift > 0)
        return n << shift;
    throw new Error("what");
};
const writeBits = (buf, beginAtBit, nBits, value) => {
    // consider third codepoint:
    // AAAAAAAA BBBBBBBB.CCCCCCCC  bytes
    // 00000111 11222223.33334444  codepoints
    // ******** **OOOOO*.********  third character will have these bits to it
    // -------- ->      .          bitOffset = 2x5= 10
    //          ->      .          offsetInByte = 10%8= 2
    //                 <.          shift = 3-offsetInByte
    // consider 4th codepoint
    // AAAAAAAA BBBBBBBB.CCCCCCCC  bytes
    // 00000111 11222223.33334444  codepoints
    // ******** *******O.OOOO****  fourth character will have these bits to it
    // -------- ------> .          bitOffset = 3x5= 15
    //          ------> .          offsetInByte = 15%8= 7
    //                  .    <---  shift = 3-offsetInByte = -4 (-4 + 8 = 4 in next byte)
    if (buf.length * 8 - (beginAtBit + nBits) < 0) {
        throw new Error(`Attempt to write past array end: Array length: ${buf.length * 8} bits, writing ${nBits} at ${beginAtBit}`);
    }
    value &= 2 ** nBits - 1;
    const startingByte = Math.floor(beginAtBit / 8);
    const offsetInStartingByte = beginAtBit % 8;
    const shift = 8 - nBits - offsetInStartingByte;
    buf[startingByte] = (buf[startingByte] | shiftNumber(value, shift)) & 0xff;
    if (shift < 0) {
        // next byte
        const offsetInNextByte = offsetInStartingByte - 8;
        const shift = 8 - nBits - offsetInNextByte;
        buf[startingByte + 1] =
            (buf[startingByte + 1] | shiftNumber(value, shift)) & 0xff;
    }
};
const base32_to_u8a = (b32string) => {
    if (b32string.length % 8)
        throw new Error("input should have length of multiple of 8");
    if (b32string.includes(alphabet_1.BASE32_PADDING)) {
        b32string = b32string.slice(0, b32string.indexOf(alphabet_1.BASE32_PADDING));
    }
    const codepoints = Array.from(b32string).map((x) => alphabet_1.BASE32_ALPHABET.indexOf(x));
    if (codepoints.some((x) => x === -1))
        throw new Error("Illegal characters found in input");
    const buf = new Uint8Array((b32string.length * 5) / 8);
    let bitOffset = 0;
    for (const codepoint of codepoints) {
        const realBits = Math.min(5, buf.length * 8 - bitOffset);
        let realValue = codepoint;
        if (realBits < 5) {
            realValue >>= 5 - realBits;
        }
        writeBits(buf, bitOffset, realBits, realValue);
        bitOffset += 5;
    }
    return buf;
};
exports.base32_to_u8a = base32_to_u8a;
//# sourceMappingURL=base32_to_u8a.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/converters/convert.js":
/*!*************************************************************!*\
  !*** ./node_modules/simple-totp/dist/converters/convert.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convert = exports.from_u8a = exports.to_u8a = void 0;
const ascii_to_u8a_1 = __webpack_require__(/*! ./ascii_to_u8a */ "./node_modules/simple-totp/dist/converters/ascii_to_u8a.js");
const base32_to_u8a_1 = __webpack_require__(/*! ./base32_to_u8a */ "./node_modules/simple-totp/dist/converters/base32_to_u8a.js");
const hex_to_u8a_1 = __webpack_require__(/*! ./hex_to_u8a */ "./node_modules/simple-totp/dist/converters/hex_to_u8a.js");
const u8a_to_ascii_1 = __webpack_require__(/*! ./u8a_to_ascii */ "./node_modules/simple-totp/dist/converters/u8a_to_ascii.js");
const u8a_to_base32_1 = __webpack_require__(/*! ./u8a_to_base32 */ "./node_modules/simple-totp/dist/converters/u8a_to_base32.js");
const u8a_to_hex_1 = __webpack_require__(/*! ./u8a_to_hex */ "./node_modules/simple-totp/dist/converters/u8a_to_hex.js");
const to_u8a = (encoding, value) => {
    switch (encoding) {
        case "ascii":
            return (0, ascii_to_u8a_1.ascii_to_u8a)(value);
        case "hex":
            return (0, hex_to_u8a_1.hex_to_u8a)(value);
        case "base32":
            return (0, base32_to_u8a_1.base32_to_u8a)(value);
    }
};
exports.to_u8a = to_u8a;
const from_u8a = (data, encoding) => {
    switch (encoding) {
        case "ascii":
            return (0, u8a_to_ascii_1.u8a_to_ascii)(data);
        case "hex":
            return (0, u8a_to_hex_1.u8a_to_hex)(data);
        case "base32":
            return (0, u8a_to_base32_1.u8a_to_base32)(data);
    }
};
exports.from_u8a = from_u8a;
const convert = (from, to, value) => {
    let u8a;
    switch (from) {
        case "raw":
            u8a = value;
            break;
        default:
            u8a = (0, exports.to_u8a)(from, value);
    }
    switch (to) {
        case "raw":
            return u8a;
        default:
            return (0, exports.from_u8a)(u8a, to);
    }
};
exports.convert = convert;
//# sourceMappingURL=convert.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/converters/hex_to_u8a.js":
/*!****************************************************************!*\
  !*** ./node_modules/simple-totp/dist/converters/hex_to_u8a.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hex_to_u8a = void 0;
const hex_to_u8a = (str) => {
    if (str.length % 2)
        throw new Error("odd string length");
    const result = new Uint8Array(str.length / 2);
    for (let index = 0; index < result.length; index++) {
        const hex = str.slice(index * 2, index * 2 + 2);
        result[index] = parseInt(hex, 16);
    }
    return result;
};
exports.hex_to_u8a = hex_to_u8a;
//# sourceMappingURL=hex_to_u8a.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/converters/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/simple-totp/dist/converters/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.to_u8a = exports.from_u8a = exports.convert = exports.base32_to_u8a = exports.u8a_to_base32 = exports.u8a_to_hex = exports.u8a_to_ascii = exports.hex_to_u8a = exports.ascii_to_u8a = void 0;
var ascii_to_u8a_1 = __webpack_require__(/*! ./ascii_to_u8a */ "./node_modules/simple-totp/dist/converters/ascii_to_u8a.js");
Object.defineProperty(exports, "ascii_to_u8a", ({ enumerable: true, get: function () { return ascii_to_u8a_1.ascii_to_u8a; } }));
var hex_to_u8a_1 = __webpack_require__(/*! ./hex_to_u8a */ "./node_modules/simple-totp/dist/converters/hex_to_u8a.js");
Object.defineProperty(exports, "hex_to_u8a", ({ enumerable: true, get: function () { return hex_to_u8a_1.hex_to_u8a; } }));
var u8a_to_ascii_1 = __webpack_require__(/*! ./u8a_to_ascii */ "./node_modules/simple-totp/dist/converters/u8a_to_ascii.js");
Object.defineProperty(exports, "u8a_to_ascii", ({ enumerable: true, get: function () { return u8a_to_ascii_1.u8a_to_ascii; } }));
var u8a_to_hex_1 = __webpack_require__(/*! ./u8a_to_hex */ "./node_modules/simple-totp/dist/converters/u8a_to_hex.js");
Object.defineProperty(exports, "u8a_to_hex", ({ enumerable: true, get: function () { return u8a_to_hex_1.u8a_to_hex; } }));
var u8a_to_base32_1 = __webpack_require__(/*! ./u8a_to_base32 */ "./node_modules/simple-totp/dist/converters/u8a_to_base32.js");
Object.defineProperty(exports, "u8a_to_base32", ({ enumerable: true, get: function () { return u8a_to_base32_1.u8a_to_base32; } }));
var base32_to_u8a_1 = __webpack_require__(/*! ./base32_to_u8a */ "./node_modules/simple-totp/dist/converters/base32_to_u8a.js");
Object.defineProperty(exports, "base32_to_u8a", ({ enumerable: true, get: function () { return base32_to_u8a_1.base32_to_u8a; } }));
var convert_1 = __webpack_require__(/*! ./convert */ "./node_modules/simple-totp/dist/converters/convert.js");
Object.defineProperty(exports, "convert", ({ enumerable: true, get: function () { return convert_1.convert; } }));
Object.defineProperty(exports, "from_u8a", ({ enumerable: true, get: function () { return convert_1.from_u8a; } }));
Object.defineProperty(exports, "to_u8a", ({ enumerable: true, get: function () { return convert_1.to_u8a; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/converters/u8a_to_ascii.js":
/*!******************************************************************!*\
  !*** ./node_modules/simple-totp/dist/converters/u8a_to_ascii.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.u8a_to_ascii = void 0;
const u8a_to_ascii = (u8a) => {
    let string = "";
    for (const byte of u8a) {
        string += String.fromCharCode(byte);
    }
    return string;
};
exports.u8a_to_ascii = u8a_to_ascii;
//# sourceMappingURL=u8a_to_ascii.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/converters/u8a_to_base32.js":
/*!*******************************************************************!*\
  !*** ./node_modules/simple-totp/dist/converters/u8a_to_base32.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.u8a_to_base32 = void 0;
const alphabet_1 = __webpack_require__(/*! ./alphabet */ "./node_modules/simple-totp/dist/converters/alphabet.js");
const u8a_to_base32 = (buf) => {
    let _buf = buf.slice();
    let current = 0;
    let currentBitLength = 0;
    let base32 = "";
    const CONSUME = 8;
    const FLUSH = 5;
    const consumeFromSource = () => {
        current = (current << CONSUME) | _buf[0];
        currentBitLength += CONSUME;
        _buf = _buf.slice(1);
    };
    const flush = () => {
        const leading5bits = current >> (currentBitLength - FLUSH);
        current -= leading5bits << (currentBitLength - FLUSH);
        currentBitLength -= FLUSH;
        base32 += alphabet_1.BASE32_ALPHABET[leading5bits];
    };
    const align = () => {
        current = current << (FLUSH - currentBitLength);
        currentBitLength = FLUSH;
    };
    const pad = () => {
        const length = Math.ceil(base32.length / 8) * 8;
        base32 = base32.padEnd(length, alphabet_1.BASE32_PADDING);
    };
    while (_buf.length) {
        while (currentBitLength < 5)
            consumeFromSource();
        while (currentBitLength >= 5)
            flush();
    }
    if (currentBitLength > 0) {
        align();
        flush();
        pad();
    }
    return base32;
};
exports.u8a_to_base32 = u8a_to_base32;
//# sourceMappingURL=u8a_to_base32.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/converters/u8a_to_hex.js":
/*!****************************************************************!*\
  !*** ./node_modules/simple-totp/dist/converters/u8a_to_hex.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.u8a_to_hex = void 0;
const u8a_to_hex = (u8a) => {
    let string = "";
    for (const byte of u8a) {
        string += byte.toString(16).padStart(2, "0");
    }
    return string;
};
exports.u8a_to_hex = u8a_to_hex;
//# sourceMappingURL=u8a_to_hex.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/getTOTP.js":
/*!**************************************************!*\
  !*** ./node_modules/simple-totp/dist/getTOTP.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTOTP = void 0;
const _1 = __webpack_require__(/*! . */ "./node_modules/simple-totp/dist/index.js");
/**
 * Full implementation of HMAC-based one-time password algorighm
 * @param secretKey secret key in form of a Uint8Array or a string
 * @param timestamp
 * @param encoding encoding of a secret key in case it's a string
 * @param nDigits length of an OTP
 * @param T0 Epoch of a counter
 * @param Tx Period of a counter
 * @returns
 */
const getTOTP = (secretKey, encoding = undefined, timestamp = Date.now(), nDigits = 6, T0 = 0, Tx = 30000) => {
    const { counterValue, remainingMs } = (0, _1.getCounterValue)(timestamp, T0, Tx);
    const totp = (0, _1.getCode)((0, _1.getHMAC)((0, _1.getKey)(secretKey, encoding), counterValue), nDigits);
    return { totp, remainingMs };
};
exports.getTOTP = getTOTP;
//# sourceMappingURL=getTOTP.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/hotp/getCode.js":
/*!*******************************************************!*\
  !*** ./node_modules/simple-totp/dist/hotp/getCode.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCode = void 0;
/**
 * Provide human-readable representation of HMAC
 * @param hmac hash to format
 * @param nDigits length of code
 * @returns human-readable code
 */
const getCode = (hmac, nDigits) => {
    // Truncation first takes the 4 least significant bits of the MAC
    const offset = hmac[hmac.length - 1] & 0xf;
    // and uses them as a byte offset `offset`. That index i is used to select
    // 31 bits from MAC
    const fourBytes = ((hmac[offset] << 24) +
        (hmac[offset + 1] << 16) +
        (hmac[offset + 2] << 8) +
        hmac[offset + 3]) &
        0x7fffffff;
    // The HOTP value is the human-readable design output, a `nDigits`-digit
    // decimal number (without omission of leading 0s):
    return (fourBytes % 10 ** nDigits).toString(10).padStart(nDigits, "0");
};
exports.getCode = getCode;
//# sourceMappingURL=getCode.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/hotp/getCounter.js":
/*!**********************************************************!*\
  !*** ./node_modules/simple-totp/dist/hotp/getCounter.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCounter = void 0;
/**
 * Calculate a counter value
 */
const getCounter = (timestamp, T0, Tx) => {
    const adjustedTimestamp = timestamp - T0;
    const remainingMs = Tx - (adjustedTimestamp % Tx);
    const counter = Math.floor(adjustedTimestamp / Tx);
    return { counter, remainingMs };
};
exports.getCounter = getCounter;
//# sourceMappingURL=getCounter.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/hotp/getCounterValue.js":
/*!***************************************************************!*\
  !*** ./node_modules/simple-totp/dist/hotp/getCounterValue.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCounterValue = void 0;
/**
 * Calculate a counter value
 * @param timestamp current UNIX timestamp in milliseconds
 * @param T0 Epoch, i.e. which timestamp is considered start of the counting
 * (use `0` unless otherwise specified)
 * @param Tx Duration of each period in milliseconds (usually `30000`)
 * @returns
 */
const getCounter_1 = __webpack_require__(/*! ./getCounter */ "./node_modules/simple-totp/dist/hotp/getCounter.js");
const getCounterValue = (timestamp, T0, Tx) => {
    const { counter, remainingMs } = (0, getCounter_1.getCounter)(timestamp, T0, Tx);
    const counterValue = new Uint8Array(8);
    // TODO: use writeBigInt64BE(counter, 0) (requires node v12.something)
    // This can wait until 2038 when 64bit time stamps become necessity
    const counterBytes = new Uint8Array(4).map((_, i) => (counter >> ((3 - i) * 8)) & 0xff);
    for (let index = 0; index < 4; index++) {
        counterValue[4 + index] = counterBytes[index];
    }
    return { counterValue, remainingMs };
};
exports.getCounterValue = getCounterValue;
//# sourceMappingURL=getCounterValue.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/hotp/getHMAC.js":
/*!*******************************************************!*\
  !*** ./node_modules/simple-totp/dist/hotp/getHMAC.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getHMAC = void 0;
const crypto_1 = __importDefault(__webpack_require__(/*! crypto */ "crypto"));
/**
 * Quick shortcut to creating HMACs
 * @param secret Secret key
 * @param message Message to hash
 * @returns HMAC of your message
 */
const getHMAC = (secret, message) => {
    const buf = crypto_1.default.createHmac("sha1", secret).update(message).digest();
    const u8a = new Uint8Array(buf);
    return u8a;
};
exports.getHMAC = getHMAC;
//# sourceMappingURL=getHMAC.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/hotp/getKey.js":
/*!******************************************************!*\
  !*** ./node_modules/simple-totp/dist/hotp/getKey.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getKey = void 0;
const converters_1 = __webpack_require__(/*! ../converters */ "./node_modules/simple-totp/dist/converters/index.js");
/**
 * creates a Uint8Array with your secret key to use in HMAC. You don't need
 * this function if your secret key is already a Uint8Array.
 * @param input your secret key, in form of a Uint8Array or a string (strings need
 * to specify encoding)
 * @param encoding if your secret key is a string, specify encoding.
 * @returns your secret key
 */
const getKey = (input, encoding) => {
    if (input instanceof Uint8Array)
        return input;
    if (encoding === undefined) {
        throw new Error("Encoding should be provided for string inputs");
    }
    switch (encoding) {
        case "ascii":
            return (0, converters_1.ascii_to_u8a)(input);
        case "base32":
            return (0, converters_1.base32_to_u8a)(input);
        case "hex":
            return (0, converters_1.hex_to_u8a)(input);
    }
};
exports.getKey = getKey;
//# sourceMappingURL=getKey.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/hotp/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/simple-totp/dist/hotp/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getHMAC = exports.getCounter = exports.getCounterValue = exports.getKey = exports.getCode = void 0;
var getCode_1 = __webpack_require__(/*! ./getCode */ "./node_modules/simple-totp/dist/hotp/getCode.js");
Object.defineProperty(exports, "getCode", ({ enumerable: true, get: function () { return getCode_1.getCode; } }));
var getKey_1 = __webpack_require__(/*! ./getKey */ "./node_modules/simple-totp/dist/hotp/getKey.js");
Object.defineProperty(exports, "getKey", ({ enumerable: true, get: function () { return getKey_1.getKey; } }));
var getCounterValue_1 = __webpack_require__(/*! ./getCounterValue */ "./node_modules/simple-totp/dist/hotp/getCounterValue.js");
Object.defineProperty(exports, "getCounterValue", ({ enumerable: true, get: function () { return getCounterValue_1.getCounterValue; } }));
var getCounter_1 = __webpack_require__(/*! ./getCounter */ "./node_modules/simple-totp/dist/hotp/getCounter.js");
Object.defineProperty(exports, "getCounter", ({ enumerable: true, get: function () { return getCounter_1.getCounter; } }));
var getHMAC_1 = __webpack_require__(/*! ./getHMAC */ "./node_modules/simple-totp/dist/hotp/getHMAC.js");
Object.defineProperty(exports, "getHMAC", ({ enumerable: true, get: function () { return getHMAC_1.getHMAC; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/index.js":
/*!************************************************!*\
  !*** ./node_modules/simple-totp/dist/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTOTP = exports.from_u8a = exports.to_u8a = exports.convert = exports.BASE32_PADDING = exports.BASE32_ALPHABET = exports.getCounter = exports.getKey = exports.getHMAC = exports.getCounterValue = exports.getCode = void 0;
var hotp_1 = __webpack_require__(/*! ./hotp */ "./node_modules/simple-totp/dist/hotp/index.js");
Object.defineProperty(exports, "getCode", ({ enumerable: true, get: function () { return hotp_1.getCode; } }));
Object.defineProperty(exports, "getCounterValue", ({ enumerable: true, get: function () { return hotp_1.getCounterValue; } }));
Object.defineProperty(exports, "getHMAC", ({ enumerable: true, get: function () { return hotp_1.getHMAC; } }));
Object.defineProperty(exports, "getKey", ({ enumerable: true, get: function () { return hotp_1.getKey; } }));
Object.defineProperty(exports, "getCounter", ({ enumerable: true, get: function () { return hotp_1.getCounter; } }));
var alphabet_1 = __webpack_require__(/*! ./converters/alphabet */ "./node_modules/simple-totp/dist/converters/alphabet.js");
Object.defineProperty(exports, "BASE32_ALPHABET", ({ enumerable: true, get: function () { return alphabet_1.BASE32_ALPHABET; } }));
Object.defineProperty(exports, "BASE32_PADDING", ({ enumerable: true, get: function () { return alphabet_1.BASE32_PADDING; } }));
var converters_1 = __webpack_require__(/*! ./converters */ "./node_modules/simple-totp/dist/converters/index.js");
Object.defineProperty(exports, "convert", ({ enumerable: true, get: function () { return converters_1.convert; } }));
Object.defineProperty(exports, "to_u8a", ({ enumerable: true, get: function () { return converters_1.to_u8a; } }));
Object.defineProperty(exports, "from_u8a", ({ enumerable: true, get: function () { return converters_1.from_u8a; } }));
var getTOTP_1 = __webpack_require__(/*! ./getTOTP */ "./node_modules/simple-totp/dist/getTOTP.js");
Object.defineProperty(exports, "getTOTP", ({ enumerable: true, get: function () { return getTOTP_1.getTOTP; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./src/addTOTP.ts":
/*!************************!*\
  !*** ./src/addTOTP.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addTOTP = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const simple_totp_1 = __webpack_require__(/*! simple-totp */ "./node_modules/simple-totp/dist/index.js");
var AdditionalEncodings;
(function (AdditionalEncodings) {
    AdditionalEncodings["BASE_32"] = "base32";
    AdditionalEncodings["OTPAUTH_URI"] = "otpauth:// TOTP key";
})(AdditionalEncodings || (AdditionalEncodings = {}));
const isFullState = (s) => {
    if (s.T0 === undefined) {
        return false;
    }
    if (s.TX === undefined) {
        return false;
    }
    if (s.encoding === undefined) {
        return false;
    }
    if (s.key === undefined) {
        return false;
    }
    if (s.nDigits === undefined) {
        return false;
    }
    if (s.name === undefined) {
        return false;
    }
    if (s.prefix === undefined) {
        return false;
    }
    if (s.needCustomParams === undefined) {
        return false;
    }
    return true;
};
const findNextStep = (s) => {
    if (s.encoding === undefined) {
        return askForEncoding;
    }
    if (s.key === undefined) {
        return askForCode;
    }
    if (s.T0 === undefined || s.TX === undefined || s.nDigits === undefined) {
        if (s.needCustomParams === true) {
            return askForCustomParams;
        }
        return askForParameters;
    }
    if (s.name === undefined) {
        return askForName;
    }
    if (s.prefix === undefined) {
        return askForPrefix;
    }
    return null;
};
const askForEncoding = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const encodings = [
        { label: AdditionalEncodings.BASE_32 },
        { label: "hex" },
        { label: "ascii" },
        { label: AdditionalEncodings.OTPAUTH_URI },
    ];
    const pick = yield vscode_1.window.showQuickPick(encodings, {
        placeHolder: "Which encoding does your seed have",
    });
    return Object.assign(Object.assign({}, state), { encoding: pick === null || pick === void 0 ? void 0 : pick.label });
});
const askForParameters = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultParams = Symbol();
    const customParams = Symbol();
    const items = [
        {
            id: defaultParams,
            label: "Use default parameters",
            description: "T₀ = 0, 30 seconds interval, 6 digits",
            detail: "T₀ = 0, 30 seconds interval, 6 digits",
        },
        { label: "Custom parameters...", id: customParams },
    ];
    const pick = yield vscode_1.window.showQuickPick(items, {
        placeHolder: "Optional parameters",
    });
    if (pick === undefined) {
        return state;
    }
    if (pick.id === defaultParams) {
        return Object.assign(Object.assign({}, state), { T0: 0, TX: 30, nDigits: 6, needCustomParams: false });
    }
    return Object.assign(Object.assign({}, state), { needCustomParams: true });
});
const askForName = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const name = yield vscode_1.window.showInputBox({
        prompt: "Name of token",
        placeHolder: "Name of token",
        ignoreFocusOut: true,
    });
    return Object.assign(Object.assign({}, state), { name });
});
const askForPrefix = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const prefix = yield vscode_1.window.showInputBox({
        prompt: "prefix of token",
        placeHolder: "prefix",
        ignoreFocusOut: true,
    });
    return Object.assign(Object.assign({}, state), { prefix });
});
const askForCustomParams = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const _T0 = yield vscode_1.window.showInputBox({
        placeHolder: "Initial timestamp",
        value: "0",
        ignoreFocusOut: true,
    });
    const _TX = yield vscode_1.window.showInputBox({
        placeHolder: "Interval length (seconds)",
        value: "30",
        ignoreFocusOut: true,
    });
    const _nDigits = yield vscode_1.window.showInputBox({
        placeHolder: "Interval length (seconds)",
        value: "6",
        ignoreFocusOut: true,
    });
    return Object.assign(Object.assign({}, state), { T0: _T0 ? parseInt(_T0, 10) : undefined, TX: _TX ? parseInt(_TX, 10) : undefined, nDigits: _nDigits ? parseInt(_nDigits, 10) : undefined });
});
const askForCode = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const getPlaceholder = () => {
        if (state.encoding === AdditionalEncodings.OTPAUTH_URI) {
            return "otpauth://";
        }
    };
    const decode = (v) => {
        switch (state.encoding) {
            case AdditionalEncodings.BASE_32:
                return (0, simple_totp_1.to_u8a)("base32", v.toUpperCase());
            case AdditionalEncodings.OTPAUTH_URI:
                throw new Error("No decoder");
            case "hex":
                const allCharacters = /^[0-9a-h]+$/i.test(v);
                const charCount = v.length % 2 === 0;
                if (!allCharacters) {
                    throw new Error("Check that all characters are in 0-9,a-h range (case insensitive)");
                }
                if (!charCount) {
                    throw new Error("Input length is uneven");
                }
                return Buffer.from(v, "hex");
            case "ascii":
                const buf = Buffer.from(v, "ascii");
                if (buf.toString("ascii") !== v) {
                    throw new Error("Not all characters are in ascii range");
                }
                return buf;
            default:
                throw new Error("Encoding is undefined");
        }
    };
    const key = yield vscode_1.window.showInputBox({
        prompt: "Paste your code",
        placeHolder: getPlaceholder(),
        ignoreFocusOut: true,
        validateInput: (v) => {
            try {
                decode(v);
            }
            catch (error) {
                return error.message;
            }
        },
    });
    if (key !== undefined) {
        return Object.assign(Object.assign({}, state), { key: decode(key) });
    }
    throw new Error("Key is undefined");
});
function addTOTP(context) {
    return __awaiter(this, void 0, void 0, function* () {
        function collectInputs() {
            return __awaiter(this, void 0, void 0, function* () {
                let state = {};
                while (!isFullState(state)) {
                    const step = findNextStep(state);
                    if (step === null) {
                        throw new Error("no steps");
                    }
                    state = yield step(state);
                }
                return state;
            });
        }
        const state = yield collectInputs();
        const code = {
            name: state.name,
            secret: (0, simple_totp_1.from_u8a)(state.key, "hex"),
            type: "hex",
            prefix: state.prefix,
            T0: state.T0,
            // state.TX is in seconds, Code['TX'] is in milliseconds
            TX: state.TX * 1000,
            nDigits: state.nDigits,
        };
        vscode_1.window.showInformationMessage(`Creating Application Service '${state.name}'`);
        return code;
    });
}
exports.addTOTP = addTOTP;


/***/ }),

/***/ "./src/buttons.ts":
/*!************************!*\
  !*** ./src/buttons.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.restoreButton = exports.backupButton = exports.editButton = exports.addButton = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
exports.addButton = {
    iconPath: new vscode_1.ThemeIcon("add"),
    tooltip: "Add new OTP",
};
exports.editButton = {
    iconPath: new vscode_1.ThemeIcon("edit"),
    tooltip: "Edit OTP",
};
exports.backupButton = {
    iconPath: new vscode_1.ThemeIcon("save"),
    tooltip: "Backup codes",
};
exports.restoreButton = {
    iconPath: new vscode_1.ThemeIcon("folder-opened"),
    tooltip: "Restore from backup",
};


/***/ }),

/***/ "./src/commands.ts":
/*!*************************!*\
  !*** ./src/commands.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Command = void 0;
var Command;
(function (Command) {
    Command["PICK"] = "totp.pick";
    Command["BACKUP"] = "totp.backup";
    Command["RESTORE"] = "totp.restore";
    Command["EDIT"] = "totp.edit";
    Command["CLEAR"] = "totp.clear";
    Command["NEW"] = "totp.new";
})(Command = exports.Command || (exports.Command = {}));


/***/ }),

/***/ "./src/commands/backup.ts":
/*!********************************!*\
  !*** ./src/commands/backup.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.totpBackup = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const auto_1 = __webpack_require__(/*! ../store/versions/auto */ "./src/store/versions/auto.ts");
const askForEncryptionPassphrase_1 = __webpack_require__(/*! ../store/askForEncryptionPassphrase */ "./src/store/askForEncryptionPassphrase.ts");
const totpBackup = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codes = yield auto_1.auto.loadFromState(context);
        const passphrase = yield (0, askForEncryptionPassphrase_1.askForEncryptionPassphrase)();
        if (passphrase === undefined) {
            throw new Error("passphrase dialog aborted");
        }
        const content = yield auto_1.auto.backup(context, codes, passphrase);
        const d = yield vscode_1.workspace.openTextDocument({ content, language: "json" });
        vscode_1.window.showTextDocument(d);
        vscode_1.window.showInformationMessage("Save this document somewhere and don't forget the passphrase!");
    }
    catch (x) {
        // debugger;
    }
});
exports.totpBackup = totpBackup;


/***/ }),

/***/ "./src/commands/clear.ts":
/*!*******************************!*\
  !*** ./src/commands/clear.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.totpClear = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const auto_1 = __webpack_require__(/*! ../store/versions/auto */ "./src/store/versions/auto.ts");
const totpClear = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const YES = { label: "♻️ CONFIRM PURGE ♻️" };
        const items = new Array(10)
            .fill(0)
            .map((x) => ({ label: "❌ ABORT PURGE ❌" }));
        const index = Math.round(Math.random() * 8) + 1;
        items[index] = YES;
        const result = yield vscode_1.window.showQuickPick(items);
        if (result === YES) {
            yield auto_1.auto.clear(context);
        }
    }
    catch (x) {
        vscode_1.window.showInformationMessage(x.message);
    }
});
exports.totpClear = totpClear;


/***/ }),

/***/ "./src/commands/edit.ts":
/*!******************************!*\
  !*** ./src/commands/edit.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.totpEdit = exports.renameRoutine = exports.deleteRoutine = exports.pickForEdit = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const context_1 = __webpack_require__(/*! ../store/context */ "./src/store/context.ts");
const commands_1 = __webpack_require__(/*! ../commands */ "./src/commands.ts");
const auto_1 = __webpack_require__(/*! ../store/versions/auto */ "./src/store/versions/auto.ts");
const pickForEdit = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        const disposables = [];
        const dispose = () => disposables.forEach((it) => it.dispose());
        const items = data.map((code) => ({
            code: code,
            label: code.name,
        }));
        const qp = vscode_1.window.createQuickPick();
        disposables.push(qp);
        qp.title = "Select item to edit";
        qp.items = items;
        disposables.push(qp.onDidChangeSelection((items) => {
            const data = items[0].code;
            resolve({ button: false, data });
            dispose();
        }), qp.onDidHide(() => {
            dispose();
            reject();
        }));
        qp.show();
    });
});
exports.pickForEdit = pickForEdit;
const deleteRoutine = (context, code) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmation = yield vscode_1.window.showInputBox({
        placeHolder: `Please type "${code.name}" to confirm deletion`,
        prompt: `Before deleting this account, make sure that you have other means of generating codes for it`,
        validateInput: (value) => {
            if (value === code.name)
                return null;
            return `Please type "${code.name}" to confirm deletion`;
        },
    });
    if (confirmation === code.name) {
        yield (0, context_1.deleteCode)(context, code.name);
    }
});
exports.deleteRoutine = deleteRoutine;
const renameRoutine = (context, code) => __awaiter(void 0, void 0, void 0, function* () {
    const newName = yield vscode_1.window.showInputBox({
        prompt: `Enter new name for ${code.name}`,
        value: code.name,
    });
    if (newName === undefined) {
        return;
    }
    yield (0, context_1.replaceCode)(context, code.name, Object.assign(Object.assign({}, code), { name: newName }));
});
exports.renameRoutine = renameRoutine;
const totpEdit = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield auto_1.auto.loadFromState(context);
        const entry = yield (0, exports.pickForEdit)(data);
        if (entry.button) {
            return;
        }
        const code = entry.data;
        const RENAME = { label: "Rename" };
        const DELETE = { label: "Delete" };
        const result = yield vscode_1.window.showQuickPick([RENAME, DELETE]);
        if (!result) {
            return;
        }
        if (result === RENAME) {
            yield (0, exports.renameRoutine)(context, code);
        }
        if (result === DELETE) {
            yield (0, exports.deleteRoutine)(context, code);
        }
        yield vscode_1.commands.executeCommand(commands_1.Command.PICK);
    }
    catch (x) {
        // debugger;
    }
});
exports.totpEdit = totpEdit;


/***/ }),

/***/ "./src/commands/new.ts":
/*!*****************************!*\
  !*** ./src/commands/new.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.totpNew = void 0;
const addTOTP_1 = __webpack_require__(/*! ../addTOTP */ "./src/addTOTP.ts");
const context_1 = __webpack_require__(/*! ../store/context */ "./src/store/context.ts");
const totpNew = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const code = yield (0, addTOTP_1.addTOTP)(context);
    (0, context_1.addCode)(context, code);
});
exports.totpNew = totpNew;


/***/ }),

/***/ "./src/commands/pick.ts":
/*!******************************!*\
  !*** ./src/commands/pick.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.totpPick = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const pickOTP_1 = __webpack_require__(/*! ../pickOTP */ "./src/pickOTP.ts");
const index_1 = __webpack_require__(/*! ../store/index */ "./src/store/index.ts");
const commands_1 = __webpack_require__(/*! ../commands */ "./src/commands.ts");
const buttons_1 = __webpack_require__(/*! ../buttons */ "./src/buttons.ts");
const auto_1 = __webpack_require__(/*! ../store/versions/auto */ "./src/store/versions/auto.ts");
const totpPick = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ctxCodes = yield auto_1.auto.loadFromState(context);
        const result = yield (0, pickOTP_1.pickOTPService)(ctxCodes);
        if (result.button) {
            switch (result.data) {
                case buttons_1.addButton: {
                    yield vscode_1.commands.executeCommand(commands_1.Command.NEW);
                    break;
                }
                case buttons_1.editButton: {
                    yield vscode_1.commands.executeCommand(commands_1.Command.EDIT);
                    break;
                }
                case buttons_1.restoreButton: {
                    yield vscode_1.commands.executeCommand(commands_1.Command.RESTORE);
                    break;
                }
                case buttons_1.backupButton: {
                    yield vscode_1.commands.executeCommand(commands_1.Command.BACKUP);
                    break;
                }
            }
        }
        else {
            const info = (0, index_1.getInfo)(result.data);
            vscode_1.env.clipboard.writeText(info.code);
            vscode_1.window.showInformationMessage("Passphrase copied to clipboard");
        }
    }
    catch (x) {
        // debugger;
    }
});
exports.totpPick = totpPick;


/***/ }),

/***/ "./src/commands/restore.ts":
/*!*********************************!*\
  !*** ./src/commands/restore.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.totpRestore = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const context_1 = __webpack_require__(/*! ../store/context */ "./src/store/context.ts");
const auto_1 = __webpack_require__(/*! ../store/versions/auto */ "./src/store/versions/auto.ts");
const passphraseGetter = () => __awaiter(void 0, void 0, void 0, function* () {
    const passphrase = yield vscode_1.window.showInputBox({
        prompt: "Enter passphrase used for encryption",
        password: true,
    });
    if (passphrase === undefined) {
        return null;
    }
    return passphrase;
});
const totpRestore = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uri = yield vscode_1.window.showOpenDialog({
            openLabel: "Restore seeds",
            canSelectMany: false,
            canSelectFiles: true,
        });
        if (!uri) {
            return;
        }
        const data = yield vscode_1.workspace.fs.readFile(uri[0]);
        const backupData = data.toString();
        const codes = yield auto_1.auto.restore(context, backupData, passphraseGetter);
        if (codes.length !== 0) {
            yield (0, context_1.merge)(context, codes);
            vscode_1.window.showInformationMessage(`${codes.length} passphrases have been imported`);
        }
    }
    catch (x) {
        vscode_1.window.showErrorMessage(`An error occured during decryption: \n${x.message}`);
    }
});
exports.totpRestore = totpRestore;


/***/ }),

/***/ "./src/makeStatusBarItem.ts":
/*!**********************************!*\
  !*** ./src/makeStatusBarItem.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeStatusBarItem = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const commands_1 = __webpack_require__(/*! ./commands */ "./src/commands.ts");
const makeStatusBarItem = () => {
    const myStatusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 100);
    myStatusBarItem.show();
    myStatusBarItem.text = "$(key)";
    myStatusBarItem.command = commands_1.Command.PICK;
    return myStatusBarItem;
};
exports.makeStatusBarItem = makeStatusBarItem;


/***/ }),

/***/ "./src/pickOTP.ts":
/*!************************!*\
  !*** ./src/pickOTP.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pickOTPService = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const buttons_1 = __webpack_require__(/*! ./buttons */ "./src/buttons.ts");
const pickOTPService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        const disposables = [];
        const dispose = () => disposables.forEach((it) => it.dispose());
        const items = data.map((code) => ({
            code: code,
            label: code.name,
        }));
        const qp = vscode_1.window.createQuickPick();
        disposables.push(qp);
        qp.title = "OTP Generator";
        qp.items = items;
        qp.buttons = [buttons_1.addButton, buttons_1.editButton, buttons_1.backupButton, buttons_1.restoreButton];
        disposables.push(qp.onDidChangeSelection((items) => {
            const data = items[0].code;
            resolve({ button: false, data });
            dispose();
        }), qp.onDidTriggerButton((btn) => {
            resolve({ button: true, data: btn });
            dispose();
        }), qp.onDidHide(() => {
            dispose();
            reject();
        }));
        qp.show();
    });
});
exports.pickOTPService = pickOTPService;


/***/ }),

/***/ "./src/store/askForEncryptionPassphrase.ts":
/*!*************************************************!*\
  !*** ./src/store/askForEncryptionPassphrase.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.askForEncryptionPassphrase = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const askForEncryptionPassphrase = () => __awaiter(void 0, void 0, void 0, function* () {
    const passphrase = yield vscode_1.window.showInputBox({
        prompt: "Enter encryption passphrase",
        password: true,
        placeHolder: "Leave this empty if you don't want to encrypt (UNSAFE)",
    });
    return passphrase;
});
exports.askForEncryptionPassphrase = askForEncryptionPassphrase;


/***/ }),

/***/ "./src/store/context.ts":
/*!******************************!*\
  !*** ./src/store/context.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.merge = exports.deleteCode = exports.replaceCode = exports.addCode = exports.STORE_VER_KEY = void 0;
const auto_1 = __webpack_require__(/*! ./versions/auto */ "./src/store/versions/auto.ts");
exports.STORE_VER_KEY = "STORE_VER";
const addCode = (ctx, code) => __awaiter(void 0, void 0, void 0, function* () {
    const allKeys = yield auto_1.auto.loadFromState(ctx);
    const newKeys = [code, ...allKeys];
    yield auto_1.auto.storeInState(ctx, newKeys);
});
exports.addCode = addCode;
const replaceCode = (ctx, name, newCode) => __awaiter(void 0, void 0, void 0, function* () {
    const allKeys = yield auto_1.auto.loadFromState(ctx);
    const newKeys = allKeys.map((key) => {
        if (key.name === name) {
            return newCode;
        }
        return key;
    });
    yield auto_1.auto.storeInState(ctx, newKeys);
});
exports.replaceCode = replaceCode;
const deleteCode = (ctx, name) => __awaiter(void 0, void 0, void 0, function* () {
    const allKeys = yield auto_1.auto.loadFromState(ctx);
    const newKeys = allKeys.filter((key) => key.name !== name);
    yield auto_1.auto.storeInState(ctx, newKeys);
});
exports.deleteCode = deleteCode;
const merge = (ctx, data) => __awaiter(void 0, void 0, void 0, function* () {
    const ctxCodes = (yield auto_1.auto.loadFromState(ctx)) || [];
    data.forEach((code) => {
        const c = ctxCodes.find((ctxCode) => JSON.stringify(ctxCode) === JSON.stringify(code));
        if (c === undefined) {
            console.log(`merging code ${code.name}`);
            ctxCodes.push(code);
        }
    });
    yield auto_1.auto.storeInState(ctx, ctxCodes);
});
exports.merge = merge;


/***/ }),

/***/ "./src/store/crypto.ts":
/*!*****************************!*\
  !*** ./src/store/crypto.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decode = exports.encode = void 0;
const crypto = __webpack_require__(/*! crypto */ "crypto");
const EXPORT_ENCODING = "hex";
const ALGORITHM = "aes-192-cbc";
const encode = (data, passphrase) => {
    // Use the async `crypto.scrypt()` instead.
    const key = crypto.scryptSync(passphrase, "salt", 24);
    // Use `crypto.randomBytes` to generate a random iv instead of the static iv
    // shown here.
    const iv = Buffer.alloc(16, 0); // Initialization vector.
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(data, "utf8", EXPORT_ENCODING);
    encrypted += cipher.final(EXPORT_ENCODING);
    return encrypted;
};
exports.encode = encode;
const decode = (data, passphrase) => {
    // Use the async `crypto.scrypt()` instead.
    const key = crypto.scryptSync(passphrase, "salt", 24);
    // Use `crypto.randomBytes` to generate a random iv instead of the static iv
    // shown here.
    const iv = Buffer.alloc(16, 0); // Initialization vector.
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(data, EXPORT_ENCODING, "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
    // Prints: some clear text data
};
exports.decode = decode;


/***/ }),

/***/ "./src/store/index.ts":
/*!****************************!*\
  !*** ./src/store/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInfo = void 0;
const simple_totp_1 = __webpack_require__(/*! simple-totp */ "./node_modules/simple-totp/dist/index.js");
const getInfo = (code) => {
    const { totp, remainingMs } = (0, simple_totp_1.getTOTP)(code.secret, code.type, undefined, code.nDigits, code.T0, code.TX);
    const prefix = code.prefix || "";
    const remaining = Math.floor(remainingMs / 1000)
        .toString(10)
        .padStart(2, "0");
    return { code: `${prefix}${totp}`, remaining, name: code.name };
};
exports.getInfo = getInfo;


/***/ }),

/***/ "./src/store/passphraseGetter.ts":
/*!***************************************!*\
  !*** ./src/store/passphraseGetter.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makePasswordCache = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const makePasswordCache = () => {
    let passphrase = null;
    return () => __awaiter(void 0, void 0, void 0, function* () {
        if (passphrase) {
            return passphrase;
        }
        const input = yield vscode_1.window.showInputBox({
            prompt: "Enter passphrase to unlock OTP storage",
            password: true,
        });
        if (input) {
            passphrase = input;
        }
        return passphrase;
    });
};
exports.makePasswordCache = makePasswordCache;


/***/ }),

/***/ "./src/store/versions/auto.ts":
/*!************************************!*\
  !*** ./src/store/versions/auto.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.auto = void 0;
const context_1 = __webpack_require__(/*! ../context */ "./src/store/context.ts");
const v1_1 = __webpack_require__(/*! ./v1 */ "./src/store/versions/v1.ts");
const v2_1 = __webpack_require__(/*! ./v2 */ "./src/store/versions/v2.ts");
const latest = v2_1.persistV2;
exports.auto = {
    storeInState: latest.storeInState,
    backup: latest.backup,
    clear: latest.clear,
    loadFromState(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = ctx.globalState.get(context_1.STORE_VER_KEY);
            switch (v) {
                case 2:
                    return yield v2_1.persistV2.loadFromState(ctx);
                case 1:
                default:
                    return yield v1_1.persistV1.loadFromState(ctx);
            }
        });
    },
    restore(ctx, backupData, passphraseGetter) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = JSON.parse(backupData)[context_1.STORE_VER_KEY];
            switch (v) {
                case 2:
                    return yield v2_1.persistV2.restore(ctx, backupData, passphraseGetter);
                case 1:
                default:
                    return yield v1_1.persistV1.restore(ctx, backupData, passphraseGetter);
            }
        });
    },
};


/***/ }),

/***/ "./src/store/versions/v1.ts":
/*!**********************************!*\
  !*** ./src/store/versions/v1.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.persistV1 = void 0;
const context_1 = __webpack_require__(/*! ../context */ "./src/store/context.ts");
const crypto_1 = __webpack_require__(/*! ../crypto */ "./src/store/crypto.ts");
const KEY = "TOTP";
const STORE_VER = 1;
exports.persistV1 = {
    storeInState(ctx, codes) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.globalState.update(KEY, codes);
            ctx.globalState.update(context_1.STORE_VER_KEY, STORE_VER);
        });
    },
    loadFromState(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = ctx.globalState.get(KEY, null);
            return value === null ? [] : value;
        });
    },
    backup(ctx, data, passphrase) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = passphrase === ""
                ? { cleartext: data }
                : {
                    encrypted: (0, crypto_1.encode)(JSON.stringify(data), passphrase),
                };
            const json = JSON.stringify(value, null, 2);
            return json;
        });
    },
    restore(ctx, backupData, passphraseGetter) {
        return __awaiter(this, void 0, void 0, function* () {
            let passphrase;
            const { cleartext, encrypted } = JSON.parse(backupData);
            const codes = [];
            if (cleartext !== undefined) {
                codes.push(...cleartext);
            }
            if (encrypted !== undefined) {
                passphrase = yield passphraseGetter();
                if (!passphrase) {
                    throw new Error("No passphrase was supplied");
                }
                codes.push(...JSON.parse((0, crypto_1.decode)(encrypted, passphrase)));
            }
            return codes;
        });
    },
    clear(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.globalState.update(KEY, null);
            ctx.globalState.update(context_1.STORE_VER_KEY, null);
        });
    },
};


/***/ }),

/***/ "./src/store/versions/v2.ts":
/*!**********************************!*\
  !*** ./src/store/versions/v2.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.persistV2 = void 0;
const context_1 = __webpack_require__(/*! ../context */ "./src/store/context.ts");
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const v1_1 = __webpack_require__(/*! ./v1 */ "./src/store/versions/v1.ts");
const passphraseGetter_1 = __webpack_require__(/*! ../passphraseGetter */ "./src/store/passphraseGetter.ts");
const KEY = "TOTP";
const STORE_VER = 2;
const passphraseGetter = (0, passphraseGetter_1.makePasswordCache)();
exports.persistV2 = {
    storeInState(ctx, codes) {
        return __awaiter(this, void 0, void 0, function* () {
            const passphrase = yield passphraseGetter();
            if (passphrase === null) {
                yield vscode_1.window.showErrorMessage("Can't update storage");
                return;
            }
            ctx.globalState.update(KEY, yield this.backup(ctx, codes, passphrase));
            ctx.globalState.update(context_1.STORE_VER_KEY, STORE_VER);
        });
    },
    loadFromState(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const backupData = ctx.globalState.get(KEY, "{}");
            const data = yield this.restore(ctx, backupData, passphraseGetter);
            return data;
        });
    },
    backup: v1_1.persistV1.backup,
    restore: v1_1.persistV1.restore,
    clear: v1_1.persistV1.clear,
};


/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const pick_1 = __webpack_require__(/*! ./commands/pick */ "./src/commands/pick.ts");
const commands_1 = __webpack_require__(/*! ./commands */ "./src/commands.ts");
const new_1 = __webpack_require__(/*! ./commands/new */ "./src/commands/new.ts");
const edit_1 = __webpack_require__(/*! ./commands/edit */ "./src/commands/edit.ts");
const makeStatusBarItem_1 = __webpack_require__(/*! ./makeStatusBarItem */ "./src/makeStatusBarItem.ts");
const backup_1 = __webpack_require__(/*! ./commands/backup */ "./src/commands/backup.ts");
const restore_1 = __webpack_require__(/*! ./commands/restore */ "./src/commands/restore.ts");
const clear_1 = __webpack_require__(/*! ./commands/clear */ "./src/commands/clear.ts");
function activate(context) {
    console.log("Activated.");
    context.subscriptions.push(vscode_1.commands.registerCommand(commands_1.Command.NEW, () => (0, new_1.totpNew)(context)), vscode_1.commands.registerCommand(commands_1.Command.PICK, () => (0, pick_1.totpPick)(context)), vscode_1.commands.registerCommand(commands_1.Command.BACKUP, () => (0, backup_1.totpBackup)(context)), vscode_1.commands.registerCommand(commands_1.Command.RESTORE, () => (0, restore_1.totpRestore)(context)), vscode_1.commands.registerCommand(commands_1.Command.EDIT, () => (0, edit_1.totpEdit)(context)), vscode_1.commands.registerCommand(commands_1.Command.CLEAR, () => (0, clear_1.totpClear)(context)), (0, makeStatusBarItem_1.makeStatusBarItem)());
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map