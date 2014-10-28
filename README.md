Proximity
=========
A web application to meet new people near you!


# Realisation

Proximity is a full-stack application.

## Back-end
- **MongoDB** (no previous experience): Database. Has built-in GeoSpatial search and is document-based, which allows for more straightforward mapping in a REST environment.
- **Python** (no previous experience): Back-end logic.
- **PyMongo** (no previous experience): Database driver. Python driver for the MongoDB.
- **Flask** (no previous experience): Web container and application. Allows for templating and easy request routing.
- **Heroku** (no previous experience): Production environment.

### Tree with most important files
```
proximity
├── __init__.py             start of Python backend
├── view.py                 view layer, responsible for request routing
├── user_controller.py      controller layer, responsible for user logic
└── data.py                 data layer, responsible for database calls
```

## Front-end
- **JavaScript** (no previous experience) with **HTML** (basic previous experience).
- **Foundation** (no previous experience): Allows for easy and quick grid-based design, which scales well depending on screen size.
- **Underscore.js** (no previous experience): Allows for easy templating.
- **Backbone.js** (no previous experience): Front-end logic and routing. Takes away a lot of boilerplate code, and also allows for relatively transparent database syncing.
- **Grunt** (no previous experience): To combine and minify all JS code into a single quick-load file.
- **Require.js** (no previous experience): To load all necessary 3rd-party dependencies at the start and in the correct order, as well as loading the Google Maps API asynchronously.

### Tree with most important files
```
proximity
├── static
|   ├── css                               CSS files (minified Foundation)
|   ├── images                            Images (special Google Maps icon)
|   └── js                                JavaScript files
|       ├── build
|       |   ├── proximity.js              Concatenation of all Proximity JS code
|       |   ├── proximity.min.js          Minified version of proximity.js
|       ├── libs                          3rd-party JavaScript libraries
|       ├── main.js                       Front-end app launch point, contains Require.js configuration
|       └── src
|           ├── models                    Backbone.js Model extensions
|           ├── routers                   Backbone.js Router extensions
|           └── views                     Backbone.js View extensions
└── templates
    └── index.html                        HTML for the index (has _.js templates as inline scripts)
```


# Usage

## Running the app locally
1. Start a MongoDB server on port **27017** (or change the port in `proximity/__init__.py`).
2. Have MongoDB use `proximity` as database via the command `use proximity` in the Mongo shell. Alternatively, change the database to use in `proximity/__init__.py`.
3. Start a server by executing `python run.py`.

## Loading test data
There should be some data already loaded, but if you want to start fresh you can call `/users/load` to reset the database contents and create 20 test users with semi-randomized locations (10 in Belgium, 10 in San Francisco).

## REST API calls
- `GET /users`: Returns all users current in the database.
- `GET /users/<uid>`: Returns the user for that UserID.
- `GET /users_near?uid=<uid>`: Returns all user within a 1km radius of the user for that UserID.
- `POST /users`: Creates a new user with the info as JSON in the request.
- `PUT /users/<uid>`: Updates a user for that UserID with the info as JSON in the request.

## Live application
Up and running at [proximityapp.herokuapp.com](https://proximityapp.herokuapp.com)


# ToDo list

- **Code**
  - Tests. Tests everywhere.
  - Move Python API code to a separate folder, ensure that front-end only uses those API calls
  - Improve front-end code with better use of Backbone.sync
- **Features**
  - Filter "users near" to take into account "looking for" preferences.
  - Allow for user deletion.
  - Authentication/security.
- **Improve design/flow**
