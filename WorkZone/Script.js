let columns = [false,true,false];
let mainColumn=1;
let R=0;
let L=0;
let graph=[];
let countOfVort=2;
let graphIds= new Map();
let m = new Map();
let s = new Set();
let blockTriggered="NaN";
let varMap= new Map();
let varSet = new Set();
let errorOfBlock=false;
let zoom=5;
let cellW=230;
let cellH=200;
let inMenu=true ;
let firstFile=0;
let source;

window.onloud=function(){
    newFile();
    if (!source){
        source= document.getElementById('workSpaceBody').innerHTML;
    }
}();

class vort{
	constructor(type,pos, x, y){
		this.parents= [];
		this.childs=[];
		this.type=type;
		this.pos=pos;
		this.x=x;
        this.y=y;
		this.ifRes=true;
        this.dead=false;
	}
	addParent(parent){
		this.parents.push(parent);
	}
	addChild(child){
		this.childs.push(child);
	}
}


(function () {
  var blockContextMenu, myElement;

  blockContextMenu = function (evt) {
    evt.preventDefault();
    let trg=event.target;
    let cell;
    let row;
    if (trg.tagName=="TD"){
        row=trg.parentNode.rowIndex;
        cell=trg.cellIndex;
    } else {
        row=trg.parentNode.parentNode.rowIndex;
        cell=trg.parentNode.cellIndex;
    }
    let V =graph[graphIds.get(row+ " "+(cell-mainColumn))];
    if ( trg.tagName=="IMG" || (V.type=="trg" && V.childs.length==1) || V.type!="trg" ){
        cmenu();
    }
  };

  myElement = document.querySelector('#Main');
  myElement.addEventListener('contextmenu', blockContextMenu);
})();


function getFocus(trg) {
	let row=trg.parentNode.rowIndex;
	let cell=trg.cellIndex;
	let paint=true;
	let V =graph[graphIds.get(row+ " "+(cell-mainColumn))];
    if (V.type=="trg" && V.childs.length==1){
        cmenu();
    }
    if (V.cell.className==="focusеtarget"){
		paint=false;
	}
    paintChilds(graph[0],false);
	paintChilds(V,paint);
	paintParents(V,paint);
    blockTriggered=V.pos;
    document.getElementById("initBox").value=V.value==undefined?"":V.value;   
}

function paintChilds(V,paint){
    if (V.type=="trg"){
        return;
    }
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
	if (V.type=="trg"){
        return;
    }
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
    if ( event.target.className === "droptarget") {
    	var table = document.getElementById("workSpace");
    	graph[0].cell= table.rows[0].cells[mainColumn];
        var data =document.getElementById(event.dataTransfer.getData("Text"));
        var startNode= data.parentNode;
        var start= data.cloneNode(true);
        var row=event.target.parentNode.rowIndex;
        var cell =event.target.cellIndex;
        var key=row + " " +(cell-mainColumn);
        var V=graph[graphIds.get(key)];
        var parent=graph[V.parents[0]];
        if (V.childs.length!=0 && data.className=="end"){
            return;
        }
        data.setAttribute("draggable", "false");
        event.target.appendChild(data);
        event.target.setAttribute('onclick',"getFocus(this)");
        
        event.target.className = "lv";
       	startNode.appendChild(start);
        event.target.setAttribute("contextmenu","alert()");

        
        V.type=data.className;
        blockTriggered=V.pos;
        if (V.type!="end"){
            document.getElementById("initBox").focus();
        }
		if (V.x===parent.x){
			V.ifRes=false;
		}
        if (V.childs.length==0)
            changeTrigger(row, cell,data.id,V.pos,true);
        else if (V.type=="if")
            changeTrigger(row, cell,data.id,V.pos,false);
        if (parent.pos!=0 && parent.cell.className==="focusеtarget" && V.ifRes){
        	V.cell.className="focusеtarget";
		}
        if (V.type==="loop"){
            V.root=findRoot(V);
        }
    }
});


