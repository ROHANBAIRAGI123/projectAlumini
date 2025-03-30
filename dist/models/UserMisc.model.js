"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class UserMisc {
    // Create a new user
    static create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("insert into User_Misc set ?", [
                userData,
            ]);
            return result;
        });
    }
    // Get all users
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("select branch,achievement from User_Misc");
            return result;
        });
    }
    // find by id
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("select branch,achievement from User_Misc where id = ?", [id]);
            return result;
        });
    }
    // update user
    static updateUser(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("update User_Misc set ? where id = ?", [
                userData,
                id,
            ]);
            return result;
        });
    }
}
exports.default = UserMisc;
