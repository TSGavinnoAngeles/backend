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
exports.fetchDatafromDatabase = void 0;
const dbConnect_1 = __importDefault(require("./dbConnect"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
function fetchDatafromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, dbConnect_1.default)();
        const UserSchema = new mongoose_1.default.Schema({
            email: {
                type: String,
            },
            password: {
                type: String,
            },
        });
        const Users = mongoose_1.default.model('Users', UserSchema);
        try {
            // Fetch data from the database (replace {} with your actual query)
            const data = yield Users.find({ email: "jerma@admin.com" });
            // Output the retrieved data
            console.log('Data from the database:', data);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            // Close the database connection
            mongoose_1.default.connection.close();
        }
    });
}
exports.fetchDatafromDatabase = fetchDatafromDatabase;
