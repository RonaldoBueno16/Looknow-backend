import { Model } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { GridFSBucket, ObjectId, GridFSBucketReadStream } from 'mongodb'; // Importe o GridFSBucket e ObjectId
import { AgreementModel } from '../models/agreement.model';
import { UploadedFileDto } from '../dtos/uploaded-file.dto';
import { AgreementDTO } from '../dtos/agreement/create-agreement.dto';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AgreementFilter } from '../models/agreement-filter.model';

@Injectable()
export class AgreementService {
    constructor(
        @InjectModel('Acordos') private readonly agreementModel: Model<AgreementModel>,
        @InjectConnection() private readonly connection: Connection
    ) { }

    async create(file: UploadedFileDto, data: AgreementDTO) {
        const bucket = new GridFSBucket(this.connection.db, {
            bucketName: 'arquivos',
        });

        const uploadStream = bucket.openUploadStream(file.originalname);
        uploadStream.end(file.buffer);

        const document = await this.agreementModel.create({
            ...data,
            document_id: uploadStream.id,
        });

        return await document.save();
    }

    async listAllAgreements(filters?: AgreementFilter): Promise<AgreementModel[]> {
        let query = this.agreementModel.find();
        
        if (filters) {
            if (filters.nome_cliente) query = query.where('nome_cliente', new RegExp(filters.nome_cliente, 'i'));
            if (filters.nome_projeto) query = query.where('nome_projeto', new RegExp(filters.nome_projeto, 'i'));
            if (filters.segmento) query = query.where('segmento', new RegExp(filters.segmento, 'i'));
            if (filters.modelo_contrato) query = query.where('modelo_contrato', new RegExp(filters.modelo_contrato, 'i'));
            if (filters.numero_contrato) query = query.where('numero_contrato', new RegExp(filters.numero_contrato, 'i'));
            if (filters.gerencia_responsavel) query = query.where('numero_contrato', new RegExp(filters.gerencia_responsavel, 'i'));

            if (filters.data_inicial && filters.data_final) {
                const dataInicial = new Date(filters.data_inicial);
                const dataFinal = new Date(filters.data_final);
                dataInicial.setHours(0, 0, 0);
                dataFinal.setHours(23, 59, 59, 999); 

                console.log(dataInicial);
                console.log(dataFinal);
                
                query = query.where('data_inicial_contrato', {
                    $gte: dataInicial,
                    $lte: dataFinal
                });
            }

            if (filters.palavra_chave)
                query = query.where('palavras_chaves', new RegExp(filters.palavra_chave, 'i'));
        }

        const agreements = await query.exec();
        return agreements;
    }

    async downloadDocument(agreementId: string): Promise<{ stream: GridFSBucketReadStream | null, fileName: string | null }> {
        const objectId = new ObjectId(agreementId);
        const bucket = new GridFSBucket(this.connection.db, {
            bucketName: 'arquivos',
        });

        const fileInfo = await bucket.find({ _id: objectId }).toArray();
        if (!fileInfo || fileInfo.length === 0) {
            return { stream: null, fileName: null };
        }

        const downloadStream = bucket.openDownloadStream(objectId);
        const fileName = fileInfo[0].filename; // Obtém o nome do arquivo

        return { stream: downloadStream, fileName: fileName };
    }
}
