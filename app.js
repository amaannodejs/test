const users = require('./models/users')

//dependencies and constants
const uri= "mongodb+srv://amaan:9868439196@cluster0.rwg26nd.mongodb.net/work?retryWrites=true&w=majority",
    mongoose = require('mongoose'),
    express= require('express'),
    {faker}=require('@faker-js/faker'),
    app=express(),
    User=require('./models/users'),
    Userprofile=require('./models/usersprofiles'),
    err=(err)=>{console.log(err)}






//______________Question 1____________
//seeding database

//seeding user
const seedUser=()=>{
    const user= new User({
        "firstname":faker.name.firstName(),
        "lastname":faker.name.firstName(),
        "email":faker.internet.email(),
        "password":faker.internet.password()
    })
    user.save().then(u=>{
        console.log(u)
    }).catch(err=>{
        console.log(err)
    })
}
// for(let i=0; i<5;i++){
//     seedUser()
// }


//seeding userprofile
const seedprofile=async ()=>{
    const users= await User.find()
    if(!users){return console.log('no user found')}
    users.forEach(user=>{
        Userprofile.findOne({"user_id":user._id}).then(userprofile=>{
            console.log(userprofile)
            if(!userprofile){
                let userp= new Userprofile({
                    "user_id":user._id,
                    "dob":faker.date.birthdate(),
                    "mobile_no":faker.phone.number()
                })
                userp.save().then(userp=>{
                    //console.log(userp)
                }).catch(err=>{
                    console.log(err)
                })
            }
        }).catch(err=>{console.log(err)})
       
    })
    
}
seedprofile()

//____________Question 1 End______________________




// const date=faker.date.birthdate()
// date.setMonth(2)
// date.setFullYear(2005)
// date.setDate(02)
// console.log(date)

//routes
app.get('/',(req,res)=>{
    res.send('server is up!')
})


mongoose.connect(uri)
    .then(result => {
        app.listen(80, () => {
            console.log('80isUP!')
        });
    })
    .catch(err => {
        console.log(err);
    });