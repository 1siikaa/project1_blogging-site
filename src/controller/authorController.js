const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
const {isValidName, isValidEmail, isValidPassword, forName}=require("../validate/validation")

//---------------------------------------------------- Sign Up author ----------------------------------------------

const createAuthors = async function(req, res){
    try{
        if(Object.keys(req.body).length==0){
           return res.status(400).send({status:false, msg:"can not register author details  with empty body"})}
      

// validation starts 
        if (!req.body.fname) { return res.status(400).send({ status: false, message: "fname is mandatory" }) }
        if (!req.body.lname) { return res.status(400).send({ status: false, message: "lname is mandatory" }) }
        if (!req.body.title) { return res.status(400).send({ status: false, message: "title is mandatory" }) }
        if (!req.body.email) { return res.status(400).send({ status: false, message: "email is mandatory" }) }
        if (!req.body.password) { return res.status(400).send({ status: false, message: "password is mandatory" }) }

        //==============================validation by using Regex=============================================================// 
if(req.body.email){req.body.email= req.body.email.toString()}
if(req.body.password){req.body.password=req.body.password.toString()}

        if (!isValidName(req.body.fname)&& !forName(req.body.fname)) return res.status(400).send({ status: false, message: "plz provide valid fname" })
        if (!isValidName(req.body.lname) && !forName(req.body.lname)) return res.status(400).send({ status: false, message: "plz provide valid lname" })

    if (!["Miss", "Mrs", "Mr"].includes(req.body.title)) return res.status(400).send({ status: false, message: "title can take only from Mr, Miss, Mrs" })

       if(!isValidEmail(req.body.email)){return res.status(400).send({status:false, msg:"this is not a valid emailId"})}
       if(!isValidPassword(req.body.password)){return res.status(400).send({status:false, msg:"this is not a valid password , password should contain atleast one special character, one lowercase letter, one uppercase letter , one digit between 0-9 and a length between 8-15 characters."})}
// validation ends


// if an author already exist with the same email or password
    if(await authorModel.findOne({email:req.body.email})){
    return res.status(400).send({status:false, msg:"This email is already exist. Please login or provide another email address."})}
    return res.status(201).send({status:true, data:await authorModel.create(req.body)})
    }
    catch(error){return res.sendStatus(500)}}



//---------------------------------------- Sign In ----------------------------------------------------

const authorLogin= async function(req,res){
        try{
       
 // requirement   

        if(Object.keys(req.body).length==0){
           return res.status(400).send({status:false, message:"Please provide email and password for signing in."})}
          
            if(req.body.email){req.body.email= req.body.email.toString()}
            if(req.body.password){req.body.password=req.body.password.toString()}
// validation starts 


       if(!req.body.email || !req.body.password){return res.status(400).send({status:false, message:"both fields are required to sign in."})}
           


          //==============================validation by using Regex=============================================================// 

if(!isValidEmail(req.body.email)){return res.status(400).send({status:false, msg:"invalid email/ email id is not correct."})}
if(!isValidPassword(req.body.password)){return res.status(400).send({status:false, msg:"invalid password/ password is not correct."})}

// validation ends
const authorDetail = await authorModel.findOne({email:req.body.email,password:req.body.password})

// if author has not registered 
if(!authorDetail){
    return res.status(404).send({status:false, msg:"you are not registered. first signup then try to sign in again."})}

// jwt token generation 

return res.status(200).send({status:true, message:"using this token stay signed in for 24 hours" ,data:jwt.sign({
    id:authorDetail._id,},"blogging-site",{ expiresIn: '24h'})})}

catch(error){
 return res.sendStatus(500)}}



module.exports.createAuthors= createAuthors
module.exports.authorLogin=authorLogin
