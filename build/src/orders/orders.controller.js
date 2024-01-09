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
exports.OrdersController = void 0;
var common_1 = require("@nestjs/common");
var orders_service_1 = require("./orders.service");
var createOrder_dto_1 = require("./dto/createOrder.dto");
var OrdersController = /** @class */ (function () {
    function OrdersController(orderService) {
        this.orderService = orderService;
    }
    OrdersController.prototype.create = function (body, req) {
        return this.orderService.create(body, req);
    };
    OrdersController.prototype.getOrder = function (body, req) {
        return this.orderService.findOrder(body, req);
    };
    __decorate([
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Req)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [createOrder_dto_1.CreateOrderDto, Object]),
        __metadata("design:returntype", void 0)
    ], OrdersController.prototype, "create", null);
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Req)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], OrdersController.prototype, "getOrder", null);
    OrdersController = __decorate([
        (0, common_1.Controller)('order'),
        __metadata("design:paramtypes", [orders_service_1.OrdersService])
    ], OrdersController);
    return OrdersController;
}());
exports.OrdersController = OrdersController;
//# sourceMappingURL=orders.controller.js.map