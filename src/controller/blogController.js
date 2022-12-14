const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");
const { isValidName}=require("../validate/validation")
const moment = require("moment");

//---------------------------------------- Blog Creation --------------------------------------------------

const createBlogs = async function (req, res) {
  try {
    // checking requirements
    if (Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "invalid request put valid data in body" });}


    // validation starts
      if (!req.body.title) { return res.status(400).send({ status: false, message: "title is mandatory" }) }
      if (!req.body.body) { return res.status(400).send({ status: false, message: "body is mandatory" }) }
      if (!req.body.authorId) { return res.status(400).send({ status: false, message: "authorId is mandatory" }) }
      if (!req.body.category) { return res.status(400).send({ status: false, message: "category is mandatory" }) }


          //==============================validation by using Regex=============================================================// 

          if (!isValidName(req.body.title)) return res.status(400).send({ status: false, message: "plz provide title" })
          if (!isValidName(req.body.body)) return res.status(400).send({ status: false, message: "Plz provied a valid body" })
          if (!isValidName(req.body.category)) return res.status(400).send({ status: false, message: "category is not valid" })
          

    if (!mongoose.isValidObjectId(req.body.authorId)) {
      return res.status(400).send({status: false, message: "invalid author id"})}

      if(req.body.tags){
        if(typeof (req.body.tags)== "object"){
      req.body.tags=req.body.tags.map((ele)=>ele.toString())
        }
        else{
          return res.status(400).send({status:false, message: "type of tags field is not valid."})}}
  
          if(req.body.subcategory){
            if(typeof (req.body.subcategory)== "object"){
          req.body.subcategory=req.body.subcategory.map((ele)=>ele.toString())
            }
            else{
              return res.status(400).send({status:false, message: "type of subcategory field is not valid."})}}
      
      if(req.body.isPublished){
      if(req.body.isPublished==true){
        req.body.publishedAt= moment().format('YYYY-MM-DD, hh:mm:ss a')}
    else{return res.status(400).send({status:false, message:"type of isPublished is not valid."})}}
    
    if(req.body.isDeleted){
      if(req.body.isDeleted==true){
       return res.status(400).send({status:false, message:"you can not delete a document from here."})}
     
    else{return res.status(400).send({status:false, message:"type of isDeleted is not valid."})}}
  
// validation ends 

  
    return res.status(201).send({ status: true, data: await blogModel.create(req.body)})}
      
      catch (error) {
    return res.status(500).send({ status: false, message: error.message })}};


//............................................................... GET API's ..............................................................................


const fetchBlogs = async (req, res) => {
  try {
// fetching all resources without filters

    if (Object.keys(req.query).length == 0) {
      const allBlogs = await blogModel.find({isDeleted:false, isPublished:true});
        if (allBlogs.length!== 0) { 
     return res.status(200).send({status:true, message:"no query", data: allBlogs });}
     else{
      return res.status(404).send({status:false, message:"No blogs found"})
     }}

      
    // fetching all resources with the matching filters

    if (Object.keys(req.query).length !== 0){   //manipulating filters
      req.query.isDeleted=false
      req.query.isPublished=true

      const filteredBlogs = await blogModel.find(req.query )
      if(filteredBlogs.length==0){
        return res.status(404).send({status:false, message:"No blogs found with these filter"})}
else{
      return res.status(200).send({status:true, message:"query",data: filteredBlogs });}}}

     catch (error) {
   return res.status(500).send({status:false, message: error.message });}};




//.............................................................................. Update API's .............................................................
//............................................................. Update By Path Param ..............................................................................




