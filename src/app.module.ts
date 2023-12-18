import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,      
      playground: false,      
      autoSchemaFile: join( process.cwd(), 'src/schema.gql' ),
      includeStacktraceInErrorResponses: true,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,      
      synchronize: true, //* Sincroniza automaticamente el esquema de base de datos con los modelos de entidades. Evita gestionar manualmente las migraciones
      autoLoadEntities: true, //* Carga automáticamente todas las entidades eliminando la necesidad de listarlas manualmente
    }),    
    ItemsModule,    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
