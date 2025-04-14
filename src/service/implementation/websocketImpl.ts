import { Server, Socket } from "socket.io";
import { calculateDistance, updateBatteryLevel } from "./battery.impl" // Ensure correct path
import { db } from "../../configs/db";

interface LocationUpdatePayload {
  serialNumber: string;
  latitude: number;
  longitude: number;
}

export function setupWebSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("✅ Client connected to WebSocket");

    socket.on("updateLocation", async (data: LocationUpdatePayload) => {
        try {
          const { serialNumber, latitude, longitude } = data;
          const evtol = await db.evtol.findUnique({ where: { serialNumber } });
    
          if (!evtol) {
            console.error(`❌ eVTOL with serial number ${serialNumber} not found.`);
            return;
          }
    
          const previousLat = evtol.latitude ?? latitude;
          const previousLon = evtol.longitude ?? longitude;
    
          await updateBatteryLevel(serialNumber, latitude, longitude);
    
          const updatedEvtol = await db.evtol.findUnique({ where: { serialNumber } });
    
          // Calculate distance traveled
          const distanceTraveled = calculateDistance(previousLat, previousLon, latitude, longitude);
    
          io.emit("batteryUpdate", {
            serialNumber: updatedEvtol?.serialNumber,
            batteryLevel: updatedEvtol?.batteryCapacity,
            latitude: updatedEvtol?.latitude,
            longitude: updatedEvtol?.longitude,
            distanceTraveled: distanceTraveled.toFixed(2), // Send distance
          });
    
          console.log(`🚁 ${serialNumber} traveled ${distanceTraveled.toFixed(2)} km, Battery: ${updatedEvtol?.batteryCapacity}%`);
        } catch (error) {
          console.error("❌ Error updating location:", error);
        }
      });

    socket.on("requestFleetData", async () => {
        try {
            const evtols = await db.evtol.findMany({
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
        } catch (error) {
          console.error("❌ Error fetching fleet data:", error);
        }
      });
    
    socket.on("disconnect", () => {
      console.log("⚠️ Client disconnected from WebSocket");
    });
  });
}
