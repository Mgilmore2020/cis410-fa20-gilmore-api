const sql = require('mssql')
const myConfig = require("./config.js")

const config = {
    user: myConfig.DB.user,
    password: myConfig.DB.password,
    server: myConfig.DB.server, 
    database: myConfig.DB.database,
}

async function executeQuery(aQuery){
    var connection = await sql.connect(config)
    var result = await connection.query(aQuery)

    return result.recordset
}

module.exports = {executeQuery: executeQuery}
