import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ToDo, User } from "./entities";
import { createToDoInput, createUserInput,EditToDoInput,LoginUserInput } from "./inputs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import MyContext from "./context";
import { ADMINMAINLIST, UserRole } from "./utils";

@Resolver(_type=>ToDo)
class UserAndTodo{

    @Mutation(()=>Boolean)
    async registerUser(
        @Arg("Data") createUser:createUserInput,
    ){
        const user=User.create({
                name:createUser.name,
                email:createUser.email,
                password:createUser.password,
        });

        if(ADMINMAINLIST.includes(createUser.email)){
            user.role=UserRole.ADMIN;
            console.log("the user now is");
            console.log(user);
        }

        user.save();

        return !!user;
        
    }

    @Mutation(()=>String)
    async loginUser(
        @Arg("login_data") loginUser:LoginUserInput
    ){
        const user=await User.findOne({where:{email:loginUser.email}});
        if(!user){
            return "Email does not exist";
        }
        else{
            const matched=bcrypt.compare(loginUser.password,user.password);
            if(!matched){
                return "password Incorrect";
            }
            else{

                const token=jwt.sign({email:user.email},process.env.JWT_TOKEN!);
                return token;
            }
        }
    }

    @Mutation(()=>Boolean)
    @Authorized()
    async createToDo(
        @Arg("ToDo_Data") createToDo:createToDoInput,
        @Ctx() {user}:MyContext
    ){
        const todo=ToDo.create({
            title:createToDo.title,
            description:createToDo.description,
            user:user
        })
        
        todo.save();
        console.log(todo);
        return !!todo;
    }

    @Mutation(()=>String)
    @Authorized()
    async deleteToDo(
        @Arg("ToDo_ID") todoid:string
    ){
        ToDo.delete({id:todoid});
        return "ToDo item deleted";
    }

    @Mutation(()=>String)
    @Authorized()
    async editToDo(
        @Arg("ToDo_id") todoid:String,
        @Arg("Data")  editToDo:EditToDoInput
    ){
        const todoItem=await ToDo.findOne({where:{id:todoid}});
        if(editToDo.title!=null){
            todoItem!.title=editToDo.title;
        }
        if(editToDo.description!=null){
            todoItem!.description=editToDo.description;
        }

        todoItem?.save();

        return "Your todo item has been edited";
    }

    @Query(()=>ToDo)
    @Authorized()
    async showToDoByUserID(
        @Ctx() {user} : MyContext
    ){
    
        const todo=await ToDo.findOne({where:{user:user.id}});
        return todo;``
    }

    @Query(()=>ToDo)
    @Authorized()
    async showToDoByToDoID(
        @Arg("ToDo_ID") todoid:String
    ){
        const todo=await ToDo.findOne({where:{id:todoid}});
        return todo;
    }
}
export {UserAndTodo};

