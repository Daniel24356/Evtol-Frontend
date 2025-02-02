import { IsNotEmpty, Length } from "class-validator";


export class MedicationDTO{
    @IsNotEmpty()
    @Length(2, 50)
    name!: string

    weight!: number

    code!: number

    imageUrl!: string
}