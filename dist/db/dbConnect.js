"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});
const UserModel = mongoose_1.default.model('User', userSchema);
const cardSchema = new mongoose_1.Schema({
    idNums: { type: String, required: true },
    bal: { type: Number, required: true },
    stat: { type: String, required: true },
});
const CardModel = mongoose_1.default.model('Card', cardSchema);
// express app
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        // use mongoose to connect this app to our database on MongoDB using the DB_URL (connection string)
        try {
            yield mongoose_1.default.connect(process.env.DB_URL, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            });
            console.log('Successfully connected to MongoDB Atlas!');
        }
        catch (error) {
            console.log('Unable to connect to MongoDB Atlas!');
            console.error(error);
        }
    });
}
// Example route to fetch data from the "users" collection
app.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserModel.find();
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// Example route to fetch data from the "cards" collection
app.get('/card', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cards = yield CardModel.find();
        res.json(cards);
    }
    catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.default = dbConnect;
