import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ItemsService } from './items.service';
import { User } from 'src/users/entities/user.entity';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Item)
@UseGuards( JwtAuthGuard )
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation( () => Item, { name: 'createItem' } )
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User
  ): Promise<Item> {    
    return this.itemsService.create(createItemInput, user);
  }

  @Query( () => [Item], { name: 'items' } )
  async findAll(
    @CurrentUser() user: User
  ): Promise<Item[]> {
    return this.itemsService.findAll( user );
  }

  @Query(() => Item, { name: 'item' })
  async findOne(
    @Args( 'id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemsService.findOne( id, user );
  }

  @Mutation( () => Item )
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemsService.update( updateItemInput.id, updateItemInput, user );
  }

  @Mutation( () => Item )
  async removeItem(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemsService.remove( id, user );
  }
}
