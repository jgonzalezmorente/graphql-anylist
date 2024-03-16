import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {

  private logger: Logger = new Logger('UserService');

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ) {}

  async create( signupInput: SignupInput ): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10 )
      });

      return await this.userRepository.save( newUser );
    } catch (error) {
      this.handleDBErrors( error );      
    }
  }

  async findAll( roles: ValidRoles[] ): Promise<User[]> {
    if ( roles.length === 0 ) return this.userRepository.find({
      // ? No es necesario porque tenemos lazy en la propiedad lastUpdateBy
      // relations: {
      //   lastUpdateBy: true
      // }
    });
    
    return this.userRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]') //* Intersección del array de roles de la base de datos no vacía con el array de roles que le pasamos
      .setParameter('roles', roles)
      .getMany();
    }

  async findOne( id: string ): Promise<User> {
    throw new Error( 'findOne method not implemented' );
  }

  async findOneByEmail( email: string ): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `${ email } not found`
      });
    }    
  }

  async findOneById( id: string ): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `User with id ${ id } not found`
      });
    }
  }

  async update(
    id: string, 
    updateUserInput: UpdateUserInput,
    updateBy: User
  ): Promise<User> {    
    const user = await this.userRepository.preload({
      ...updateUserInput,        
      id 
    });      
    if (!user) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `User with id ${ id } not found`
      });
    }      
    try {
      user.lastUpdateBy = updateBy;
      if ( updateUserInput.password ) {
        user.password = bcrypt.hashSync( updateUserInput.password, 10 );
      }
      return await this.userRepository.save( user );
    } catch (error) {    
      this.handleDBErrors( error );
    }
  }

  async block( id: string, adminUser: User ): Promise<User> {
    const userToBlock = await this.findOneById( id );
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;
    return await this.userRepository.save( userToBlock );
  }

  private handleDBErrors( error: any ): never {    
    if ( error.code === '23505' ) {
      throw new BadRequestException( error.detail.replace( 'Key ', '') );
    }
    if ( error.code === 'error-001' ) {     
      throw new NotFoundException( error.detail );      
    }    
    this.logger.error( error );
    throw new InternalServerErrorException( 'Please check server logs' );
  }
}
