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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
var generatedUuid = (0, uuid_1.v4)();
var code = generatedUuid.slice(0, 5);
var User = /** @class */ (function () {
    function User() {
        this.ref_code = code;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        __metadata("design:type", String)
    ], User.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '', unique: true }),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], User.prototype, "first_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], User.prototype, "last_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: 0 }),
        __metadata("design:type", Number)
    ], User.prototype, "otp_token", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '', unique: true }),
        __metadata("design:type", String)
    ], User.prototype, "ref_code", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], User.prototype, "ref_by", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
        __metadata("design:type", Array)
    ], User.prototype, "referrals", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
        __metadata("design:type", Array)
    ], User.prototype, "notifications", void 0);
    __decorate([
        (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
        __metadata("design:type", Date)
    ], User.prototype, "deletedAt", void 0);
    User = __decorate([
        (0, typeorm_1.Entity)()
    ], User);
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.entity.js.map