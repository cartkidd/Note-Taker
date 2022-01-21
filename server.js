const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const PORT = process.env.PORT || 3000;



//Could be in its own file and folder to have less code in server.js
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Routes (Could be in its own file)
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Display
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    })
});

//New Note
app.post("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuid.v4();
        notes.push(newNote);

        const createNote = JSON.stringify(notes);
        fs.writeFile(path.join(__dirname, "./db/db.json"), createNote, (err) =>{
            if (err) throw err;
        });
        res.json(newNote);
    });
});

//Delete Saved Notes
app.delete("/api/notes/:id", function(req, res) {
    const noteID = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const notesArray = notes.filter(item => {
            return item.id !== noteID
        });
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err, data) => {
            console.log("Deletelos")
            if (err) throw err; 
            res.json(notesArray) 

        });
    });

});


app.listen(PORT, function() {
    console.log(`App listening to ${PORT}`);
});