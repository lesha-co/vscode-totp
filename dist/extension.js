module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/simple-totp/dist/base32decode.js":
/*!*******************************************************!*\
  !*** ./node_modules/simple-totp/dist/base32decode.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
var padding = "=";
exports.base32decode = function (b32string) {
    if (b32string.length % 8)
        throw new Error("input should have length of multiple of 8");
    var codepoints = Array.from(b32string).map(function (x) { return alphabet.indexOf(x); });
    if (codepoints.some(function (x) { return x === -1; }))
        throw new Error("Illegal characters found in input");
    var buf = Buffer.alloc((b32string.length * 5) / 8);
    codepoints.forEach(function (code, index, array) {
        // 000000001111111122222222  bytes
        // **********OOOOO*********  third character will have these bits to it
        // --------->                bitOffset = 2x5= 10
        //         ->                offsetInByte = 10%8= 2
        //          <---------------> u16
        //                 <-------- shiftInU16 = 9
        var bitOffset = index * 5;
        // we need to know which byte corresponds to given bit offset
        var startingByte = Math.floor(bitOffset / 8);
        // we need to know how far we are into this byte
        var offsetInByte = bitOffset % 8;
        // we will work with u16 because our 5 bits can cross byte border and it's easier to just
        // assume that we're working with u16s
        var shiftInU16 = 16 - 5 - offsetInByte;
        if (index === array.length - 1) {
            // in case of last character startingByte would be the last one and we can't read u16
            // anymore, in that case we will work with u8
            var u8 = buf.readUInt8(startingByte);
            var newU8 = u8 | code;
            buf.writeUInt8(newU8, startingByte);
        }
        else {
            var u16 = buf.readUInt16BE(startingByte);
            var newU16 = u16 | (code << shiftInU16);
            buf.writeUInt16BE(newU16, startingByte);
        }
    });
    return buf;
};
//# sourceMappingURL=base32decode.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/getCode.js":
/*!**************************************************!*\
  !*** ./node_modules/simple-totp/dist/getCode.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getCode = function (hmac, nDigits) {
    var offset = hmac.readUInt8(hmac.length - 1) & 0xf;
    var fourBytes = hmac.readUInt32BE(offset) & 0x7fffffff;
    return (fourBytes % Math.pow(10, nDigits)).toString(10).padStart(nDigits, "0");
};
//# sourceMappingURL=getCode.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/getCounter.js":
/*!*****************************************************!*\
  !*** ./node_modules/simple-totp/dist/getCounter.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getCounter = function (timestamp, T0, Tx) {
    var adjustedTimestamp = timestamp - T0;
    var remainingMs = Tx - (adjustedTimestamp % Tx);
    var counter = Math.floor(adjustedTimestamp / Tx);
    var counterBuffer = Buffer.alloc(8, 0);
    // TODO: use writeBigInt64BE(counter, 0) (requires node v12.something)
    // This can wait until 2038 when 64bit time stamps become necessity
    counterBuffer.writeUInt32BE(counter, 4);
    return { counterBuffer: counterBuffer, remainingMs: remainingMs };
};
//# sourceMappingURL=getCounter.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/getHMAC.js":
/*!**************************************************!*\
  !*** ./node_modules/simple-totp/dist/getHMAC.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(__webpack_require__(/*! crypto */ "crypto"));
exports.getHMAC = function (secret, message) {
    return crypto_1.default
        .createHmac("sha1", secret)
        .update(message)
        .digest();
};
//# sourceMappingURL=getHMAC.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/getKey.js":
/*!*************************************************!*\
  !*** ./node_modules/simple-totp/dist/getKey.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var base32decode_1 = __webpack_require__(/*! ./base32decode */ "./node_modules/simple-totp/dist/base32decode.js");
exports.getKey = function (input, encoding) {
    if (Buffer.isBuffer(input))
        return input;
    if (encoding === undefined) {
        throw new Error("Encoding should be provided for string inputs (any Buffer encoding or 'base32')");
    }
    if (encoding === "base32")
        return base32decode_1.base32decode(input);
    return Buffer.from(input, encoding);
};
//# sourceMappingURL=getKey.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/getTOTP.js":
/*!**************************************************!*\
  !*** ./node_modules/simple-totp/dist/getTOTP.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getCode_1 = __webpack_require__(/*! ./getCode */ "./node_modules/simple-totp/dist/getCode.js");
