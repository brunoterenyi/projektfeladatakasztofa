const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');
const { request } = require('http');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

let szavak = [];
let megfejtes = '';
let tippek = [];
let hibak = 0;
const maxHiba = 6;

router.get('/words', (request, response) => {
    response.status(200).json(szavak);
});

router.post('/words', (request, response) => {
    const szo = request.body.word.trim().toUpperCase();

    if (szo === '') {
        message: 'A szó nem lehet üres.';
    }
    if (szavak.includes(szo)) {
        message: 'Ez a szó már létezik.';
    }

    szavak.push(szo);
    response.status(200).json({
        message: 'A szó hozzáadva.',
        words: szavak
    });
});
router.delete('/words/:word', (request, response) => {
    const szo = request.word.toUpperCase();
    const index = szavak.indexOf(szo);

    if (index === -1) {
        return response.status(404).json({
            message: 'Ez a szó nem található'
        });
    }
});

szavak.splice(index, 1);

response.status(200).json({
    message: 'Szó törölve',
    words: szavak
});

router.post('/game/new', (request, response) => {
    if (szavak.length === 0) {
        return response.status(400).json({
            message: 'Nincs szó a játékhoz!'
        });
    }
});

module.exports = router;
