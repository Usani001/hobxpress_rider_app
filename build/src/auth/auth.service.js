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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var bcrypt = require("bcrypt");
var speakeasy = require("speakeasy");
var user_entity_1 = require("../users/entity/user.entity");
var typeorm_2 = require("typeorm");
var rider_entity_1 = require("../rider/entity/rider.entity");
var jwt = require('jsonwebtoken');
var AuthService = /** @class */ (function () {
    function AuthService(entityManager, userConnection, riderConnection) {
        this.entityManager = entityManager;
        this.userConnection = userConnection;
        this.riderConnection = riderConnection;
        this.saltOrRounds = Number(process.env.HASH_SALT);
    }
    AuthService.prototype.encrypt = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.hash(data, this.saltOrRounds)];
                    case 1:
                        hash = _a.sent();
                        return [2 /*return*/, hash];
                }
            });
        });
    };
    AuthService.prototype.sendOTP = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, OTP, newUser, last, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.userConnection.findOneBy({ email: data.email })];
                    case 1:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 4];
                        OTP = this.generateOtp2(process.env.OTP_SECRETS, data.email);
                        return [4 /*yield*/, this.userConnection.create()];
                    case 2:
                        newUser = _a.sent();
                        // Store OTP in the user's data or a temporary storage (e.g., a cache or session)
                        newUser.otp_token = OTP;
                        newUser.email = data.email;
                        return [4 /*yield*/, this.userConnection.save(newUser)];
                    case 3:
                        last = _a.sent();
                        // Send OTP to the user (e.g., via email or SMS)
                        console.log(last);
                        //send otp email
                        return [2 /*return*/, {
                                status: true,
                                message: 'OTP sent: ' + newUser.otp_token,
                            }];
                    case 4: return [2 /*return*/, {
                            status: false,
                            message: 'User already exists',
                        }];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                status: false,
                                data: error_1,
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.sendRiderOTP = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var rider, OTP, newRider, last, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.riderConnection.findOneBy({ email: data.email })];
                    case 1:
                        rider = _a.sent();
                        if (!!rider) return [3 /*break*/, 4];
                        OTP = this.generateOtp2(process.env.OTP_SECRETS, data.email);
                        return [4 /*yield*/, this.userConnection.create()];
                    case 2:
                        newRider = _a.sent();
                        // Store OTP in the user's data or a temporary storage (e.g., a cache or session)
                        newRider.otp_token = OTP;
                        newRider.email = data.email;
                        return [4 /*yield*/, this.riderConnection.save(newRider)];
                    case 3:
                        last = _a.sent();
                        // Send OTP to the user (e.g., via email or SMS)
                        console.log(last);
                        //send otp email
                        return [2 /*return*/, {
                                status: true,
                                message: 'OTP sent: ' + newRider.otp_token,
                            }];
                    case 4: return [2 /*return*/, {
                            status: false,
                            message: 'Rider already exists',
                        }];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        return [2 /*return*/, {
                                status: false,
                                data: error_2,
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.resendOTP = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, OTP, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.userConnection.findOneBy({ email: data.email })];
                    case 1:
                        user = _a.sent();
                        OTP = this.generateOtp2(process.env.OTP_SECRETS, data.email);
                        user.otp_token = OTP;
                        return [4 /*yield*/, this.userConnection.save(user)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                status: true,
                                message: 'OTP sent: ' + user.otp_token,
                            }];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, {
                                status: false,
                                data: error_3,
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.verifyOTP = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userConnection.findOne({
                                where: { email: data.email },
                            })];
                    case 1:
                        user = _a.sent();
                        if (user && user.otp_token === data.otp) {
                            return [2 /*return*/, {
                                    status: true,
                                    message: 'OTP is valid',
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    status: false,
                                    message: 'Invalid OTP',
                                }];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, {
                                status: false,
                                data: error_4,
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.verifyRiderOTP = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var rider, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.riderConnection.findOne({
                                where: { email: data.email },
                            })];
                    case 1:
                        rider = _a.sent();
                        if (rider && rider.otp_token === data.otp) {
                            return [2 /*return*/, {
                                    status: true,
                                    message: 'OTP is valid',
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    status: false,
                                    message: 'Invalid OTP',
                                }];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, {
                                status: false,
                                data: error_5,
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //   generateOtp() {
    //     var digits = '0123456789';
    //     let OTP = '';
    //     for (let i = 0; i < 4; i++) {
    //       OTP += digits[Math.floor(Math.random() * 10)];
    //     }
    //     return OTP;
    //   }
    AuthService.prototype.generateOtp2 = function (secret, email) {
        var otp = speakeasy.totp({
            secret: secret + email,
            encoding: 'base32',
            step: 600,
            digits: 4,
        });
        return otp;
    };
    AuthService.prototype.generateRandomString = function (length) {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }
        return randomString;
    };
    // verifyOtp(secret: string, enteredOtp: string, email: string): boolean {
    //   const otp = this.generateOtp2(secret, email);
    //   console.log(otp);
    //   return otp === enteredOtp;
    // }
    AuthService.prototype.extractUserFromToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded;
            return __generator(this, function (_a) {
                decoded = jwt.verify(token, process.env.DEFAULT_SECRET);
                return [2 /*return*/, decoded];
            });
        });
    };
    AuthService.prototype.extractTokenFromHeader = function (request) {
        console.log(request.headers.authorization);
        var token = request.headers.authorization.substring(7, request.headers.authorization.length);
        // console.log({
        //   data: token,
        // });
        return token;
    };
    AuthService.prototype.getLoggedInUser = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var token, decoded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.extractTokenFromHeader(request)];
                    case 1:
                        token = _a.sent();
                        decoded = jwt.verify(token, process.env.DEFAULT_SECRET);
                        return [2 /*return*/, decoded];
                }
            });
        });
    };
    AuthService = __decorate([
        (0, common_1.Injectable)(),
        __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
        __param(2, (0, typeorm_1.InjectRepository)(rider_entity_1.Rider)),
        __metadata("design:paramtypes", [typeorm_2.EntityManager,
            typeorm_2.Repository,
            typeorm_2.Repository])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map