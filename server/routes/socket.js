// Keep track of which names are used so that there are no duplicates

var drawings = ["słoń", "tv", "telefon", "mikrofon", "książka", "lornetka", "zamek", "dom",
 "głośnik", "lampa", "klawiatura", "mysz", "ptak", "drzewo", "sklep", "samochód",
 "ciężarówka", "traktor", "autobus", "samolot", "statek", "jabłko", "gruszka", "kiwi", "garnek",
 "patelnia", "miska", "wiaderko", "film", "długopis", "ołowek", "zeszyt", "karta", "butelka",
 "kosz na śmieci", "piłka", "siatka", "płot", "brama", "człowiek", "bluza", "spodnie", "gitara",
 "kredki", "zboże", "słuchawki", "doniczka", "siekiera", "nóż", "widelec", "łyżka", "fotel", "krzesło",
 "kanapa", "kanapka", "chleb", "kiełbasa", "stół", "łóżko", "szafa", "biurko", "kwiatek", "tulipan",
 "słonecznik", "ławka", "miotła", "szczkotka", "grabie", "łopata", "trąbka", "wiertarka", "bębny",
 "pałeczki", "deska", "czaszka", "ręka", "świeczka", "lampa", "ogień", "ognisko", "grill", "perfum",
 "puszka", "anioł", "wosk", "ul", "pszczoła", "miód", "niedźwiedż", "drzwi", "kręgle", "puchar",
 "wózek", "buty", "ciasto", "tort", "kufel", "sofa", "nos", "kierownica", "worek", "plakat",
 "pistolet", "pluszak", "plecak", "smycz", "obroża", "okno", "koło", "felga", "wanna"];
var activeDrawing;
var activePainer;
function randomFromArray(_array) {;
    var tmpRand = Math.floor((Math.random() * (_array.length)) + 0);
    return (_array[tmpRand]);
}
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
var drawQueue = [];
var socketIDs = {
    id: {},
    score: {},
    addUser: function(_id, name){
        if(name && !this.id[name]){
            this.id[name] = _id;
            this.score[name] = 0;
            return true;
        }
    },
    removeUser: function(name){
        delete this.id[name];
        delete this.score[name];
        return true;
    },
    getUserID: function(name){
        return this.id[name];
    },
    getUserScore: function(name){
        return this.score[name];
    },
    getUsers: function(){
        var tmp = [];
        for (user in this.id){
            tmp.push(user);
        }
        return tmp;
    },
    getUsersByScore: function(){
      var tmp = [];
      for (user in this.score){
          tmp.push(user);
      }
      return tmp;
    },
    randomUser: function(){
        var random = randomFromArray(Object.keys(this.id));
        return ( random );
    }
}
var userNames = (function() {
    var names = {};

    var claim = function(name) {
        if (!name || names[name]) {
            return false;
        } else {
            names[name] = true;
            return true;
        }
    };

    // find the lowest unused "guest" name and claim it
    var getGuestName = function() {
        var name,
            nextUserId = 1;

        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (!claim(name));

        return name;
    };

    // serialize claimed names as an array
    var get = function() {
        var res = [];
        for (user in names) {
            res.push(user);
        }

        return res;
    };

    var free = function(name) {
        if (names[name]) {
            delete names[name];
        }
    };

    return {claim: claim, free: free, get: get, getGuestName: getGuestName};
}());

