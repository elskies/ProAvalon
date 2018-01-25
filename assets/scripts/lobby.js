var socket = io({transports: ['websocket'], upgrade: false});
console.log("started");


//button event listeners
document.querySelector("#danger-alert-box-button").addEventListener("click", function(){
    document.querySelector("#danger-alert-box").classList.add("inactive-window");
    document.querySelector("#danger-alert-box-button").classList.add("inactive-window");
});

document.querySelector("#success-alert-box-button").addEventListener("click", function(){
    document.querySelector("#success-alert-box").classList.add("inactive-window");
    document.querySelector("#success-alert-box-button").classList.add("inactive-window");
});




document.querySelector("#chat-message-input").onkeyup = function (e) {
	//When enter is pressed in the chatmessageinput
	if (e.keyCode == 13) {
        var d = new Date();
        //set up the data structure:
        var message = this.value;

        //only do it if the user has inputted something
        //i.e. dont run when its an empty string
        if(message && message.length > 0){
            //append 0 in front of single digit minutes
            var dateMinutes = d.getMinutes();

            var date = "" + d.getHours() + ":" + dateMinutes;
            var data = {
                date: date,
                message: message
            }

            //reset the value of the textbox
            this.value = "";
            //send data to the server 
            socket.emit("allChatFromClient", data);

            //add the self chat
            var dateStr = "[" + data.date + "]";
            var str = "<li class=self>" + dateStr + " Me: " + data.message;
            $("#chat-list").append(str);
            //scroll down
            $("#chat-window")[0].scrollTop = $("#chat-window")[0].scrollHeight;
        }

    }
};

socket.on("allChatToClient", function(data){

	var date = "[" + data.date + "]";
	var str = "<li class=other>" + date + " " + data.username + ": " + data.message;
	$("#chat-list").append(str);
    //scroll down
    $("#chat-window")[0].scrollTop = $("#chat-window")[0].scrollHeight;


});

socket.on("player-joined-lobby", function(username){
    var str = "<li class=server-text>" + username + " has joined the lobby!";
    $("#chat-list").append(str);
});

socket.on("player-left-lobby", function(username){
    var str = "<li class=server-text>" + username + " has left the lobby.";
    $("#chat-list").append(str);
});


socket.on("update-current-players-list", function(currentPlayers){
    console.log("update the current player list request received");
    console.log(currentPlayers);
    //remove all the li's inside the list
    $("#current-players-list li").remove();
    
    //append each player into the list
    currentPlayers.forEach(function(currentPlayer){
      var str = "<li>" + currentPlayer + "</li>";
      $("#current-players-list").append(str);
  });
});

socket.on("update-current-games-list", function(currentGames){
    console.log("update the current games list request received");
    console.log(currentGames);
    //remove all the li's inside the list
    $("#current-games-list li").remove();
    
    //append each player into the list
    currentGames.forEach(function(currentGame){
        //if the currentGame exists
        if(currentGame){
            var str = "<li>" + currentGame.roomId + ": " + currentGame.status + "</li>";
            $("#current-games-list").append(str);      
        }

    });
});



//notifications code
socket.on("alert", function(data){
    alert(data);
    window.location.replace("/");
});

socket.on("danger-alert", function(data){
    document.querySelector("#danger-alert-box").classList.remove("inactive-window");
    document.querySelector("#danger-alert-box-button").classList.remove("inactive-window");
    document.querySelector("#danger-alert-box").textContent = data + "        |        Press here to remove";
});

socket.on("success-alert", function(data){
    document.querySelector("#success-alert-box").classList.remove("inactive-window");
    document.querySelector("#success-alert-box-button").classList.remove("inactive-window");
    document.querySelector("#success-alert-box").textContent = data + "        |        Press here to remove";
});



//ROOM CODE
document.querySelector("#testLink").addEventListener("click", function(){
    socket.emit("newRoom");
}); 

socket.on("autoJoinRoomID", function(roomID){
    console.log("auto join room");
    socket.emit("joinRoom", roomID);
})

socket.on("new-game-created", function(str){
    var str = "<li class=server-text>" + str + "</li>";
    $("#chat-list").append(str);
});