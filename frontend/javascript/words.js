async function szavakBetoltese() {
    const response = await fetch('/api/words');
    const szavak = await response.json();

    const lista = document.getElementById('wordList');
    lista.innerHTML = '';

    for (let i = 0; i < szavak.length; i++) {
        const elem = document.createElement('li');
        elem.className =
            'list-group-item d-flex justify-content-between align-items-center';

        const szoveg = document.createElement('span');
        szoveg.textContent = szavak[i];

        const gomb = document.createElement('button');
        gomb.textContent = 'Törlés';
        gomb.className = 'btn btn-danger btn-sm';

        gomb.addEventListener('click', async function () {
            await szoTorlese(szavak[i]);
        });

        elem.appendChild(szoveg);
        elem.appendChild(gomb);
        lista.appendChild(elem);
    }
}

async function szoHozzaadasa() {
    const input = document.getElementById('wordInput');
    const szo = input.value.trim();

    const response = await fetch('/api/words', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word: szo })
    });

    const data = await response.json();

    document.getElementById('message').textContent =
        data.message;

    if (response.ok) {
        input.value = '';
    }

    szavakBetoltese();
}

async function szoTorlese(szo) {
    const response = await fetch(
        '/api/words/' + encodeURIComponent(szo),
        { method: 'DELETE' }
    );

    const data = await response.json();

    document.getElementById('message').textContent =
        data.message;

    szavakBetoltese();
}

document.getElementById('addButton').addEventListener(
    'click', szoHozzaadasa
);

szavakBetoltese();