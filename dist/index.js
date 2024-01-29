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
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const server_1 = __importDefault(require("./server"));
const stations_1 = require("./stations");
const dbConnect_1 = __importDefault(require("./db/dbConnect"));
const userModel_1 = __importDefault(require("./db/userModel"));
const cardModel_1 = __importDefault(require("./db/cardModel"));
const jwt = __importStar(require("jsonwebtoken"));
const secretKey = 'adljalgidalgaldkjahf10871395';
// import {  fetchDatafromDatabase as fetchMongo} from './db/index'
const PORT = process.env.PORT || 3000;
//import startServer from 'server';
//App Varaibles 
dotenv.config();
(0, dbConnect_1.default)();
//intializing the express app 
const app = (0, express_1.default)();
//using the dependancies
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/list-stations', (req, res) => {
    res.json([
        stations_1.stations
    ]).status(200);
});
app.get('/stations/get/:id', (req, res) => {
    const id = req.params['id'];
    const station = stations_1.stations.find((s) => s.id === Number(id));
    if (station) {
        res.send([
            station === null || station === void 0 ? void 0 : station.stationName
        ]).status(200);
    }
    else {
        res.status(500).send([
            "DNE"
        ]).status(200);
    }
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        else {
            const token = jwt.sign({
                userId: user._id,
            }, secretKey, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all users from the database
        const users = yield userModel_1.default.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        const usersData = users.map(user => ({
            _id: user._id,
            email: user.email,
            password: user.password,
        }));
        res.json(usersData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
app.get('/cards', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all users from the database
        const cards = yield cardModel_1.default.find();
        if (!cards || cards.length === 0) {
            return res.status(404).json({ message: 'No cards found' });
        }
        const cardsData = cards.map(card => ({
            bal: card.bal,
            idNums: card.idNums,
            stat: card.stat,
        }));
        res.json(cardsData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
app.patch('/cards/:idNums', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idNums } = req.params;
    const { updatedValue, isAddition } = req.body;
    try {
        const card = yield cardModel_1.default.findOne({ idNums });
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        let newBalance;
        if (isAddition) {
            newBalance = card.bal + updatedValue;
        }
        else {
            if (Number(card.bal) - updatedValue < 0) {
                return res.status(400).json({ error: 'Cannot deduct beyond current balance' });
            }
            newBalance = Number(card.bal) - updatedValue;
        }
        const updatedDocument = yield cardModel_1.default.findOneAndUpdate({ idNums: card.idNums }, { bal: newBalance }, { new: true });
        res.json(updatedDocument);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.delete('/delCards/:idNums', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idNums } = req.params;
    try {
        // Find the card by idNums and delete it
        const deletedCard = yield cardModel_1.default.findOneAndDelete({ idNums });
        if (!deletedCard) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json({ message: 'Card deleted successfully', deletedCard });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
app.post('/addcards', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idNums, bal, stat } = req.body;
    if (idNums === null || bal === null || stat === null) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
    else {
        try {
            // Create a new card document
            const newCard = yield cardModel_1.default.create({
                idNums,
                bal,
                stat,
            });
            res.json({ message: 'Card added successfully', newCard });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}));
app.get('/checkIdExists/:idNums', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idNums } = req.params;
    try {
        const existingCard = yield cardModel_1.default.findOne({ idNums });
        res.json({ exists: existingCard !== null });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
(0, server_1.default)(app);
