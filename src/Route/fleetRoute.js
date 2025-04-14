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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../configs/db");
const fleetrouter = (0, express_1.Router)();
fleetrouter.get("/analytics", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalEvtols = yield db_1.db.evtol.count();
        const avgBattery = yield db_1.db.evtol.aggregate({ _avg: { batteryCapacity: true } });
        const totalDeliveries = yield db_1.db.delivery.count();
        res.json({
            totalEvtols,
            avgBattery: avgBattery._avg.batteryCapacity || 0,
            totalDeliveries,
        });
    }
    catch (error) {
        next(error);
    }
}));
fleetrouter.get("/active", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activeEvtols = yield db_1.db.evtol.findMany({
            where: {
                NOT: { state: "IDLE" }, // Exclude idle eVTOLs
            },
            select: {
                serialNumber: true,
                state: true,
                batteryCapacity: true,
                latitude: true,
                longitude: true,
            },
        });
        res.json({ activeEvtols });
    }
    catch (error) {
        next(error);
    }
}));
fleetrouter.get("/battery", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const evtols = yield db_1.db.evtol.findMany({
            select: { serialNumber: true, batteryCapacity: true, latitude: true, longitude: true }
        });
        res.json({ evtols });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = fleetrouter;
