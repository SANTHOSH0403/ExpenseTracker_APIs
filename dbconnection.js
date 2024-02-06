const {MongoClient}= require('mongodb')

let dbconnection

function connectoDB(callBack){
   MongoClient.connect('mongodb+srv://santhosh27:santhosh_27@cluster0.vdxvwah.mongodb.net/?retryWrites=true&w=majority').then
   (function(client){
    dbconnection=client.db()
    callBack()

}).catch(function(error){
    callBack(error)
})
    

}
function getDB(){
 return dbconnection
}

module.exports={connectoDB,getDB}