var getCounter_1 = __webpack_require__(/*! ./getCounter */ "./node_modules/simple-totp/dist/getCounter.js");
var getHMAC_1 = __webpack_require__(/*! ./getHMAC */ "./node_modules/simple-totp/dist/getHMAC.js");
var getKey_1 = __webpack_require__(/*! ./getKey */ "./node_modules/simple-totp/dist/getKey.js");
exports.getTOTP = function (seed, encoding, timestamp, nDigits, T0, Tx) {
    if (timestamp === void 0) { timestamp = Date.now(); }
    if (nDigits === void 0) { nDigits = 6; }
    if (T0 === void 0) { T0 = 0; }
    if (Tx === void 0) { Tx = 30000; }
    var secret = getKey_1.getKey(seed, encoding);
    var _a = getCounter_1.getCounter(timestamp, T0, Tx), counterBuffer = _a.counterBuffer, remainingMs = _a.remainingMs;
    var hmac = getHMAC_1.getHMAC(secret, counterBuffer);
    var totp = getCode_1.getCode(hmac, nDigits);
    return { totp: totp, remainingMs: remainingMs };
};
//# sourceMappingURL=getTOTP.js.map

/***/ }),

/***/ "./node_modules/simple-totp/dist/index.js":
/*!************************************************!*\
  !*** ./node_modules/simple-totp/dist/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getKey_1 = __webpack_require__(/*! ./getKey */ "./node_modules/simple-totp/dist/getKey.js");
exports.getKey = getKey_1.getKey;
var base32decode_1 = __webpack_require__(/*! ./base32decode */ "./node_modules/simple-totp/dist/base32decode.js");
exports.base32decode = base32decode_1.base32decode;
var getCode_1 = __webpack_require__(/*! ./getCode */ "./node_modules/simple-totp/dist/getCode.js");
exports.getCode = getCode_1.getCode;
var getCounter_1 = __webpack_require__(/*! ./getCounter */ "./node_modules/simple-totp/dist/getCounter.js");
exports.getCounter = getCounter_1.getCounter;
var getHMAC_1 = __webpack_require__(/*! ./getHMAC */ "./node_modules/simple-totp/dist/getHMAC.js");
exports.getHMAC = getHMAC_1.getHMAC;
var getTOTP_1 = __webpack_require__(/*! ./getTOTP */ "./node_modules/simple-totp/dist/getTOTP.js");
exports.getTOTP = getTOTP_1.getTOTP;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./src/addTOTP.ts":
/*!************************!*\
  !*** ./src/addTOTP.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
                return simple_totp_1.base32decode(v.toUpperCase());
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
            secret: state.key.toString("hex"),
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totpBackup = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const auto_1 = __webpack_require__(/*! ../store/versions/auto */ "./src/store/versions/auto.ts");
const askForEncryptionPassphrase_1 = __webpack_require__(/*! ../store/askForEncryptionPassphrase */ "./src/store/askForEncryptionPassphrase.ts");
exports.totpBackup = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codes = yield auto_1.auto.loadFromState(context);
        const passphrase = yield askForEncryptionPassphrase_1.askForEncryptionPassphrase();
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


/***/ }),

/***/ "./src/commands/clear.ts":
/*!*******************************!*\
  !*** ./src/commands/clear.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totpClear = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const auto_1 = __webpack_require__(/*! ../store/versions/auto */ "./src/store/versions/auto.ts");
exports.totpClear = (context) => __awaiter(void 0, void 0, void 0, function* () {
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


/***/ }),

/***/ "./src/commands/edit.ts":
/*!******************************!*\
  !*** ./src/commands/edit.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totpEdit = exports.renameRoutine = exports.deleteRoutine = exports.pickForEdit = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const context_1 = __webpack_require__(/*! ../store/context */ "./src/store/context.ts");
