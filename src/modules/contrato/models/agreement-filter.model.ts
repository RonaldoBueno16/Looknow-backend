export class AgreementFilter {
    constructor(
        public nome_cliente?: string,
        public nome_projeto?: string,
        public numero_contrato?: string,
        public data_inicial?: Date,
        public data_final?: Date,
        public modelo_contrato?: string,
        public segmento?: string,
        public gerencia_responsavel?: string,
        public palavra_chave?: string,
    ) {
        
    }
}