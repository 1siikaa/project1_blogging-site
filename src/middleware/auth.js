const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")
const blogModel = require("../models/blogModel")

//-------------------------------------------  Authentication  ----------------------------------------------------


const authentication = async (req,res,next) => {
   try {

    // requirements 
        if(!req.headers["x-api-key"])
         return res.status(400).send({status:false, message:"token must be present inside the header"})


// authentication 
    jwt.verify(req.headers["x-api-key"], "blogging-site", function (err, decodedToken){
if(err){
    return res.status(401).send({status:false, message:err.message})
    }
    else{
        req.identity=decodedToken.id
        next()
    }
})}

catch(err){
    res.status(500).send({status:false, message: err.message})}}


//------------------------------------------  Authorisation -----------------------------------------------------------------------------


const authorisation = async (req,res,next) => {
     try{
        // requirements
 if(!req.params.blogId){
    res.status(400).send({status:false, message:"blogId should be present in path parameters"})
 }

 // validation of ObjectId
  if(!isValidObjectId(req.params.blogId)){
 res.status(400).send({status: false, msg:"please use valid ObjectId!!"})}
 
  let findBlogById= await blogModel.findById({_id:req.params.blogId})

  // authorization 
  if(req.identity==findBlogById.authorId)
     next()

else{
    res.status(403).send({status: false,message:"You are unauthorized to do this!!!"})}}

 catch(err){
         res.status(500).send({status:false, message:err.message})}}


module.exports.authentication = authentication
module.exports.authorisation = authorisation