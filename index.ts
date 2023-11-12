import readline from "readline";

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a WebSocket connection
const socket = new WebSocket("ws://localhost:3000");

// Message is received
socket.addEventListener("message", (event) => {
  // Ensure the event data is treated as a string
  const message = event.data instanceof Buffer ? event.data.toString() : event.data;
  console.log(`Received: ${message}`);

  // Parse the sender ID and message content
  const senderIdMatch = message.match(/^from: (\S+), message: (.+)/);
  
  if (senderIdMatch) {
    const senderId = senderIdMatch[1];
    const messageContent = senderIdMatch[2].toLowerCase();

    // Check for the time command
    if (messageContent.includes("what's the time")) {
      const currentTime = new Date().toLocaleTimeString(); // Get the current time
      console.log(`Sending current time to ${senderId}: ${currentTime}`);
      socket.send(`@${senderId} The current time is: ${currentTime}`);
    }
  } else {
    console.log("Could not parse the sender ID and message.");
  }
});



// Socket opened
socket.addEventListener("open", (event) => {
  // connected
  console.log("Connected to the server.");

  // Send a registration message as soon as the connection opens
  const registrationMessage = "register as TimeBot";
  socket.send(registrationMessage);

  // prompt
  rl.prompt();
});

// Socket closed
socket.addEventListener("close", (event) => {
  console.log("Disconnected from the server.");
  rl.close();
});

// Error handler
socket.addEventListener("error", (event) => {
  console.error("An error occurred with the WebSocket.");
});

// Handle the 'line' event
rl.on("line", (line) => {
  // check for bye
  if (line.trim().toLowerCase() === "bye") {
    // Close the WebSocket connection if the user enters 'bye'
    socket.close();
  } else {
    // Send the message to the server
    socket.send(line);
  }
  rl.prompt();
}).on("close", () => {
  console.log("Have a great day!");
  process.exit(0);
});
