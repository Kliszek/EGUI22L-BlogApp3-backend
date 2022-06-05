# BlogApp 3 - EGUI laboratories project
A project realized as a third assignment for Graphical User Interfaces classes.

### What is it?
This web application is the **backend** for the third part of BlogApp trilogy.
It has some basic functionalities such as:
* User account creation and login (returning a JWT)
* Fetching all the blogs, or blogs belonging to specific user
* Creation and deletion of a blog
* Creation, deletion and edition of blog entries
* The app handles basic server errors and throws exceptions


### Technologies used

* NestJS
* Passport.js with JsonWebTokens
* Bcrypt for password hashing
* Configuration with enviromental variables
* Data is saved as .json files locally


### How to launch it

Before launching the project, make sure you have nodejs and npm installed on your computer.
Of course you'll also need a frontend for this application, which is located [here](https://gitlab-stud.elka.pw.edu.pl/egui22l/Jakub_Radoslaw_Kliszko/egui22l-blogapp3-frontend). The instructions for the frontend are located on its repository website.
Then, download the files from this repository and update all the nodejs packages, by running

    npm install

Then, fill up the config files, which are named "***.env.stage.dev***" and "***.env.stage.prod***". 
The variables you need to specify are:

| Variable name | Descrpition                      |
| ------------- | -------------------------------- |
| BLOGS_PATH    | the path to json file with blogs |
| USERS_PATH    | the path to json file with users |
| JWT_SECRET    | the JWT secret                   |

After this you can run the project, by executing

    npm run start:dev

or

    npm run start:prod

The backend will start at address http://localhost:3001 by default.

You can then run the frontend application, as specified on its page.
