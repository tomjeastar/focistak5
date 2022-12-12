const express = require('express')
const fs = require("fs");
const bodyParser = require("body-parser")
const uniqid = require('uniqid');
const sanitizeHtml = require('sanitize-html');

const dataFile = "./data/players.json";
const port = 3000

const app = express()

//get players by id
app.get('/players/:id', function (req, res) {
    let id = req.params.id;

    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data) => {
        let players = JSON.parse(data);

        //megkeressük a megfelelő players-ot id alján
        const playersById = players.find(player => player.id === id)
        if (!playersById) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //visszaküldjük
        res.send(playersById);
    });
})

//get players
app.get('/players', function (req, res) {
    fs.readFile(dataFile, (error, data) => {
        let players = data;
        res.send(players);
    });
})


//delete players by id
app.delete('/players/:id', function (req, res) {
    let id = req.params.id;

    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data) => {
        let players = JSON.parse(data);

        //megkeressük a megfelelő players indexét id alján
        const playersIndexById = players.findIndex(player => player.id === id)

        if (playersIndexById === -1) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //letöröljük
        players.splice(playersIndexById, 1);

        //visszaír: obj -> json
        players = JSON.stringify(players)
        fs.writeFile(dataFile, players, (error) => {
            console.log(error);
            //visszaküldjük, hogy melyik id-t töröltük
            res.send({ id: id });
        })
    });
})

//put players by id
app.put('/players/:id', bodyParser.json(), function (req, res) {
    let id = req.params.id;
    let putPlayers = {
        id: id,
        name: sanitizeHtml(req.body.name),
        qualification: sanitizeHtml(req.body.qualification), //A játékos minősítése (1-10)
        position: sanitizeHtml(req.body.position), //hátvéd, csatár, stb.
        club: sanitizeHtml(req.body.club), //melyik klubban játszik
        age: sanitizeHtml(req.body.age), // hány éves
        nationality: sanitizeHtml(req.body.nationality) // nemzetiség
    }
    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data) => {
        let players = JSON.parse(data);

        //megkeressük a megfelelő players indexét id alján
        const playersIndexById = players.findIndex(player => player.id === id)

        if (playersIndexById === -1) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //felülírjuk
        players[playersIndexById] = putPlayers;

        //visszaír: obj -> json
        players = JSON.stringify(players)
        fs.writeFile(dataFile, players, (error) => {
            console.log(error);
            //visszaküldjük, a módosított rekordot
            res.send(putPlayers);
        })
    });
})

//post
app.post('/players', bodyParser.json(), function (req, res) {
    let newPlayers = {
        id: uniqid(),
        name: sanitizeHtml(req.body.name),
        qualification: req.body.qualification, //A játékos minősítése (1-10)
        position: req.body.position, //hátvéd, csatár, stb.
        club: sanitizeHtml(req.body.club), //melyik klubban játszik
        age: req.body.age, // hány éves
        nationality: sanitizeHtml(req.body.nationality) // nemzetiség
    }


    fs.readFile(dataFile, (error, data) => {
        //beolvas, json -> obj
        let players = JSON.parse(data);
        //push
        players.push(newPlayers);
        //visszaír: obj -> json
        players = JSON.stringify(players)
        fs.writeFile(dataFile, players, (error) => {
            console.log(error);
            res.send(newPlayers);
        })

    })

})

app.listen(port)

//<script>alert('betörtem')</script>