import { Peer } from "https://esm.sh/peerjs@1.5.4?bundle-deps"

var peer = new Peer();

var connection;

function connect() {

    var id = document.getElementById("id").value;
    console.log("connecting to :" + id)
    var conn = peer.connect(id);
    conn.on('open', function () {
        conn.send('hi!');
    });
    conn.on('data', function (data) {
        console.log(data);
        document.getElementById("que").innerHTML = data;
    });
    connection = conn
}


document.getElementById("connect").addEventListener("click", connect)

function send() {
    var message = document.getElementById("message").value;
    connection.send(message)
}

document.getElementById("send").addEventListener("click", send)

peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
    document.getElementById("peerid").innerHTML = id;
});

peer.on('connection', function (conn) {
    conn.on('data', function (data) {
        console.log(data);
        document.getElementById("que").innerHTML = data;
    });
    connection = conn
});

export { connect }