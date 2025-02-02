import { EVTOL_MODEL, EVTOL_STATE } from "@prisma/client"
import { IsEnum, Length } from "class-validator"

export class EvtolDetailDTO{
  @Length(5,100)
  serialNumber!: string

  @IsEnum(EVTOL_MODEL)
  model!: EVTOL_MODEL

  weightLimit!: number

  batteryCapacity!: number

  @IsEnum(EVTOL_STATE)
  state!: EVTOL_STATE
}