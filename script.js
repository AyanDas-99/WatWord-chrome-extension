const form = document.querySelector('#form');
const submitImg = document.querySelector(".search");
const inputWord = document.querySelector('#word');
const loadingAnimation = document.querySelector('.loading');
const mainContentDiv = document.querySelector('.content');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    mainContentDiv.innerHTML = ''
    const word = inputWord.value;
    loadingAnimation.style.display = 'block'
    searchWord(word);
})

// Get word from API and call displayResult
async function searchWord(word) {
    const URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
    try {
        p = fetch(URL + word);
        let response = (await p).json();
        response = await response;
        console.log(response)
        displayResult(response);
    }
    catch(e) {
        displayError();
    }
    loadingAnimation.style.display = 'none'
}

// Use response from searchWord() and display in the body
function displayResult(response) {
    const definitions = response[0].meanings[0].definitions;
    const synonyms = response[0].meanings[0].synonyms;
    const antonyms = response[0].meanings[0].antonyms

    // Meaning
    const meaningDiv = document.createElement('div');
    meaningDiv.className = 'meaning'
    console.log(definitions)
    const meaning = `<div class="heading">Meaning</div>
                        <p class="definition">
                        ${definitions[0].definition}</p>`
    meaningDiv.innerHTML = meaning;
    mainContentDiv.appendChild(meaningDiv);

    // More definitions
    definitions.shift();
    if (definitions.length != 0) {
        const moreMeanings = document.createElement('details');
        moreMeanings.className = "meaning";
        moreMeanings.innerHTML = '<summary class="heading">More definitions<span class="icon"><img src="media/toggle.png" alt="toggle more info" class="toggle"></span></summary>';
        let p = document.createElement('p');
        p.className = "definition";
        definitions.forEach((meaning, index) => {
            p.innerHTML += meaning.definition + '<br><br>'
        })
        moreMeanings.appendChild(p);
        mainContentDiv.appendChild(moreMeanings);
    }

    //Pronunciation
    if (response[0].phonetics[0].audio.length != 0) {
        const phoneticDiv = document.createElement('details');
        phoneticDiv.className = "meaning";
        phoneticDiv.innerHTML = '<summary class="heading">Pronunciation<span class="icon"><img src="media/toggle.png" alt="toggle more info" class="toggle"></span></summary>';
        const speakerImg = document.createElement('img');
        speakerImg.className = "speaker";
        speakerImg.src = "media/speaker.png";
        audio = new Audio(response[0].phonetics[0].audio);
        speakerImg.addEventListener('click', () => {
            audio.play();
        })
        phoneticDiv.appendChild(speakerImg);
        mainContentDiv.appendChild(phoneticDiv);
    }

    // parts of speech
    const pos = document.createElement('details');
    pos.className = "meaning";
    pos.innerHTML = '<summary class="heading">Part of speech<span class="icon"><img src="media/toggle.png" alt="toggle more info" class="toggle"></span></summary>';
    p = document.createElement('p');
    p.className = "definition";
    p.textContent = response[0].meanings[0].partOfSpeech;
    pos.appendChild(p);
    mainContentDiv.appendChild(pos);
}

function displayError() {
    mainContentDiv.innerHTML = '<h3 class="error-msg">Meaning not found</h3>';
}