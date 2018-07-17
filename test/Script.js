

document.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData("Text", event.target.id);
});

document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

document.addEventListener("drop", function(event) {
    event.preventDefault();
    if ( event.target.className == "droptarget" ) {
        var data =document.getElementById(event.dataTransfer.getData("Text"));
        var startNode= data.parentNode
        var start= data.cloneNode(true);
        data.setAttribute("draggable", "false"); 
        event.target.appendChild(data);
        event.target.className = "lv";
        startNode.appendChild(start);
    }
});