const commands_1 = __webpack_require__(/*! ../commands */ "./src/commands.ts");
const auto_1 = __webpack_require__(/*! ../store/versions/auto */ "./src/store/versions/auto.ts");
exports.pickForEdit = (data) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.deleteRoutine = (context, code) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield context_1.deleteCode(context, code.name);
    }
});
exports.renameRoutine = (context, code) => __awaiter(void 0, void 0, void 0, function* () {
    const newName = yield vscode_1.window.showInputBox({
        prompt: `Enter new name for ${code.name}`,
        value: code.name,
    });
    if (newName === undefined) {
        return;
    }
    yield context_1.replaceCode(context, code.name, Object.assign(Object.assign({}, code), { name: newName }));
});
exports.totpEdit = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield auto_1.auto.loadFromState(context);
        const entry = yield exports.pickForEdit(data);
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
            yield exports.renameRoutine(context, code);
        }
        if (result === DELETE) {
            yield exports.deleteRoutine(context, code);
        }
        yield vscode_1.commands.executeCommand(commands_1.Command.PICK);
    }
    catch (x) {
        // debugger;
    }
});


/***/ }),

/***/ "./src/commands/new.ts":
/*!*****************************!*\
  !*** ./src/commands/new.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totpNew = void 0;
const addTOTP_1 = __webpack_require__(/*! ../addTOTP */ "./src/addTOTP.ts");
const context_1 = __webpack_require__(/*! ../store/context */ "./src/store/context.ts");
exports.totpNew = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const code = yield addTOTP_1.addTOTP(context);
    context_1.addCode(context, code);
});


/***/ }),

/***/ "./src/commands/pick.ts":
/*!******************************!*\
  !*** ./src/commands/pick.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totpPick = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const pickOTP_1 = __webpack_require__(/*! ../pickOTP */ "./src/pickOTP.ts");
const index_1 = __webpack_require__(/*! ../store/index */ "./src/store/index.ts");
const commands_1 = __webpack_require__(/*! ../commands */ "./src/commands.ts");
const buttons_1 = __webpack_require__(/*! ../buttons */ "./src/buttons.ts");
const auto_1 = __webpack_require__(/*! ../store/versions/auto */ "./src/store/versions/auto.ts");
exports.totpPick = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ctxCodes = yield auto_1.auto.loadFromState(context);
        const result = yield pickOTP_1.pickOTPService(ctxCodes);
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
            const info = index_1.getInfo(result.data);
            vscode_1.env.clipboard.writeText(info.code);
            vscode_1.window.showInformationMessage("Passphrase copied to clipboard");
        }
    }
    catch (x) {
        // debugger;
    }
});


/***/ }),

/***/ "./src/commands/restore.ts":
/*!*********************************!*\
  !*** ./src/commands/restore.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.totpRestore = (context) => __awaiter(void 0, void 0, void 0, function* () {
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
            yield context_1.merge(context, codes);
            vscode_1.window.showInformationMessage(`${codes.length} passphrases have been imported`);
        }
    }
    catch (x) {
        vscode_1.window.showErrorMessage(`An error occured during decryption: \n${x.message}`);
    }
});


/***/ }),

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
    context.subscriptions.push(vscode_1.commands.registerCommand(commands_1.Command.NEW, () => new_1.totpNew(context)), vscode_1.commands.registerCommand(commands_1.Command.PICK, () => pick_1.totpPick(context)), vscode_1.commands.registerCommand(commands_1.Command.BACKUP, () => backup_1.totpBackup(context)), vscode_1.commands.registerCommand(commands_1.Command.RESTORE, () => restore_1.totpRestore(context)), vscode_1.commands.registerCommand(commands_1.Command.EDIT, () => edit_1.totpEdit(context)), vscode_1.commands.registerCommand(commands_1.Command.CLEAR, () => clear_1.totpClear(context)), makeStatusBarItem_1.makeStatusBarItem());
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),

/***/ "./src/makeStatusBarItem.ts":
/*!**********************************!*\
  !*** ./src/makeStatusBarItem.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.makeStatusBarItem = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const commands_1 = __webpack_require__(/*! ./commands */ "./src/commands.ts");
exports.makeStatusBarItem = () => {
    const myStatusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 100);
    myStatusBarItem.show();
    myStatusBarItem.text = "$(key)";
    myStatusBarItem.command = commands_1.Command.PICK;
    return myStatusBarItem;
};


/***/ }),

/***/ "./src/pickOTP.ts":
/*!************************!*\
  !*** ./src/pickOTP.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickOTPService = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const buttons_1 = __webpack_require__(/*! ./buttons */ "./src/buttons.ts");
