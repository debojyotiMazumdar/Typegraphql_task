import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity,PrimaryGeneratedColumn,ManyToOne, OneToMany} from "typeorm";


@Entity()
class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:string

    @Column()
    name:string

    @Column({unique:true})
    email:string

    @Column()
    password:string

    @OneToMany(_type=>ToDo,todo=>todo.user)
    todos:ToDo[];

}

@Entity()
@ObjectType()
class ToDo extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:string;

    @Column()
    @Field()
    title:string;

    @Column()
    @Field()
    description:string;

    @ManyToOne(_type=>User,user=>user.todos,{
        cascade:true
        
    })

    user:User;
}

export {User,ToDo};