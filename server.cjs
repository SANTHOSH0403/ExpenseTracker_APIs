const express =require('express')
const bodyParser=require('body-parser')
const {connectoDB,getDB} = require('./dbconnection.js')

const {ObjectId} = require('mongodb')

const app=express()
app.use(bodyParser.json())

let db
connectoDB(function (error) {
    if(error){
        console.log('not working')
        console.log(error)
        }

    else{
        app.listen(8000)
        db=getDB()
        console.log('Listening on port 8000...')
    }
})

app.post('/add-entry',function(request,response){
    db.collection('ExpenseCollection').insertOne(request.body).then(function(){
       response.status(200).json({
        "status":"Added successfully" })

    }).catch(function(){
        response.status(501).json({
            "status":"Not Added"
        })
    })
    
})

  app.get('/get-entries',function(request,response){
    const entries=[]
    db.collection('ExpenseCollection')
    .find()
    .forEach(entry=>entries.push(entry))
    .then(function(){
        response.status(200).json(entries)
    }).catch(function(){
        response.status(404).json({
            "status":"Not Fetch"
        })
    })
  })


  app.delete('/delete-entry', function(request, response) {
    if(ObjectId.isValid(request.query.id)) {
        db.collection('ExpensesCollection').deleteOne({
            _id : new ObjectId(request.query.id)
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})

app.patch('/update-entry/:id',function(request,response){
    if(ObjectId.isValid(request.params.id)){
    db.collection('ExpenseCollection').updateOne(
        {_id:new ObjectId(request.params.id)},
       {$set:request.body}
    ).then(function() {
        response.status(200).json({
            "status" : "Entry successfully updated"
        })
    }).catch(function() {
        response.status(500).json({
            "status" : "Entry not updated"
        })
    })
} else {
    response.status(500).json({
        "status" : "ObjectId not valid"
    })
}
})