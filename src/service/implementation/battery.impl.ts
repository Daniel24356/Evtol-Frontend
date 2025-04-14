import { db } from "../../configs/db";
import { CustomError } from "../../exceptions/error/customError.error";
import { io } from "../..";

const BATTERY_DRAIN_RATE = 0.2; // Example: 0.2% per km
const EXTRA_WEIGHT_DRAIN = 0.01; // Example: +1% battery drain per 10kg
const EMERGENCY_THRESHOLD = 10; // Trigger emergency landing at 10%

export async function updateBatteryLevel(serialNumber: string, newLat: number, newLon: number) {
    const evtol = await db.evtol.findUnique({ where: { serialNumber } });

    if (!evtol) throw new CustomError(404, "eVTOL not found");

    if (evtol.batteryCapacity <= 0) throw new CustomError(400, "Battery is empty");

    if (!evtol.latitude || !evtol.longitude) {
        // First-time location setup
        await db.evtol.update({
            where: { serialNumber },
            data: { batteryCapacity: { decrement: 1 }, latitude: newLat, longitude: newLon },
        });
        return;
    }

    // **1️⃣ Calculate Distance and Payload**
    const distance = calculateDistance(evtol.latitude, evtol.longitude, newLat, newLon);
    const payloadWeight = await calculateCurrentPayloadWeight(serialNumber);

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
    await db.evtol.update({
        where: { serialNumber },
        data: {
            batteryCapacity: newBatteryLevel,
            latitude: newLat,
            longitude: newLon,
            state: evtolState
        },
    });

    // **6️⃣ Log Battery Consumption**
    await db.batteryLog.create({
        data: {
            evtolId: evtol.id,
            level: newBatteryLevel,
        }
    });

    console.log(`✅ eVTOL ${serialNumber} moved ${distance.toFixed(2)} km, battery now at ${newBatteryLevel}%`);

      // **🟡 Emit Low Battery Alert (if < 25%)**
      if (newBatteryLevel < 25) {
        io.emit("batteryWarning", { 
            serialNumber, 
            battery: newBatteryLevel, 
            message: "Battery is low! Consider charging soon." 
        });
    }

    // **🔴 Emit Critical Battery & Suggest Charging Station (if < 10%)**
    if (newBatteryLevel < 10) {
        const nearestStation = await findNearestChargingStation(newLat, newLon);
        io.emit("batteryWarning", { 
            serialNumber, 
            battery: newBatteryLevel, 
            message: `Critical battery! Nearest charging station: ${nearestStation.name} at (${nearestStation.latitude}, ${nearestStation.longitude})`,
            chargingStation: nearestStation
        });
    }
}

async function findNearestChargingStation(lat: number, lon: number) {
    const stations = await db.chargingStation.findMany(); // Fetch all charging stations
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
}

// **🔹 Haversine Formula to Calculate Distance (in km)**
 export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// **🔹 Get Current Payload Weight**
async function calculateCurrentPayloadWeight(serialNumber: string): Promise<number> {
    const evtol = await db.evtol.findUnique({
        where: { serialNumber },
        include: { medications: true },
    });

    return evtol?.medications.reduce((total, med) => total + med.weight, 0) ?? 0;
}
