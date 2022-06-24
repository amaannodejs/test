const user = require('./models/user');

const express=require('express'),
    uri= "mongodb+srv://amaan:9868439196@cluster0.rwg26nd.mongodb.net/project2?retryWrites=true&w=majority",
    app=express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    userRoutes=require('./routes/users'),
    {faker}=require('@faker-js/faker'),
    User=require('./models/user')






app.use(bodyParser.json());


//routes
app.use("/user",userRoutes)



//seed users
// const seedusers=()=>{
//     for (let i =0; i<50;i++){
//         const user=new User({
//             "name":faker.name.firstName(),
//             "username":faker.internet.userName(),
//             "password":faker.internet.password()
//         })
//         user.save().then(user=>{console.log(user)})
//     }
// }
// seedusers()


mongoose.connect(uri)
    .then(result => {
        app.listen(process.env.PORT || 80, () => {
            console.log('80isUP!')
        });
    })
    .catch(err => {
        console.log(err);
    });

//Deployed url
    //https://excellencetechp2.herokuapp.com/