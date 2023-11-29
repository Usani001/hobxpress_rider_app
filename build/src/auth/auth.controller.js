"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.autheObj = exports.autheoObj = void 0;
var common_1 = require("@nestjs/common");
var auth_service_1 = require("./auth.service");
var autheoObj = /** @class */ (function () {
    function autheoObj() {
    }
    return autheoObj;
}());
exports.autheoObj = autheoObj;
var autheObj = /** @class */ (function () {
    function autheObj() {
    }
    return autheObj;
}());
exports.autheObj = autheObj;
var AuthController = /** @class */ (function () {
    function AuthController(authService) {
        this.authService = authService;
    }
    AuthController.prototype.verify = function (data) {
        return this.authService.verifyOTP(data);
    };
    AuthController.prototype.sendOTP = function (data) {
        return this.authService.sendOTP(data);
    };
    AuthController.prototype.sendRiderOTP = function (data) {
        return this.authService.sendRiderOTP(data);
    };
    AuthController.prototype.verifyRider = function (data) {
        return this.authService.verifyRiderOTP(data);
    };
    __decorate([
        (0, common_1.Get)('verifyOtp'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [autheoObj]),
        __metadata("design:returntype", void 0)
    ], AuthController.prototype, "verify", null);
    __decorate([
        (0, common_1.Get)('sendOtp'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [autheObj]),
        __metadata("design:returntype", void 0)
    ], AuthController.prototype, "sendOTP", null);
    __decorate([
        (0, common_1.Get)('sendRiderOtp'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [autheObj]),
        __metadata("design:returntype", void 0)
    ], AuthController.prototype, "sendRiderOTP", null);
    __decorate([
        (0, common_1.Get)('verifyRiderOtp'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [autheoObj]),
        __metadata("design:returntype", void 0)
    ], AuthController.prototype, "verifyRider", null);
    AuthController = __decorate([
        (0, common_1.Controller)('Auth'),
        __metadata("design:paramtypes", [auth_service_1.AuthService])
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map