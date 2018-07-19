var columns = [false,true,false];
var mainColumn=1;

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
	if (type !== "end"){
			table.rows[row+1].cells[cell].className= "droptarget"; 
	}
	if (type=== "romb"){ 
		var newColumn = findFreeColumn(cell)
		table.rows[row].cells[newColumn].className= "droptarget";
	}
}

function findFreeColumn(startColumn){
	var table = document.getElementById("workSpace");
	if (startColumn<mainColumn || (!columns[mainColumn-1] && mainColumn== startColumn)){
		for (var i=startColumn-1;i>=0;i--){
			if (!columns[i]){
				if(i==0){
					addColumn(true);
					i++;
				}
				columns[i]=true;
				return i ;
			}
		}
	} else {
		alert();
		for (i=startColumn+1;i<columns.length;i++){
			if (!columns[i]){
				if(i==columns.length-1){
					addColumn(false);
				}
				columns[i]=true;
				return i ;
			}
		}
	}
} 

function addColumn(side){
	var newCellClass;
	var table = document.getElementById("workSpace");
	var pos =0;
	if (!side){
		pos=columns.length-1;
	}
	if (table.rows[0].cells[pos].className=== "lv"){
		newCellClass ="lc";
	} else {
		newCellClass ="lv";
	}
	for (var i =0;i<table.rows.length;i++){
		var newCell= document.createElement("td");
		newCell.className=newCellClass;
		if (!side){
			table.rows[i].appendChild(newCell);
			columns.push(false);
		} else{
			table.rows[i].insertBefore(newCell,table.rows[i].children[0]);
			columns.unshift(false);
			mainColumn++;
		}
	}
}