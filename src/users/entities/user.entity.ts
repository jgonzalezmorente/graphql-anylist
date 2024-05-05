import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from 'src/items/entities/item.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User {

  @PrimaryGeneratedColumn( 'uuid' )
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  fullName: string;

  @Column({ unique: true })
  @Field( () => String )
  email: string;

  @Column()  
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field( () => [String] )  
  roles: string[];

  @Column({
    type: 'boolean',
    default: true
  })

  @Field( () => Boolean )
  isActive: boolean;

  //* eager: true -> cada vez que se cargue la entidad principal se cargan las entidades relacionadas
  //* lazy: true -> las entidades relacionadas se cargan de manera perezosa. Las entidades relacionadas no se cargan hasta que explícitamente se accede a ellas
 
  @ManyToOne( () => User, ( user ) => user.lastUpdateBy, { nullable: true, lazy: true } )
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User

  @OneToMany( () => Item, item => item.user, { lazy: true } )
  @Field( () => [Item] )
  items: Item[];

}
