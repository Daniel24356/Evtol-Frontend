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
exports.updateBatteryLevel = updateBatteryLevel;
exports.calculateDistance = calculateDistance;
const db_1 = require("../../configs/db");
const customError_error_1 = require("../../exceptions/error/customError.error");
const __1 = require("../..");
const BATTERY_DRAIN_RATE = 0.2; // Example: 0.2% per km
const EXTRA_WEIGHT_DRAIN = 0.01; // Example: +1% battery drain per 10kg
const EMERGENCY_THRESHOLD = 10; // Trigger emergency landing at 10%
function updateBatteryLevel(serialNumber, newLat, newLon) {
    return __awaiter(this, void 0, void 0, function* () {
        const evtol = yield db_1.db.evtol.findUnique({ where: { serialNumber } });
        if (!evtol)
            throw new customError_error_1.CustomError(404, "eVTOL not found");
        if (evtol.batteryCapacity <= 0)
            throw new customError_error_1.CustomError(400, "Battery is empty");
        if (!evtol.latitude || !evtol.longitude) {
            // First-time location setup
            yield db_1.db.evtol.update({
                where: { serialNumber },
                data: { batteryCapacity: { decrement: 1 }, latitude: newLat, longitude: newLon },
            });
            return;
        }
        // **1️⃣ Calculate Distance and Payload**
        const distance = calculateDistance(evtol.latitude, evtol.longitude, newLat, newLon);
        const payloadWeight = yield calculateCurrentPayloadWeight(serialNumber);
        // **2️⃣ Compute Battery Drain**
        let batteryDrain = distance * BATTERY_DRAIN_RATE;
        batteryDrain += (payloadWeight / 10) * EXTRA_WEIGHT_DRAIN;
        // **3️⃣ Update Battery Level**
        const newBatteryLevel = Math.max(0, evtol.batteryCapacity - Math.ceil(batteryDrain));
        // **4️⃣ Check Emergency Landing**
        let evtolState = evtol.state;
        if (newBatteryLevel <= EMERGENCY_THRESHOLD) {
            evtolState = "EMERGENCY_LANDING"; // Add this state to EVTOL_STATE Enum
            console.warn(`⚠️ eVTOL ${serialNumber} battery critically low! Initiating emergency landing.`);
        }
        // **5️⃣ Update eVTOL Data**
        yield db_1.db.evtol.update({
            where: { serialNumber },
            data: {
                batteryCapacity: newBatteryLevel,
                latitude: newLat,
                longitude: newLon,
                state: evtolState
            },
        });
        // **6️⃣ Log Battery Consumption**
        yield db_1.db.batteryLog.create({
            data: {
                evtolId: evtol.id,
                level: newBatteryLevel,
            }
        });
        console.log(`✅ eVTOL ${serialNumber} moved ${distance.toFixed(2)} km, battery now at ${newBatteryLevel}%`);
        // **🟡 Emit Low Battery Alert (if < 25%)**
        if (newBatteryLevel < 25) {
            __1.io.emit("batteryWarning", {
                serialNumber,
                battery: newBatteryLevel,
                message: "Battery is low! Consider charging soon."
            });
        }
        // **🔴 Emit Critical Battery & Suggest Charging Station (if < 10%)**
        if (newBatteryLevel < 10) {
            const nearestStation = yield findNearestChargingStation(newLat, newLon);
            __1.io.emit("batteryWarning", {
                serialNumber,
                battery: newBatteryLevel,
                message: `Critical battery! Nearest charging station: ${nearestStation.name} at (${nearestStation.latitude}, ${nearestStation.longitude})`,
                chargingStation: nearestStation
            });
        }
    });
}
function findNearestChargingStation(lat, lon) {
    return __awaiter(this, void 0, void 0, function* () {
        const stations = yield db_1.db.chargingStation.findMany(); // Fetch all charging stations
        let nearestStation = stations[0];
        let minDistance = calculateDistance(lat, lon, stations[0].latitude, stations[0].longitude);
        for (const station of stations) {
            const dist = calculateDistance(lat, lon, station.latitude, station.longitude);
            if (dist < minDistance) {
                minDistance = dist;
                nearestStation = station;
            }
        }
        return nearestStation;
    });
}
// **🔹 Haversine Formula to Calculate Distance (in km)**
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
// **🔹 Get Current Payload Weight**
function calculateCurrentPayloadWeight(serialNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const evtol = yield db_1.db.evtol.findUnique({
            where: { serialNumber },
            include: { medications: true },
        });
        return (_a = evtol === null || evtol === void 0 ? void 0 : evtol.medications.reduce((total, med) => total + med.weight, 0)) !== null && _a !== void 0 ? _a : 0;
    });
}
