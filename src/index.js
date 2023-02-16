let jokePrompt = null
let jokeDelivery = null

jsonData=[]

startJoke()

function startJoke(){
fetch ("https://v2.jokeapi.dev/joke/pun?format=json&safe-mode&type=twopart")
.then ((res)=> res.json())
.then ((joke) => 
    renderSetup(joke))
}

const jokeSetup = document.querySelector("#setup")
const newJoke = document.querySelector("#newJoke")
const userForm = document.querySelector("#user-punchline-form")

function renderSetup(joke){
    jokeSetup.textContent=joke.setup
    jokePrompt=joke.setup
    jokeDelivery = joke.delivery
}

newJoke.addEventListener("submit", (e)=> {
    e.preventDefault()
    startJoke()
})

userForm.addEventListener("submit", (e)=>addUserToJson(e))

function addUserToJson(e){
    e.preventDefault()

    userJoker = {
     prompt: jokePrompt,
     cpuResponse:jokeDelivery,
     cpuLikes: 0,
     userResponse:e.target["user-punchline"].value, 
     userLikes: 0,
     username: e.target["user-name"].value
    }

    jsonData.push(userJoker) // ONLY PUSHES IN A SINGLE JOKE

    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userJoker)
    })
    .then(res => res.json())
    .then(data =>{
        let element = createElement(data);
        voteContainer.prepend(element);

        voteContainer.children[10].remove();
    })
    userForm.reset()
}

let scoreJsonData = [];

//Render Scoreboard Fuunctions
function sortMatches() {
    //grab elements

    let winnerArray = [];
    let loserArray = [];
    let completeArray = [...scoreJsonData];

    // console.log(jsonData)
    scoreJsonData.forEach(match => {
        if (match.userLikes > match.cpuLikes) {
            winnerArray.push(match);
        }
        else {
            loserArray.push(match);
        }
    });

    winnerArray.sort( (x, y) => (x.userLikes - x.cpuLikes) - (y.userLikes - y.cpuLikes) );

    loserArray.sort( (x, y) => (x.cpuLikes - x.userLikes) - (y.cpuLikes - y.userLikes) );

    winnerArray.reverse()
    loserArray.reverse()
    completeArray.reverse()

    //set image arrays
    const winnerImageArray = [
        "./static/the-godfather.jpeg",
        "./static/george-clooney.jpeg",
        "./static/red-forman.jpeg"

    ];
    const loserImageArray = [
        "./static/landfill.png",
        "./static/dumpster-fire.jpg",
        "./static/garbage-can.png"
    ];

    appendScoreboard(winnerArray, document.getElementById('high-scores'), winnerImageArray);
    appendScoreboard(loserArray, document.getElementById('low-scores'), loserImageArray);
    appendScoreboard(completeArray, document.getElementById('recent-scores'));
}

function appendScoreboard(scoreArray, element, imageArray = []) {
    //the over-arching loop to create three rows 
    for (let i = 0; i < 3; i++) {
        const styleDiv = document.createElement('div')
        const newRow = document.createElement('tr')
        styleDiv.appendChild(newRow)

        styleDiv.setAttribute('class', 'rowHighlighter')

        //left td
        const imgHolder = document.createElement('td')

        if (arguments.length === 3) {
            const newImg = document.createElement('img')
            newImg.src = imageArray[i]
            imgHolder.appendChild(newImg)
        }
        //center td
        const userName = document.createElement('td')
        userName.textContent = scoreArray[i].username

        //right td
        const score = document.createElement('td')
        score.textContent = `${scoreArray[i].userLikes} - ${scoreArray[i].cpuLikes}`

        //append all
        newRow.append(imgHolder, userName, score)
        element.appendChild(newRow)
        newRow.onmouseover = function () {
            let daddySaysPrompt = document.querySelector("#daddy-says-prompt")
            let daddySaysUsername = document.querySelector("#daddy-says-username")
            let daddySaysUserResponse = document.querySelector("#daddy-says-user-response")
            let daddySaysLikes = document.querySelector("#daddy-says-likes")
            let daddySaysLine1 = document.querySelector("#line1")
            let daddySaysLine2 = document.querySelector("#line2")
            let daddySaysLine3 = document.querySelector("#line3")

            daddySaysLine1.style.visibility = 'visible'
            daddySaysPrompt.textContent = `${scoreArray[i].prompt}`
            daddySaysUsername.textContent = `${scoreArray[i].username}`
            daddySaysUserResponse.textContent = `${scoreArray[i].userResponse}`
            daddySaysLikes.textContent = `${scoreArray[i].userLikes} Beers`
            
            newRow.onmouseout = function (){
            daddySaysLine1.style.visibility = 'hidden'
            daddySaysPrompt.textContent = ``
            daddySaysUsername.textContent = ``
            daddySaysUserResponse.textContent = ``
            daddySaysLikes.textContent = ``
            }
            oliveGardenEasterEgg.innerText = "";
            ryanReynoldsEasterEgg.innerText = "";
                  
        }
    }
}



