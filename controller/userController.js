const express = require('express')
const router = express.Router();
const User = require('../model/User')
const bcrypt = require('bcrypt')
const constants = require('../constants')


router.post('/', constants.upload.single('avatar'), async (req,res)=>{
    const saltRound = 10
    let passwordHash = await bcrypt.hash(req.body.password, saltRound)
    req.body.password = passwordHash
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        address: req.body.address,
        age: req.body.age,
        avatar: req.file.path
    })
    user.save((err)=>{
        if(err) throw err;
        console.log("User save successfully");
    })
    res.json({"data": user})
})

router.get('/all',(req,res)=>{
    return User.find().exec((err, users)=>{
        if(err) throw err
        res.json(users)
    })
})

router.put('/update',constants.upload.single('avatar') ,async (req,res)=>{
    const saltRound = 10
    let passwordHash = await bcrypt.hash(req.body.password, saltRound)
    req.body.password = passwordHash
    if(!req.body._id){
        res.status(400).send({messError: 'not found ID'})
    }

    const id = {_id: req.body._id}
    const update = {
        _id: req.body._id,
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        address: req.body.address,
        age: req.body.age,
        avatar: req.file.path
    }
    User.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) return res.send(err)
        res.json(result)
    })
})


router.post('/avatar', constants.upload.single('avatar'), async(req, res)=>{
    let id = req.authenticateUser._id;
    let update = req.body;
    update.avatar= req.file.originalname
    User.findByIdAndUpdate(id, update, {new: true}, function(err, result){
        if (err) return res.send(err)
        res.json(result)
    })
})

router.delete('/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: 'not found id' })
    }
    const id = { _id: req.params.id }
    User.findByIdAndDelete(id, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.json({ mess: "Sucessesful delete id:" + req.params.id })
        }
    })
})

module.exports = router
