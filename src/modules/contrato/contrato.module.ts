import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgreementController } from './controllers/agreement.controller';
import { AgreementSchema } from './schemas/agreement.schema';
import { AgreementService } from './services/agreement.service';
dotenv.config();

console.log(process.env.CONNECTION_STRING)

@Module({
    imports: [
        MongooseModule.forRoot(process.env.CONNECTION_STRING),
        MongooseModule.forFeature([
            {
                name: 'Acordos',
                schema: AgreementSchema
            }
        ])
    ],
    controllers: [AgreementController],
    providers: [AgreementService]
})

export class ContratoModule { }