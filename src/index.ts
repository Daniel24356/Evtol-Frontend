import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import userRouter from "./Route/userRouter";
import { errorHandler } from "./exceptions/error/errorHandler";
import authRouter from "./Route/authRouth";
import evtolRouter from "./Route/evtolRouter";
import medicationRouter from "./Route/medicationRoute";
import { db } from "./configs/db";

dotenv.config();

const portEnv = process.env.PORT;
if(!portEnv){
   console.error("Error: PORT is not defined in .env file");
   process.exit(1);
}

const PORT:number = parseInt(portEnv, 10);
if(isNaN(PORT)){
   console.error("Error: PORT is not a number in .env file");
   process.exit(1);
}

setInterval(async () => {
    const evtols = await db.evtol.findMany();

    for (const evtol of evtols) {
        let newBattery = evtol.batteryCapacity;

        if (newBattery <= 20) {
            // If the battery is ≤ 20%, start charging
            newBattery = Math.min(newBattery + 10, 100); // Increase by 10%, max 100%
            console.log(`EVTOL ${evtol.serialNumber} is charging... Current battery: ${newBattery}%`);

            if (newBattery === 100) {
                console.log(`EVTOL ${evtol.serialNumber} has finished charging and is now at 100%`);
            }
        } else if (newBattery > 20 && newBattery < 70) {
            // If the battery is between 20% and 70%, start charging to 70%
            newBattery = Math.min(newBattery + 10, 70); // Charge to 70%, max 70%
            console.log(`EVTOL ${evtol.serialNumber} is charging to 70%. Current battery: ${newBattery}%`);
        } else if (newBattery >= 70) {
            // If the battery is ≥ 70%, start discharging
            newBattery = Math.max(newBattery - 5, 0); // Decrease by 5%, min 0%

            console.log(`EVTOL ${evtol.serialNumber} is discharging... Current battery: ${newBattery}%`);

            if (newBattery <= 20) {
                console.log(`EVTOL ${evtol.serialNumber} has reached 20%. Starting to charge.`);
            }
        }

        // Update the eVTOL's battery level in the database
        await db.evtol.update({
            where: { id: evtol.id },
            data: { batteryCapacity: newBattery },
        });

        // Log the battery change
        await db.batteryLog.create({
            data: {
                evtolId: evtol.id,
                level: newBattery,
            },
        });

        console.log(`EVTOL ${evtol.serialNumber} battery updated: ${newBattery}%`);
    }
}, 60000); // Runs every 60 seconds




const app = express();
const corsOptions = {
    origin:
    "*",
    Credentials: true,
    allowedHeaders: "*",
    methods:"GET, HEAD, PUT, PATCH, POST, DELETE"
};

app.use(cors(corsOptions));

app.use(express.json());

// app.use("/api/v1/users", userRouter)
// app.use("/api/v1/login", authRouter)
app.use("/api/v1/evtol", evtolRouter)
app.use("/api/v1/medication", medicationRouter)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})