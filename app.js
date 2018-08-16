const express = require('express');
const fs = require('fs');
const cors = require('cors');
const {urlencoded} = require('body-parser');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded());

app.get('/books',async (req,res)=>{
    let data = await fs.readFileSync(`${__dirname}/lib/books.json`);
    res.json(JSON.parse(data.toString()));
});

app.post('/books',async (req,res)=>{
    let data = await fs.readFileSync(`${__dirname}/lib/books.json`);
    data = JSON.parse(data.toString());
    let newId = (Number(data.books[data.books.length-1].id)+1).toString();
    let newBook =
    {
        id: newId,
        authorName: req.body.authorName,
        publishedDate: req.body.publishedDate,
        title: req.body.title
    }
    data.books.push(newBook);
    fs.writeFileSync(`${__dirname}/lib/books.json`, JSON.stringify(data));
    res.json(data);
});

app.put('/books/:id',async(req,res)=>{
    let data = await fs.readFileSync(`${__dirname}/lib/books.json`);
    data = JSON.parse(data.toString());
    for (let book of data.books){
        if(book.id === req.params.id){
            book.authorName = req.body.authorName;
            book.title = req.body.title;
            book.publishedDate = req.body.publishedDate;
            break;
        }
    }
    fs.writeFileSync(`${__dirname}/lib/books.json`, JSON.stringify(data));
    res.json(data);
})

app.delete('/books/:id',async(req,res)=>{
    let data = await fs.readFileSync(`${__dirname}/lib/books.json`);
    data = JSON.parse(data.toString());
    for(let i = 0; i<data.books.length ; i++)
    {
        if(data.books[i].id === req.params.id){
            data.books.splice(i,1);
            break;
        }
    }
    fs.writeFileSync(`${__dirname}/lib/books.json`, JSON.stringify(data));
    res.json(data);
})

// app.listen(process.env.PORT,()=>{
app.listen(PORT,()=>{
    console.log("listenning on port", PORT);
})