const updateBlog = async function (req, res) {
  try {
  // requirements
    if(Object.keys(req.body).length==0){
      return res.status(400).send({status:false, message:"body is imprtant to update a document"})
    }
// validation starts
    if(req.body.title){
    if (!isValidName(req.body.title)) return res.status(400).send({ status: false, message: "plz provide title" })
    }
    if(req.body.body){
    if (!isValidName(req.body.body)) return res.status(400).send({ status: false, message: "Plz provied a valid body" })
    }
    if(req.body.category){
    if (!isValidName(req.body.category)) return res.status(400).send({ status: false, message: "category is not valid" })
    }
    if(req.body.tags){
      if(typeof (req.body.tags)== "object"){
    req.body.tags=req.body.tags.map((ele)=>ele.toString())
      }
      else{
        return res.status(400).send({status:false, message: "type of tags field is not valid."})}}

        if(req.body.subcategory){
          if(typeof (req.body.subcategory)== "object"){
        req.body.subcategory=req.body.subcategory.map((ele)=>ele.toString())
          }
          else{
            return res.status(400).send({status:false, message: "type of subcategory field is not valid."})}}
 
    if(req.body.isPublished){
    if(req.body.isPublished===true){req.body.publishedAt=moment().format('YYYY-MM-DD, hh:mm:ss a')
    }
    else if(req.body.isPublished===false){
    return res.status(400).send({status:false, message:"can not unpublish document after publishing it."})
    }
  else{return res.status(400).send({status:false, message:"type of isPublished is not valid."})}}
  
  if(req.body.isDeleted){
    if(req.body.isDeleted===true){
      return res.status(400).send({status:false, message:"you can not delete a document from here."})}
    else if(req.body.isDeleted===false){
      req.body.deletedAt= null}
  else{return res.status(400).send({status:false, message:"type of isDeleted is not valid."})}}

    const updatedDocument= await blogModel.findOneAndUpdate({_id:req.params.blogId},
      {title:req.body.title, body:req.body.body, isPublished:req.body.isPublished, publishedAt:req.body.publishedAt, isDeleted:req.body.isDeleted, category:req.body.category, deletedAt:req.body.deletedAt, $push:{tags:req.body.tags, subcategory:req.body.subcategory}},
      {new:true})
      if(Object.keys(updatedDocument).length!==0){
    return res.status(200).send({ status: true, message: "blog is successfully updated", data: updatedDocument})}
    else{
      return res.status(404).send({status:false, message:"can not find the document to update."})
    }}
    catch (err) {
    res.sendStatus(500)}};




//............................................................. DELETE API's ..............................................................................
//............................................................. Delete By Path Param ..............................................................................

const deleteDocument = async function (req, res) {
  try {
    
const deactivatedData= await blogModel.findOneAndUpdate({_id:req.params.blogId},
{isDeleted:true, deletedAt:moment().format('YYYY-MM-DD, hh:mm:ss a')},
{new : true})

    if(Object.keys(deactivatedData).length!==0){return  res.status(200).send()}
    else{return res.status(404).send({status:false, message:'this blog does not exist.'})}} 
    
    catch (err) {return res.sendStatus(500)}};



//----------------------------------------------- Delete by Query Param ------------------------------------------



const deleteDocByQuery = async function (req, res) {
  try {
    //requirements 

      if(Object.keys(req.query).length==0){
        return res.status(400).send({status:false, message:"enter atleast one query to delete the matched document."})}
        
    
       
        // validation starts   
        if(req.query.authorId){
        if(!mongoose.isValidObjectId(req.query.authorId))
        return res.status(400).send({status:false, message:"authorId is not a valid ObjectId"})
        }
        req.query.isDeleted=false
        req.query.isPublished=true
      const findDocs= await blogModel.find(req.query)
      if(!findDocs){
        return res.status(400).send({status:false, message:"BLOG IS NOT AVAILABLE"})
        
      }
   

let deletedData=[] 
for(let i=0; i<findDocs.length; i++){
  if(findDocs[i].authorId==req.identity){    

    deletedData.push(await blogModel.findOneAndUpdate({authorId:req.identity,isDeleted:false, isPublished:true,$or:[{category:req.query.category, subcategory:req.query.subcategory, tags:req.query.tags, body:req.query.body, title:req.query.title}]},
    { isDeleted: true, deletedAt: new Date() },{new:true}))}}

    if(deletedData.length!==0){
      return res.status(200).send();}

     else{
      return res.status(400).send({status:false, message:"can not delete these blogs. May be they don't exist at your end!!"})}
}
    catch (err) {
   return res.sendStatus(500)}};





module.exports.createBlogs = createBlogs;
module.exports.updateBlog = updateBlog;
module.exports.fetchBlogs= fetchBlogs
module.exports.deleteDocument = deleteDocument
module.exports.deleteDocByQuery= deleteDocByQuery
