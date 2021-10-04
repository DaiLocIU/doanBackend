import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { momoConfiguration } from './momo.configuration';
import { webConfiguration } from './web.configuration';
import { sendGridConfiguration } from './sendgrid.configuration';
import { appConfiguration } from './app.configuration';
import { authConfiguration } from './auth.configuration';
import { dbConfiguration } from './db.configuration';
import { cloudinaryConfiguration } from './cloudinary.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [
        appConfiguration,
        authConfiguration,
        dbConfiguration,
        cloudinaryConfiguration,
        sendGridConfiguration,
        webConfiguration,
        momoConfiguration,
      ],
    }),
  ],
})
export class ApiConfigModule {

}
