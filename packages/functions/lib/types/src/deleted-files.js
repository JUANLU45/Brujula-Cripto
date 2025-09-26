"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryStatus = exports.TimeRange = exports.OperatingSystem = exports.WalletFileType = void 0;
/**
 * Tipos TypeScript centralizados para herramienta de archivos eliminados
 * Siguiendo PROYEC_PARTE1.MD - Centralización absoluta de tipos
 */
var WalletFileType;
(function (WalletFileType) {
    WalletFileType["BITCOIN_CORE"] = "bitcoin-core";
    WalletFileType["ETHEREUM_KEYSTORE"] = "ethereum-keystore";
    WalletFileType["ELECTRUM"] = "electrum";
    WalletFileType["METAMASK"] = "metamask";
    WalletFileType["EXODUS"] = "exodus";
    WalletFileType["LEDGER_LIVE"] = "ledger-live";
    WalletFileType["TREZOR"] = "trezor";
    WalletFileType["MYETHERWALLET"] = "myetherwallet";
    WalletFileType["OTHER"] = "other";
})(WalletFileType || (exports.WalletFileType = WalletFileType = {}));
var OperatingSystem;
(function (OperatingSystem) {
    OperatingSystem["WINDOWS"] = "windows";
    OperatingSystem["MACOS"] = "macos";
    OperatingSystem["LINUX"] = "linux";
    OperatingSystem["ANDROID"] = "android";
    OperatingSystem["IOS"] = "ios";
})(OperatingSystem || (exports.OperatingSystem = OperatingSystem = {}));
var TimeRange;
(function (TimeRange) {
    TimeRange["UNDER_24H"] = "under-24h";
    TimeRange["UNDER_7D"] = "under-7d";
    TimeRange["UNDER_30D"] = "under-30d";
    TimeRange["OVER_30D"] = "over-30d";
})(TimeRange || (exports.TimeRange = TimeRange = {}));
var RecoveryStatus;
(function (RecoveryStatus) {
    RecoveryStatus["ANALYZING"] = "analyzing";
    RecoveryStatus["READY"] = "ready";
    RecoveryStatus["IN_PROGRESS"] = "in-progress";
    RecoveryStatus["SUCCESS"] = "success";
    RecoveryStatus["PARTIAL_SUCCESS"] = "partial-success";
    RecoveryStatus["FAILED"] = "failed";
    RecoveryStatus["NEEDS_PROFESSIONAL"] = "needs-professional";
})(RecoveryStatus || (exports.RecoveryStatus = RecoveryStatus = {}));
//# sourceMappingURL=deleted-files.js.map