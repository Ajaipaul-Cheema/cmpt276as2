var canvas = document.getElementById("rectangleBox");
var nameRectangle = document.getElementById("name").innerHTML;
var width = document.getElementById("width").innerHTML;
var height = document.getElementById("height").innerHTML;
var color = document.getElementById("color").innerHTML;
var border = document.getElementById("border").innerHTML;
var borderColor = document.getElementById("borderColor").innerHTML;

canvas.style.backgroundColor = color.trim();
canvas.style.width = width.trim() + "px";
canvas.style.height = height.trim() + "px";
canvas.innerHTML += nameRectangle;

if(border.trim() == "Yes") {
canvas.style.border = "solid " + "5px " + borderColor.trim();
}
