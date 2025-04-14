import { NextFunction, Request, Response } from "express";
import { EvtolServiceImpl } from "../service/implementation/evtol-service.implementation";
import { EvtolDetailDTO } from "../dto/evtolDetail.dto";
import { MedicationDTO } from "../dto/medication.dto";
import { CustomRequest } from "../Middleware/auth.middleware";
import { CustomError } from "../exceptions/error/customError.error";


export class EvtolController {
    private evtolService: EvtolServiceImpl;

    constructor(){
        this.evtolService = new EvtolServiceImpl();
    }

    public createEvtol = async(
        req: Request,
        res: Response,
        next:  NextFunction
    ): Promise<void> => {
        try{
         const evtolData = req.body as EvtolDetailDTO
         const newEvtol = await this.evtolService.registerEvtol(evtolData)
         res.status(201).json(newEvtol)
        }catch(error){
         next(error)
        }
    }

    public getAllEvtol = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
           const evtol = await this.evtolService.getAllEvtol()
           res.status(200).json(evtol)
        } catch(error){
            next(error)
        }
    }

    public loadEvtol = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { serialNumber, medications } = req.body;
            const userId = Number(req.userAuth); // Convert to number
            
            if (isNaN(userId)) {
                throw new CustomError(401, "Unauthorized: Invalid user ID");
            }
    
            // Call service to load the medications based on the passed IDs
            const updatedEvtol = await this.evtolService.loadEvtol(serialNumber, medications, userId);
            res.status(200).json(updatedEvtol);
        } catch (error) {
            next(error);
        }
    };
    

    public checkLoadedEvtolItems = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { serialNumber } = req.params; 
            const medications = await this.evtolService.checkLoadedEvtolItems(serialNumber);
            res.status(200).json(medications);
        } catch (error) {
            next(error);
        }
    }

    public checkBatteryLevel = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { serialNumber } = req.params;
            const batteryLevel = await this.evtolService.checkBatteryLevel(serialNumber);
            res.json({ batteryLevel });
        } catch (error) {
            next(error);
        }
    }

    public checkAvailableEvtolForLoading = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { serialNumber, medications }: { serialNumber: string, medications: MedicationDTO[] } = req.body;

            // Call the service method
            const updatedEvtol = await this.evtolService.checkAvailableEvtolForLoading(serialNumber, medications);
            res.status(200).json(updatedEvtol);
        } catch (error) {   
                next(error);
        }
    };

    public getLoadedMedications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const loadedMedications = await this.evtolService.getLoadedMedications();
            res.status(200).json(loadedMedications);
        } catch (error) {
            next(error);
        }
    };
}