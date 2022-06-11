import {ApolloServer, gql} from 'apollo-server';
import {ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import typeDefs from './schemaGQL.js'
import {users, quotes} from './testdb.js';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import { MONGO_URL } from './config.js';
import {JWT_SECRET} from './config.js';

mongoose.connect(MONGO_URL)
.then(()=>{
    console.log('connected succesfully')
})
.catch((err)=>{
    console.error(err);

})


//import models first
import './models/Quotes.js';
import './models/User.js'



import resolvers from './resolvers.js'


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>{
        const {authorization} = req.headers;
        if(authorization){
            const {userId} = jwt.verify(authorization, JWT_SECRET)
            return {userId}
        }

    },
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})


//mongodb+srv://graphql:<password>@cluster0.vqvu97e.mongodb.net/?retryWrites=true&w=majority
server.listen().then(({url})=>{
    console.log(`server is ready at ${url}`)
})


