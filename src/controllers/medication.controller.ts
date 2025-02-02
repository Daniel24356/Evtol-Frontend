import { NextFunction, Request, Response } from "express";
import { MedicationServiceImpl } from "../service/implementation/medication-service.implementation";
import { MedicationDTO } from "../dto/medication.dto";


export class MedicationController{
    private medicationService: MedicationServiceImpl;

    constructor(){
        this.medicationService = new MedicationServiceImpl();
    }

    public createMedicine = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
           const medicationData = req.body as MedicationDTO
           const newMedication = await this.medicationService.createMedicine(medicationData)
           res.status(201).json(newMedication)
        }catch(error){
           next(error)
        }
    }

    public getAllMedicine = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const medicine = await this.medicationService.getAllMedicine()
            res.status(200).json(medicine)
        }catch(error){
            next(error)
        }
    }
}