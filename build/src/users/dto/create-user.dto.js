"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserResponseDto = exports.CreateUserDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var user_entity_1 = require("../entity/user.entity");
var CreateUserDto = /** @class */ (function (_super) {
    __extends(CreateUserDto, _super);
    function CreateUserDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CreateUserDto;
}((0, swagger_1.OmitType)(user_entity_1.User, [
    'ref_code',
    'referrals',
    'ref_by',
    'id',
    'otp_token',
    'deletedAt',
])));
exports.CreateUserDto = CreateUserDto;
var CreateUserResponseDto = /** @class */ (function () {
    function CreateUserResponseDto() {
    }
    return CreateUserResponseDto;
}());
exports.CreateUserResponseDto = CreateUserResponseDto;
//# sourceMappingURL=create-user.dto.js.map