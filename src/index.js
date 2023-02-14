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
     userName: e.target["user-name"].value
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
    .then( () => {
        renderJoke(userJoker) 
        userForm.reset() 
})
}

//CREATING THE JOKE LIST
fetch("http://localhost:3000/users")
.then(res => res.json())
.then(data => {
    renderAllJokes(data)
    data.forEach(joke => {
        jsonData.push(joke); //the entire db.json file now exists within jsonData
    })
    
})

function renderAllJokes(data){
    let onlyTen = [...data].slice(-10)
    onlyTen.forEach(jokeObj =>{
        renderJoke(jokeObj);
    })
}

function renderJoke(jokeObj){
    
    const voteContainer = document.getElementById("voting-container");
    const jokeContainer = document.createElement("div");
    const aiContainer = document.createElement("div");
    const userContainer = document.createElement("div");
    let prompt = document.createElement("h3");
    let aiTitle = document.createElement("h4");
    let aiPunchline = document.createElement("p");
    let aiNumOfLikes = document.createElement("p");
    let userTitle = document.createElement("h4");
    let userPunchline = document.createElement("p");
    let userNumofLikes = document.createElement("p");
    
    voteContainer.appendChild(jokeContainer);
    voteContainer.appendChild(jokeContainer);
    jokeContainer.append(prompt, aiContainer, userContainer);
    aiContainer.append(aiTitle, aiPunchline, aiNumOfLikes);
    userContainer.append(userTitle, userPunchline, userNumofLikes);

    prompt.textContent = jokeObj.prompt;
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
        userNumofLikes.textContent = jokeObj.userLikes;
        updateLikes(jokeObj);
    }) 

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
    .then(data => console.log(data))
}