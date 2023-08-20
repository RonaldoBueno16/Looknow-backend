export class AgreementModel {
    constructor(
        public nome_cliente: string,
        public nome_projeto: string,
        public gerencia_responsavel: string,
        public segmento: string,
        public modelo_contrato: string,
        public data_inicial_contrato: Date,
        public palavras_chaves: string[] | string,
        public resumo: string
    ) { }
}