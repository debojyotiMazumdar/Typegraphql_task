import { IsEmail, IsNotEmpty, Matches} from "class-validator";
import { Field, InputType} from "type-graphql";

@InputType()
class createUserInput{

    @Field()
    @IsNotEmpty()
    name:string;

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @Field()
    @IsNotEmpty()
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!#$%^&*])/)
    password:string;
}

@InputType()
class createToDoInput{

    @Field()
    title:string

    @Field()
    description:string
    
}

@InputType()
class EditToDoInput{

    @Field({nullable:true})
    title:string;

    @Field({nullable:true})
    description:string;

}

@InputType()
class LoginUserInput{

    @Field()
    @IsEmail()
    email:string;

    @Field()
    password:string;
}

export {createUserInput,createToDoInput,EditToDoInput,LoginUserInput};