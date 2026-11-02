async function ujJatek() {
    const response = await fetch('/api/game/new', {
        method: 'POST'
    });

    const data = await response.json();

    document.getElementById('word').textContent =
        '_ '.repeat(data.wordLength).trim();

    document.getElementById('mistakes').textContent =
        'Hibák: 0 / 6';

    document.getElementById('guessedLetters').textContent =
        'Tippek: -';

    document.getElementById('message').textContent =
        data.message;

    document.getElementById('letter').disabled = false;
    document.getElementById('guessButton').disabled = false;
}

async function tippeles() {
    const input = document.getElementById('letter');
    const betu = input.value.trim().toLocaleUpperCase('hu');

    if (betu === '') {
        document.getElementById('message').textContent =
            'Írj be egy betűt!';
        return;
    }

    const response = await fetch('/api/game/guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ letter: betu })
    });

    const data = await response.json();

    document.getElementById('message').textContent =
        data.message;

    if (!response.ok) {
        input.value = '';
        return;
    }

    document.getElementById('word').textContent =
        data.word.split('').join(' ');

    document.getElementById('mistakes').textContent =
        'Hibák: ' + data.mistakes + ' / ' + data.maxMistakes;

    document.getElementById('guessedLetters').textContent =
        'Tippek: ' + data.guessedLetters.join(', ');

    if (data.status !== 'playing') {
        input.disabled = true;
        document.getElementById('guessButton').disabled = true;
    }

    input.value = '';
}

document.getElementById('guessButton').addEventListener(
    'click', tippeles
);

document.getElementById('newGame').addEventListener(
    'click', ujJatek
);

document.getElementById('letter').addEventListener(
    'keydown', function (event) {
        if (event.key === 'Enter') {
            tippeles();
        }
    }
);

ujJatek();











