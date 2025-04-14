import { EvtolController } from "../controllers/evtol.conroller";
import express from "express"
import { authenticateUser } from "../Middleware/auth.middleware";

const evtolController = new EvtolController();
const evtolRouter = express.Router()

evtolRouter.post("/", evtolController.createEvtol)
evtolRouter.get("/", evtolController.getAllEvtol)
evtolRouter.post("/load", authenticateUser, evtolController.loadEvtol )
evtolRouter.get("/:serialNumber/medications", evtolController.checkLoadedEvtolItems)
evtolRouter.get("/:serialNumber/battery", evtolController.checkBatteryLevel)
evtolRouter.post("/check-load", evtolController.checkAvailableEvtolForLoading)
evtolRouter.get("/loaded-medications", authenticateUser, evtolController.getLoadedMedications);


export default evtolRouter