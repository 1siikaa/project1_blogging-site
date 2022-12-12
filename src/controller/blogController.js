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

    let {body, title, authorId, category,tags, subcategory, isPublished,isDeleted}= req.body

    // validation starts
      if (!title) { return res.status(400).send({ status: false, message: "title is mandatory" }) }
      if (!body) { return res.status(400).send({ status: false, message: "body is mandatory" }) }
      if (!authorId) { return res.status(400).send({ status: false, message: "authorId is mandatory" }) }
      if (!category) { return res.status(400).send({ status: false, message: "category is mandatory" }) }


          //==============================validation by using Regex=============================================================// 

          if (!isValidName(title)) return res.status(400).send({ status: false, message: "plz provide title" })
          if (!isValidName(body)) return res.status(400).send({ status: false, message: "Plz provied a valid body" })
          if (!isValidName(category)) return res.status(400).send({ status: false, message: "category is not valid" })
          

    if (!mongoose.isValidObjectId(authorId)) {
      res.status(400).send({status: false, message: "invalid author id"})}

      if(tags){
        if(typeof (tags)== "object"){
      tags=tags.map((ele)=>ele.toString())
        }
        else{
          return res.status(400).send({status:false, message: "type of tags field is not valid."})}}
  
          if(subcategory){
            if(typeof (subcategory)== "object"){
          subcategory=subcategory.map((ele)=>ele.toString())
            }
            else{
              return res.status(400).send({status:false, message: "type of subcategory field is not valid."})}}
      
      if(isPublished){
      if(isPublished==true){
        let today= moment().format('YYYY-MM-DD, hh:mm:ss a')
  req.body.publishedAt=today
      }
      else if(isPublished==false){
        req.body.publishedAt= null
      }
    else{
      return res.status(400).send({status:false, message:"type of isPublished is not valid."})
    }}
    
    if(isDeleted){
      if(isDeleted==true){
       return res.status(400).send({status:false, message:"you can not delete a document from here."})
      }
      else if(isDeleted==false){
        req.body.deletedAt= null
      }
    else{
      return res.status(400).send({status:false, message:"type of isDeleted is not valid."})}}
  
// validation ends 

    const document = await blogModel.create(req.body);
    return res.status(201).send({ status: true, data:document});}
      
      catch (error) {
    return res.status(500).send({ status: false, message: error.message }) }};


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

      let filteredBlogs = await blogModel.find(req.query )
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
      res.status(400).send({status:false, message:"body is imprtant to update a document"})
    }
    let {isDeleted, isPublished, title, tags, category, subcategory, body, publishedAt, deletedAt}= req.body
// validation starts
    if(title){
    if (!isValidName(title)) return res.status(400).send({ status: false, message: "plz provide title" })
    }
    if(body){
    if (!isValidName(body)) return res.status(400).send({ status: false, message: "Plz provied a valid body" })
    }
    if(category){
    if (!isValidName(category)) return res.status(400).send({ status: false, message: "category is not valid" })
    }
    if(tags){
      if(typeof (tags)== "object"){
    tags=tags.map((ele)=>ele.toString())
      }
      else{
        return res.status(400).send({status:false, message: "type of tags field is not valid."})}}

        if(subcategory){
          if(typeof (subcategory)== "object"){
        subcategory=subcategory.map((ele)=>ele.toString())
          }
          else{
            return res.status(400).send({status:false, message: "type of subcategory field is not valid."})}}
    let today
    if(isPublished){
    if(isPublished==true){
       today= moment().format('YYYY-MM-DD, hh:mm:ss a')
req.body.publishedAt=today
    }
    else if(isPublished==false){
    res.status(400).send({status:false, message:"can not unpublish document after publishing it."})
    }
  else{
    return res.status(400).send({status:false, message:"type of isPublished is not valid."})
  }}
  
  if(isDeleted){
    if(isDeleted==true){
      res.status(400).send({status:false, message:"you can not delete a document from here."})
    }
    else if(isDeleted==false){
      req.body.deletedAt= null
    }
  else{
    return res.status(400).send({status:false, message:"type of isDeleted is not valid."})}}

    const updatedDocument= await blogModel.findOneAndUpdate({_id:req.params.blogId},
      {title:title, body:body, isPublished:isPublished, publishedAt:publishedAt, isDeleted:isDeleted, category:category, deletedAt:deletedAt, $push:{tags:tags, subcategory:subcategory}},
      {new:true})
      if(Object.keys(updatedDocument).length!==0){
    res.status(200).send({ status: true, message: "blog is successfully updated", data: updatedDocument})}
    else{
      res.status(404).send({status:false, message:"can not find the document to update."})
    }
    
  }
    catch (err) {
    res.status(500).send({status:false, message: err.message })}};




//............................................................. DELETE API's ..............................................................................
//............................................................. Delete By Path Param ..............................................................................




const deleteDocument = async function (req, res) {
  try {
    const today= moment().format('YYYY-MM-DD, hh:mm:ss a')
    const deactivatedData= await blogModel.findOneAndUpdate({_id:req.params.blogId},
{isDeleted:true, deletedAt:today},
{new : true}
    )
    if(Object.keys(deactivatedData).length!==0){
   return  res.status(200).send()}
    else{
      res.status(404).send({status:false, message:'this blog does not exist.'})
    }
  } 
    catch (err) {
    res.status(500).send({status:false, message:err.message});}};



//----------------------------------------------- Delete by Query Param ------------------------------------------



const deleteDocByQuery = async function (req, res) {
  try {
    //requirements 

      if(Object.keys(req.query).length==0){
        return res.status(400).send({status:false, message:"enter atleast one query to delete the matched document."})}
        
        let{title, body, category, subcategory,tags, authorId}= req.query
    
       
        // validation starts   
        if(authorId){
        if(!mongoose.isValidObjectId(authorId))
        return res.status(400).send({status:false, message:"authorId is not a valid ObjectId"})
       }
      let findDocs= await blogModel.find(req.query)
      if(!findDocs){
        return res.status(400).send({status:false, message:"BLOG IS NOT AVAILABLE"})
        
      }
      const identity= req.identity

      let deletedData=[]
      let deletedDoc
for(let i=0; i<findDocs.length; i++){
  if(findDocs[i].authorId==identity){         
    deletedDoc = await blogModel.findOneAndUpdate({authorId:identity,isDelete:false, isPublished:true,$or:[{category:category, subcategory:subcategory, tags:tags, body:body, title:title}]},
      { isDeleted: true, deletedAt: new Date() },);

    deletedData.push(deletedDoc)}}

    if(deletedData.length!==0){
      return res.status(200).send();}

     else{
      return res.status(400).send({status:false, message:"can not delete these blogs. May be they don't exist at your end!!"})}}
     
    catch (err) {
    res.status(500).send({status:false, message: err.message })}};





module.exports.createBlogs = createBlogs;
module.exports.updateBlog = updateBlog;
module.exports.fetchBlogs= fetchBlogs
module.exports.deleteDocument = deleteDocument
module.exports.deleteDocByQuery= deleteDocByQuery
