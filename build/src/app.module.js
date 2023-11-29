"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var typeorm_1 = require("@nestjs/typeorm");
var config_1 = require("@nestjs/config");
var sharedModules_1 = require("../sharedModules");
var entitiesData_1 = require("../entitiesData");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.prototype.configure = function (consumer) { };
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: __spreadArray(__spreadArray([], sharedModules_1.sharedModules, true), [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                }),
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DBHOST,
                    port: 5432,
                    username: process.env.DBUSERNAME,
                    password: process.env.DBPASSWORD,
                    database: process.env.DATABASE,
                    ssl: false,
                    entities: __spreadArray([], entitiesData_1.sharedEntities, true),
                    synchronize: true,
                }),
            ], false),
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map