// export function for listening to the socket
module.exports = function(socket) {
    // ##################################
    //          GLOBAL SETTINGS
    // ##################################
    var name = userNames.getGuestName();

    socket.on('setNickName', function(data, fn) {
        console.log(" ### USER SET UNIQ NICK FOR SOCKET ###");
        console.log(" ### NICK: " + data.name + " ###");

        if (userNames.claim(data.name)) {
            var oldName = name;
            userNames.free(oldName);
            name = data.name;

            fn(true);
        } else {
            fn(false);
        }
    });

    // broadcast a user's message to other users
    socket.on('send:message', function(data) {
        // if (){
        //
        // }
        socket.broadcast.emit('send:message', {
            user: name,
            text: data.text
        });
        console.log(activeDrawing + " " + activePainer + " " + name);
        if (data.text === activeDrawing && name != activePainer) {
            console.log('ZGADŁ');
            socket.server.sockets.emit('user:scored', {
                user: name,
                text: data.text
            });
            // NEW DRAWING / NEW PAINTER
            if (drawQueue.length === 0){
              drawQueue = socketIDs.getUsers();
            }
            activePainer = randomFromArray(drawQueue);
            activeDrawing = randomFromArray(drawings);
            drawQueue = removeA(drawQueue, activePainer);
            socket.server.sockets.to("PUNS").emit('send:message', {
                 user: "BOT",
                 text: "rysuje - " + activePainer
            });
            socket.server.sockets.to(socketIDs.getUserID(activePainer)).emit('new:drawing', {
               drawing: activeDrawing
            });

        }
    });

    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function(data, fn) {
        console.log(" ### CHANGE NAME REQUEST ###");
        if (userNames.claim(data.name)) {
            var oldName = name;
            userNames.free(oldName);
            name = data.name;
            fn(true);
        } else {
            fn(false);
        }
    });

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function() {
        userNames.free(name);
        socketIDs.removeUser(name);
        drawQueue = removeA(drawQueue, name);
        if (userNames.get().length < 2) {
            socket.broadcast.emit('user:left', {
                name: name,
                emptyRoom: true
            });
        } else {
            if (name === activePainer) {
              if (drawQueue.length === 0){
                drawQueue = socketIDs.getUsers();
              }
              activePainer = randomFromArray(drawQueue);
              activeDrawing = randomFromArray(drawings);
              drawQueue = removeA(drawQueue, activePainer);
              socket.server.sockets.to("PUNS").emit('send:message', {
                   user: "BOT",
                   text: "rysuje - " + activePainer
              });
              socket.server.sockets.to(socketIDs.getUserID(activePainer)).emit('new:drawing', {
                 drawing: activeDrawing
              });
            }
            socket.broadcast.emit('user:left', {
                name: name,
                emptyRoom: false
            });
        }
    });

    // ##################################
    //              GAME PUNS
    // ##################################
    socket.on('joinPuns', function(nickName) {

        console.log("JOIN PUNS");
        socket.join('PUNS');
        socketIDs.addUser(socket.id, name);
        drawQueue.push(name);
        console.log(drawQueue);

        // console.log(activeDrawing);
        // console.log(socketIDs[1]);
        // console.log("LOGIN: " + socket.id);

        // console.log(socket.server.sockets.adapter.rooms["PUNS"]);
        // console.log(socketIDs);
        // pick user to draw
        socket.on('chooseArtist', function(data, fn) {
            if (drawQueue.length === 0){
              drawQueue = socketIDs.getUsers();
            }
            activePainer = randomFromArray(drawQueue);
            drawQueue = removeA(drawQueue, activePainer);
            activeDrawing = randomFromArray(drawings);
            socket.server.sockets.to("PUNS").emit('send:message', {
                user: "BOT",
                text: "rysuje - " + activePainer
            });
            fn(activePainer);
            socket.server.sockets.to(socketIDs.getUserID(activePainer)).emit('new:drawing', {
              drawing: activeDrawing
            });
            console.log("chooseArtist: " + activePainer + " chooseDrawing: " + activeDrawing);
            // socket.broadcast.emit();
        });
        socket.on('chooseArtist2', function(data, fn) {
            activePainer = randomFromArray(data);
            activeDrawing = randomFromArray(drawings);
            socket.broadcast.emit('send:message', {
                user: "BOT",
                text: "rysuje - " + activePainer
            });
            fn(activePainer);
            socket.server.sockets.to(socketIDs.getUserID(activePainer)).emit('new:drawing', {
              drawing: activeDrawing
            });
            console.log("chooseArtist2: " + activePainer + " chooseDrawing: " + activeDrawing);
            // socket.broadcast.emit();
        });
        socket.on('send:rect', function(data){
          socket.broadcast.emit('get:rect', data);
        });

        //send the new user their name and a list of users
        socket.emit('init', {
            name: name,
            users: userNames.get()
        });

        // notify other clients that a new user has joined
        socket.broadcast.emit('user:join', {name: name});
        console.log('Tworze strone');
        socket.emit('logIn_PUNS');
        // user logIn check

        //});

    });
};
