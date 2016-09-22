# BB Investimentos API
A RESTful API for all investment funds of Brazilian bank Banco do Brasil
- Visit our website (available only in PT-BR): https://bbinvestimentos-api.herokuapp.com

# How it works
- Users can send HTTP requests through the GET method in order to obtain the desired data
- Use https://bbinvestimentos-api.herokuapp.com/api/fundos to get all funds available
- Use https://bbinvestimentos-api.herokuapp.com/api/fundos/{id or code} to get a specific fund by ID or alphanumeric code

- Other methods like POST, PUT and DELETE are available for admin users

# Technology stack
- API implementation: Node.js, Express and Mongoose
- Database: MongoDB
- Web front-end: AngularJS, Bootstrap and jQuery
- App container: Heroku
