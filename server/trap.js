const express = require('express');
const app = express();
const PORT = 8797;
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const middleware = require('./helper/authenMiddleware')
const server = require("http").createServer(app);
const io = require('socket.io')(server);
io.of('/api/socket').on('connection',(socket)=>{
    console.log("soket.io: User.connected", socket.id);
    socket.on("disconnect",()=>{
        console.log('soket.io: User.disconnected');
    })
})
io.listen(2000)
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('uploads'))

const UserRouter = require('./controller/userController')
const PostRouter = require('./controller/postController')
const authRouter = require('./controller/authController')
const CommentRounter = require('./controller/commentController');
const { RSA_NO_PADDING } = require('constants');
var mongoDB = 'mongodb+srv://toan1998:121998vn@cluster0.dwanw.mongodb.net/test?authSource=admin&replicaSet=atlas-bd5rxb-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
//cluster0.dwanw.mongodb.net/users';
mongoose.connect(mongoDB, function (err) {
    if (err) throw err;
    console.log('Successfully connected');
});

pipeline =[
    {'$addFields':{'newField':'newPost'}}
] 

const connection = mongoose.connection
connection.once("open",()=>{
    console.log("MongoDB database connected");
    console.log("Setting change streams");
    const postChangeStream = connection.collection('post').watch()

    postChangeStream.on('change',(change)=>{
        switch(change.operationType){
            case"insert":
            const post = {
                _id:change.fullDocument._id,
                title: change.fullDocument.title,
                described: change.fullDocument.described,
                like:[],
                comment:[],
                space: change.fullDocument.space,
                author: change.fullDocument.author
            }
            io.of('/api/socket').emit('newPost',post)
            break;
        }
    })
})
//Ép Mongoose sử dụng thư viện promise toàn cục
mongoose.Promise = global.Promise;
//Lấy kết nối mặc định
var db = mongoose.connection;



app.use('/', authRouter)
app.use('/user', middleware.authenticateJWT, UserRouter)
app.use('/post', PostRouter)
app.use('/comment', middleware.authenticateJWT, CommentRounter)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => { console.log("Server started on http://localhost:" + PORT) })
module.exports = app;
