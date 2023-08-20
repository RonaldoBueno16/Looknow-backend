import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document,  } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { AgreementModel } from '../models/agreement.model';

@Injectable()
@Schema()
export class Agreement extends Document implements AgreementModel {
    @Prop({ required: true })
    nome_cliente: string;

    @Prop({ required: true })
    nome_projeto: string;

    @Prop({ required: true })
    gerencia_responsavel: string;

    @Prop({ required: true })
    segmento: string;

    @Prop({ required: true })
    modelo_contrato: string;

    @Prop({ required: true })
    data_inicial_contrato: Date;

    @Prop({ required: true })
    palavras_chaves: string[];

    @Prop({ required: false })
    resumo: string;

    @Prop({ required: true })
    document_id: string;
}


export const AgreementSchema = SchemaFactory.createForClass(Agreement);