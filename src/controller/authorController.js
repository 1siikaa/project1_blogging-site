const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
const { isValidName, isValidEmail, isValidPassword, forName }=require("../validate/validation")

//---------------------------------------------------- Sign Up author ----------------------------------------------

const createAuthors = async function(req, res){
    try{
        if(Object.keys(req.body).length==0){
            res.status(400).send({status:false, msg:"can not register author details  with empty body"})
        }
        const{fname, lname, title, email, password}= req.body

// validation starts 
        if (!fname) { return res.status(400).send({ status: false, message: "fname is mandatory" }) }
        if (!lname) { return res.status(400).send({ status: false, message: "lname is mandatory" }) }
        if (!title) { return res.status(400).send({ status: false, message: "title is mandatory" }) }
        if (!email) { return res.status(400).send({ status: false, message: "email is mandatory" }) }
        if (!password) { return res.status(400).send({ status: false, message: "password is mandatory" }) }

        //==============================validation by using Regex=============================================================// 
if(email){req.body.email= email.toString()}
if(password){req.body.password=password.toString()}

        if (!isValidName(fname)&& !forName(fname)) return res.status(400).send({ status: false, message: "plz provide valid fname" })
        if (!isValidName(lname) && !forName(lname)) return res.status(400).send({ status: false, message: "plz provide valid lname" })

    if (!["Miss", "Mrs", "Mr"].includes(title)) return res.status(400).send({ status: false, message: "title can take only from Mr, Miss, Mrs" })

       if(!isValidEmail(email))
       {
        return res.status(400).send({status:false, msg:"this is not a valid emailId"})
       }
       if(!isValidPassword(password))
       {return res.status(400).send({status:false, msg:"this is not a valid password , password should contain atleast one special character, one lowercase letter, one uppercase letter , one digit between 0-9 and a length between 8-15 characters."})
       }
// validation ends


// if an author already exist with the same email or password
        const uniqueMail= await authorModel.findOne({email:email})
        if(uniqueMail){
     return res.status(400).send({status:false, msg:"This email is already exist. Please login or provide another email address."})}

        const details= await authorModel.create(req.body)
        res.status(201).send({status:true, data:details})
    }
    catch(error){
        res.status(500).send({status:false, message: error.messaage })}}



//---------------------------------------- Sign In ----------------------------------------------------

const authorLogin= async function(req,res){
        try{
       
 // requirement   

        if(Object.keys(req.body).length==0){
            res.status(400).send({status:false, message:"Please provide email and password for signing in."})}
            const{email,password}=req.body
            if(email){req.body.email= email.toString()}
            if(password){req.body.password=password.toString()}

// validation starts 

        if(email.length==0|| password.length==0){
            res.status(400).send({status:false, message:"both fields are required to sign in."})}

          //==============================validation by using Regex=============================================================// 

if(!isValidEmail(email)){res.status(400).send({status:false, msg:"invalid email/ email id is not correct."})}
if(!isValidPassword(password)){res.status(400).send({status:false, msg:"invalid password/ password is not correct."})}

// validation ends


// if author has not registered 
let authorDetail=await authorModel.findOne({email:email,password:password})

if(!authorDetail){
    res.status(404).send({status:false, msg:"you are not registered. first signup then try to sign in again."})}

// jwt token generation 

const token=jwt.sign({
  id:authorDetail._id,
  email:authorDetail.email,
  password:authorDetail.password
},"blogging-site",{ expiresIn: '24h'})

res.setHeader("x-api-key", token)
res.status(200).send({status:true, message:"using this token stay signed in for 24 hours" ,data:token})}
catch(error){
 res.status(500).send({status:false, message:"internal server error", Error: error.message})
 }}



module.exports.createAuthors= createAuthors
module.exports.authorLogin=authorLogin
