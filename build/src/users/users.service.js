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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("typeorm");
var user_entity_1 = require("./entity/user.entity");
var auth_service_1 = require("../auth/auth.service");
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var UsersService = /** @class */ (function () {
    function UsersService(userConnection, authService) {
        this.userConnection = userConnection;
        this.authService = authService;
    }
    UsersService.prototype.create = function (createUserDto, query) {
        return __awaiter(this, void 0, void 0, function () {
            var ref_code, refcodeUser, user, _a, newData, error_1, user, _b, newData, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!query) return [3 /*break*/, 11];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 9, , 10]);
                        ref_code = query.ref_code;
                        return [4 /*yield*/, this.userConnection.findOneBy({
                                ref_code: ref_code,
                            })];
                    case 2:
                        refcodeUser = _c.sent();
                        return [4 /*yield*/, this.userConnection.findOneBy({
                                email: createUserDto.email,
                            })];
                    case 3:
                        user = _c.sent();
                        if (!user) return [3 /*break*/, 7];
                        _a = createUserDto;
                        return [4 /*yield*/, this.authService.encrypt(createUserDto.password)];
                    case 4:
                        _a.password = _c.sent();
                        createUserDto['ref_by'] = refcodeUser.email;
                        refcodeUser.referrals.push(createUserDto.email);
                        user.first_name = createUserDto.first_name;
                        user.last_name = createUserDto.last_name;
                        user.password = createUserDto.password;
                        console.log(user);
                        return [4 /*yield*/, this.userConnection.save(user)];
                    case 5:
                        newData = _c.sent();
                        return [4 /*yield*/, this.userConnection.save(refcodeUser)];
                    case 6:
                        _c.sent();
                        console.log(newData);
                        return [2 /*return*/, {
                                status: true,
                                message: 'user Created successfully',
                            }];
                    case 7: return [2 /*return*/, {
                            status: false,
                            data: 'Create a user first',
                        }];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _c.sent();
                        return [2 /*return*/, {
                                data: error_1,
                                status: false,
                                message: 'error in creating data',
                            }];
                    case 10: return [3 /*break*/, 18];
                    case 11:
                        _c.trys.push([11, 17, , 18]);
                        return [4 /*yield*/, this.userConnection.findOneBy({
                                email: createUserDto.email,
                            })];
                    case 12:
                        user = _c.sent();
                        if (!user) return [3 /*break*/, 15];
                        _b = createUserDto;
                        return [4 /*yield*/, this.authService.encrypt(createUserDto.password)];
                    case 13:
                        _b.password = _c.sent();
                        // createUserDto = user
                        user.first_name = createUserDto.first_name;
                        user.last_name = createUserDto.last_name;
                        user.password = createUserDto.password;
                        console.log(user);
                        return [4 /*yield*/, this.userConnection.save(user)];
                    case 14:
                        newData = _c.sent();
                        console.log(newData);
                        return [2 /*return*/, {
                                status: true,
                                message: 'user Created successfully',
                            }];
                    case 15: return [2 /*return*/, {
                            status: false,
                            data: 'Create a user first',
                        }];
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        error_2 = _c.sent();
                        return [2 /*return*/, {
                                data: error_2,
                                status: false,
                                message: 'error in creating data',
                            }];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.findUser = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var tokUser, getUser, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.authService.getLoggedInUser(req)];
                    case 1:
                        tokUser = _a.sent();
                        return [4 /*yield*/, this.userConnection.findOne({
                                where: { id: tokUser.data.id },
                            })];
                    case 2:
                        getUser = _a.sent();
                        if (!getUser || getUser.deletedAt) {
                            return [2 /*return*/, { status: false, message: 'User not found' }];
                        }
                        return [2 /*return*/, { status: true, message: 'user found', data: getUser }];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, { status: true, message: 'error', data: error_3 }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.login = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var data, passwordIsMatch, password, ref_by, ref_code, referrals, otp_token, Filterdata, token, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.userConnection.findOne({
                                where: { email: body.email },
                            })];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, bcrypt.compare(body.password, (data === null || data === void 0 ? void 0 : data.password) || '')];
                    case 2:
                        passwordIsMatch = _a.sent();
                        if (data && passwordIsMatch) {
                            password = data.password, ref_by = data.ref_by, ref_code = data.ref_code, referrals = data.referrals, otp_token = data.otp_token, Filterdata = __rest(data, ["password", "ref_by", "ref_code", "referrals", "otp_token"]);
                            token = jwt.sign({
                                data: Filterdata,
                            }, process.env.DEFAULT_SECRET, { expiresIn: '24h' });
                            //filterout password,
                            return [2 /*return*/, {
                                    status: true,
                                    token: token,
                                    data: Filterdata,
                                    message: 'login successfully',
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    status: false,
                                    message: 'login failed, either email or password is wrong',
                                }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.log(error_4);
                        return [2 /*return*/, {
                                status: false,
                                message: 'login failed',
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //update user email first lastname number and password
    UsersService.prototype.update = function (body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var tokUser, getUser, password, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.authService.getLoggedInUser(req)];
                    case 1:
                        tokUser = _a.sent();
                        return [4 /*yield*/, this.userConnection.findOne({
                                where: { id: tokUser.data.id },
                            })];
                    case 2:
                        getUser = _a.sent();
                        if (body.first_name) {
                            getUser.first_name = body.first_name;
                        }
                        if (body.last_name) {
                            getUser.last_name = body.last_name;
                        }
                        if (!body.password) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.authService.encrypt(body.password)];
                    case 3:
                        password = _a.sent();
                        getUser.password = password;
                        _a.label = 4;
                    case 4:
                        if (body.email) {
                            getUser.email = body.email;
                        }
                        return [4 /*yield*/, this.userConnection.save(getUser)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, {
                                status: true,
                                message: 'User updated successfully',
                            }];
                    case 6:
                        error_5 = _a.sent();
                        return [2 /*return*/, {
                                status: true,
                                message: 'error updating user',
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    //update password , forgot passwod, set password to randomstring, send randstring to email
    UsersService.prototype.resetPassword = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var getUser, randomPass, password, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.userConnection.findOne({
                                where: { email: body.email },
                            })];
                    case 1:
                        getUser = _a.sent();
                        return [4 /*yield*/, this.authService.generateRandomString(10)];
                    case 2:
                        randomPass = _a.sent();
                        //send to user email
                        console.log(randomPass);
                        return [4 /*yield*/, this.authService.encrypt(randomPass)];
                    case 3:
                        password = _a.sent();
                        getUser.password = password;
                        return [4 /*yield*/, this.userConnection.save(getUser)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, { status: true, message: 'New password sent' }];
                    case 5:
                        error_6 = _a.sent();
                        return [2 /*return*/, { status: false, message: error_6 }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.remove = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var tokUser, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!req) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.authService.getLoggedInUser(req)];
                    case 1:
                        tokUser = _a.sent();
                        return [4 /*yield*/, this.userConnection.softDelete(tokUser.data.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                status: true,
                                message: 'deleted successfully',
                            }];
                    case 3:
                        if (!id) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.userConnection.softDelete(id)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, {
                                status: true,
                                message: 'deleted successfully',
                            }];
                    case 5: return [2 /*return*/, {
                            status: false,
                            message: 'error deleting',
                        }];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_7 = _a.sent();
                        return [2 /*return*/, {
                                status: false,
                                message: error_7,
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    var _a;
    UsersService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
        __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map