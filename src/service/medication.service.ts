import { Medication } from "@prisma/client";
import { MedicationDTO } from "../dto/medication.dto";


export interface MedicationService{
    createMedicine(data: MedicationDTO): Promise<Medication>
    getAllMedicine(): Promise<Medication[]>
}