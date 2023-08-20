import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Query, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ResultDto } from "../dtos/result.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFileDto } from "../dtos/uploaded-file.dto";
import { AgreementDTO } from "../dtos/agreement/create-agreement.dto";
import { AgreementService } from "../services/agreement.service";
import { AgreementFilter } from "../models/agreement-filter.model";
import { ApiConsumes } from "@nestjs/swagger";
import { Flunt } from '../../../utils/flunt'
import { convertToHtml } from "mammoth";
import { buffer } from "stream/consumers";
import { OpenAIService } from "../services/openai.service";
import { IResumeText } from "../models/openai-resume.model";

@Controller('v1/contrato')
export class AgreementController {
    constructor(
        private readonly service: AgreementService,
        private readonly openAIService: OpenAIService
    ) {
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    async post(@UploadedFile() file: UploadedFileDto, @Body() model: AgreementDTO) {
        if (!file) {
            throw new HttpException(
                new ResultDto('Documento não encontrado', false, null, ['Você precisa enviar o documento como form-data']),
                HttpStatus.BAD_REQUEST
            )
        }

        const flunt = new Flunt();

        flunt.isRequired(model.nome_cliente, 'Informe o nome do cliente (nome_cliente)');
        flunt.isRequired(model.modelo_contrato, 'Informe o modelo do contrato (modelo_contrato)');
        flunt.isRequired(model.nome_projeto, 'Informe o nome do projeto (nome_projeto)');
        flunt.isRequired(model.segmento, 'Informe o segmento (segmento)');
        flunt.isRequired(model.gerencia_responsavel, 'Informe a gerencia responsavel (gerencia_responsavel)');
        flunt.isRequired(model.data_inicial_contrato, 'Informe a data inicial do contrato (data_inicial_contrato)');
        if (flunt.errors.length > 0) {
            throw new HttpException(
                new ResultDto('Erros de validação', false, null, [flunt.errors]),
                HttpStatus.BAD_REQUEST
            )
        }

        if (typeof model.palavras_chaves === 'string' && model.palavras_chaves.length > 0) {
            const palavrasArray = model.palavras_chaves.split(',').map(palavra => palavra.trim());
            model.palavras_chaves = palavrasArray;
        }

        try {
            if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                try {
                    const { value: fileContent } = await convertToHtml({ buffer: file.buffer });

                    const result: IResumeText = await this.openAIService.getResumeFromText(fileContent) as IResumeText;

                    model.palavras_chaves = result.palavras_chaves;
                    model.resumo = result.resumo;
                }
                catch (error) {
                    console.log(error);

                    throw new HttpException(
                        new ResultDto('Ops, ocorreu algum erro no servidor!', false, null, ['Não foi possível realizar a leitura do documento']),
                        HttpStatus.INTERNAL_SERVER_ERROR
                    )
                }
            }

            const result = await this.service.create(file, model);

            return new ResultDto('Documento criado com sucesso!', true, result, null);
        }
        catch (error) {
            throw new HttpException(
                new ResultDto('Ops, ocorreu algum erro no servidor!', false, null, null),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    @Get('listall')
    async listall(@Query() filters: AgreementFilter) {
        try {
            const result = await this.service.listAllAgreements(filters);

            return new ResultDto(`${result.length} contratos encontrados`, true, result, null);
        }
        catch (error) {
            throw new HttpException(
                new ResultDto('Ops, ocorreu algum erro no servidor!', false, null, null),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    @Get('download/:id')
    async download(@Param('id') agreementId: string, @Res() res: any) {
        try {
            const downloadStream = await this.service.downloadDocument(agreementId);

            if (!downloadStream) {
                throw new HttpException(
                    new ResultDto('Documento não encontrado', false, null, []),
                    HttpStatus.NOT_FOUND
                );
            }

            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', `attachment; filename=${downloadStream.fileName}`); // Substitua pelo nome desejado

            downloadStream.stream?.pipe(res);
        } catch (error) {
            throw new HttpException(
                new ResultDto('Ops, ocorreu algum erro no servidor!', false, null, null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}