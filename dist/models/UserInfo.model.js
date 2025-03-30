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
class UserInfo {
    // Create a new user
    static create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("insert into User_Info set ?", [
                userData,
            ]);
            return result;
        });
    }
    // Get all users
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("select fname,lname,email,role,graduationYear,contact from User_Info");
            return result;
        });
    }
    // find by email
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("select fname,lname,email,role,graduationYear,contact from User_Info where email = ?", [email]);
            return result;
        });
    }
    // find by contact
    static findByContact(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("select fname,lname,email,role,graduationYear,contact from User_Info where contact = ?", [contact]);
            return result;
        });
    }
    // update user
    static updateUser(email, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("update User_Info set ? where email = ?", [userData, email]);
            return result;
        });
    }
    //delete user
    static deleteUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("delete from User_Info where email = ?", [
                email,
            ]);
            return result;
        });
    }
    // get user password by email
    static getUserPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query("select password from User_Info where email = ?", [email]);
            return result;
        });
    }
}
exports.default = UserInfo;
