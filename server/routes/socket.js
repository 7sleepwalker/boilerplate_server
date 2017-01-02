// Keep track of which names are used so that there are no duplicates

var drawings = ["elephant", "lion", "sword"];
var activeDrawing = randomFromArray(drawings);
var activePainer;
function randomFromArray(_array){
    return (_array[Math.floor((Math.random() * _array.length) + 0)]);
}

var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

// export function for listening to the socket
module.exports = function (socket) {

  console.log("LOGIN: " + socket.id);

  var name = userNames.getGuestName();
  //send the new user their name and a list of users
  socket.emit('init', {
    name: name,
    users: userNames.get()
  });


  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // user logIn check
  socket.on('logIn_PUNS', function(data, fn) {
    console.log("JOIN PUNS BEFORE");
    socket.join('PUNS');
    console.log("JOIN PUNS AFTER");
    fn(true);
    //   if (data.users.length > 0) {
    //       fn(true);
    //   } else {
    //       fn(false);
      //
    //   }

  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.text
    });
  });

  // validate a user's name change, and broadcast it on success
  socket.on('change:name', function (data, fn) {
      console.log(" ### CHANGE NAME REQUEST ###");
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);

      name = data.name;
      console.log("FROM: " + name + " TO: " + oldName);
      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });

      fn(true);
    } else {
      fn(false);
    }
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {

    userNames.free(name);
    if (userNames.get().length < 2){
        socket.broadcast.emit('user:left', {
          name: name,
          emptyRoom: true
        });
    }
    else{
        if (name === activePainer){
            // NOWY GRACZ PO DISCONNECT OLD ONE ??????????????????????????????????????????????????????
        }
        socket.broadcast.emit('user:left', {
          name: name,
          emptyRoom: false
        });
    }
  });
};
