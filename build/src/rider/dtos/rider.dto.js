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
exports.CreateUserResponseDto = exports.RiderDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var rider_entity_1 = require("../entity/rider.entity");
var RiderDto = /** @class */ (function (_super) {
    __extends(RiderDto, _super);
    function RiderDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RiderDto;
}((0, swagger_1.OmitType)(rider_entity_1.Rider, [
    'ref_code',
    'referrals',
    'ref_by',
    'id',
    'otp_token',
    'deletedAt',
])));
exports.RiderDto = RiderDto;
var CreateUserResponseDto = /** @class */ (function () {
    function CreateUserResponseDto() {
    }
    return CreateUserResponseDto;
}());
exports.CreateUserResponseDto = CreateUserResponseDto;
//# sourceMappingURL=rider.dto.js.map