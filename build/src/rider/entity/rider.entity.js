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
exports.Rider = void 0;
var orders_entity_1 = require("../../orders/entity/orders.entity");
var typeorm_1 = require("typeorm");
var typeorm_2 = require("typeorm");
var uuid_1 = require("uuid");
var generatedUuid = (0, uuid_1.v4)();
var code = generatedUuid.slice(0, 5);
var Rider = /** @class */ (function () {
    function Rider() {
        this.ref_code = code;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        __metadata("design:type", String)
    ], Rider.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Rider.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '', unique: true }),
        __metadata("design:type", String)
    ], Rider.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Rider.prototype, "first_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Rider.prototype, "last_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: 0 }),
        __metadata("design:type", Number)
    ], Rider.prototype, "otp_token", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '', unique: true }),
        __metadata("design:type", String)
    ], Rider.prototype, "ref_code", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Rider.prototype, "ref_by", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
        __metadata("design:type", Array)
    ], Rider.prototype, "referrals", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
        __metadata("design:type", Array)
    ], Rider.prototype, "notifications", void 0);
    __decorate([
        (0, typeorm_2.DeleteDateColumn)({ nullable: true }),
        __metadata("design:type", Date)
    ], Rider.prototype, "deletedAt", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return orders_entity_1.Order; }, function (order) { return order.rider; }),
        __metadata("design:type", Array)
    ], Rider.prototype, "order", void 0);
    Rider = __decorate([
        (0, typeorm_1.Entity)()
    ], Rider);
    return Rider;
}());
exports.Rider = Rider;
//# sourceMappingURL=rider.entity.js.map