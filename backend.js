const express = require('express');
const db = require('./db')
const cors = require('cors')
const multer = require('multer')
const bodyparser = require('body-parser')
const path = require('path')
const app = express();
app.use(express.static("./public"))

const  PORT = 3002;
app.use(cors());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json())

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({ storage: storage });

app.get("/api/get", (req,res)=>{
    db.query("SELECT * FROM Users", (err,result)=>{
        if(err) {
        console.log(err)
        } 
    res.send(result)
    });
});

app.post("/api/getPhotos", (req,res)=>{
    const userId = req.body.userId;

    db.query(`SELECT P.photo_id, P.src, P.category, P.info from (SELECT Distinct(photo_id) from Ratings Where user_id = ${ userId }) as R Right join Photos P on R.photo_id = P.photo_id Where ISNULL(R.Photo_id) and P.user_id <> ${ userId };`, (err,result)=>{
        if(err) {
            console.log(err)
        } 
        res.send(result)
    });
});

app.post("/api/getMyPhotos", (req,res)=>{
    const userId = req.body.userId;

    db.query(`SELECT P.photo_id, P.src, ROUND(AVG(R.stars),2) as 'avg', P.category, P.info from (SELECT * from Photos where user_id = ${ userId }) as P Join Ratings R on P.photo_id =
    R.photo_id GROUP BY P.photo_id, P.src;`, (err,result)=>{
        if(err) {
            console.log(err)
        } 
        res.send(result)
    });
});

app.post("/api/getPhoto", (req,res)=>{
    const photoId = req.body.photoId;

    db.query(`SELECT src from Photos where photo_id like ${ photoId };`, (err,result)=>{
        if(err) {
            console.log(err)
        } 
        res.send(result)
    });
});

app.post("/api/deletePhoto", (req,res)=>{
    const photoId = req.body.photoId;

    db.query(`DELETE from Photos where photo_id like ${ photoId };`, (err,result)=>{
        if(err) {
            console.log(err)
        } 
        res.send(result)
    });
});

app.get("/api/getOutfits", (req,res)=>{
    db.query(`Select * from Outfits;`, (err,result)=>{
        if(err) {
            console.log(err)
        } 
        res.send(result)
    });
});

app.post("/api/addPhotoInfo", (req,res)=>{
    const photoId = req.body.photoId;
    const category = req.body.category;
    const info = req.body.info;

    db.query(`UPDATE Photos SET category = '${ category }', info = '${ info }' where photo_id like ${ photoId };`, (err,result)=>{
        if(err) {
            console.log(err)
        } 
        res.send(result)
    });
});

app.post("/api/getUser", (req,res)=>{
    const email = req.body.email;

    db.query(`SELECT user_id from Users WHERE email = '${ email }'`, (err,result)=>{
        if(err) {
            console.log(err)
            res.send('false')
        } else {
            res.send(result)
        }
    });
});

app.post('/api/create', (req,res)=> {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const avatar = req.body.avatar;

    db.query("INSERT INTO Users (name, surname, email, avatar) VALUES (?,?,?,?)",[name,surname,email,avatar], (err,result)=>{
        if(err) {
            console.log(err)
        } else {
            res.send([result.insertId])
        }
    });
})

app.post("/api/uploadImage", upload.single('file'), (req, res) => {
    console.log(req);
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)
        db.query("INSERT INTO Photos (user_id, src) VALUES(?,?);", [req.body.userId,'http://127.0.0.1:3002/images/' + req.file.filename], (err, result) => {
            if (err) throw err
            res.send([result.insertId])
        })
    }
});

app.post('/api/ratePicture', (req,res)=> {
    const photoId = req.body.photoId;
    const userId = req.body.userId;
    const star = req.body.numOfStars;
    const comment = req.body.comment;

    db.query("INSERT INTO Ratings (photo_id, user_id, star, comment) VALUES (?,?,?,?)",[photoId,userId,star,comment], (err,result)=>{
        if(err) {
            console.log(err)
        } else {
            res.send([result])
        }
    });
})

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})