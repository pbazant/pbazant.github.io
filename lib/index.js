(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "dialog_iot_dongle"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const did = require("dialog_iot_dongle");
    // export const d = did;
    document.getElementById('view').innerHTML = "blablabla";
    document.getElementById('view').addEventListener("click", () => {
        return did.dialog_wearable_service((...args) => {
            console.log(...args);
            const logstring = args.join(' ');
            const child = document.createElement('div');
            child.innerHTML = logstring;
            document.getElementById('view').appendChild(child);
        });
    });
    exports.d = did;
});
