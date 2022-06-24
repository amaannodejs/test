const user = require('../models/user')

const express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    User=require('../models/user'),
    AccessToken=require('../models/accesstoken'),
    Address=require('../models/userAddress'),
    err=(err)=>{console.log(err)}


//middlewares
//middleware of validation and redundency
router.post('/register',(req,res,next)=>{
    if(!req.body.username || !req.body.password || !req.body.confirm_pass ||!req.body.name || req.body.password!=req.body.confirm_pass ){
        return res.sendStatus(500)
    }
    User.find({"username":req.body.username}).then(user=>{
       if(user.length!=0){return res.sendStatus(500)}
       next()
    }).catch(err)

    
})
//middleware of password hashing
router.post('/register',(req,res,next)=>{
    bcrypt.hash(req.body.password,12).then(hash=>{
        req.body.password=hash
        next()
    }).catch(err)
})
//middleware for get /login
router.post('/login',(req,res,next)=>{

    if(!req.body.username||!req.body.password){
        return res.sendStatus(500)
    }
    next()
    
})

//middleware AccessToken to userId
const protectRoute=(req,res,next)=>{
    if(!req.headers.accesstoken){return res.sendStatus(500)}
    AccessToken.findOne({"accessToken":req.headers.accesstoken}).then(token=>{
        
        if(!token){return res.sendStatus(500)}
        const validTime=new Date()
        validTime.setTime(validTime.getTime() - (1 * 60 * 60 * 1000))
        if(token.expiry<validTime){return res.sendStatus(500)}
        User.findOne({"_id":token.userId}).then(user=>{
            console.log(user)
            if(!user){return res.sendStatus(500)}
            req.user=user
            next()
        }).catch(err)
    }).catch(err)

}


//route logic

//POST/PUT
router.post('/register',(req,res)=>{
    
    
    const username= req.body.username,
        password=req.body.password,
        name=req.body.name
        const newAddress=new Address({"address":[],"city":"","state":"","pincode":"","phoneno":""})
        newAddress.save().then(address=>{
            const user=new User({
                "name":name,
                "password":password,
                "username":username,
                "address":address._id
            })
            user.save().then(user=>{
    
                console.log(user)
                res.sendStatus(200)
            }).catch(err)
        

        }).catch(err)
       

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
            
            bcrypt.hash(Date().toString(),12).then(hash=>{
                const accessToken=hash
                let expiry=new Date()
                
                expiry.setTime(expiry.getTime() + 1 * 60 * 60 * 1000)
                
                AccessToken.deleteMany({"userId":user._id}).then(removed=>{

                    token=new AccessToken({
                        "accessToken":accessToken,
                        "userId":user._id,
                        "expiry":expiry
                    })
                    
                    token.save().then(token=>{
                        
                        if(!token){return res.sendStatus(500)}
                        
                        return res.json({"accessToken":token.accessToken})
                    }).catch(err)
                }).catch(err)
                


            }).catch(err)

        }).catch(err)
    }).catch(err)
    
})
router.put('/delete',(req,res)=>{
    if(!req.body.AccessToken){return res.sendStatus(500)}
    const token = req.body.AccessToken
    User.findOneAndDelete({"_id":token}).then(user=>{
        return res.sendStatus(200)
        
    }).catch(err)
})

router.post('/address',protectRoute,(req,res)=>{
    console.log('sd')
    if((req.body.address.length == 0)||!req.body.city||!req.body.state||!req.body.pincode||!req.body.phoneno){
        return res.sendStatus(500)
    }
    
    Address.findOne({"_id":req.user.address}).then(address=>{
        
        address.address=req.body.address
        address.city=req.body.city
        address.state=req.body.state
        address.pincode=req.body.pincode
        address.phoneno=req.body.phoneno
        address.save().then(address=>{
            return res.sendStatus(200)
        }).catch(err)
        
    }).catch(err)
    

})

//GET
router.get('/get',(req,res)=>{
    if(!req.body.AccessToken){return res.sendStatus(500)}
    const token = req.body.AccessToken
    User.findOne({"_id":token}).then(user=>{
        if(!user){return res.sendStatus(500)}
        const snd={"name":user.name,"username":user.username}
        return res.json(snd)
    }).catch(err)
})



router.get('/list/:page',protectRoute,(req,res)=>{
    if(isNaN(req.params.page)){return res.sendStatus(500)}
    const perpage=10,
        pagenum=Number(req.params.page)
    User.find().limit(perpage ).skip(pagenum > 0 ? ( ( pagenum - 1 ) * perpage ) : 0).populate("address").exec().then(users=>{
        console.log(req.headers["key"])
        return res.json(users)
        
    }).catch(err)
})

module.exports= router;