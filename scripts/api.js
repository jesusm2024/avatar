let allCharacters = []; // Variable to store all characters
const limit = 100; // Assuming you want to fetch all at once or a high number if there are too many

// Function to load characters based on the selected affiliation
const loadCharactersByAffiliation = async (affiliation) => {
    try {
        let page = 1;
        let hasMore = true;
        allCharacters = []; // Reset the characters array

        while (hasMore) {
            const res = await fetch(`https://last-airbender-api.fly.dev/api/v1/characters?perPage=${limit}&page=${page}&affiliation=${affiliation}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }

            if (data.length === 0) {
                hasMore = false;
                break;
            }

            allCharacters = allCharacters.concat(data); // Add data to the allCharacters array
            page++;
        }

        // Now allCharacters has all the data, display it
        displayCharacters(allCharacters);

    } catch (err) {
        console.error('Error loading characters:', err);
    }
}

// Function to display the characters
const displayCharacters = (characters) => {
    const charGrid = document.getElementById('char-grid');
    if (charGrid){
        charGrid.innerHTML = ''; // Clear any existing content
    }

    characters.forEach(char => {
        if (charGrid && char.name && char.photoUrl && char.affiliation &&
            !["CIRCUS MASTER", "FIRE NATION COMPANY LEADER", "SHA-MO", "TIENHAI'S HUSBAND", "ROKU'S WATERBENDING MASTER", "YUGODA", "OLD WANDERER", "NOREN", "TOM-TOM"].includes(char.name.toUpperCase()))
        {
            const markup = `
                <div class="char-box">
                    <img src="${char.photoUrl}" alt="Picture of ${char.name}"/>
                    <h3>${char.name.toUpperCase()}</h3>
                    <p>Affiliation: ${char.affiliation}</p>
                </div>
            `;
            charGrid.insertAdjacentHTML('beforeend', markup);
        }
    });
}

// Function to handle button clicks and update the affiliation
const handleButtonClick = (affiliationText) => {
    // Replace spaces with '+' in the affiliation text
    const affiliation = affiliationText === 'All' ? '' : affiliationText.replace(/\s+/g, '+');
    
    // Call the function to load characters based on the formatted affiliation
    loadCharactersByAffiliation(affiliation);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nation-btn').forEach(button => {
        button.addEventListener('click', () => {
            const affiliationText = button.textContent.trim(); // Get the text content of the button

            // Handle affiliation change
            handleButtonClick(affiliationText);

            // Remove 'active' class from all buttons
            document.querySelectorAll('.nation-btn').forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');
        });
    });

    // Set the 'All' button as active by default
    const allButton = document.querySelector('.nation-btn');
    if (allButton) {
        allButton.classList.add('active');
    } 
});

// Load all characters by default on page load
loadCharactersByAffiliation('');

////////////////////////////////////////////////////////////////////////////////////

let allQuestions = []; // Array of all questions
let correctAnswers = 0; // Counter for correct answers

// Function to load questions
const loadQuestions = async () => {
    try {
        const res = await fetch(`https://api.sampleapis.com/avatar/questions`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }

        allQuestions = data; // Store all questions
        correctAnswers = 0; // Reset correct answers counter
        updateScore(); // Reset the score display
        displayRandomQuestion(); // Display one random question

    } catch (err) {
        console.error('Error loading questions:', err);
    }
}

// Function to display a random question
const displayRandomQuestion = () => {
    const trivia = document.getElementById('trivia');
    if (trivia) {
        trivia.innerHTML = ''; // Clear any existing content
    }

    if (allQuestions.length === 0) {
        // Display a congratulations message and a Restart button
        trivia.innerHTML = `
            <p>Congratulations! You answered all questions correctly!</p>
            <button id="restart-btn">Restart</button>
        `;

        // Add event listener to the restart button
        document.getElementById('restart-btn').addEventListener('click', restartGame);

        return;
    }

    // Select a random question
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    const ques = allQuestions[randomIndex];

    if (ques.question && ques.possibleAnsers && ques.correctAnswer && trivia) {
        // Display the question
        const markup = `
            <div class="ques-box">
                <p>${ques.question}</p>
            `;
        trivia.insertAdjacentHTML('beforeend', markup);

        // Display the possible answers as buttons
        ques.possibleAnsers.forEach(ans => {
            const buttonMarkup = `
                <button type="button" class="trivia-btn">${ans}</button>
            `;
            trivia.insertAdjacentHTML('beforeend', buttonMarkup);
        });

        trivia.insertAdjacentHTML('beforeend', '</div>');

        // Add event listeners to the dynamically created buttons
        document.querySelectorAll('.trivia-btn').forEach(button => {
            button.addEventListener('click', () => {
                const selectedAnswer = button.textContent.trim(); // Get the text content of the button
                handleTriviaButtonClick(selectedAnswer, ques.correctAnswer, randomIndex); // Pass the correct answer and question index
            });
        });
    }
}

// Function to handle button clicks and check the answer
const handleTriviaButtonClick = (selectedAnswer, correctAnswer, questionIndex) => {
    if (selectedAnswer === correctAnswer) {
        correctAnswers++; // Increment correct answers counter
        updateScore(); // Update the score display

        // Remove the question from the array so it's not displayed again
        allQuestions.splice(questionIndex, 1);

        // Display the next random question
        displayRandomQuestion();
    } else {
        restartGame(); // Restart the game if the answer is incorrect
    }
}

// Function to update the score display
const updateScore = () => {
    const scoreDisplay = document.getElementById('score');
    if (scoreDisplay){
        scoreDisplay.textContent = `Correct: ${correctAnswers}/35`;
    }
}

// Function to restart the game
const restartGame = () => {
    correctAnswers = 0; // Reset correct answers counter
    updateScore(); // Reset the score display
    loadQuestions(); // Reload all questions and restart the game
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestions(); // Load questions on page load
});