import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgreementController } from './controllers/agreement.controller';
import { AgreementSchema } from './schemas/agreement.schema';
import { AgreementService } from './services/agreement.service';
dotenv.config();

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://158.69.50.126:27019'),
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