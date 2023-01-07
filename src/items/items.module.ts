import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ItemRepository } from 'src/item-repository';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, ItemRepository],
})
export class ItemsModule {}
