const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const middleware = require('./utilities/middleware');

app.get("/", (request, response) => {
//this is a Web page so set the content-type to HTML
  response.writeHead(200, {'Content-Type': 'text/html'});
  for (let i = 1; i < 7; i++) {
    //write a response to the client
    response.write('<h' + i + ' style="color:blue">Hello World From GitHub!</h' + i + '>');
  }
  response.end(); //end the response
});

/**
 * Route for users to register to our app
 */
app.use("/auth", require("./routes/auth/register"));

/**
 * Route for users to resetPassword to our app
 */
app.use("/auth", require("./routes/auth/login"));

/**
 * Route for users to verify their email address
 */
app.use("/verification", require("./routes/auth/verify"));

/**
 * Route for users to change their password
 */
app.use("/password", require("./routes/auth/password/change_password"));

/**
 * Route for users to reset their password
 */
app.use("/password/reset", require("./routes/auth/password/reset_password"));

/**
 * Route for users to create, read, update, and delete contacts
 */
app.use("/contacts", middleware.checkToken, require("./routes/contacts/list"));

/**
 * Route for users to confirm or deny contact requests
 */
app.use("/contactRequests", middleware.checkToken, require("./routes/contacts/requests"));

/**
 * Route for users to get weather information
 */
app.use("/weather", middleware.checkToken, require("./routes/weather"));

/**
 * Route for users to create / get messages in chat room
 */
app.use('/messages', middleware.checkToken, require('./routes/chat/messages.js'));

/**
 * ROute for users to create and retrieve chat rooms
 */
app.use('/chats', middleware.checkToken, require('./routes/chat/chats.js'));

/**
 * Route to accept users Pushy tokens
 */
app.use('/auth', middleware.checkToken, require('./routes/chat/pushy_register.js'));

/**
 * Serve the API documentation generated by apidoc as HTML. * https://apidocjs.com/
 */
app.use("/doc", express.static('apidoc'));

/*
* Heroku will assign a port you can use via the 'PORT' environment variable
* To accesss an environment variable, use process.env.<ENV>
* If there isn't an environment variable, process.env.PORT will be null (or undefined) * If a value is 'falsy', i.e. null or undefined, javascript will evaluate the rest of the 'or'
* In this case, we assign the port to be 5000 if the PORT variable isn't set
* You can consider 'let port = process.env.PORT || 5000' to be equivalent to:
* let port; = process.env.PORT;
* if(port == null) {port = 5000}
*/
app.listen(PORT, () => {
  console.log("Server up and running on port: " + PORT);
});
