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
    .then(() =>{
        renderJoke(userJoker)
        userForm.reset()
    })
}




let scoreJsonData = [];

//Render Scoreboard Fuunctions
function sortMatches() {
    //grab elements
    console.log(scoreJsonData)


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
        "https://i.ebayimg.com/images/g/Cm4AAOSws7dibBwZ/s-l500.jpg",
        "https://i.pinimg.com/236x/97/bf/05/97bf0588f1b996b1137f0cc5a3d66662.jpg",
        "https://i.etsystatic.com/10980000/r/il/1a7883/2445227071/il_570xN.2445227071_qizg.jpg"

    ];
    const loserImageArray = [
        "https://i.pinimg.com/236x/1f/40/03/1f4003a4b9924c0b213b0af324f387c3.jpg",
        "https://teehandy.com/wp-content/uploads/2022/06/t1-206.jpg",
        "https://cdn.spotlightstories.co/wp-content/uploads/2019/08/08002854/vincevaughn.jpg"
    ];

    console.log(completeArray)
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
        console.log(styleDiv)

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
            daddySaysLine2.style.visibility = 'visible'
            daddySaysLine3.style.visibility = 'visible'
            daddySaysPrompt.textContent = `${scoreArray[i].prompt}`
            daddySaysUsername.textContent = `${scoreArray[i].username}`
            daddySaysUserResponse.textContent = `${scoreArray[i].userResponse}`
            daddySaysLikes.textContent = `${scoreArray[i].userLikes} Beers`
            
            newRow.onmouseout = function (){
            daddySaysLine1.style.visibility = 'hidden'
            daddySaysLine2.style.visibility = 'hidden'
            daddySaysLine3.style.visibility = 'hidden'
            daddySaysPrompt.textContent = ``
            daddySaysUsername.textContent = ``
            daddySaysUserResponse.textContent = ``
            daddySaysLikes.textContent = ``
            }
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

function renderAllJokes(data){
    let onlyTen = [...data].slice(-10);
    onlyTen.forEach(jokeObj => renderJoke(jokeObj));
}

function renderJoke(jokeObj){
    const voteContainer = document.getElementById("voting-container");
    const aiContainer = document.createElement("div");
    const userContainer = document.createElement("div");    
    const jokeContainer = document.createElement("div");  
    const responseContainer = document.createElement("div");
  
    aiContainer.id = "ai-joke-container";
    userContainer.id = "user-joke-container";
    jokeContainer.id = "one-joke";
    responseContainer.id ="punchlines";

    let prompt = document.createElement("h3");
    let aiTitle = document.createElement("h4");
    let aiPunchline = document.createElement("p");
    let aiNumOfLikes = document.createElement("p");
    let userTitle = document.createElement("h4");
    let userPunchline = document.createElement("p");
    let userNumofLikes = document.createElement("p");

    aiTitle.className = "name-title";
    userTitle.className = "name-title";
    aiNumOfLikes.className = "likes-container";
    userNumofLikes.className = "likes-container";


    
    voteContainer.appendChild(jokeContainer);
    jokeContainer.append(prompt, responseContainer);
    responseContainer.append(aiContainer, userContainer);
    aiContainer.append(aiTitle, aiPunchline, aiNumOfLikes);
    userContainer.append(userTitle, userPunchline, userNumofLikes);
    selectedJoke = jokeContainer

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
    
    if(jsonData.length > 10){
        voteContainer.children[0].remove();
    }
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
