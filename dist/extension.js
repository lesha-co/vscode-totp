module.exports=function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=12)}([function(e,t){e.exports=require("vscode")},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(2),r=n(17),a=r.persistV1;t.auto={storeInState:a.storeInState,backup:a.backup,loadFromState(e){return o(this,void 0,void 0,(function*(){switch(e.globalState.get(i.STORE_VER_KEY)){case 1:return r.persistV1.loadFromState(e);default:throw new Error("unknown version")}}))},restore(e,t){return o(this,void 0,void 0,(function*(){switch(JSON.parse(t)[i.STORE_VER_KEY]){case 1:default:return r.persistV1.restore(e,t)}}))}}},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(1);t.STORE_VER_KEY="STORE_VER",t.addCode=(e,t)=>o(void 0,void 0,void 0,(function*(){const n=yield i.auto.loadFromState(e),o=[t,...n];yield i.auto.storeInState(e,o)})),t.replaceCode=(e,t,n)=>o(void 0,void 0,void 0,(function*(){const o=(yield i.auto.loadFromState(e)).map(e=>e.name===t?n:e);yield i.auto.storeInState(e,o)})),t.deleteCode=(e,t)=>o(void 0,void 0,void 0,(function*(){const n=(yield i.auto.loadFromState(e)).filter(e=>e.name!==t);yield i.auto.storeInState(e,n)})),t.merge=(e,t)=>o(void 0,void 0,void 0,(function*(){const n=yield i.auto.loadFromState(e);t.forEach(e=>{void 0===n.find(t=>JSON.stringify(t)===JSON.stringify(e))&&(console.log("merging code "+e.name),n.push(e))}),yield i.auto.storeInState(e,n)}))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.PICK="totp.pick",e.BACKUP="totp.backup",e.RESTORE="totp.restore",e.EDIT="totp.edit",e.NEW="totp.new"}(t.Command||(t.Command={}))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(0);t.addButton={iconPath:new o.ThemeIcon("add"),tooltip:"Add new OTP"},t.editButton={iconPath:new o.ThemeIcon("edit"),tooltip:"Edit OTP"},t.backupButton={iconPath:new o.ThemeIcon("save"),tooltip:"Backup codes"},t.restoreButton={iconPath:new o.ThemeIcon("folder-opened"),tooltip:"Restore from backup"}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(6);t.getKey=o.getKey;var i=n(7);t.base32decode=i.base32decode;var r=n(8);t.getCode=r.getCode;var a=n(9);t.getCounter=a.getCounter;var c=n(10);t.getHMAC=c.getHMAC;var u=n(16);t.getTOTP=u.getTOTP},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(7);t.getKey=function(e,t){if(Buffer.isBuffer(e))return e;if(void 0===t)throw new Error("Encoding should be provided for string inputs (any Buffer encoding or 'base32')");return"base32"===t?o.base32decode(e):Buffer.from(e,t)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.base32decode=function(e){if(e.length%8)throw new Error("input should have length of multiple of 8");var t=Array.from(e).map((function(e){return"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".indexOf(e)}));if(t.some((function(e){return-1===e})))throw new Error("Illegal characters found in input");var n=Buffer.alloc(5*e.length/8);return t.forEach((function(e,t,o){var i=5*t,r=Math.floor(i/8),a=11-i%8;if(t===o.length-1){var c=n.readUInt8(r)|e;n.writeUInt8(c,r)}else{var u=n.readUInt16BE(r)|e<<a;n.writeUInt16BE(u,r)}})),n}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getCode=function(e,t){var n=15&e.readUInt8(e.length-1);return((2147483647&e.readUInt32BE(n))%Math.pow(10,t)).toString(10).padStart(t,"0")}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getCounter=function(e,t,n){var o=e-t,i=n-o%n,r=Math.floor(o/n),a=Buffer.alloc(8,0);return a.writeUInt32BE(r,4),{counterBuffer:a,remainingMs:i}}},function(e,t,n){"use strict";var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var i=o(n(11));t.getHMAC=function(e,t){return i.default.createHmac("sha1",e).update(t).digest()}},function(e,t){e.exports=require("crypto")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(0),i=n(13),r=n(3),a=n(20),c=n(22),u=n(23),s=n(24),d=n(25);t.activate=function(e){e.subscriptions.push(o.commands.registerCommand(r.Command.NEW,()=>a.totpNew(e)),o.commands.registerCommand(r.Command.PICK,()=>i.totpPick(e)),o.commands.registerCommand(r.Command.BACKUP,()=>s.totpBackup(e)),o.commands.registerCommand(r.Command.RESTORE,()=>d.totpRestore(e)),o.commands.registerCommand(r.Command.EDIT,()=>c.totpEdit(e)),u.makeStatusBarItem())},t.deactivate=function(){}},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(0),r=n(14),a=n(15),c=n(3),u=n(4),s=n(1);t.totpPick=e=>o(void 0,void 0,void 0,(function*(){try{const t=yield s.auto.loadFromState(e),n=yield r.pickOTPService(t);if(n.button)switch(n.data){case u.addButton:yield i.commands.executeCommand(c.Command.NEW);break;case u.editButton:yield i.commands.executeCommand(c.Command.EDIT);break;case u.restoreButton:yield i.commands.executeCommand(c.Command.RESTORE);break;case u.backupButton:yield i.commands.executeCommand(c.Command.BACKUP)}else{const e=a.getInfo(n.data);i.env.clipboard.writeText(e.code),i.window.showInformationMessage("Password copied to clipboard")}}catch(e){}}))},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(0),r=n(4);t.pickOTPService=e=>o(void 0,void 0,void 0,(function*(){return yield new Promise((t,n)=>{const o=[],a=()=>o.forEach(e=>e.dispose()),c=e.map(e=>({code:e,label:e.name})),u=i.window.createQuickPick();o.push(u),u.title="OTP Generator",u.items=c,u.buttons=[r.addButton,r.editButton,r.backupButton,r.restoreButton],o.push(u.onDidChangeSelection(e=>{const n=e[0].code;t({button:!1,data:n}),a()}),u.onDidTriggerButton(e=>{t({button:!0,data:e}),a()}),u.onDidHide(()=>{a(),n()})),u.show()})}))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(5);t.getInfo=e=>{const{totp:t,remainingMs:n}=o.getTOTP(e.secret,e.type,void 0,e.nDigits,e.T0,e.TX);return{code:`${e.prefix||""}${t}`,remaining:Math.floor(n/1e3).toString(10).padStart(2,"0"),name:e.name}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(8),i=n(9),r=n(10),a=n(6);t.getTOTP=function(e,t,n,c,u,s){void 0===n&&(n=Date.now()),void 0===c&&(c=6),void 0===u&&(u=0),void 0===s&&(s=3e4);var d=a.getKey(e,t),l=i.getCounter(n,u,s),f=l.counterBuffer,p=l.remainingMs,v=r.getHMAC(d,f);return{totp:o.getCode(v,c),remainingMs:p}}},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(2),r=n(18),a=n(0),c=n(19);t.persistV1={storeInState(e,t){return o(this,void 0,void 0,(function*(){e.globalState.update("TOTP",t),e.globalState.update(i.STORE_VER_KEY,1)}))},loadFromState(e){return o(this,void 0,void 0,(function*(){return e.globalState.get("TOTP",[])}))},backup(e,t){return o(this,void 0,void 0,(function*(){const e=yield r.askForEncryptionPassword();if(void 0===e)throw new Error("passphrase dialog aborted");return""===e?JSON.stringify({cleartext:t}):JSON.stringify({encrypted:c.encode(JSON.stringify(t),e)})}))},restore(e,t){return o(this,void 0,void 0,(function*(){let e;const{cleartext:n,encrypted:o}=JSON.parse(t),i=[];if(void 0!==n&&i.push(...n),void 0!==o){if(e=yield a.window.showInputBox({prompt:"Enter password used for encryption",password:!0}),!e)throw new Error("No passphrase was supplied");i.push(...JSON.parse(c.decode(o,e)))}return i}))}}},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(0);t.askForEncryptionPassword=()=>o(void 0,void 0,void 0,(function*(){return yield i.window.showInputBox({prompt:"Enter encryption password",password:!0,placeHolder:"Leave this empty if you don't want to encrypt (UNSAFE)"})}))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(11);t.encode=(e,t)=>{const n=o.scryptSync(t,"salt",24),i=Buffer.alloc(16,0),r=o.createCipheriv("aes-192-cbc",n,i);let a=r.update(e,"utf8","hex");return a+=r.final("hex"),a},t.decode=(e,t)=>{const n=o.scryptSync(t,"salt",24),i=Buffer.alloc(16,0),r=o.createDecipheriv("aes-192-cbc",n,i);let a=r.update(e,"hex","utf8");return a+=r.final("utf8"),a}},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(21),r=n(2);t.totpNew=e=>o(void 0,void 0,void 0,(function*(){const t=yield i.addTOTP(e);r.addCode(e,t)}))},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(0),r=n(5);var a;!function(e){e.BASE_32="base32",e.OTPAUTH_URI="otpauth:// TOTP key"}(a||(a={}));const c=e=>void 0===e.encoding?u:void 0===e.key?p:void 0===e.T0||void 0===e.TX||void 0===e.nDigits?!0===e.needCustomParams?f:s:void 0===e.name?d:void 0===e.prefix?l:null,u=e=>o(void 0,void 0,void 0,(function*(){const t=[{label:a.BASE_32},{label:"hex"},{label:"ascii"},{label:a.OTPAUTH_URI}],n=yield i.window.showQuickPick(t,{placeHolder:"Which encoding does your seed have"});return Object.assign(Object.assign({},e),{encoding:null==n?void 0:n.label})})),s=e=>o(void 0,void 0,void 0,(function*(){const t=Symbol(),n=[{id:t,label:"Use default parameters",description:"T₀ = 0, 30 seconds interval, 6 digits",detail:"T₀ = 0, 30 seconds interval, 6 digits"},{label:"Custom parameters...",id:Symbol()}],o=yield i.window.showQuickPick(n,{placeHolder:"Optional parameters"});return void 0===o?e:o.id===t?Object.assign(Object.assign({},e),{T0:0,TX:30,nDigits:6,needCustomParams:!1}):Object.assign(Object.assign({},e),{needCustomParams:!0})})),d=e=>o(void 0,void 0,void 0,(function*(){const t=yield i.window.showInputBox({prompt:"Name of token",placeHolder:"Name of token",ignoreFocusOut:!0});return Object.assign(Object.assign({},e),{name:t})})),l=e=>o(void 0,void 0,void 0,(function*(){const t=yield i.window.showInputBox({prompt:"prefix of token",placeHolder:"prefix",ignoreFocusOut:!0});return Object.assign(Object.assign({},e),{prefix:t})})),f=e=>o(void 0,void 0,void 0,(function*(){const t=yield i.window.showInputBox({placeHolder:"Initial timestamp",value:"0",ignoreFocusOut:!0}),n=yield i.window.showInputBox({placeHolder:"Interval length (seconds)",value:"30",ignoreFocusOut:!0}),o=yield i.window.showInputBox({placeHolder:"Interval length (seconds)",value:"6",ignoreFocusOut:!0});return Object.assign(Object.assign({},e),{T0:t?parseInt(t,10):void 0,TX:n?parseInt(n,10):void 0,nDigits:o?parseInt(o,10):void 0})})),p=e=>o(void 0,void 0,void 0,(function*(){const t=t=>{switch(e.encoding){case a.BASE_32:return r.base32decode(t.toUpperCase());case a.OTPAUTH_URI:throw new Error("No decoder");case"hex":const e=/^[0-9a-h]+$/i.test(t),n=t.length%2==0;if(!e)throw new Error("Check that all characters are in 0-9,a-h range (case insensitive)");if(!n)throw new Error("Input length is uneven");return Buffer.from(t,"hex");case"ascii":const o=Buffer.from(t,"ascii");if(o.toString("ascii")!==t)throw new Error("Not all characters are in ascii range");return o;default:throw new Error("Encoding is undefined")}},n=yield i.window.showInputBox({prompt:"Paste your code",placeHolder:(()=>{if(e.encoding===a.OTPAUTH_URI)return"otpauth://"})(),ignoreFocusOut:!0,validateInput:e=>{try{t(e)}catch(e){return e.message}}});if(void 0!==n)return Object.assign(Object.assign({},e),{key:t(n)});throw new Error("Key is undefined")}));t.addTOTP=function(e){return o(this,void 0,void 0,(function*(){const e=yield function(){return o(this,void 0,void 0,(function*(){let e={};for(;void 0===(t=e).T0||void 0===t.TX||void 0===t.encoding||void 0===t.key||void 0===t.nDigits||void 0===t.name||void 0===t.prefix||void 0===t.needCustomParams;){const t=c(e);if(null===t)throw new Error("no steps");e=yield t(e)}var t;return e}))}(),t={name:e.name,secret:e.key.toString("hex"),type:"hex",prefix:e.prefix,T0:e.T0,TX:1e3*e.TX,nDigits:e.nDigits};return i.window.showInformationMessage(`Creating Application Service '${e.name}'`),t}))}},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(0),r=n(2),a=n(3),c=n(1);t.pickForEdit=e=>o(void 0,void 0,void 0,(function*(){return yield new Promise((t,n)=>{const o=[],r=()=>o.forEach(e=>e.dispose()),a=e.map(e=>({code:e,label:e.name})),c=i.window.createQuickPick();o.push(c),c.title="Select item to edit",c.items=a,o.push(c.onDidChangeSelection(e=>{const n=e[0].code;t({button:!1,data:n}),r()}),c.onDidHide(()=>{r(),n()})),c.show()})})),t.deleteRoutine=(e,t)=>o(void 0,void 0,void 0,(function*(){(yield i.window.showInputBox({placeHolder:`Please type "${t.name}" to confirm deletion`,prompt:"Before deleting this account, make sure that you have other means of generating codes for it"}))===t.name&&r.deleteCode(e,t.name)})),t.renameRoutine=(e,t)=>o(void 0,void 0,void 0,(function*(){const n=yield i.window.showInputBox({prompt:"Enter new name for "+t.name,value:t.name});void 0!==n&&r.replaceCode(e,t.name,Object.assign(Object.assign({},t),{name:n}))})),t.totpEdit=e=>o(void 0,void 0,void 0,(function*(){try{const n=yield c.auto.loadFromState(e),o=yield t.pickForEdit(n);if(o.button)return;const r=o.data,u={label:"Rename"},s={label:"Delete"},d=yield i.window.showQuickPick([u,s]);if(!d)return;d===u&&(yield t.renameRoutine(e,r)),d===s&&(yield t.deleteRoutine(e,r)),yield i.commands.executeCommand(a.Command.PICK)}catch(e){}}))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(0),i=n(3);t.makeStatusBarItem=()=>{const e=o.window.createStatusBarItem(o.StatusBarAlignment.Right,100);return e.show(),e.text="$(key)",e.command=i.Command.PICK,e}},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(0),r=n(1);t.totpBackup=e=>o(void 0,void 0,void 0,(function*(){try{const t=yield r.auto.loadFromState(e),n=yield r.auto.backup(e,t),o=yield i.workspace.openTextDocument({content:n});i.window.showTextDocument(o),i.window.showInformationMessage("Save this document somewhere and don't forge the passphrase!")}catch(e){}}))},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{u(o.next(e))}catch(e){r(e)}}function c(e){try{u(o.throw(e))}catch(e){r(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=n(0),r=n(2),a=n(1);t.totpRestore=e=>o(void 0,void 0,void 0,(function*(){try{const t=yield i.window.showOpenDialog({openLabel:"Restore seeds",canSelectMany:!1,canSelectFiles:!0});if(!t)return;const n=(yield i.workspace.fs.readFile(t[0])).toString(),o=yield a.auto.restore(e,n);0!==o.length&&(r.merge(e,o),i.window.showInformationMessage(o.length+" passwords have been imported"))}catch(e){i.window.showErrorMessage("An error occured during decryption: \n"+e.message)}}))}]);
//# sourceMappingURL=extension.js.map