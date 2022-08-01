import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { hostname, port, password } = new URL(
          configService.get('REDIS_URL') ?? '',
        );

        return {
          redis: {
            tls: configService.get('QUEUE_TLS')
              ? {
                  rejectUnauthorized: false,
                }
              : undefined,
            host: hostname,
            port: Number(port),
            password,
          },
        };
      },
    }),
  ],
})
export class QueueModule {}
