$(document).ready(function() {
  $(".carousel.carousel-slider").carousel({
    fullWidth: true
  });
  autoplay();
  function autoplay() {
    $(".carousel").carousel("next");
    setTimeout(autoplay, 4500);
  }

  //   // my firebase reference
  var firebaseConfig = {
    apiKey: "AIzaSyCJ3r5_wWpR8BwixkfxBxWYr0LoBVuvmyk",
    authDomain: "trainschedule-1ae3b.firebaseapp.com",
    databaseURL: "https://trainschedule-1ae3b.firebaseio.com",
    projectId: "trainschedule-1ae3b",
    storageBucket: "",
    messagingSenderId: "151739966825",
    appId: "1:151739966825:web:7a66796b9990befb"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // A variable to reference the database.
  var dataRef = firebase.database();

  //   // My clock
  function currentTime() {
    var today = new Date();
    var hour = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    min = timeCheck(min);
    sec = timeCheck(sec);
    document.getElementById("clock").innerHTML =
      "Current Time: " + hour + ":" + min + ":" + sec;
    var t = setTimeout(currentTime, 500);
  }
  function timeCheck(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  currentTime();
  console.log(currentTime);

  // Initial Values
  //   var trainName = "";
  //   var destination = "";
  //   var firstTime = "";
  //   var frequency = "";

  $("#submit").on("click", function(event) {
    event.preventDefault();

    // Grabbing user input
    var trainName = $("#trainNameInput")
      .val()
      .trim();
    var destination = $("#destinationInput")
      .val()
      .trim();
    var firstTime = $("#firstTrainInput")
      .val()
      .trim();
    var frequency = $("#frequencyInput")
      .val()
      .trim();

    // Creating local "temporary" object for holding train data
    dataRef.ref().push({
      trainName: trainName,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency
    });

    console.log(trainName);
    console.log(destination);
    console.log(firstTime);
    console.log(frequency);
  });

  // Firebase watcher + initial loader HINT: .on("value")
  dataRef.ref().on(
    "child_added",
    function(snapshot) {
      // Log everything that's coming out of snapshot
      console.log(snapshot.val().trainName);
      console.log(snapshot.val().destination);
      console.log(snapshot.val().frequency);
      console.log(snapshot.val().nextTrain);
      // Change the HTML to reflect
      var trainName = snapshot.val().trainName;
      var destination = snapshot.val().destination;
      var firstTime = snapshot.val().firstTime;
      var frequency = snapshot.val().frequency;

      // First user train time
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

      //Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart(remainder)
      var timeRemainder = diffTime % frequency;
      console.log(timeRemainder);

      // Minutes Until Train
      var tMinutesTillTrain = frequency - timeRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      // Creating the new row
      var newRow = $("<tr>").append(
        $("<td>").append(trainName),
        $("<td>").append(destination),
        $("<td>").append(frequency + " min"),
        $("<td>").text((nextTrain).format("HH:mm")),
        $("<td>").append(tMinutesTillTrain)
      );

      $("#trainTable > tbody").append(newRow);


    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");

      // Handle the errors
    },
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );
});
