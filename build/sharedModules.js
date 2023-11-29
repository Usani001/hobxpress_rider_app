"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedModules = void 0;
var orders_module_1 = require("./src/orders/orders.module");
var rider_module_1 = require("./src/rider/rider.module");
var users_module_1 = require("./src/users/users.module");
exports.sharedModules = [users_module_1.UsersModule, orders_module_1.OrdersModule, rider_module_1.RiderModule];
//# sourceMappingURL=sharedModules.js.map