const express = require("express");
const bcrypt = require("bcryptjs")

const db = require("./dbConnect.js")

const app = express();
app.use(express.json())

app.get("/hi",(req,res)=>{
    res.send("hello world")
})

app.post("/jobseeker", async (req,res)=>{
    //res.send("creating jobseeker");
    //console.log("request body", req.body)

    var nameFirst= req.body.nameFirst;
    var nameLast = req.body.nameLast;
    var email = req.body.email;
    var password = req.body.password;

    if(!nameFirst || !nameLast || !email || !password){
        return res.status(400).send("Bad Request")
    }

    nameFirst = nameFirst.replace("'","''")
    nameLast = nameLast.replace("'","''")

    var emailCheckQuery = `SELECT Email
    FROM JobSeeker
    WHERE Email = '${email}'`;

    var existingUser = await db.executeQuery(emailCheckQuery);

    //console.log("existing user", existingUser)
    if(existingUser[0]){
        return res.status(409).send("Please enter a different email")
    }

    var hashedPassword = bcrypt.hashSync(password)
    var insertQuery = `INSERT INTO JobSeeker(NameFirst,NameLast,Email,Password)
    VALUES('${nameFirst}','${nameLast}', '${email}','${hashedPassword}')
    `

    db.executeQuery(insertQuery)
        .then(()=>{res.status(201).send()})
        .catch((err)=>{
            console.log("error in POST /jobseeker",err)
            res.status(500).send()
        })
})

app.get("/workplaces", (req,res)=>{
    //get data from database
    db.executeQuery(`SELECT *
    FROM Workplace
    LEFT JOIN Industry
    ON Industry.IndustryPK = Workplace.IndustryFK`)
    .then((result)=>{
        res.status(200).send(result)
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send()
    })
})

app.get("/workplaces/:pk", (req, res)=>{
    var pk = req.params.pk
    // console.log("my PK:" , pk)

    var myQuery = `SELECT *
    FROM Workplace
    LEFT JOIN Industry
    ON Industry.IndustryPK = Workplace.IndustryFK
    WHERE workplacePk = ${pk}`

    db.executeQuery(myQuery)
        .then((workplace)=>{
            // console.log("Movies: ", movies)

            if(workplace[0]){
                res.send(workplace[0])
            }else{res.status(404).send('bad request')}
        })
        .catch((err)=>{
            console.log("Error in /movies/pk", err)
            res.status(500).send()
        })
})

app.listen(5000,()=>{console.log("app is running on port 5000")});