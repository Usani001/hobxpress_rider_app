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
exports.Order = exports.orderType = void 0;
var rider_entity_1 = require("../../rider/entity/rider.entity");
var typeorm_1 = require("typeorm");
var orderType;
(function (orderType) {
    orderType["ACTIVE"] = "ACTIVE";
    orderType["COMPLETED"] = "COMPLETED";
    orderType["CANCELLED"] = "CANCELLED";
})(orderType = exports.orderType || (exports.orderType = {}));
var Order = /** @class */ (function () {
    function Order() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        __metadata("design:type", Number)
    ], Order.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Order.prototype, "user_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "pickup_add", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: null }),
        __metadata("design:type", String)
    ], Order.prototype, "pickup_schedule_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: null }),
        __metadata("design:type", String)
    ], Order.prototype, "pickup_schedule_time", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "delivery_add", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "recieverName", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "phoneNumber", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "recieverEmail", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "notes", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "itemName", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "itemSize", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "itemWeight", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "itemDescription", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: '' }),
        __metadata("design:type", String)
    ], Order.prototype, "delivery_description", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: orderType.ACTIVE }),
        __metadata("design:type", String)
    ], Order.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return rider_entity_1.Rider; }, function (rider) { return rider.order; }),
        __metadata("design:type", rider_entity_1.Rider)
    ], Order.prototype, "rider", void 0);
    Order = __decorate([
        (0, typeorm_1.Entity)()
    ], Order);
    return Order;
}());
exports.Order = Order;
//# sourceMappingURL=orders.entity.js.map