//CREATING THE JOKE LIST

fetch("http://localhost:3000/users")
.then(res => res.json())
.then(data => {
    scoreJsonData = [...data].slice(0, -10)
    sortMatches()

    renderAllJokes(data)
    data.forEach(jokeObj =>{
        jsonData.push(jokeObj);
    })
})

const voteContainer = document.getElementById("voting-container");

function renderAllJokes(data){
    let onlyTen = [...data].slice(-10).reverse();
    onlyTen.forEach(jokeObj => renderJoke(jokeObj));
}

function renderJoke(jokeObj){
    let element = createElement(jokeObj)
    voteContainer.appendChild(element);  
}

function createElement(jokeObj){
    const aiContainer = document.createElement("div");
    const userContainer = document.createElement("div");    
    const jokeContainer = document.createElement("div");  
    const responseContainer = document.createElement("div");
    let prompt = document.createElement("h3");
    let aiTitle = document.createElement("h4");
    let aiPunchline = document.createElement("p");
    let aiNumOfLikes = document.createElement("p");
    let userTitle = document.createElement("h4");
    let userPunchline = document.createElement("p");
    let userNumofLikes = document.createElement("p");
  
    //CSS
    aiContainer.id = "ai-joke-container";
    userContainer.id = "user-joke-container";
    jokeContainer.id = "one-joke";
    responseContainer.id ="punchlines";
    aiTitle.className = "name-title";
    userTitle.className = "name-title";
    aiNumOfLikes.className = "likes-container";
    userNumofLikes.className = "likes-container";

    jokeContainer.append(prompt, responseContainer);
    responseContainer.append(aiContainer, userContainer);
    aiContainer.append(aiTitle, aiPunchline, aiNumOfLikes);
    userContainer.append(userTitle, userPunchline, userNumofLikes);

    prompt.textContent = jokeObj.prompt;
    aiTitle.textContent = "The Daddy";
    aiPunchline.textContent = jokeObj.cpuResponse;
    aiNumOfLikes.textContent = `${jokeObj.cpuLikes} Beers!`;
    userTitle.textContent = "User";
    userPunchline.textContent = jokeObj.userResponse;
    userNumofLikes.textContent = `${jokeObj.userLikes} Beers!`;

        //Listener Functions
        function updateAiLikes() {
            jokeObj.cpuLikes++;
            aiNumOfLikes.textContent = `${jokeObj.cpuLikes} Beers!`;
            updateLikes(jokeObj);
            aiContainer.removeEventListener('click', updateAiLikes)
        }
    
        function updateUserLikes() {
            jokeObj.userLikes++;
            userNumofLikes.textContent = `${jokeObj.userLikes} Beers!`;
            updateLikes(jokeObj);
            userContainer.removeEventListener('click', updateUserLikes)
        }
    
         //Event Listners to Update likes
    aiContainer.addEventListener("click", updateAiLikes)
    userContainer.addEventListener("click", updateUserLikes) 

    jsonData.push(jokeObj);
    return jokeContainer;
}

//patch request for updating likes
function updateLikes(jokeObj){
    fetch(`http://localhost:3000/users/${jokeObj.id}`,{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jokeObj)
    })
    .then(res => res.json())
}

//EASTER EGGS
const daddySays = document.getElementById("daddy-says-container");
const recentScoresTitle = document.getElementById("recent-scores-title");
const oliveGardenEasterEgg = document.createElement("div");
const daddyTitle = document.getElementById("ryanReynolds");
const ryanReynoldsEasterEgg = document.createElement("div");

recentScoresTitle.addEventListener("click", oliveGarden);
daddyTitle.addEventListener("click", ryanReynolds);

function oliveGarden(){
    let picture = document.createElement("img")
    let link = document.createElement("a")
    link.href = "https://www.olivegarden.com/home"
    link.textContent = "Your answer was too boring. This is where you belong:"
    picture.src ="https://www.kark.com/wp-content/uploads/sites/85/2021/12/OliveGardenGettyImages-1326009258.jpg?w=1280&h=720&crop=1";
    
    link.id = "oliveGardenLink";
    picture.id = "oliveGarden";
    
    link.appendChild(picture)
    oliveGardenEasterEgg.appendChild(link);
    daddySays.append(oliveGardenEasterEgg);  
    //needs to only click once
}

function ryanReynolds(){
    let picture = document.createElement("img");
    let link = document.createElement("a");

    link.href = "https://ryan-reynolds.net/"
    link.textContent = "Daddy"
    picture.src = "https://ntvb.tmsimg.com/assets/assets/57282_v9_bc.jpg?w=270&h=360";
  
    link.id = "ryanReynoldsLink";
    picture.id = "ryanReynoldsPic";
    
    ryanReynoldsEasterEgg.append(picture, link);
    daddySays.appendChild(ryanReynoldsEasterEgg);
}





