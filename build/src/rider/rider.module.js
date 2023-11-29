"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderModule = void 0;
var common_1 = require("@nestjs/common");
var rider_controller_1 = require("./rider.controller");
var rider_service_1 = require("./rider.service");
var typeorm_1 = require("@nestjs/typeorm");
var auth_module_1 = require("../auth/auth.module");
var rider_entity_1 = require("./entity/rider.entity");
var orders_module_1 = require("../orders/orders.module");
var orders_entity_1 = require("../orders/entity/orders.entity");
var RiderModule = /** @class */ (function () {
    function RiderModule() {
    }
    RiderModule = __decorate([
        (0, common_1.Module)({
            controllers: [rider_controller_1.RiderController],
            providers: [rider_service_1.RiderService],
            imports: [typeorm_1.TypeOrmModule.forFeature([rider_entity_1.Rider, orders_entity_1.Order]), auth_module_1.AuthModule, orders_module_1.OrdersModule],
            exports: [rider_service_1.RiderService],
        })
    ], RiderModule);
    return RiderModule;
}());
exports.RiderModule = RiderModule;
//# sourceMappingURL=rider.module.js.map