import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefiController } from './defi.controller';
import { UserEntity } from '../user.entity';
import {DefiEntity} from './defi.entity'
import { DefiService } from './defi.service';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([DefiEntity, UserEntity,]), UserModule],
  providers: [DefiService],
  controllers: [
    DefiController
  ]
})

export class DefiModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'defi', method: RequestMethod.GET}, //get all
        {path: 'defi', method: RequestMethod.POST}, // admin create
        {path: 'defi/:slug', method: RequestMethod.DELETE},  // admin delete
        {path: 'defi/:slug', method: RequestMethod.PUT},  // admin modify
        {path: 'defi/:slug', method: RequestMethod.GET}, //get by id
    
}