function changeTrigger(row, cell, type, prnt, check){
	var table = document.getElementById("workSpace");
	if (type !== "end" && check && type!== "loop"){
        let newVort = new vort("trg",countOfVort++,row+1,cell-mainColumn);//поменть id у фигур
        let key=(row+1)+ " " +(cell-mainColumn);
        newVort.baseClass="lv";
        newVort.addParent(prnt);
        graph[prnt].addChild(countOfVort-1);
        newVort.cell=table.rows[row+1].cells[cell];
        newVort.cell.className="droptarget";
        graphIds.set(key,countOfVort-1);
        graph.push(newVort);
	}
	if (type=== "romb"){
		let newColumn = findFreeColumn(cell);
        let key=row+ " " +(newColumn-mainColumn);
        let newVort = new vort("trg",countOfVort++,row,newColumn-mainColumn);//поменть id у фигур
        newVort.baseClass="lv";
        newVort.addParent(prnt);
        graph[prnt].addChild(countOfVort-1);
        newVort.cell=table.rows[row].cells[newColumn];
        newVort.cell.className="droptarget";
        graphIds.set(key,countOfVort-1);
        graph.push(newVort);
    }
	if (row >= document.getElementById("workSpace").rows.length-2){
		addRow();
	}
}

function findRoot(V){
    while (V.y==graph[V.parents[0]].y && graph[V.parents[0]].type!="start" ){
        V=graph[V.parents[0]];
    }
    return V.parents[0];
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
        newCell.style.width=cellW;
        newCell.style.height=cellH;
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
    let zm= document.getElementById('zoomBox');
	let Ht=document.getElementById("hiddenTools");
	let iMenu =document.getElementById("InformationMenu")
	let Hm=document.getElementById("hiddenInformationMenu");
	let main =document.getElementById("main");
	trg===Hm? obj= iMenu: obj=menu;
	if (obj.className=="hidden"){
		if (trg===Ht){
			if (iMenu.className=="hidden"){
				main.style.width="92%";
				main.style.left="8%";
			}else{
				main.style.width="76%";
				main.style.left="8%";
			}
		}else{
			if (menu.className=="hidden"){
				main.style.width="84%";
				main.style.left="0%";
			}else{
				main.style.width="76%";
				main.style.left="8%";
			}
            zm.style.left="74%";
		}
		obj.className="block";
		} else{
    	if (trg===Ht){
			if (iMenu.className=="hidden"){
				main.style.width="100%";
				main.style.left="0%";
			}else{
				main.style.width="84%";
				main.style.left="0%";
			}
		}else{
			if (menu.className=="hidden"){
				main.style.width="100%";
				main.style.left="0%";
			}else{
				main.style.width="92%";
				main.style.left="8%";
			}
            zm.style.left="90%";
		}
 		obj.className="hidden";
	}
}

function  hiddenVarBox(trg){
	let VarBox= document.getElementById("initVarBox");
	if (VarBox.style.display!=="block"){
		VarBox.style.display="block";
		trg.width=0;
		trg.height=0;
		trg.style.opacity=0;
		VarBox.focus();
	}
}

function getVal(){
	let trg= document.getElementById("Plas");
	let VarBox= document.getElementById("initVarBox");
    let prt= document.getElementById("var");
    let lastCh= document.getElementById("addVar");
    let elem1= document.createElement("div");
    let elem2= document.createElement("div");
    let hr= document.createElement("hr");
    res=parse(VarBox.value, true);
    if (res==="error" || res==="changes" || res==true || res==false){
        VarBox.style.background="#DEB5B1";
        return;
    }
    hr.size=3;
    hr.color="#334D4D";
    hr.style.opacity= 0.7;
    elem1.innerHTML = res;
    let i = document.createElement("div");
    i.innerHTML=m.get(res);
    varMap.set(res,m.get(res));
    elem2.appendChild(i);
    elem2.setAttribute('onclick',"reVal(this)");
    varSet.add(res);
    prt.insertBefore(elem1,lastCh);
    prt.insertBefore(elem2,lastCh);
    prt.insertBefore(hr,lastCh);
	VarBox.value="";
	VarBox.style.display="none";
	trg.width=40;
	trg.height=40;
	trg.style.opacity=1;
}

function returnPlas(){
	let trg= document.getElementById("Plas");
	let VarBox= document.getElementById("initVarBox");
	VarBox.style.display="none";
	trg.width=40;
	trg.height=40;
	trg.style.opacity=1;
}