exports.pickOTPService = (data) => __awaiter(void 0, void 0, void 0, function* () {
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


/***/ }),

/***/ "./src/store/askForEncryptionPassphrase.ts":
/*!*************************************************!*\
  !*** ./src/store/askForEncryptionPassphrase.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askForEncryptionPassphrase = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
exports.askForEncryptionPassphrase = () => __awaiter(void 0, void 0, void 0, function* () {
    const passphrase = yield vscode_1.window.showInputBox({
        prompt: "Enter encryption passphrase",
        password: true,
        placeHolder: "Leave this empty if you don't want to encrypt (UNSAFE)",
    });
    return passphrase;
});


/***/ }),

/***/ "./src/store/context.ts":
/*!******************************!*\
  !*** ./src/store/context.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.deleteCode = exports.replaceCode = exports.addCode = exports.STORE_VER_KEY = void 0;
const auto_1 = __webpack_require__(/*! ./versions/auto */ "./src/store/versions/auto.ts");
exports.STORE_VER_KEY = "STORE_VER";
exports.addCode = (ctx, code) => __awaiter(void 0, void 0, void 0, function* () {
    const allKeys = yield auto_1.auto.loadFromState(ctx);
    const newKeys = [code, ...allKeys];
    yield auto_1.auto.storeInState(ctx, newKeys);
});
exports.replaceCode = (ctx, name, newCode) => __awaiter(void 0, void 0, void 0, function* () {
    const allKeys = yield auto_1.auto.loadFromState(ctx);
    const newKeys = allKeys.map((key) => {
        if (key.name === name) {
            return newCode;
        }
        return key;
    });
    yield auto_1.auto.storeInState(ctx, newKeys);
});
exports.deleteCode = (ctx, name) => __awaiter(void 0, void 0, void 0, function* () {
    const allKeys = yield auto_1.auto.loadFromState(ctx);
    const newKeys = allKeys.filter((key) => key.name !== name);
    yield auto_1.auto.storeInState(ctx, newKeys);
});
exports.merge = (ctx, data) => __awaiter(void 0, void 0, void 0, function* () {
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


/***/ }),

/***/ "./src/store/crypto.ts":
/*!*****************************!*\
  !*** ./src/store/crypto.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const crypto = __webpack_require__(/*! crypto */ "crypto");
const EXPORT_ENCODING = "hex";
const ALGORITHM = "aes-192-cbc";
exports.encode = (data, passphrase) => {
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
exports.decode = (data, passphrase) => {
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


/***/ }),

/***/ "./src/store/index.ts":
/*!****************************!*\
  !*** ./src/store/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = void 0;
const simple_totp_1 = __webpack_require__(/*! simple-totp */ "./node_modules/simple-totp/dist/index.js");
exports.getInfo = (code) => {
    const { totp, remainingMs } = simple_totp_1.getTOTP(code.secret, code.type, undefined, code.nDigits, code.T0, code.TX);
    const prefix = code.prefix || "";
    const remaining = Math.floor(remainingMs / 1000)
        .toString(10)
        .padStart(2, "0");
    return { code: `${prefix}${totp}`, remaining, name: code.name };
};


/***/ }),

/***/ "./src/store/passphraseGetter.ts":
/*!***************************************!*\
  !*** ./src/store/passphraseGetter.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePasswordCache = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
exports.makePasswordCache = () => {
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


/***/ }),

/***/ "./src/store/versions/auto.ts":
/*!************************************!*\
  !*** ./src/store/versions/auto.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
                    encrypted: crypto_1.encode(JSON.stringify(data), passphrase),
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
                codes.push(...JSON.parse(crypto_1.decode(encrypted, passphrase)));
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistV2 = void 0;
const context_1 = __webpack_require__(/*! ../context */ "./src/store/context.ts");
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const v1_1 = __webpack_require__(/*! ./v1 */ "./src/store/versions/v1.ts");
const passphraseGetter_1 = __webpack_require__(/*! ../passphraseGetter */ "./src/store/passphraseGetter.ts");
const KEY = "TOTP";
const STORE_VER = 2;
const passphraseGetter = passphraseGetter_1.makePasswordCache();
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

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ })

/******/ });
//# sourceMappingURL=extension.js.map