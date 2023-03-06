## Singhai Expense Managing Tool 

### How to run ? 
Make sure you have installed Nodejs if not you can download it from [here](https://nodejs.org/en/download/) and Visual Studio Code from [here](https://code.visualstudio.com/download)

Make sure to have config.env file inside /backend/config/ Diretory.

1. Clone the repository
``` git clone https://github.com/prabalJain1998/singhai-expense-web-app.git ```

2. Open the root directory in vscode
3. Open Terminal.
4. Install Dependencies for Backend by running the command in root directory.
```
npm install
```
5. Install Dependencies for Frontend by running the command in frontend directory.
```
cd frontend
```
```
npm install
```
6. Start the Server by running the command within root directory.
```
npm run dev
```
5. Move to Frontend Directory
```
cd frontend
```
```
npm start
```


Hurray your Website is Up!!!!!

## Please find the config.env template below :

PORT = 3000 <br/>

DB_URL = PUT_DATABASE_CONNECTION_STRING

JWT_SECRET = PUT_RANDOM_STRING <br/>
JWT_EXPIRE = 5d

COOKIE_EXPIRE = PUT_NUMBER_OF_DAYS_HERE

SMTP_MAIL = YOUREMAIL <br/>
SMTP_PASSWORD = YOURPASSWORD

SECURE_KEY = SOMERANDOMKEY

FRONTEND_URL = "http://localhost:3000"

