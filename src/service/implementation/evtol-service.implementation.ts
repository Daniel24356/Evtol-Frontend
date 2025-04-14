import { Evtol, EVTOL_STATE, LoadedMedication, Medication } from "@prisma/client";
import { EvtolDetailDTO } from "../../dto/evtolDetail.dto";
import { EvtolService } from "../evtol.service";
import { db } from "../../configs/db";
import { CustomError } from "../../exceptions/error/customError.error";
import { MedicationDTO } from "../../dto/medication.dto";


export class EvtolServiceImpl implements EvtolService{
 
  async  registerEvtol(data: EvtolDetailDTO): Promise<Evtol> {
         const isEvtolExist = await db.evtol.findFirst({
             where: {
                serialNumber: data.serialNumber
             }
         })
             
         if(isEvtolExist){
             throw new CustomError(409, "oops evtol already exist")
         }


         const evtol = await db.evtol.create({
            data: {
                serialNumber: data.serialNumber,
                model: data.model,
                weightLimit: data.weightLimit,
                batteryCapacity: data.batteryCapacity,
                state: data.state
            }
         })

         return evtol
    }

  async getAllEvtol(): Promise<Evtol[]> {
        return await db.evtol.findMany()
    }
  
  async loadEvtol(serialNumber: string, items: MedicationDTO[],userId: number): Promise<Evtol> {
    // Step 1: Check if the eVTOL exists
    const evtol = await db.evtol.findUnique({
        where: { serialNumber }
    });

    if (!evtol) {
        throw new CustomError(404, "eVTOL not found");
    }

    const medications = await db.medication.findMany({
        where: {
            code: { in: items.map((item) => item.code) } // Find medications that match the passed `codes`
        }
    });

    if (medications.length !== items.length) {
        throw new CustomError(404, "Some medications were not found");
    }

    await db.loadedMedication.createMany({
        data: medications.map((med) => ({
            evtolId: evtol.id,
            medicationId: med.id,
            loadedByUserId: userId,
            loadedAt: new Date()
        }))
    });

    // Step 3: Update eVTOL with medications by connecting their IDs
    const updatedEvtol = await db.evtol.update({
        where: { serialNumber },
        data: {
            medications: {
                connect: medications.map((med) => ({ id: med.id })) // Connect using medication IDs
            }
        }
    });
     
    return updatedEvtol;
    }

  async checkLoadedEvtolItems(serialNumber: string): Promise<Medication[]> {
      
    const evtol = await db.evtol.findFirst({
        where: { serialNumber },
        include: { medications: true } 
    });

    if (!evtol) {
        throw new CustomError(404, "eVTOL not found");
    }

    return evtol.medications;
    }

  async  checkBatteryLevel(serialNumber: string): Promise<number> {
    const evtol = await db.evtol.findUnique({
        where: { serialNumber },
    });

    if (!evtol) {
        throw new Error("EVTOL not found");
    }

    // Log battery level
    await db.batteryLog.create({
        data: {
            evtolId: evtol.id,
            level: evtol.batteryCapacity,
        },
    });

    return evtol.batteryCapacity;
    }

    async checkAvailableEvtolForLoading(serialNumber: string, items: MedicationDTO[]): Promise<Evtol> {
        // Find the eVTOL by serial number
        const evtol = await db.evtol.findUnique({
            where: { serialNumber },
            include: { medications: { select: { id: true, weight: true } } }
        });
    
        if (!evtol) {
            throw new CustomError(404, "eVTOL not found");
        }
    
        console.log("Checking eVTOL:", evtol);
        console.log("Battery Capacity:", evtol.batteryCapacity);
    
        // Prevent loading if battery is below 25%
        if (evtol.batteryCapacity < 25) {
            throw new CustomError(400, "This item cannot be loaded until battery is higher than 25%");
        }
    
        const medicationCodes = items.map((item) => item.code);
        const existingMedications = await db.medication.findMany({
            where: { code: { in: medicationCodes } },
            select: { id: true, weight: true }
        });
    
        console.log("Existing medications:", existingMedications);
          
        // Calculate total medication weight
        const newWeight = existingMedications.reduce((sum, med) => sum + med.weight, 0);
        const existingWeight = evtol.medications.reduce((sum, med) => sum + med.weight, 0);
        const totalWeight = newWeight + existingWeight;
        
        console.log("New weight:", newWeight);
        console.log("Existing weight:", existingWeight);
        console.log("Total weight:", totalWeight);
        
        // Prevent loading if weight exceeds limit
        if (totalWeight > evtol.weightLimit) {
            throw new CustomError(400, "Total medication weight exceeds eVTOL weight limit");
        }
    
        let newState: "IDLE" | "LOADING" | "LOADED" | "DELIVERING" = "LOADING";
        if (totalWeight === evtol.weightLimit) {
            newState = "LOADED";
        }
    
        const updatedEvtol = await db.evtol.update({
            where: { serialNumber },
            data: {
                state: newState,
                medications: {
                    connect: existingMedications.map((med) => ({ id: med.id }))
                }
            },
            include: { medications: true }
        });
    
        return updatedEvtol;
    }
    
    async getLoadedMedications(): Promise<LoadedMedication[]> {
        return await db.loadedMedication.findMany({
            include: {
                evtol: true,
                medication: true,
                loadedBy: {
                    select: { id: true, firstName: true, lastName: true, email: true }
                }
            }
        });
    }
    
}