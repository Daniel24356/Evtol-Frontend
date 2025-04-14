import { Router } from "express";
import { db } from "../configs/db";

const fleetrouter = Router();

fleetrouter.get("/analytics", async (req, res, next) => {
  try {
    const totalEvtols = await db.evtol.count();
    const avgBattery = await db.evtol.aggregate({ _avg: { batteryCapacity: true } });
    const totalDeliveries = await db.delivery.count();

    res.json({
      totalEvtols,
      avgBattery: avgBattery._avg.batteryCapacity || 0,
      totalDeliveries,
    });
  } catch (error) {
    next(error);
  }
});

fleetrouter.get("/active", async (req, res, next) => {
    try {
      const activeEvtols = await db.evtol.findMany({
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
    } catch (error) {
      next(error);
    }
  });

  fleetrouter.get("/battery", async (req, res, next) => {
    try {
      const evtols = await db.evtol.findMany({
        select: { serialNumber: true, batteryCapacity: true, latitude: true, longitude: true }
      });
  
      res.json({ evtols });
    } catch (error) {
      next(error);
    }
  });
  

export default fleetrouter;
