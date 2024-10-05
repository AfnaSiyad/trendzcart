const mogoose = require("mongoose");

const databaseConnection = ()=>{
    mogoose.connect(process.env.DB_URI)
    .then((data) => console.log(`Database connected with server ${data.connection.host}`))
    .catch((err) => console.log(err.message));
}

module.exports = databaseConnection