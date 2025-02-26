function POST(){
let sensor = document.getElementById('sensor').value;
let location = document.getElementById('location').value;
let value1 = document.getElementById('value1').value;
let value2 = document.getElementById('value2').value;
let value3 = document.getElementById('value3').value;
const xhttp = new XMLHttpRequest();
xhttp.open("POST", "http://localhost/post-esp-data.php");
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("&sensor=" + sensor + "&location=" + location + "&value1=" + value1 + "&value2=" + value2 + "&value3=" + value3 + "");
xhttp.onloadend = function(){
    console.log("Succes");
}
}