var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Bloquing the HTML entities
//Declaring our array
var Todolist = [];


// Charging the index page when the user requests it
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', 
    function (socket, pseudo) {

        console.log("We have a new client: " + socket.id);
        //When a user connects, we send the most up to date list
        socket.on('newConnection', function () {
            io.sockets.emit('connectionUpdate', {tdlist:Todolist});
        });         
        // When a user adds an element, we update our array and send it to all the users
        socket.on('addnew', function (addnew) {
            addnew = ent.encode(addnew);
            Todolist.push(addnew);
            io.sockets.emit('addnew', {tdlist:Todolist});
        });
        // When a user deletes an element, we update our array and send it to all the users     
        socket.on('delete', function (id) {
            Todolist.splice(id,1);
            io.sockets.emit('delete', {tdlist:Todolist});
        }); 
    
    });
//Telling the server to listen on the 3000
server.listen(process.env.PORT || 3000,function () {
  console.log("Server has started");
});
