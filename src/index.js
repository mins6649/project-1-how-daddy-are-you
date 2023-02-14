
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
