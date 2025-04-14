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
exports.setupWebSocket = setupWebSocket;
const battery_impl_1 = require("./battery.impl"); // Ensure correct path
const db_1 = require("../../configs/db");
function setupWebSocket(io) {
    io.on("connection", (socket) => {
        console.log("✅ Client connected to WebSocket");
        socket.on("updateLocation", (data) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { serialNumber, latitude, longitude } = data;
                const evtol = yield db_1.db.evtol.findUnique({ where: { serialNumber } });
                if (!evtol) {
                    console.error(`❌ eVTOL with serial number ${serialNumber} not found.`);
                    return;
                }
                const previousLat = (_a = evtol.latitude) !== null && _a !== void 0 ? _a : latitude;
                const previousLon = (_b = evtol.longitude) !== null && _b !== void 0 ? _b : longitude;
                yield (0, battery_impl_1.updateBatteryLevel)(serialNumber, latitude, longitude);
                const updatedEvtol = yield db_1.db.evtol.findUnique({ where: { serialNumber } });
                // Calculate distance traveled
                const distanceTraveled = (0, battery_impl_1.calculateDistance)(previousLat, previousLon, latitude, longitude);
                io.emit("batteryUpdate", {
                    serialNumber: updatedEvtol === null || updatedEvtol === void 0 ? void 0 : updatedEvtol.serialNumber,
                    batteryLevel: updatedEvtol === null || updatedEvtol === void 0 ? void 0 : updatedEvtol.batteryCapacity,
                    latitude: updatedEvtol === null || updatedEvtol === void 0 ? void 0 : updatedEvtol.latitude,
                    longitude: updatedEvtol === null || updatedEvtol === void 0 ? void 0 : updatedEvtol.longitude,
                    distanceTraveled: distanceTraveled.toFixed(2), // Send distance
                });
                console.log(`🚁 ${serialNumber} traveled ${distanceTraveled.toFixed(2)} km, Battery: ${updatedEvtol === null || updatedEvtol === void 0 ? void 0 : updatedEvtol.batteryCapacity}%`);
            }
            catch (error) {
                console.error("❌ Error updating location:", error);
            }
        }));
        socket.on("requestFleetData", () => __awaiter(this, void 0, void 0, function* () {
            try {
                const evtols = yield db_1.db.evtol.findMany({
                    where: { state: { not: "IDLE" } }, // ✅ Adjust condition as needed
                    select: {
                        serialNumber: true,
                        batteryCapacity: true,
                        latitude: true,
                        longitude: true,
                        state: true, // ✅ Use "state" instead of "status"
                        updatedAt: true,
                    },
                });
                socket.emit("fleetUpdate", evtols); // Only to requesting admin
            }
            catch (error) {
                console.error("❌ Error fetching fleet data:", error);
            }
        }));
        socket.on("disconnect", () => {
            console.log("⚠️ Client disconnected from WebSocket");
        });
    });
}
