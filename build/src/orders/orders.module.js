"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
var common_1 = require("@nestjs/common");
var orders_service_1 = require("./orders.service");
var orders_controller_1 = require("./orders.controller");
var typeorm_1 = require("@nestjs/typeorm");
var orders_entity_1 = require("./entity/orders.entity");
var auth_module_1 = require("../auth/auth.module");
var OrdersModule = /** @class */ (function () {
    function OrdersModule() {
    }
    OrdersModule = __decorate([
        (0, common_1.Module)({
            controllers: [orders_controller_1.OrdersController],
            providers: [orders_service_1.OrdersService],
            imports: [typeorm_1.TypeOrmModule.forFeature([orders_entity_1.Order]), auth_module_1.AuthModule],
            exports: [orders_service_1.OrdersService],
        })
    ], OrdersModule);
    return OrdersModule;
}());
exports.OrdersModule = OrdersModule;
//# sourceMappingURL=orders.module.js.map