"use strict";
/**
 * This module writes the contracts to the global CDN.
 * It uploads the abi name, and smartcontract name, and smartcontract address in each network.
 * It doesn't update them.
 * For updating the config modules, please use the /src/cdn-config/write.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.connectCdnByEnv = exports.connectCdn = exports.setSmartcontract = void 0;
var alicloud_1 = require("./alicloud");
var seascape_cdn_config_1 = require("./seascape-cdn-config");
var seascape_abi_config_1 = require("./seascape-abi-config");
var seascape_abi_1 = require("./seascape-abi");
var __1 = require("..");
var setSmartcontract = function (projectPath, smartcontractPath, smartcontract) { return __awaiter(void 0, void 0, void 0, function () {
    var client, abiConfig, seascapeCdnConfig;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, alicloud_1.connectionByEnvironment)(projectPath.temp)];
            case 1:
                client = _a.sent();
                if (client === undefined) {
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, seascape_abi_config_1["default"].New(projectPath.temp, smartcontract.name)];
            case 2:
                abiConfig = _a.sent();
                return [4 /*yield*/, abiConfig.incrementVersion(client)];
            case 3:
                _a.sent();
                return [4 /*yield*/, seascape_abi_1["default"].SetAbi(client, abiConfig, smartcontract.abi)];
            case 4:
                _a.sent();
                smartcontract.abi = __1.CdnUtil.cdnReadAbiUrl(projectPath.temp, abiConfig);
                return [4 /*yield*/, seascape_cdn_config_1["default"].New(projectPath)];
            case 5:
                seascapeCdnConfig = _a.sent();
                return [4 /*yield*/, seascapeCdnConfig.setSmartcontract(client, smartcontractPath, smartcontract)];
            case 6: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.setSmartcontract = setSmartcontract;
exports.connectCdn = alicloud_1.connection;
exports.connectCdnByEnv = alicloud_1.connectionByEnvironment;
//# sourceMappingURL=write.js.map