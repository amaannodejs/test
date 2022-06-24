const express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    User=require('../models/user')


//middlewares
//middleware of validation and redundency
router.post('/register',(req,res,next)=>{
    if(!req.body.username || !req.body.password || !req.body.confirm_pass ||!req.body.name || req.body.password!=req.body.confirm_pass ){
        return res.sendStatus(500)
    }
    User.find({"username":req.body.username}).then(user=>{
       if(user.length!=0){return res.sendStatus(500)}
       next()
    }).catch(err=>{console.log(err)})

    
})
//middleware of password hashing
router.post('/register',(req,res,next)=>{
    bcrypt.hash(req.body.password,12).then(hash=>{
        req.body.password=hash
        next()
    }).catch(err=>console.log(err))
})
//middleware for get /login
router.post('/login',(req,res,next)=>{

    if(!req.body.username||!req.body.password){
        return res.sendStatus(500)
    }
    next()
    
})

//route logic
router.post('/register',(req,res)=>{
    
    
    const username= req.body.username,
        password=req.body.password,
        name=req.body.name
        const user=new User({
            "name":name,
            "password":password,
            "username":username
        })
        user.save().then(user=>{
            console.log(user)
            res.sendStatus(200)
        }).catch(err=>{console.log(err)})
    

})


router.post('/login',(req,res)=>{
    const username=req.body.username,
        password=req.body.password
    User.findOne({"username":username}).then(user=>{
        if(!user){
            return res.sendStatus(500)
        }
        bcrypt.compare(password,user.password).then(result=>{
            if(!result){return res.sendStatus(500)}
            let snd={"AccessToken":user._id.toString()}
            res.json(snd)

        }).catch(err=>{console.log(err)})
    }).catch(err=>console.log(err))
    
})


router.get('/get',(req,res)=>{
    if(!req.body.AccessToken){return res.sendStatus(500)}
    const token = req.body.AccessToken
    User.findOne({"_id":token}).then(user=>{
        if(!user){return res.sendStatus(500)}
        const snd={"name":user.name,"username":user.username}
        res.json(snd)
    }).catch(err=>{console.log(err)})
})

router.put('/delete',(req,res)=>{
    if(!req.body.AccessToken){return res.sendStatus(500)}
    const token = req.body.AccessToken
    User.findOneAndDelete({"_id":token}).then(user=>{
        res.sendStatus(200)
        
    }).catch(err=>{console.log(err)})
})

router.get('/list/:page',(req,res)=>{
    if(isNaN(req.params.page)){return res.sendStatus(500)}
    const perpage=10,
        pagenum=Number(req.params.page)
    User.find().limit(perpage ).skip(pagenum > 0 ? ( ( pagenum - 1 ) * perpage ) : 0).then(users=>{

        return res.json(users)
        
    }).catch(err=>console.log(err))
})

module.exports= router;