function reVal(trg){
    let startVal=trg.firstChild
    let input= document.createElement("input");
    let del= document.createElement("img");
    startVal.style.display="none";
    input.setAttribute("type","text");
    input.setAttribute("id","tmpInput");
    input.setAttribute("placeholder", startVal.innerHTML);
    input.setAttribute("onblur","reValBlur()");
    input.setAttribute("onclick","reValBlur()");
    input.setAttribute("onkeydown", "if(event.keyCode==13){ reGetVal();}else {this.style.background='#DFE0E7';}")
    trg.appendChild(input);
    input.focus();
}

function reValBlur(){
    event.target.parentNode.firstChild.style.display="block";
    event.target.remove();
}

function reGetVal(){
    let trg=event.target;
    if (isNaN(trg.value)){
        trg.style.background="#DEB5B1";
    }else{
        let i=0;
        while (trg.parentNode.children[i+1]!=trg){
            i+=3;
        }
        let name= trg.parentNode.parentNode.children[i];
        if (trg.value===""){
            let per=trg.parentNode.parentNode;
            m.delete(name.innerHTML);
            s.delete(name.innerHTML);
            varSet.delete(name.innerHTML);
            varMap.delete(name.innerHTML);
            per.children[i].remove();
            per.children[i].remove();
            per.children[i].remove();
        } else{
            m.set(name.innerHTML,trg.value);
            varMap.set(name.innerHTML,trg.value);
            trg.parentNode.firstChild.innerHTML=trg.value;
            reValBlur();
        }
    }
}

function getValOfBlock(){
    var input=event.target;
    var trg=graph[blockTriggered];
    var res=parse(input.value,false);
    if (input.value===""){
        return;
    }
    if (res==="error" || (trg.type=="init" && (typeof(res)!=="string" || res=="changes")) || (trg.type=="act" && res!=="changes") || (trg.type=="if" && typeof(res)=="string")){
        input.style.background="#DEB5B1";
        return;
    }
    trg.value=input.value;
    input.value=""; 
    input.blur();
}

function copySet(A,B){
    for (let i of A){
        B.add(i);
    }
}

function changedBlock(){
    let trg=graph[blockTriggered];
    if (!trg || trg.dead){
        return;
    }
    let cell=document.getElementById("workSpace").rows[trg.x].cells[mainColumn+trg.y];
    cell.firstChild.style.border="4px solid #977676";
    cell.firstChild.style.background="#D1D6E1";
    if (errorOfBlock){
        cell.firstChild.style.background="#DEB5B1";
        errorOfBlock=false;
    }
    event.target.value=trg.value===undefined?"":trg.value;
}

function delChange(){
    let trg=graph[blockTriggered];
    let cell=document.getElementById("workSpace").rows[trg.x].cells[mainColumn+trg.y];
    cell.firstChild.style.border="none";
    cell.firstChild.style.background="none";
    event.target.value="";
    event.target.style.background="#DFE0E7";
}

function cmenu(){
    let contmenu=document.getElementById("submenu");
    let trg= event.target.tagName=="TD"?event.target: event.target.parentNode;
    let block=graph[graphIds.get(trg.parentNode.rowIndex+ " "+(trg.cellIndex-mainColumn))];
    document.getElementById("initBox").value=block.value===undefined?"": block.value;
    contmenu.style.display="block";
    blockTriggered=block.pos;
    contmenu.style.left=Math.round(event.clientX-15)+"px";
    contmenu.style.top=Math.round(event.clientY-90)+"px";

    if (event.target.id=="start" || event.target.firstChild && event.target.firstChild.id=="start" || event.target.className=="start"){
        return;
    } else if (event.target.className=="end" || event.target.className=="droptarget"){
        if (contmenu.children.length==4){
            contmenu.children[0].remove();
        }
        contmenu.style.height="120px";
    } else {
        if (contmenu.children.length==3){
            let lit=document.createElement("li");
            lit.setAttribute("onclick","reValBloc()");
            lit.innerHTML="<i>Переобозначить</i>";
            contmenu.insertBefore(lit,contmenu.children[0]);
        }
        contmenu.style.height="160px";
    }
    contmenu.style.width="170px";
    contmenu.style.opacity=0.9;
}

