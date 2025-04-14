import { Evtol, LoadedMedication, Medication } from "@prisma/client";
import { EvtolDetailDTO } from "../dto/evtolDetail.dto";
import { MedicationDTO } from "../dto/medication.dto";



export interface EvtolService{
    registerEvtol(data: EvtolDetailDTO): Promise<Evtol>
    getAllEvtol(): Promise<Evtol[]>
    loadEvtol(serialNumber: string, items: MedicationDTO[], userId:number): Promise<Evtol>;
    checkLoadedEvtolItems(serialNumber: string): Promise<Medication[]>;
    checkBatteryLevel(serialNumber: string): Promise<number>;
    checkAvailableEvtolForLoading(serialNumber: string, items: MedicationDTO[]): Promise<Evtol>;
    getLoadedMedications(): Promise<LoadedMedication[]>
}