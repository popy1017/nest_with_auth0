import { Injectable } from '@nestjs/common';
import { ItemRepository } from 'src/item-repository';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private itemRepository: ItemRepository) {}

  create(createItemDto: CreateItemDto) {
    return this.itemRepository.create(createItemDto);
  }

  findAll() {
    return this.itemRepository.getAll();
  }

  findOne(id: string) {
    return this.itemRepository.get(id);
  }

  update(id: string, updateItemDto: UpdateItemDto) {
    return this.itemRepository.update(id, updateItemDto);
  }

  remove(id: string) {
    return this.itemRepository.delete(id);
  }
}