function closeMenu(){
    document.getElementById("initBox").value="";
    let contmenu=document.getElementById("submenu");
    contmenu.style.width="0";
    contmenu.style.height="0";
    contmenu.style.opacity=0;
}

function reValBloc(){
    var box =document.getElementById("initBox");
    box.focus();
    box.value = graph[blockTriggered].value;
    closeMenu();
}

function helpPage(){
    if (inMenu)
        return;
    let cnf=confirm("При переходе на туториал построенная ранее блок-схема удалится. Перейти?");
    if (cnf){
        document.location.href = 'help.html';
    }
}

function reSetM(){
    m.clear();
    for (let i of varSet){
        m.set(i,varMap.get(i));
    }
}

function buttonPlay(){
    if (inMenu)
        return;
    if (document.getElementById("var").firstChild.tagName=="i"){
        return;
    }
    s.clear();
    var V =graph[0];
    while(V.type!="end"){
        if (V.type=="start"){
            V=graph[V.childs[0]];
            continue;
        }
        //alert(V.type + " " + V.x+ " " + (V.y+mainColumn));
        if (V.childs.length==0){
            alert("error Of End");
            reSetM();
            return;
        }
        if (V.value){
            var tmpr =parse(V.value,true);
        } 
        if ( !V.value || tmpr == "error" ){
            let varbox= document.getElementById("initBox");
            blockTriggered=V.pos;
            varbox.style.background="#DEB5B1";
            errorOfBlock=true;
            varbox.focus();
            reSetM();
            return;
        }
        if (V.type=="if"){
            if(tmpr){
                if (graph[V.childs[0]].ifRes){
                    V=graph[V.childs[0]];
                } else {
                    V=graph[V.childs[1]];
                }
            } else {
                if (!graph[V.childs[0]].ifRes){
                    V=graph[V.childs[0]];
                } else {
                    V=graph[V.childs[1]];;
                } 
            }
            continue;
        } else if (V.type == "end"){
            break;
        }
        V=graph[V.childs[0]];
    }
    setRes();
    reSetM();
    return;
}

function setRes(){
    let varTable= document.getElementById("var");
    let elem= document.createElement("i");
    let hr= document.createElement("hr");
    hr.size=3;
    hr.color="#334D4D";
    hr.style.opacity= 0.7;
    varTable.innerHTML="";
    elem.innerHTML="Результат вычислений:";
    varTable.insertBefore(elem,document.getElementById("var").firstChild);
    for (let item of varSet){
        newSetRes(item,m);
    }
    for (let item of s){
        newSetRes(item,m);
    }
    varTable.insertBefore(elem,document.getElementById("var").firstChild);
}

function newSetRes(item, tMap){
    let prt= document.getElementById("var");
    let elem1= document.createElement("div");
    let elem2= document.createElement("div");
    let hr= document.createElement("hr");
    let place = document.getElementById("var").lastChild;
    hr.size=3;
    hr.color="#334D4D";
    hr.style.opacity= 0.7;
    elem1.innerHTML = item;
    let i = document.createElement("div");
    i.innerHTML=tMap.get(item);
    elem2.appendChild(i);
    if (tMap==varMap){
        elem2.setAttribute('onclick',"reVal(this)");
    } else prt.insertBefore(hr,place);
    prt.insertBefore(elem1,place);
    prt.insertBefore(elem2,place);
    if (tMap!=m) prt.insertBefore(hr,place); 
}

function buttonReStart() {
    if (inMenu)
        return;
    let varTable= document.getElementById("var");
    
    varTable.innerHTML='<div id="addVar" style=\"height: 100%\"><input type=\"image\" src=\"https://png.icons8.com/ios/100/2a3c3c/plus.png\" width=\"40\" height=\"40\" id=\"Plas\" onclick=\"hiddenVarBox(this)\" draggable=\"false\" checked/><input type=\"text\" name=\"инициализацияПеременных\" onblur=\"returnPlas()\" placeholder=\"var [name] = [expr];\" width=\"70%\" id=\"initVarBox\" onkeydown=\"if(event.keyCode==13){ getVal(this);} else {this.style.background=\'#DFE0E7\';}\"></div>';
    for (let i of varSet){
        newSetRes(i,varMap);
    }
}

