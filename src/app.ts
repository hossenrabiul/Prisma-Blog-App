import express from 'express'
import { postRoute } from './modules/post/post.routes'
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
export const app = express()
app.use(express.json())
import cors from 'cors'
import { commentRoute } from './modules/comment/comment.routes';
app.use(cors({
    origin : process.env.API_URL,
    
}))

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use('/post', postRoute)
app.use('/comment', commentRoute)


app.get('/', (req, res) => {
    res.send("Hello world welcome to the prisma project...")
})

