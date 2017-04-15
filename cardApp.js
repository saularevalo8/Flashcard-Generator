var inquirer = require("inquirer");
var fs = require("fs");
var command = process.argv[2];
var cardsArray = [];
var amountOfCards;
var count = 0;
var score = 0;


function basicCard(question, answer) {
    this.question = question.toLowerCase();
    this.answer = answer.toLowerCase();
}

function clozeCard(question, answer) {
    this.question = question.toLowerCase();
    this.answer = answer.toLowerCase();

    if (this.question.indexOf(this.answer) != -1) {
        this.cloze = this.question.replace(answer, "...");
    }
}

function runCardGame() {

    if (command === "basic") {
        if (process.argv[3]) {
            amountOfCards = process.argv[3];
            bCards();
        } else {
            read("basicCardInfo.json");
        }
    } else if (command === "cloze") {
        if (process.argv[3]) {
            amountOfCards = process.argv[3];
            cCards();
        } else {
            read("clozeCardInfo.json");
        }
    } else {
        howToPlay();
    }
}

function howToPlay() {
    console.log("-------------------------------------------\nInstructions:\nTo review your study cards enter the following commands:\nFor Basic type: node cards.js basic\nFor Cloze type: node cards.js cloze\n--------------------------------------------\nTo create your own study cards enter the following commands:\nFor Basic Type: node cards.js basic [amount of cards]\nFor Cloze Type: node cards.js cloze [amount of cards]\n--------------------------------------------");
}


function read(card) {
    fs.readFile(card, "utf8", function(error, data) {
        var cardObj = JSON.parse(data);
        for (var i = 0; i < cardObj.cardsArray.length; i++) {
            cardsArray.push(cardObj.cardsArray[i])
        }
        amountOfCards = cardsArray.length;

        if (command === "basic") {
            reviewBasic();
        } else if (command === "cloze") {
            reviewCloze();
        }

    });

}

function write(card) {
    fs.writeFile(card, '{ "cardsArray":' + JSON.stringify(cardsArray) + '}', function(error) {
        if (error) {
            return console.log(error);
        }
    });
}

function bCards() {

    if (count < amountOfCards) {

        inquirer.prompt([{
            name: "question",
            message: "Question: "
        }, {
            name: "answer",
            message: "Answer: "
        }]).then(function(answer) {
            var nCard = new basicCard(answer.question, answer.answer);
            cardsArray.push(nCard);
            count++;
            bCards();
        });
    } else {
        count = 0;
        write("basicCardInfo.json")
        reviewBasic();
    }
};


function reviewBasic() {

    if (count < amountOfCards) {

        inquirer.prompt([{
            type: "input",
            name: "userResponse",
            message: cardsArray[count].question,
        }]).then(function(result) {

            if (result.userResponse.toLowerCase() === cardsArray[count].answer) {
                score++;
                console.log("That is Correct!");
            } else {
                console.log("Wrong! the correct answer is " + "'" + cardsArray[count].answer + "'");
            }
            count++;
            reviewBasic();
        });
    } else {
        console.log("No more cards! \nYou got " + score + " out of " + amountOfCards + " correct.");
    }
}

function cCards() {

    if (count < amountOfCards) {

        inquirer.prompt([{
            name: "question",
            message: "Question: "
        }, {
            name: "answer",
            message: "Part of answer to hide: "
        }]).then(function(answer) {
            var newCard = new clozeCard(answer.question, answer.answer);
            cardsArray.push(newCard);
            count++;
            cCards();
        });
    } else {
        count = 0;
        write("clozeCardInfo.json")
        reviewCloze();
    }
};


function reviewCloze() {

    if (count < amountOfCards) {

        inquirer.prompt([{
            type: "input",
            name: "userResponse",
            message: cardsArray[count].cloze,
        }]).then(function(result) {

            if (result.userResponse.toLowerCase() === cardsArray[count].answer) {
                score++;
                console.log("That is Correct!" + "'" + cardsArray[count].question + "'");
            } else if (result.userResponse === "") {
                console.log("No respose provided");
            } else {
                console.log("Wrong! The correct answer is \n" + "'" + cardsArray[count].question + "'");
            }
            count++;
            reviewCloze();
        });
    } else {
        console.log("No more cards! \nYou got " + score + " out of " + amountOfCards + " correct.");
    }
}
runCardGame();

