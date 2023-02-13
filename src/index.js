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

    userForm.reset()
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