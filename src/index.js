let jokePrompt = null
let jokeDelivery = null

startJoke()
function startJoke(){
fetch ("https://v2.jokeapi.dev/joke/pun?format=json&safe-mode&type=twopart")
.then ((res)=> res.json())
.then ((joke) => renderSetup(joke))
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

    jsonData=[]

    userJoker = {
     prompt: jokePrompt,
     cpuResponse:jokeDelivery,
     cpuLikes: 0,
     userResponse:e.target["user-punchline"].value, 
     userLikes: 0,
     userName: e.target["user-name"].value
    }

    jsonData.push(userJoker)

    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userJoker)
    })
    .then(userForm.reset())
}

    

//global data array (DELETE BELOW BEFORE MERGING)
let jsonData = [];


fetch("http://localhost:3000/users")
    .then(res=> res.json())
    .then(data=> {
        jsonData = data;
        sortMatches()
    });
//DELETE ABOVE BEFORE MERGING



//Render Scoreboard Fuunctions
function sortMatches() {
    //grab elements

    let winnerArray = [];
    let loserArray = [];
    let completeArray = [...jsonData];

    // console.log(jsonData)
    jsonData.forEach(match => {
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

    appendScoreboard(winnerArray, document.getElementById('high-scores'), winnerImageArray);
    appendScoreboard(loserArray, document.getElementById('low-scores'), loserImageArray);
    appendScoreboard(completeArray, document.getElementById('recent-scores'));
}

function appendScoreboard(scoreArray, element, imageArray = []) {
    //the over-arching loop to create three rows 
    for (let i = 0; i < 3; i++) {
        const newRow = document.createElement('tr')

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
    }
}

//CREATING THE JOKE LIST

fetch(" http://localhost:3000/users")
.then(res => res.json())
.then(data => {
    data.forEach(jokeObj =>{
        renderJokes(jokeObj);
    })
})

function renderJokes(jokeObj){
    const aiContainer = document.getElementById("ai-punchline-container");
    const userContainer = document.getElementById("user-punchline-container");
    let prompt = document.getElementById("submitted-prompt");
    let aiTitle = document.getElementById("ai-author");
    let aiPunchline = document.getElementById("ai-punchline");
    let aiNumOfLikes = document.getElementById("ai-punchline-likes");
    let userTitle = document.getElementById("user-author")
    let userPunchline = document.getElementById("user-punchline");
    let userNumofLikes = document.getElementById("user-punchline-likes");

    aiTitle.textContent = "The Daddy";
    aiPunchline.textContent = jokeObj.cpuResponse;
    aiNumOfLikes.textContent = jokeObj.cpuLikes;
    userTitle.textContent = "User";
    userPunchline.textContent = jokeObj.userResponse;
    userNumofLikes.textContent = jokeObj.userLikes;

    aiContainer.addEventListener("click", () =>{
        jokeObj.cpuLikes++;
        aiNumOfLikes.textContent = jokeObj.cpuLikes;
        updateLikes(jokeObj);
    })
    userContainer.addEventListener("click", () =>{ 
        jokeObj.userLikes++;
        userNumofLikes.textContent = jokes.userLikes;
        updateLikes(jokeObj);
    }) 
}


//patch request for upddating likes
function updateLikes(jokeObj){
    fetch(`HTTP ${jokeObj.id}`,{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jokeObj)
    })
    .then(res => res.json())
    .then(data => console.log(data))
}