function buttonDelete(){
    let trg=event.target.parentNode;
    let block=graph[blockTriggered];
    let pr = graph[block.parents[0]];
    blockTriggered=block.childs[0];
    if (block.type=="if"){
        let trueCh=!block.childs[0].ifRes? block.childs[0]:block.childs[1];
        let falseCh=block.childs[0].ifRes? block.childs[0]:block.childs[1];
        pr.childs[0]==block.pos?(pr.childs[0]=trueCh) :(pr.childs[1]=trueCh);
        graph[trueCh].parents[0]=pr.pos;
        columns[graph[falseCh].y+mainColumn]=false;
        dfs(graph[trueCh]);
        delDfs(graph[falseCh]);
    } else if (block.type=="end"){
        block.cell.innerHTML="";
        block.cell.className="droptarget";
        block.type="trg";
    }else{ 
        pr.childs[0]==block.pos?(pr.childs[0]=block.childs[0]) :(pr.childs[1]=block.childs[0]);
        graph[block.childs[0]].parents[0]=pr.pos;
        dfs(graph[block.childs[0]]);
        block.dead=true;
    }
    closeMenu();
}

function delDfs(V){
    for (let i =0; i<V.childs.length;i++){
        delDfs(graph[V.childs[i]]);
    }
    V.cell.innerHTML="";
    V.cell.className="lv";
    V.dead=true;
    graphIds.delete((V.x)+ " "+(V.y));
}

function dfs(V){
    let table=document.getElementById("workSpace");
    let pr=table.rows[V.x-1].cells[mainColumn+V.y]; 
    pr.innerHTML=V.cell.innerHTML;
    pr.className=V.cell.className;
    V.cell.innerHTML="";
    V.cell.className="lv";
    V.cell=pr;
    pr.setAttribute('onclick',"getFocus(this)");
    graphIds.set((V.x-1)+ " "+(V.y),V.pos);
    graphIds.delete((V.x)+ " "+(V.y));
    V.x--;
    for (var i=0;i<V.childs.length;i++){
        dfs(graph[V.childs[i]]);
    }
    
}

function buttonAddBlock(){ 
    paintChilds(graph[0]);
    let trg=event.target.parentNode;
    let block=graph[blockTriggered];
    let pr = graph[block.parents[0]];
    blockTriggered=block.childs[0];
    let newVort =new vort("trg",countOfVort++,block.x,block.y);
    pr.childs[0]==block.pos?(pr.childs[0]=newVort.pos) :(pr.childs[1]=newVort.pos);   
    block.parents[0]=newVort.pos;
    let key=(block.x)+ " " +(block.y);
    newVort.baseClass="lv";
    newVort.addParent(pr.pos);
    newVort.addChild(block.pos);
    newVort.cell=block.cell;
    newVort.cell.setAttribute('onclick',"getFocus(this)");
    graphIds.set(key,countOfVort-1);
    graph.push(newVort);
    dfsAdd(block);
    newVort.cell.className="droptarget";
    closeMenu();
}

function dfsAdd(V){
    for (var i=0;i<V.childs.length;i++){
        dfsAdd(graph[V.childs[i]]);
    }
    if (i==0){
        V.cell.setAttribute('onclick',"getFocus(this)");
        if (V.x+1 >= document.getElementById("workSpace").rows.length-2){
            addRow();
        }
    }
    let table=document.getElementById("workSpace");
    let nextCell=table.rows[V.x+1].cells[V.y+mainColumn];
    nextCell.innerHTML=V.cell.innerHTML;
    nextCell.className=V.cell.className;
    V.cell.innerHTML="";
    V.cell.className="lv";
    V.cell=nextCell;
    V.ifRes= V.y==graph[V.parents[0]].y?true:false;
    graphIds.set((V.x+1)+ " "+(V.y),V.pos);
    if (graph[V.parents[0]].type=="if" && !V.ifRes){
        graphIds.delete((V.x)+ " "+(V.y));   
    }
    V.x++;
}

