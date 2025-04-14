"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const evtol_conroller_1 = require("../controllers/evtol.conroller");
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../Middleware/auth.middleware");
const evtolController = new evtol_conroller_1.EvtolController();
const evtolRouter = express_1.default.Router();
evtolRouter.post("/", evtolController.createEvtol);
evtolRouter.get("/", evtolController.getAllEvtol);
evtolRouter.post("/load", auth_middleware_1.authenticateUser, evtolController.loadEvtol);
evtolRouter.get("/:serialNumber/medications", evtolController.checkLoadedEvtolItems);
evtolRouter.get("/:serialNumber/battery", evtolController.checkBatteryLevel);
evtolRouter.post("/check-load", evtolController.checkAvailableEvtolForLoading);
evtolRouter.get("/loaded-medications", auth_middleware_1.authenticateUser, evtolController.getLoadedMedications);
exports.default = evtolRouter;
