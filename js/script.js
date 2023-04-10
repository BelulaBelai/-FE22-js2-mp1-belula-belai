
let randomNumber = Math.ceil(Math.random() * 3);

const player = document.querySelector("#spelare");
const computer = document.querySelector("#dator");
const result = document.querySelector("#resultat");
const submit = document.querySelector("#playerName");

const sten = document.querySelector("#sten");
const sax = document.querySelector("#sax");
const påse = document.querySelector("#påse");

const rankingList = document.querySelector('#rankingList');
const scoreContainer = document.querySelector('#scoreContainer');
const scoreTitle = document.querySelector('#scoreTitle');

let spelare;
let datorsumma = 0;
let spelaresumma = 0;
let namn;

submit.addEventListener("click", nameInput);
function nameInput(event) {
    event.preventDefault();
    const h2Element = document.createElement("h2");
    document.body.append(h2Element);
    const textinput = document.querySelector("#name-input");
    player.innerText = textinput.value;
    namn = textinput.value;
    textinput.value = " ";
}

container.addEventListener("click", game);
function game(event) {
    if (event.target.tagName == "BUTTON") {
        randomNumber = Math.ceil(Math.random() * 3);

        if (event.target.id == "sten") {
            spelare = event.target.innerText;
            const h2Element2 = document.createElement("h2");
            document.body.append(h2Element2);
            player.innerText = `${namn}s val: ${spelare}`;

            if (randomNumber == 1) {
                computer.innerText = "Datorns val: sten";
                result.innerText = "Resultat: lika!";

            } else if (randomNumber == 2) {
                computer.innerText = "Dators val: påse";
                result.innerText = "Resultat: datorn vann denna rundan!";
                datorsumma++;

            } else if (randomNumber == 3) {
                computer.innerText = "Datorns val: sax";
                result.innerText = "Resultat: du vann denna rundan!";
                spelaresumma++;
            }
        } else if (event.target.id == "påse") {
            spelare = event.target.innerText;
            const h2Element3 = document.createElement("h2");
            document.body.append(h2Element3);
            player.innerText = `${namn}s val: ${spelare}`;

            if (randomNumber == 0) {
                computer.innerText = "Datorns val: sten";
                result.innerText = "Resultat: du vann denna rundan!";
                spelaresumma++;

            } else if (randomNumber == 1) {
                computer.innerText = "Datorns val: påse";
                result.innerText = "Resultat: lika!";

            } else if (randomNumber == 2) {
                computer.innerText = "Datorns val: sax";
                result.innerText = "Resultat: datorn vann denna rundan";
                datorsumma++;
            }
        } else if (event.target.id == "sax") {
            spelare = event.target.innerText;
            const h2Element4 = document.createElement("h2");
            document.body.append(h2Element4);
            player.innerText = `${namn}s val: ${spelare}`;

            if (randomNumber == 0) {
                computer.innerText = "Datorns val: sten";
                result.innerText = "Resultat: datorn vann denna rundan!";
                datorsumma++;

            } else if (randomNumber == 1) {
                computer.innerText = "Datorns val: påse";
                result.innerText = "Resultat: du vann denna rundan!";
                spelaresumma++;

            } else if (randomNumber == 2) {
                computer.innerText = "Datorns val: sax";
                result.innerText = "Resultat: lika!";
            }
        }
        document.querySelectorAll("h3")[0].innerText = `Datorns poäng:  ${datorsumma}`;
        document.querySelectorAll("h3")[1].innerText = `${namn}s poäng:  ${spelaresumma}`;

        setTimeout(function gameOver() {
            if (datorsumma == 1) {

                let obj = {
                    name: namn,
                    score: spelaresumma
                }

                postNewHighscore(obj)
                alert(`Game over! Din totala poäng blev ${spelaresumma} `);

                const restartGameBtn = document.createElement('button');
                restartGameBtn.innerText = 'Starta om spelet';
                scoreContainer.append(restartGameBtn);
                restartGameBtn.addEventListener("click", function restartGame() {
                    location.reload(true);
                })

            }

        }, 20)
    }
}

async function fetchAllScores() {
    const url = `https://highscore-5838d-default-rtdb.europe-west1.firebasedatabase.app/highscore.json`;
    return fetch(url).then(response => response.json());
}

fetchAllScores();

rankingList.innerHTML = '';

async function displayHighscores() {

    const scores = await fetchAllScores();

    const sortedList = Object.entries(scores)
        .map(([key, value]) => ({ name: value.name, score: value.score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    scoreTitle.innerText = 'Highscore';
    rankingList.innerHTML = sortedList.map(element => `
    <li>
      <p>
        Namn: ${element.name} <br>
        Poäng: ${element.score}
      </p>
    </li>
  `).join('');
}

async function postNewHighscore(obj) {

    const url = `https://highscore-5838d-default-rtdb.europe-west1.firebasedatabase.app/highscore.json`;
    const init = {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(obj)
    };

    await fetch(url, init);
    displayHighscores();
}

async function compareHighscores() {
    const obj = {
        name: namn,
        score: spelaresumma
    }

    const url = `https://highscore-5838d-default-rtdb.europe-west1.firebasedatabase.app/highscore.json`;

    const response = await fetch(url);
    const data = await response.json();

    if (obj.score <= Object.values(data).reduce((acc, curr) => Math.max(acc, curr.score), 0)) {
    } else {
        await postNewHighscore(obj);
    }
}

async function fetchAllAndPostScores() {

    const url = `https://highscore-5838d-default-rtdb.europe-west1.firebasedatabase.app/highscore.json`;

    const response = await fetch(url);
    const data = await response.json();

    const dataSort = Object.entries(data)
        .map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => b.score - a.score);

    await postNewHighscore(dataSort);
}