import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './items/dto/create-item.dto';
import { UpdateItemDto } from './items/dto/update-item.dto';
import { Item } from './items/entities/item.entity';
import * as crypto from 'crypto';

@Injectable()
export class ItemRepository {
  private _items: Item[] = [
    { id: 'e86639d1-65c8-75ad-005b-f2ec8a5e374a', name: 'Item A', price: 1000 },
    { id: '65d8b7eb-fdf4-4e71-4eb6-5dfb82e2fc3f', name: 'Item B', price: 2000 },
    { id: '9c35486d-efca-9f17-ce89-aa5299e423a9', name: 'Item C', price: 3000 },
  ];

  create(createItemDto: CreateItemDto): Item {
    const item: Item = {
      id: crypto.randomUUID(),
      ...createItemDto,
    };
    this._items.push(item);
    return item;
  }

  get(id: string): Item | undefined {
    return this._items.find((item) => item.id === id);
  }

  getAll(): Item[] {
    return this._items;
  }

  update(id: string, updateItemDto: UpdateItemDto): Item | undefined {
    let item: Item;

    const index = this._items.findIndex((_item) => _item.id === id);
    if (index >= 0) {
      this._items[index] = {
        ...this._items[index],
        ...updateItemDto,
      };
      item = this._items[index];
    }

    return item;
  }

  delete(id: string) {
    this._items = this._items.filter((item) => item.id !== id);
  }
}
