/* events fired on the draggable target */
document.addEventListener("drag", function( event ) {

}, false);

document.addEventListener("dragstart", function( event ) {
    // store a ref. on the dragged elem
    event.dataTransfer.setData("text/html", event.target.id);
    // make it half transparent
    event.target.style.opacity = .5;
}, false);

document.addEventListener("dragend", function( event ) {
    // reset the transparency
    event.target.style.opacity = "";
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function( event ) {
    // prevent default to allow drop
    event.preventDefault();
}, false);

document.addEventListener("dragenter", function( event ) {
    // highlight potential drop target when the draggable element enters it
    if ( event.target.className == "dropzone" ) {
        event.target.style.background = "purple";
    }

}, false);

document.addEventListener("dragleave", function( event ) {
    // reset background of potential drop target when the draggable element leaves it
    if ( event.target.className == "dropzone" ) {
        event.target.style.background = "";
    }

}, false);

document.addEventListener("drop", function( event ) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged elem to the selected drop target
    if ( event.target.className == "dropzone" ) {
        event.target.style.background = "";

        var data =event.dataTransfer.getData("text/html");
        
        var nodeCopy = document.getElementById(data).cloneNode(true);
        nodeCopy.id = "newId"; /* We cannot use the same ID */
        event.target.appendChild(nodeCopy);
    }
  
}, false);
