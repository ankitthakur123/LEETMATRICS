document.addEventListener("DOMContentLoaded", function(){
    const SearchButton = document.getElementById("search-btn")
    const usernameInput = document.getElementById("user-input")
    const statsContainer = document.querySelector(".stats-container")
    const easyProgressCircle = document.querySelector(".easy-progress")
    const mediumProgressCircle = document.querySelector(".medium-progress")
    const hardProgressCircle = document.querySelector(".hard-progress")
    const easyLabel = document.getElementById("easy-label")
    const mediumLabel = document.getElementById("medium-label")
    const hardLabel = document.getElementById("hard-label")
    const cardStatsContainer = document.querySelector(".stats-card")
    //return true or false on the basis of regex
    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty")
            return false
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username)
        if(!isMatching){
            alert("Invalid Username")
        }
        return isMatching
    }
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try{
            SearchButton.textContent = "Searching..."
            SearchButton.disabled = true
            const response = await fetch(url)
            if(!response.ok){
                throw new Error("Unable to fetch the user details")
            }
            const parsedata = await response.json()
            console.log("logging data: ", parsedata)
            displayUserData(parsedata)
        }catch(error){
            statsContainer.innerHTML = `<p>${error.message}</p>`
        }
    }
    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    function displayUserData(parsedata){
        const totalQues = parsedata.totalQuestions
        const totalEasyQues = parsedata.totalEasy
        const totalMediumQues = parsedata.totalMedium
        const totalHardQues = parsedata.totalHard

        const solvedTotalQues = parsedata.totalSolved;
        const solvedTotalEasyQues = parsedata.easySolved
        const solvedTotalMediumQues = parsedata.mediumSolved;
        const solvedTotalHardQues = parsedata.hardSolved;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardsData = [{label:"Overall Submissions", value:parsedata.totalSolved},
                           {label: "Overall Easy Submissions", value:parsedata.easySolved},
                           {label: "Overall Medium Submissions", value:parsedata.mediumSolved},
                           {label: "Overall Hard Submissions", value:parsedata.hardSolved},
                          ];
                          console.log("card ka data: " , cardsData);

                          cardStatsContainer.innerHTML = cardsData.map(
                              data => 
                                      `<div class="card">
                                      <h4>${data.label}</h4>
                                      <p>${data.value}</p>
                                      </div>`
                          ).join("")

    }
    SearchButton.addEventListener('click', function(){
        const username = usernameInput.value
        console.log("loggin username: ", username)
        if(validateUsername(username)){
            fetchUserDetails(username)
        }
    })
})