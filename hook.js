//this file is a little example of how to use injecting ability
//to hook a function and change its behavior
//in this case we hook the function that is responsible for the decryption of the license
//and we change the behavior to return a valid license
// JUST FOR LEARNING PURPOSES, DON'T USE THIS TO CRACK SOFTWARE
//Adding hook
const crypto = require("crypto");
const pubdec = crypto["publicDecrypt"];
delete crypto["publicDecrypt"];
let fingerprint, email, uuid, license, computerInfo = "";
let License = ""
crypto.publicDecrypt = function (key, buffer) {
    log("PubDec Key:" + key);
    log("buf: " + buffer.toString('base64'));
    if (buffer.slice(0, 26).compare(Buffer.from("CRACKED_BY_DIAMOND_HUNTERS")) == 0) {
        License = buffer.toString('base64');
        let ret = buffer.toString().replace("CRACKED_BY_DIAMOND_HUNTERS", "");
        log("backdoor data,return : " + ret);
        return Buffer.from(ret);
    }
    return pubdec(key, buffer);
};

const fetch = require("electron-fetch")
fetch_bak = fetch['default'];
	@@ -42,31 +30,6 @@ fetch.default = async function fetch(url, options) {
        ret = await data.buffer();
        log('[fetch]Ret ' + ret.toString());

        ret = Buffer.from('{"code":0,"retry":true,"msg":"' + Buffer.from("CRACKED_BY_DIAMOND_HUNTERS" + JSON.stringify(
            {
                "fingerprint": fingerprint,
                "email": email,
                "license": license,
                "type": ""
            })).toString('base64') + '"}');
        log("replace ret: " + ret.toString());
        data.text = () => {
            return new Promise((resolve, reject) => {
                resolve(ret.toString());
            });
        };
        data.json = () => {
            return new Promise((resolve, reject) => {
                resolve(JSON.parse(ret.toString()));
            });
        };
    }
    if (url.indexOf('api/client/renew') != -1) {
        ret = await data.buffer();
        log('[fetch]Ret ' + ret.toString());

        ret = Buffer.from('{"success":true,"code":0,"retry":true,"msg":"' + License + '"}');
        log("replace ret: " + ret.toString());
        data.text = () => {
            return new Promise((resolve, reject) => {
                resolve(ret.toString());
	@@ -78,6 +41,7 @@ fetch.default = async function fetch(url, options) {
            });
        };
    }
    return new Promise((resolve, reject) => {
        resolve(data);
    });
}
http = require("http")
function log(str) {
    http.get('http://127.0.0.1:3000/log?str=' + str, res => {
    }).on('error', err => {
        console.log('Error: ', err.message);
    });
}
log = console.log;
log('Hook Init')
var Module = require('module');
var originalRequire = Module.prototype.require;
Module.prototype.require = function () {
    log('Require ' + arguments[0])
    if (arguments[0] == 'crypto') {
        log('Hooking crypto');
        return crypto;
    }
    if (arguments[0] == 'electron-fetch') {
        log('Hooking electron-fetch');
        return fetch;
    }
    return originalRequire.apply(this, arguments);
};
console.log = log
let validator = {
    set: function (target, key, value) {
        if (key === 'log') {
            log('console.log override blocked');
            return;
        }
        target[key] = value;
    }
}
let proxy = new Proxy(console, validator);
console = proxy
module.exports = fetch
//hook finished
