# API
This API powers the application found in the `frontend` folder.

## Structure
The API structure is pretty simple with each part separated into different folders to keep functionality standalone and easy to edit or tweak.

**Folders**
- controllers
  - controller functions
- helpers
- models
- routes

### Controllers
Contains the primary controller file with exports to all the other controller functions. You'll be able to import the controller and have access to all functions or simply import a single function:
```javascript
// Primary Controller
const Function = require('./Folder/Module')
module.exports = {
    key: Function
    ...
}

// Route
const Controller = require('../controllers/Controller')
router.get('/', Controller.key)

// OR
const Function = require('../controllers/Controller').key
router.get('/', Function)
```

### Controller Functions
It would be a good idea to separate each piece of functionality into separate files: `RegisterUser.js`, `LoginUser.js` etc
```javascript
// Express properties will be passed to these functions if you use it as a middleware.
module.exports = (req, res, next) => {
    // Some functionality
    res.status(200).json({
        message: 'Success!'
    })
}
```

### Helpers
These helpers are usable on a retrieved document (important). Here you can define an ES6 class. See Mongoose [Documentation](https://mongoosejs.com/docs/4.x/docs/advanced_schemas.html)
```javascript
// In helper file
class Helper {
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
module.exports = Helper;

// In model file - you will need to load this class to the schema for it to be accessable
const Helper = require('../helpers/Helper')
const schema = new Schema({
    firstName: String,
    lastName: String
})

schema.loadClass(Helper);

// Retrive data
Model.findOne(...).exec().then(doc => console.log(doc.getFullName()))
```

### Models
Define a mongoose schema and export it as a model. See Mongoose [Documentation](https://mongoosejs.com/docs/4.x/docs/guide.html)
```javascript
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({...})

const Model = mongoose.model('Model', schema);
module.exports = Model;
```

### Routes
Define the routes for the resource. Here you will use the controllers to define a clean route file
```javascript
const express = require('express');
let router = express.Router()
const Controller = require('../controllers/Controller');

router.get('/get', Controller.key);
...

module.exports = router

// in the api.js file - remember to define the routes for the resource
const resourceRoutes = require('./routes/resource')
app.use('/resource', resourceResource)
// Now you'll be able to access the resource using the route `/resource/get`
```