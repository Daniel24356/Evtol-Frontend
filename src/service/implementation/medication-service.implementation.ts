import { Medication } from "@prisma/client";
import { MedicationDTO } from "../../dto/medication.dto";
import { MedicationService } from "../medication.service";
import { db } from "../../configs/db";
import { CustomError } from "../../exceptions/error/customError.error";


export class MedicationServiceImpl implements MedicationService{
  async  createMedicine(data: MedicationDTO): Promise<Medication> {
        const isMedicineExist = await db.medication.findFirst({
            where:{
                code:data.code
            }
        })

        if(isMedicineExist){
           throw new  CustomError(400, "Medicine with this code already exist")
        }

        const medicine = await db.medication.create({
            data: {
                name: data.name,
                weight: data.weight,
                code: data.code,
                imageUrl: data.imageUrl
            }
        })

        return medicine
    }

   async getAllMedicine(): Promise<Medication[]> {
        return await db.medication.findMany();
    }
    
}
