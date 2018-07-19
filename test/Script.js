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
        var row=event.target.parentNode.rowIndex;
        var cell =event.target.cellIndex;
        if (document.getElementById("workSpace").rows[row+1].cells[cell].className === "lv"){
        	event.target.className = "lv";
    	}	else {
    		event.target.className = "lc";
    	}
        startNode.appendChild(start);
        changeTrigger(row, cell,data.id);
    }
});


function changeTrigger(row, cell, type){
	var table = document.getElementById("workSpace");
	table.rows[row+1].cells[cell].className= "droptarget"; 
	if (type=== "romb"){ 
		table.rows[row].cells[cell+1].className= "droptarget";
	}
}