var columns = [false,true,false];
var mainColumn=1;
var R=0;
var L=0;

document.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData("Text", event.target.id);
});

document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

document.addEventListener("drop", function(event) {
    event.preventDefault();
    if ( event.target.className == "droptarget" ) {
    	var table = document.getElementById("workSpace");
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
	if (row +1 >= document.getElementById("workSpace").rows.length-2){
		addRow();
	}
}

function findFreeColumn(startColumn){
	var table = document.getElementById("workSpace");
	if (startColumn<mainColumn || R>=L){
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
		for (var i=startColumn+1;i<columns.length;i++){
			if (!columns[i]){
				if (i== columns.length-1){
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
	var cell;
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
		} else{
			table.rows[i].insertBefore(newCell,table.rows[i].children[0]);
		}
	}
	if (side){
		columns.unshift(false);
		L++;
	}else {
		R++;
		mainColumn++;
		columns.push(false);
	}
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function addRow(){ // переделаить
	var table = document.getElementById("workSpace");
	var row = table.insertRow(-1);
	for (var i =0; i< columns.length;i++){
		var cell = row.insertCell(-1);
		cell.className= table.rows[0].cells[i].className;
	}
}


function addWindow(trg){
	var obj;
  	var main= document.getElementById("main");
	if (trg.id=="hiddenTools"){
		obj= document.getElementById("menu");
	} else  if (trg.id=="hiddenInformationMenu") {
		obj= document.getElementById("InformationMenu");
	}
	if (obj.style.display=="none"){
	    obj.style.display= "block";
	} else{
    	
 		obj.style.display= "none";
	}

}
