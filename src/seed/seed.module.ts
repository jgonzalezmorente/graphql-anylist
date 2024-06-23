import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { CommonModule } from '../common/common.module';

@Module({
  providers: [
    SeedResolver, 
    SeedService
  ],
  imports: [
    ConfigModule,
    ItemsModule,
    UsersModule,
    CommonModule,
  ]
})
export class SeedModule {}
