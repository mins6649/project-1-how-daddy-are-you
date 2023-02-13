let jokePrompt = null
let jokeDelivery = null

fetch ("https://v2.jokeapi.dev/joke/pun?format=json&safe-mode&type=twopart")
.then ((res)=> res.json())
.then ((joke) => renderJoke(joke))

const jokeSetup = document.querySelector("#setup")
const newJoke = document.querySelector("#newJoke")
const userForm = document.querySelector("#user-punchline-form")

function renderJoke(joke){
    jokeSetup.textContent=joke.setup
    jokePrompt=joke.setup
    jokeDelivery = joke.delivery
}

newJoke.addEventListener("submit", (joke)=> {renderJoke(joke)
    e.preventDefault()})

userForm.addEventListener("submit", (joke)=>addUserToJson(joke))

function addUserToJson(joke){
    joke.preventDefault()

    jsonData=[]

    userJoker = {
     prompt: jokePrompt,
     cpuResponse:jokeDelivery,
     cpuLikes: 0,
     userResponse:joke["user-punchline"].value, 
     userLikes: 0,
     userName: joke["user-name"].value
    }

    jsonData.push(userJoker)

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userJoker)
    })

}


