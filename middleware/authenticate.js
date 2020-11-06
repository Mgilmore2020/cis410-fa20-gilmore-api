const jwt = require("jsonwebtoken")

const db = require("../dbConnect.js")
const config = require("../config.js")
const auth = async(req, res, next)=>{
    //console.log(req.header('Authorization'))
    try{

        //1 Decode token

        let myToken = req.header('Authorization').replace('Bearer ','');
        //console.log(myToken)

        let decodedToken = jwt.verify(myToken, config.JWT)
        //console.log(decodedToken)

        let jobseekerPK = decodedToken.pk
        console.log(jobseekerPK)
        //2.Compare token with db token
        let query = `SELECT JobSeekerPK, NameFirst, NameLast, Email
        FROM JobSeeker
        WHERE JobSeekerPK = ${jobseekerPK} and Token = '${myToken}'
        `
        let returnedUser = await db.executeQuery(query)
        //console.log(returnedUser)
        //3. Save user information in request
        if(returnedUser[0]){
            req.jobseeker = returnedUser[0];
            next()
        }
        else{res.status(401).send("Authentication Failed.")}
    }catch(myError){
        res.status(401).send("Authentication Failed.")
    }
}

module.exports = auth;