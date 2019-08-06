const express=require('express');
const mysql=require('mysql');
const cors=require('cors');

const PORT = process.env.PORT || 4000;

const app = express();



const connection=mysql.createConnection({
   host: 'localhost',
   user:'root',
   password:'password',
   database: 'acme'
});

SELECT_ALL='SELECT * FROM users';

connection.connect((err)=>{
   if(err){
      throw err;
   }
   console.log('MySQL Connected...');
});

app.use(cors());

app.get('/',(req,res)=>{
   res.send('go to /users to see all users')
});

app.get('/users',(req,res)=>{
   connection.query(SELECT_ALL,(err,results)=>{
      if(err){
         return res.send(err)
      }
      else{
         return res.json({
            data: results
         })
      }
   })
});

app.get('/users/add',(req,res)=> {
   const {username,password}=req.query;
   const INSERT_USER=`INSERT INTO users (username,userPasswords) VALUE (\'${username}\',sha2(CONCAT(\'${password}\',\'boring\'),256))`;
   connection.query(INSERT_USER, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send('user successfully added');
   });
});

app.get('/users/get',(req,res)=> {
   const {username,password}=req.query;
   const GET_USER=`select * from users where username=\'${username}\' and userPasswords=sha2(CONCAT(\'${password}\',\'boring\'),256)`;
   connection.query(GET_USER, (err, result) => {
      if(err){
         return res.send(err)
      }
      else{
         return res.json({
            data: result
         })
      }
   });
});
//UPDATE users set userPasswords=sha2(CONCAT('stevepass', 'boring'),256) where username='steve';
app.get('/users/send', (req,res)=>{
  const {userID,toUserID,message}=req.query;
  const SEND_TO_USER='INSERT INTO messages (messageDATE,messageDATETIME,message,userID,toUserID) VALUE(current_date(),now(),\''+message+'\','+userID+','+toUserID+')';
  connection.query(SEND_TO_USER,(err,result)=>{
     if(err){
        return res.send(err)
     }
     else{
        return res.json({
           data:result
        })
     }
  })
});

app.get('/users/received', (req,res)=>{
   const {userID,toUserID}=req.query;
   const SEND_TO_USER='SELECT * FROM messages WHERE (userID ='+userID+ ' AND toUserID='+ toUserID +') OR (userID ='+toUserID+ ' AND toUserID='+ userID +')ORDER BY messageDATETIME ASC';
   connection.query(SEND_TO_USER,(err,result)=>{
      if(err){
         return res.send(err)
      }
      else{
         return res.json({
            data:result
         })
      }
   })
});

app.listen(PORT, ()=>{
   console.log('App running on port 4000');
});