function reSize(){
    let zoom=document.getElementById("zoom");
    let cells=document.querySelectorAll("#workSpace TD");
    let grad=zoom.value;
    let cf= 1;
    cf+=grad>=5?0.1* Math.abs(grad-5):-0.1* Math.abs(grad-5);
    for (var item of cells){
        item.style.width=cellW=(230*cf) + "px";
        item.style.height=cellH=(200*cf) + "px";
    }
    zoom=grad;
}


function newFile(){
    inMenu=true;
    let menu=document.getElementById("newFileMenu");
    let M=document.getElementById("Main");
    let lol=document.getElementById("lol");
    let lu=document.getElementById('newFileUl');
    menu.style.display= "block";
    if (firstFile==1 && lu.children.length==7){
        let lu=document.getElementById('newFileUl');
        let back = document.createElement('li');
        let hr= document.createElement("hr");
        hr.size=3;
        hr.color="#334D4D";
        hr.style.opacity= 0.7;
        hr.style.width="80%";
        hr.style="margin: 0% 10%;";
        menu.style.top="19%";
        menu.style.height="70%";
        back.innerHTML='<div>Back</div>';
        back.setAttribute('onclick',"buttonBack()");
        lu.appendChild(hr);
        lu.appendChild(back);
        let lues=document.querySelectorAll("#newFileUl li");
        for (let item of lues){
            item.style.height="16%";
        }
    }
    menu.style.opacity=1;
    M.style.opacity=0;
    document.getElementById("informationHead").style.display= "none";
    document.getElementById("toolsHead").style.display= "none";
}

function buttonBack(){
    firstFile++ ;
    let M=document.getElementById("Main");
    let menu=document.getElementById("newFileMenu");
    let lol=document.getElementById("lol");
    M.style.opacity=1;  
    menu.style.opacity=0;
    document.getElementById("informationHead").style.display= "block";
    document.getElementById("toolsHead").style.display= "block";
    setTimeout(1000);
    menu.style.display= "none";
}


function buttonNewFile(){
    firstFile++;
    let M=document.getElementById("Main");
    let menu=document.getElementById("newFileMenu");
    let lol=document.getElementById("lol");
    M.style.opacity=1;
    menu.style.opacity=0;
    document.getElementById("informationHead").style.display= "block";
    document.getElementById("toolsHead").style.display= "block";
    setTimeout(1000);
    menu.style.display= "none";
    let body=document.getElementById("workSpace");

    body.innerHTML='<tr><td class="lv"></td><td class="lv" id="start"><img src="img/start.png" width="60%" height="55%" class= "start"></td><td class="lv"></td></tr><tr><td class="lv"></td><td class="lv"></td><td class="lv"></td></tr><tr><td class="lv"></td><td class="lv"></td><td class="lv"></td></tr><tr><td class="lv"></td><td class="lv"></td><td class="lv"></td></tr><tr><td class="lv"></td><td class="lv"></td><td class="lv"></td></tr>'

    columns = [false,true,false];
    mainColumn=1;
    R=0;
    L=0;
    graph=[];
    countOfVort=2;
    graphIds= new Map();
    m = new Map();
    s = new Set();
    blockTriggered="NaN";
    varMap= new Map();
    varSet = new Set();
    errorOfBlock=false;
    zoom=5;
    document.getElementById("zoom").value=5;

    buttonReStart();

    var startV=new vort("start",0,0,0);
    startV.baseClass="lv";
    startV.cell=document.getElementById("workSpace").rows[0].cells[1];
    startV.addChild(1);
    startV.cell.setAttribute('onclick',"getFocus(this)");
    graphIds.set("0 0",0);

    var ft=new vort("trg",1,1,0);
    ft.baseClass="lv";
    ft.cell=document.getElementById("workSpace").rows[1].cells[1];
    ft.addParent(0);
    ft.cell.className="droptarget";
    graphIds.set("1 0",1);

    graph.push(startV);
    graph.push(ft);

}


////////////////////// часть парсера //////////////////////////////////////////////////////////////////////////////////////////////////////////



var oper= ["+", "=","-", "*", "/", "<", ">" , "(", ")", "?" , ":", "!", "|", "&","%" ,";", " "];
var sOper= ["=", "|","&", "-","+"];
var ssOper= ["-" ,"+"];

