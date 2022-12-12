const express= require('express')
const router= express.Router()
const authorController= require("../controller/authorController.js")
const blogController= require("../controller/blogController.js")
const middleware = require("../middleware/auth")

//............................................... Post Api .........................................................................................

router.post('/authors', authorController.createAuthors)
router.post('/blogs',middleware.authentication,blogController.createBlogs)

//............................................... Get Api ...........................................................................................

router.get('/blogs',middleware.authentication, blogController.fetchBlogs)

//............................................... Put Api ..........................................................................................

router.put('/blogs/:blogId', middleware.authentication,middleware.authorisation,blogController.updateBlog)

//............................................... Delete Api .......................................................................................

router.delete('/blogs/:blogId',middleware.authentication,middleware.authorisation,blogController.deleteDocument)
router.delete('/blogs',middleware.authentication,blogController.deleteDocByQuery)

//............................................... Post Api for Log In ..............................................................................

router.post('/login',authorController.authorLogin)

//.............................................. Path not found .....................................................................................
router.all("/*", async function(req,res){
    return res.status(404).send({status:false, message:"Page Not Found."})
})

module.exports = router