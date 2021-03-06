# Notes app FSO 2021
**Full Stack Course at th University of Helsinky (2021)**

  * [Deploy the app to heroku](#deploy-the-app-to-heroku)
- [Previously performed tasks:](#previously-performed-tasks-)
  * [Part 3 MongoDB](#part-3-mongodb)
    + [In the backend](#in-the-backend)
    + [Validation](#validation)
    + [To production](#to-production)
  * [Part 4 (Notes app)](#part-4--notes-app-)
    + [Structure and Test with jest](#structure-and-test-with-jest)
    + [Testing the backend](#testing-the-backend)
      - [Test environment](#test-environment)
      - [Supertest](#supertest)
      - [Initializing the database before tests](#initializing-the-database-before-tests)
      - [Running tests one by one](#running-tests-one-by-one)
      - [More tests and refactoring the backend](#more-tests-and-refactoring-the-backend)
      - [Eliminating the try-catch](#eliminating-the-try-catch)
      - [Optimizing the beforeEach function](#optimizing-the-beforeeach-function)
    + [USer Administration](#user-administration)

## Deploy the app to heroku

1. Create repo with created app in parts 1-4
   ``` bash 
   $ git init
   $ git add .
   $ git commit -m 'Initial commit - Part4'
   $ git branch -M main
   $ git remote add origin https://github.com/greenvan/fullstackopen2021-notesapp.git
   $ git push -u origin main
   ```
2. Move 'cross-env' to dependencies instead of devDependencies in `package.json` in order to work with heroku which only installs production deps.

3. Create heroku app
   ``` bash
   $ heroku create gv-fso21-notes
   $ heroku git:remote -a gv-fso21-notes
   $ heroku config:set MONGODB_URI='mongodb+srv://fullstack:{passwd}@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
   $ git push heroku main
   ```

# Previously performed tasks:


## Part 3 MongoDB
1. Create: Organization, Project and Cluster (AWS, Frankfurt)
2. Database Access --> Create database user, read and Write
3. Network Access --> Allow from anywhere
4. Clusters --> Connect

```
mongodb+srv://fullstack:<password>@cluster0.3ji6l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

5. Install Mongoose `npm install mongoose`
6. Create mongo.js:

```
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```


### In the backend
1. New module `models/note.js`
2. In index.js: `const Note = require('./models/note')`
3. Define environment variables
    3.1 Install dotenv library: `npm install dotenv`
    3.2 Create .env file

### Validation
1. Define validation rules on mongoose schema
2. Pass exceptions to middleware (next) in post api/notes
3. Manage on errorHandler

### To production
1. Promise chaining
2. Heroku
    2.1 Environment variables: 

```bash
heroku config:set MONGODB_URI=mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```
or

```bash
$ heroku config:set MONGODB_URI='mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
```

## Part 4 (Notes app)

### Structure and Test with jest

1. Install jest 
```bash
npm install --save-dev jest
```
2. Define npm script test
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "jest --verbose"
 //...
 "jest": {
   "testEnvironment": "node"
 }
}
```

3. Add `"jest": true` a la propiedad env en el archivo .eslintrc.js.


### Testing the backend
#### Test environment
1. Edit scripts in package.json NODE_ENV and runInBand
```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "test": "NODE_ENV=test jest --verbose --runInBand"
    [...]
  },
  // ...
}
```
2. Windows --> problem: Install cross-env
`npm install --save-dev cross-env`

3. Edit scripts..(omit step 1)
```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```

4. Changes to the module that defines the application's configuration
`utils/config.js`
```js
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
```

5. Add separate variables for the database addresses of the development and test databases in `.env` file

#### Supertest
1. Install
`npm install --save-dev supertest`

2. Write first tests in `tests/note_api.test.js` file
3. Change logger so that it does not print to console in test mode

```js
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
}

module.exports = {
  info, error
}
```

#### Initializing the database before tests

1. Initialize the database before every test with the beforeEach function
```js
const Note = require('../models/note')
const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
]
beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
```

#### Running tests one by one
1. Test in a file: `npm test -- tests/note_api.test.js`
2. Tests with a specific name `npm test -- -t 'a specific note is within the returned notes'`
3. Test that contain 'notes' in their name: `npm test -- -t 'notes'`

#### More tests and refactoring the backend

1. Write a test for each route of the API
2. Refactor the remaining operations


Error occurred:
1. Install sinon
2. 
```js
// time.js
exports.setTimeout = function() {
  return global.setTimeout.apply(global, arguments);
};

// Tests
const time = require('../util/time');
const sinon = require('sinon');
sinon.stub(time, 'setTimeout');
```

#### Eliminating the try-catch
All of the route handlers follow the same structure
```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```
1. Install https://github.com/davidbanham/express-async-errors

`npm install express-async-errors`
2. In `app.js`: add `require('express-async-errors')`

Because of the library, we do not need the next(exception) call anymore. The library handles everything under the hood. If an exception occurs in a async route, the execution is automatically passed to the error handling middleware.

#### Optimizing the beforeEach function
```js
 helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
  })
})
```
Every iteration of the forEach loop generates its own asynchronous operation, and beforeEach won't wait for them to finish executing. In other words, the await commands defined inside of the forEach loop are not in the beforeEach function, but in separate functions that beforeEach will not wait for.

--> the execution of tests begins before the database state is initialized

One way of fixing this is to wait for all of the asynchronous operations to finish executing with the Promise.all method:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

```

A??n se puede acceder a los valores devueltos de cada promesa en la matriz cuando se usa el m??todo Promise.all. Si esperamos a que se resuelvan las promesas con la sintaxis await const results = await Promise.all (promiseArray), la operaci??n devolver?? una matriz que contiene los valores resueltos para cada promesa en promiseArray, y aparecen en el mismo orden que las promesas en la matriz.

Promise.all ejecuta las promesas que recibe en paralelo. Si las promesas deben ejecutarse en un orden particular, esto ser?? problem??tico. En situaciones como esta, las operaciones se pueden ejecutar dentro de un for ... of, que garantiza una determinada orden de ejecuci??n.

### USer Administration

1. Create user.js in models 
2. Add User to Note model
3. passwordHash: Instal bcrypt to generate hashes `npm install bcrypt`
4. Add route with a new Router in controllers/users.js 
5. Define it in app.js:
    ```js
    const usersRouter = require('./controllers/users')
    // ...
    app.use('/api/users', usersRouter)
    ```
6. Tests
7. username must be unique. Need to install `npm install mongoose-unique-validator`
8. Change user model:
    ```js
    const mongoose = require('mongoose')
    const uniqueValidator = require('mongoose-unique-validator')

    const userSchema = new mongoose.Schema({
      username: {
        type: String,
        unique: true
      },
      name: String,
      passwordHash: String,
      notes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Note'
        }
      ],
    })

    userSchema.plugin(uniqueValidator)

    ```
9. Tambi??n podr??amos implementar otras validaciones en la creaci??n de usuarios. Podr??amos comprobar que el nombre de usuario es lo suficientemente largo, que el nombre de usuario solo consta de caracteres permitidos o que la contrase??a es lo suficientemente segura. La implementaci??n de estas funcionalidades se deja como ejercicio opcional. Interesante, S??LO CARACTERES PERMITIDOS
10. Create new note update with userId
11. Populate
12. Let's first implement the functionality for logging in. Install the jsonwebtoken library, which allows us to generate JSON web tokens. `npm install jsonwebtoken`
13. Add `controllers/login.js.`
14. Limiting creating new notes to logged in users
15. Error Handling