class Pos {
    constructor(str,pos) {
        this.str = str;
        this.pos = pos;
    }
    skip() {
        return new Pos(this.str,this.pos+1);
    }

    skipWhile(char) {
        while (this.getChar() === char) {
            this.pos++;
        }
        return new Pos(this.str,this.pos);
    }

    getChar() {
        return this.str[this.pos];
    }

    getVal(type) {
        if (type === "oper") {
            let t = this;
            let res = "";
            let a = this.getChar();
            res+=a;
            if (a==";" && this.pos!=this.str.length-1){
                SE="SE";
            }
            t = t.skip();
            a= t.getChar();
            if  (sOper.some(t=>t===a) || ssOper.some(t=>t===a) && res==a) {
                res += a;
                t = t.skip();
                a = t.getChar();
            }
            this.pos = t.pos;
            return res;
        } else if (type === "number"){
            let t = this;
            let res = "";
            let a = this.getChar();
            while(!oper.some(t=>t=== a)){
                if  (a >= '0' && a <= '9') {
                    res += a;
                    t = t.skip();
                    a = t.getChar();
                } else {
                    // console.log("error of Syntax1");
                    return "error";
                }
            }
            this.pos = t.pos;
            return res;
        } else {
            let t = this;
            let res = "";
            let a = this.getChar();
            while(!oper.some(t=>t=== a)){
                if  (a >= 'a' && a <= 'z' || a >= '0' && a <= '9' || a >= 'A' && a <= 'Z' ) {
                    res += a;
                    t = t.skip();
                    a = t.getChar();
                } else {
                    //console.log("error of Syntax2");
                    return "error";
                }
            }
            this.pos = t.pos;
            return res;
        }
    }

}

class token {
    constructor(str){
        this.tkn= new Pos(str,0);
        this.next();
    }

    next(){
        this.start = this.tkn.skipWhile(" ");
        var a = this.start.getChar();
        if (oper.some(t => t === a)){
            this.val=this.start.getVal("oper");
            this.id="oper";
        } else if (a >= 'a' && a <= 'z' || a >= 'A' && a <= 'Z') {
            this.val = this.start.getVal("ident");
            this.id="ident";
            if (this.val === "true" || this.val === "false"){
                this.id="boolean";
            }
        } else if (a >= '0' && a <= '9') {
            this.val = this.start.getVal("number");
            this.id = "number";
        } else {
            //console.log("error of token3");
            return "error";
        }
        if (this.val === "error"){
            SE = 'SE';
            //исключение
        }
        this.tkn=this.start;
    }

    getVal(){
        return this.val;
    }
    getId(){
        return this.id;
    }

}



var write=true;
var t;
var SE = 0;
function checkRes(result){
    if (result === undefined || SE === 'SE' || result==='NaN' ) {
        //alert(result);
        return "error";
    }
    else {
        //alert("result = " + result);
        return  result;
    }
}

function parse(str,wrt) {
    write=wrt;
    t= new token(str);
    SE=0;
    result="";
    if (';' !== t.getVal()) {
        return checkRes(parseO());
    }
}


function parseO() {
    return parse_O(parseE());
}

function parse_O(n) {
    if (t.getVal() === '?') {
        if (n) {
            t.next();
            return parseO();
        }
        else {
            t.next();
            parseO();
            if (t.getVal() === ':') {
                t.next();
                return parseO();
            }
            else {
                SE = 'SE';
                return;
            }
        }
    }
    else if ( t.getVal() === '<') {
        t.next();
        return parse_O(Number(n) < Number(parseE()));
    }
    else if (t.getVal() === '>') {
        t.next();
        return parse_O(Number(n) > Number(parseE()));
    }
    else if (t.getVal() === '>=') {
        t.next();
        return parse_O(Number(n) >= Number(parseE()));
    }
    else if (t.getVal() === '<=') {
        t.next();
        return parse_O(Number(n) <= Number(parseE()));
    }
    else if (t.getVal() === '==') {
        t.next();
        return parse_O(Number(n) == Number(parseE()));
    }
    else if (t.getId()==="number"|| t.getId()==="ident" || n==="initialization"&& t.getVal()!=";"){
        SE = 'SE';
        return;
    }
    return n;
}


