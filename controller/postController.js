const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const Post = require('../model/Post')
const constants = require('../constants')
const Comment = require('../model/Comment')
router.post('/add-post', constants.upload.single('imgVideo'), (req, res) => {
    let post = new Post({
        
        title: req.body.title,
        imgVideo: req.file.path,
        described: req.body.described,
        like: req.body.like,
        comment: req.body.comment,
        space: req.body.space,
        author:req.body.author
    })
    post.save((err) => {
        if (err) throw err;
        console.log('Post save successfully')
    })

    res.json({"data": post} )
})
//Add Comment
router.post('/:id', async (req, res) => {
    let comments = new Comment({
        _id: new mongoose.Types.ObjectId(),
        content: req.body.content,
        author: req.body.author 
    })
    comments.save((err) => {
        if (err) throw err;
        console.log('Comment save successfully')
    })
    let idPost = { _id: req.params.id}
    let nowPost = await Post.findById(idPost)
    const count = nowPost.comment.push(comments._id)
    Post.findByIdAndUpdate(idPost, nowPost, { new: true }, function (err, result) {
        if (err) return res.send(err)
    })
    
    res.json({ "data": nowPost })
})

router.get('/:id', async (req, res) => {
    const id = { _id: req.params.id }
    if(!id){
        res.status(400).send({messErr:'not found id'})
    } else{
    const post = await (await Post.findById(id).populate([{path: 'author', select:['name','avatar']},'comment']))
    res.json({
        "message": "OK",
        "data": post
    })}
})

router.put('/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: 'not found id' })
    }
    const id = { _id: req.params.id }
    const update = {
            _id: id,
            title: req.body.title,
            imgVideo: req.file.path,
            described: req.body.described,
            like: req.body.like,
            comment: req.body.comment,
            space: req.body.space,
            author:req.body.author
    }
    Post.findByIdAndUpdate(id, update, { new: true }, function (err, result) {
        if (err) return res.send(err)
        res.json(result)
    })
})

router.delete('/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: "not found id" })
    }

    const id = { _id: req.params.id }
    Post.findByIdAndDelete(id, function (err, result) {
        if (err) return res.send(err)
        res.json({
            mess: "Sucessful delete id:" + req.params.id
        })
    })
})

module.exports = router