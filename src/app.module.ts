import { Module } from '@nestjs/common';
import { ContratoModule } from './modules/contrato/contrato.module';

@Module({
  imports: [ContratoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
