import {users, quotes} from './testdb.js'
import {randomBytes} from 'crypto';
import mongoose from 'mongoose';

const User = mongoose.model('User');
const Quote = mongoose.model('Quote');

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config.js';


const resolvers = {
    Query:{
        users: ()=> users,
        quotes: ()=> quotes,
        user: (_, {id})=>users.find(user=> user.id == id),
        testq: (_, {by})=> quotes.filter(quote=> quote.by == by)
    },

    User:{
        quotes: (ur)=> quotes.filter(quote=> quote.by == ur.id)
    },

    Mutation:{
        signupUser: async(_, {userNew})=>{
            const user = await User.findOne({email: userNew.email})
            if(user){
                throw new Error('User already exists!')
            }

            const hashedPassword = await bcrypt.hash(userNew.password, 12);
            
            const newUser =  new User({
                ...userNew, password: hashedPassword
            })

            return await newUser.save()
        },

        signInUser : async(_,{userSignIn}) => {
            const user = await User.findOne({email: userSignIn.email});
            if(!user){
                throw new Error('User doesnt exists!');

            }

            const checkPassword = await bcrypt.compare(userSignIn.password, user.password);
            if(!checkPassword){
                throw new Error('Invalid credentials!');
            }

            const token =  jwt.sign({userId: user._id}, JWT_SECRET)
            return (token);
        },

        createQuote: async(_,{name}, {userId}) => {
            if(!userId) {
                throw new Error('YOu must be logged in');
            }

            const newQuote = new Quote({
                name,
                by: userId,
            })

            await newQuote.save();
            return "Quote saved successfully"



        }
        

        
    },

}


export default resolvers;