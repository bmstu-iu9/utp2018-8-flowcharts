let columns = [false,true,false];
let mainColumn=1;
let R=0;
let L=0;
let graph=[];
let countOfVort=1;
let targets= new Map();
let graphIds= new Map();
class vort{
	constructor(type,pos, x, y){
		this.parents= [];
		this.childs=[];
		this.type=type;
		this.pos=pos;
		this.x=x;
        this.y=y;
		this.ifRes=true;
	}
	addParent(parent){
		this.parents.push(parent);
	}
	addChild(child){
		this.childs.push(child);
	}
}

var startV=new vort("start",0,0,0);
startV.baseClass="lv";
graph.push(startV);
targets.set("1 0",0);


function getFocus(trg) {
	let row=trg.parentNode.rowIndex;
	let cell=trg.cellIndex;
	let paint=true;
	let V =graph[graphIds.get(row+ " "+(cell-mainColumn))];
	if (V.cell.className==="focusеtarget"){
		paint=false;
	}
	paintChilds(graph[1],false);
	paintChilds(V,paint);
	paintParents(V,paint);
}

function paintChilds(V,paint){
	if (paint){
        V.cell.className="focusеtarget";
    } else {
        V.cell.className=V.baseClass;
	}
	for (let i=0;i<V.childs.length;i++){
		let W=graph[V.childs[i]];
		if (W.ifRes || !paint){
            paintChilds(W,paint);
		}
	}
}

function paintParents(V,paint){
	if (paint){
        V.cell.className="focusеtarget";
    } else {
        V.cell.className=V.baseClass;
    }
    for (let i=0;i<V.parents.length;i++){
        let W=graph[V.parents[i]];
        paintParents(W,paint);
    }
}

document.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData("Text", event.target.id);
});


document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

document.addEventListener("drop", function(event) {
    event.preventDefault();
    if ( event.target.className === "droptarget" ) {
    	var table = document.getElementById("workSpace");
    	graph[0].cell= table.rows[0].cells[mainColumn];
        var data =document.getElementById(event.dataTransfer.getData("Text"));
        var startNode= data.parentNode;
        var start= data.cloneNode(true);
        data.setAttribute("draggable", "false");
        event.target.appendChild(data);
        event.target.setAttribute('onclick',"getFocus(this)");
        var row=event.target.parentNode.rowIndex;
        var cell =event.target.cellIndex;
        event.target.className = "lv";
       	startNode.appendChild(start);

        var key=row + " " +(cell-mainColumn);
       	var newVort = new vort(data.id,countOfVort++,row,cell-mainColumn);//поменть id у фигур
		newVort.baseClass=event.target.className;
		newVort.addParent(targets.get(key));
		newVort.cell=event.target;
        var parent=graph[targets.get(key)];
        parent.addChild(countOfVort-1);
        graphIds.set(key,countOfVort-1);
		targets.delete(key);

		if (newVort.x===parent.x){
			newVort.ifRes=false;
		}

        changeTrigger(row, cell,data.id,newVort);
        if (parent.pos!=0 && parent.cell.className==="focusеtarget" && newVort.ifRes){
        	newVort.cell.className="focusеtarget";
		}

        graph.push(newVort);
    }
});


function changeTrigger(row, cell, type, newVort){
	var table = document.getElementById("workSpace");
	if (type !== "end"){
		targets.set((row+1)+" "+(cell-mainColumn),newVort.pos);
		table.rows[row+1].cells[cell].className= "droptarget";
	}
	if (type=== "romb"){
		var newColumn = findFreeColumn(cell);
        targets.set(row+" "+(newColumn-mainColumn),newVort.pos);
		table.rows[row].cells[newColumn].className= "droptarget";
	}
	if (row >= document.getElementById("workSpace").rows.length-2){
		addRow();
	}
}

function findFreeColumn(startColumn){
	var table = document.getElementById("workSpace");
	if (startColumn<mainColumn || startColumn==mainColumn && R>=L){
		for (let i=startColumn-1;i>=0;i--){
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
		for (let i=startColumn+1;i<columns.length;i++){
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
	newCellClass ="lv";
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
		mainColumn++;
		L++;
	}else {
		R++;
		columns.push(false);
	}
}

function addRow(){
    let table = document.getElementById("workSpace");
    let row = table.insertRow(-1);
	for (let i =0; i< columns.length;i++){
        let cell = row.insertCell(-1);
		cell.className= table.rows[0].cells[0].className;
	}
}



function addWindow(trg){
    let obj; 
	let menu =document.getElementById("menu");
	let Ht=document.getElementById("hiddenTools");
	let iMenu =document.getElementById("InformationMenu")
	let Hm=document.getElementById("hiddenInformationMenu");
	let main =document.getElementById("main");
	/*
    let Wt =menu.style.display==="none"? (trg===Ht?9:0):(trg===Ht?0:9);
    let Ww=75;
    let Wi= iMenu.style.display==="none"? (trg===Hm?0:16):(trg===Hm?16:16);
	main.style.width= Ww + Wi + Wt + "%";
	main.style.left= Wt!=9? 9: 0 + "%";*/
	trg===Hm? obj= iMenu: obj=menu;
	if (obj.style.display==="none"){
		if (trg===Ht){
			if (iMenu.style.display==="none"){
				main.style.width="91%";
				main.style.left="9%";
			}else{
				main.style.width="75%";
				main.style.left="9%";
			}
		}else{
			if (menu.style.display==="none"){
				main.style.width="84%";
				main.style.left="0%";
			}else{
				main.style.width="75%";
				main.style.left="9%";
			}
		}
	    obj.style.display= "block";
	} else{
    	if (trg===Ht){
			if (iMenu.style.display==="none"){
				main.style.width="100%";
				main.style.left="0%";
			}else{
				main.style.width="84%";
				main.style.left="0%";
			}
		}else{
			if (menu.style.display==="none"){
				main.style.width="100%";
				main.style.left="0%";
			}else{
				main.style.width="91%";
				main.style.left="9%";
			}
		}
 		obj.style.display= "none";
	}
}

