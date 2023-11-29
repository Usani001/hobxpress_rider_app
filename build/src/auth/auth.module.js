"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var auth_service_1 = require("./auth.service");
var jwt_1 = require("@nestjs/jwt");
var auth_controller_1 = require("./auth.controller");
var user_entity_1 = require("../users/entity/user.entity");
var typeorm_1 = require("@nestjs/typeorm");
var rider_entity_1 = require("../rider/entity/rider.entity");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            providers: [auth_service_1.AuthService],
            exports: [auth_service_1.AuthService],
            controllers: [auth_controller_1.AuthController],
            imports: [
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, rider_entity_1.Rider]),
                jwt_1.JwtModule.register({
                    global: true,
                    secret: process.env.DEFAULT_SECRET,
                    signOptions: { expiresIn: '60s' },
                }),
            ],
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map