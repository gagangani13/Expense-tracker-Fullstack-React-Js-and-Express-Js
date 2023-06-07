const jwt  = require("jsonwebtoken")

module.exports.tokenDecrypt=(req,res,next)=>{
    try {
        const tokenId=req.header('Authorization')
        const decode=jwt.verify(tokenId,'ufhuebfdnvddsd8t4y48irnigmv04t409g0bjmbwbfknbknnrgjbg')
        req.userId=decode
        req.page=req.query.page
        next()  
    } catch (error) {
        res.send({message:'Token Error'})
    }
}