function parseE() {
    return parse_E(parseT());
}


function parse_E(n) {
    //alert(t.getVal());
    if (t.getVal() === '+') {
        t.next();
        return parse_E(Number(n) + Number(parseT()));
    }
    else if (t.getVal() === '-') {
        t.next();
        return parse_E(Number(n) - Number(parseT()));
    }
    else if (t.getVal() === '||'){
        t.next();
        return parse_E(n || parseO());
    }
    else if (t.getId()==="number"|| t.getId()==="ident"){
        SE = 'SE';
        return;
    }
    return n;
}

function parseT() {
    return parse_T(parseF());
}


function parse_T(n) {
    //alert(n);

    if (t.getVal() === '*') {
        t.next();
        return parse_T(Number(n) * Number(parseF()));
    } else if (t.getVal() === '%') {
        t.next();
        return parse_T(Number(n) * Number(parseF()));
    }
    else if (t.getVal() === '/') {
        t.next();
        return parse_T(Number(n) / Number(parseF()));
    }
    else if (t.getVal() === '&&'){
        t.next();
        return parse_T(n && parseF());
    }
    else if (t.getId()==="number"|| t.getId()==="ident"){
        SE = 'SE';
        return;
    }
    return n;
}

function parseF() {
    //alert(t.getVal())
    if (t.getId()==="number") {
        var num = t.getVal();
        t.next();
        return num;
    }
    else if (t.getId()==='boolean'){
        if (t.getVal()){
            t.next();
            return true;
        } else{
            t.next();
            return false;
        }
    }
    else if (t.getId()==="ident") {
        if (t.getVal() === 'var') {
            t.next();
            var key = t.getVal();
            if (s.has(key) || varSet.has(key)) {
                SE = 'SE';
                return ;
            }
            t.next();
            if (t.getVal() === '=') {
                t.next();
                let res= Number(parseO());
                // доработаь с вариантами что значение будет bool
                if (SE!='SE'){
                    if (write){
                        s.add(key);
                        m.set(key,res);
                    }
                    return key;
                }  else {
                    return;
                }
            }
            else {
                if (write){
                    s.add(key);
                }
            }
        }
        else if (s.has(t.getVal()) || varSet.has(t.getVal()) || !write) {
            var key = t.getVal();
            t.next();
            var sors; 
            if (m.get(key)){
                sors = m;
            }else {
                sors =varMap;
            }

            if (t.getVal() === '=') {
                t.next();
                m.set(key, Number(parseO()));
                return 'changes';
            }
            else if (t.getVal() === '++'){
                t.next();
                if (write){
                    m.set(key,sors.get(key)+1);
                }
                return "changes";
            }
            else if (t.getVal() === '--'){
                t.next();
                if (write){
                    m.set(key,sors.get(key)-1);
                }
                return "changes";
            }
            else if (t.getVal() === '+='){
                t.next();
                let exp=parseE();
                if (write){
                    m.set(key,sors.get(key)+Number(exp));
                }
                return "changes";
            }
            else if (t.getVal() === '-='){
                t.next();
                let exp=parseE();
                if (write){
                    m.set(key,sors.get(key)-Number(exp));
                }
                return "changes";
            }
            else if (t.getVal() === '*='){
                t.next();
                let exp=parseE();
                if (write){
                    m.set(key,sors.get(key)*Number(exp));
                }
                return "changes";
            }
            else if (t.getVal() === '/='){
                t.next();
                let exp=parseE();
                if (write){
                    m.set(key,sors.get(key)/Number(exp));
                }
                return "changes";
            }
            else {
                let i= 0;
                if (write){
                    i=sors.get(key);
                }
                return i;
            }
        }
        else {
            SE = 'SE';
            return ;
        }
    }
    else if (t.getVal() === '(') {
        t.next();
        var n = parseO();
        if (t.getVal() === ')'){
            t.next();
            return n;
        } else {
            SE = 'SE';
            return ;
        }
    }
    else if (t.getVal() === '-') {
        t.next();
         return -1 * parseF();
    }
    else if (t.getVal()=== '!'){
        t.next();
        return !parseF();
    }
    else {
        SE='SE';
        return;
    }
}