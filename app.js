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
// seedprofile()

//____________Question 1 End______________________


//_______________Question 2__________________
//Avarage age count
const avarageAge=()=>{
    const currentYear=Number(Date().split(' ')[3])
    Userprofile.find().then(usersp=>{
        if(!usersp){return console.log('no user found')}
        let totalAge=0
        usersp.forEach(user=>{
            
            let age = currentYear - Number(user.dob.toDateString().split(' ')[3])
            totalAge = totalAge + age
        })
        let avgage=totalAge/usersp.length
        console.log(avgage)
    }).catch(err)
}
//avarageAge()

//delete age more than 25

const deleteAt25=()=>{
    const currentYear=Number(Date().split(' ')[3])
    Userprofile.find().then(usersp=>{
        if(!usersp){return console.log('no user found')}
        usersp.forEach(userp=>{
            let age = currentYear - Number(userp.dob.toDateString().split(' ')[3])
            if(age>25){
                console.log(userp.user_id)
                User.findOneAndDelete({"_id":userp.user_id}).then(del=>{
                    userp.remove()
                }).catch(err)
                
            }
        })
    }).catch(err)
}
//deleteAt25()


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