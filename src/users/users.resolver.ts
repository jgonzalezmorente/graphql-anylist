import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ItemsService } from 'src/items/items.service';
import { User } from './entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
    @Args() validRoles: ValidRolesArgs, //* Los argumentos de tipo @ArgsType, a diferencia de los @InputType, cada atributo de la clase se convierte en un parámetro individual (funcionan como queryparams)
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs

  ): Promise<User[]> {    
    return this.usersService.findAll(validRoles.roles, paginationArgs, searchArgs);
  }

  @Query(() => User, { name: 'user' })
  findOne( 
    @Args( 'id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.update( updateUserInput.id, updateUserInput, user );
  }
  
  @Mutation(() => User, { name: 'blockUser' })
  async blockUser( 
    @Args( 'id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField( () => Int, { name: 'itemCount' } )
  async itemCount(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User
  ): Promise<number> {
    return this.itemsService.itemCountByUser( user );
  }

  @ResolveField( () => [Item], { name: 'items' } )
  async getItemsByUser(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }  
}
