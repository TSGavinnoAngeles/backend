"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CardSchema = new mongoose_1.default.Schema({
    idNums: {
        type: Number,
    },
    bal: {
        type: Number,
    },
    stat: {
        type: Boolean,
    },
});
const Cards = mongoose_1.default.model('cardUsers', CardSchema);
exports.default = Cards;
