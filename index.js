const fs = require("fs");
//third party libraries that are being imported
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require("html-pdf");
const passHTML = require("./generateHTML");

// node prompt questions 
const questions = [
    {
        message: 'What is your github username?',
        name: 'username',
    },
    {
        message: 'What is your favorite color',
        name: 'color',
        type: 'list',
        choices: ['green', 'blue', 'pink', 'red'],
    }
];

// have inquirer be called and prompt user with questions
//function passed to .then is only executed after responses are retreied from the user
function init() {
    inquirer.prompt(questions).then(function (answers) {
        var username = answers.username;
        var color = answers.color;
        console.log(answers);

        axios
            .get("https://api.github.com/users/" + username)
            .then(function (res) {
                console.log(res);

                axios // Requires a seperate axios call to get stars
                    .get("https://api.github.com/users/" + username + "/repos?per_page=1000")
                    .then(function (repoRes) {
                        console.log(repoRes);
                        res.data.stars = 0;
                        for (let i = 0; i < repoRes.data.length; i++) { // Loop through each repository and count the number of stars
                            res.data.stars += repoRes.data[i].stargazers_count;
                        }

                        res.data.color = color;
                        pdf.create(passHTML(res.data)).toFile("./resumeExample.pdf", function (err, res) {
                            console.log(res);
                        });

                    });




            });

    });

}

// node interpreter goes top down; it will create the variables and questions
init();