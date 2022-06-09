import {ApolloServer, gql} from 'apollo-server';
import {ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import typeDefs from './schemaGQL.js'
import {users, quotes} from './testdb.js';
import resolvers from './resolvers.js'
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})

server.listen().then(({url})=>{
    console.log(`server is ready at ${url}`)
})


// mongodb+srv://graphql:<password>@cluster0.vqvu97e.mongodb.net/?retryWrites=true&w=majority

