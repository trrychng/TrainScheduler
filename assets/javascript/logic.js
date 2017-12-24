  var config = {
    apiKey: "AIzaSyCIYeWg1y7C0XwWJoZt4GPq8ZKGnURn_8g",
    authDomain: "trainscheduler-d1636.firebaseapp.com",
    databaseURL: "https://trainscheduler-d1636.firebaseio.com",
    projectId: "trainscheduler-d1636",
    storageBucket: "trainscheduler-d1636.appspot.com",
    messagingSenderId: "135533120883"
  };
firebase.initializeApp(config);

// Creating a variable to reference the database
var database = firebase.database();

//declaring our default train variables in the event that the database is empty
var train = "";
var destination = "";
var time = 0;
var frequency = 0;

// Capturing the Submit button click
$("#addTrain").on("click", function() {
  // Ensures the page doesn't refresh on click.
  event.preventDefault();

  // Capturing the user inputs and storing them as variables.
  train = $("#trainInput").val().trim();
  destination = $("#destinationInput").val().trim();
  time = moment($("#timeInput").val().trim(), "hmm").format("HHmm");
  frequency = $("#frequencyInput").val().trim();


  //creating the newTrain object and pushing to Firebase.
  var newTrain = {
    name: train,
    destination: destination,
    time: time,
    frequency: frequency
  };

  database.ref().push(newTrain);

  //Logging the properties of the new object to ensure that everything was pushed correctly.
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);
  
  //Informing the user that a train has been added to the scheduler.
  alert("Train successfully added to scheduler.");

  //Clearing the input fields after a user has successfully added a new train.
  $(".form-control").val("");

 
});

// Firebase event for adding a train to the database and a row in the html when a user adds a new train
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Storing into a variable.
  var train = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var time = childSnapshot.val().time;
  var frequency = childSnapshot.val().frequency;
  
  // Log the value of the various properties
  console.log("Train Name: " + train);
  console.log("Destination: " + destination);
  console.log("Train Frequency: " + frequency);
  console.log("First Departure: " + time);

  // Reformatting the inputted time.
  var timePretty = moment(time, "hh:mm").format("hh:mm A");

  // Subtract one day to make sure it comes before the current time.
  var timeConverted = moment(time, "hh:mm A").subtract(1, "day");

  // Current Time
  var currentTime = moment();
  console.log("Current time: " + moment().format("hh:mm A"));

  // Difference between the times
  var timeDiff = moment().diff(moment(timeConverted), "minutes");
  console.log("Difference in time: " + timeDiff);

  // Time apart (remainder)
  var timeRemainder = timeDiff % frequency;
  console.log("Time apart: " + timeRemainder);

  // Minutes until train's next arrival
  var minutesTillTrain = frequency - timeRemainder;
  console.log("Minutes till next train: " + minutesTillTrain);
  console.log("--------------------------------------")

  //Calculating the next available train.
  var nextTrain = moment().add(minutesTillTrain, "minutes");

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + train + "</td><td>" + destination + 
    "</td><td>" + frequency + "</td><td>" + moment(nextTrain).format("hh:mm A") + "</td><td>" + minutesTillTrain + "</td></tr>");
  }, 

  // If there are any errors, log them to the console.
  function(errorObject) {
  console.log("The read failed: " + errorObject.code);

});