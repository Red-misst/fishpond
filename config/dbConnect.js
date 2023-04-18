const {default : mongoose } = require ("mongoose");

const dbConnect = ()=>{
    try{
    mongoose.set('strictQuery',false);
    const conn = mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected succesfully");
}
catch(error){
     console.log("Database error");
}
};

module.exports = dbConnect;