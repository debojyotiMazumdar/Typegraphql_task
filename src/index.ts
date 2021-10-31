import "reflect-metadata";
import dotenv from "dotenv";
import {ApolloServer} from "apollo-server";
import {buildSchema} from "type-graphql";
import {UserAndTodo} from "./resolvers";
import { createConnection } from "typeorm";
import {User,ToDo} from "./entities";
import jwt from "jsonwebtoken";
import authChecker from "./authchecker";


dotenv.config();

const main = async ()=>{
    const schema= await buildSchema({resolvers:[UserAndTodo],authChecker:authChecker});
    const server=new ApolloServer({
        schema,
        context: async ({req}:{req:any})=>{
            let user;
            if(req.headers.authorization){
                const token=req.headers.authorization;
                const decoded:any =jwt.verify(token,process.env.JWT_TOKEN!);
                user = await User.findOne({where:{email:decoded.email}});
            }
            return {user:user};
        }
    });
    
    server.listen(8000).then(({url})=>console.log(`Listening in port ${url}`)).catch((e)=>console.log(e.message));
}

createConnection({
    type:"postgres",
    url:process.env.DATABASE_URL,
    entities:[User,ToDo],
    synchronize:true,
    logging:true
}).then(()=>console.log("Database connected")).catch((e)=>console.log(e.message));

main();