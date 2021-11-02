import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity,PrimaryGeneratedColumn,ManyToOne, OneToMany, BeforeInsert} from "typeorm";
import bcrypt from "bcrypt";
import { UserRole } from "./utils";

@Entity()
class User extends BaseEntity{

    @BeforeInsert()
    async hashPassword(){
        this.password=await bcrypt.hash(this.password,10);
    }

    @PrimaryGeneratedColumn()
    id:string

    @Column()
    name:string

    @Column({unique:true})
    email:string

    @Column()
    password:string

    @Column("enum",{enum:UserRole,default:UserRole.USER})
    @Field(()=>UserRole)
    role:UserRole


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