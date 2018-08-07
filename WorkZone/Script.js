let columns = [false,true,false];
let mainColumn=1;
let R=0;
let L=0;
let graph=[];
let countOfVort=1;
let targets= new Map();
let graphIds= new Map();
let m = new Map();
let s = new Set();
let blockTriggered="NaN";
let source = document.getElementById("body").cloneNode;
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
    if (event.target.tagName!=="TD"){
        return;
    }
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
        data.setAttribute('onclick',"cmenu()");
        event.target.appendChild(data);
        event.target.setAttribute('onclick',"getFocus(this)");
        var row=event.target.parentNode.rowIndex;
        var cell =event.target.cellIndex;
        event.target.className = "lv";
       	startNode.appendChild(start);
        event.target.setAttribute("contextmenu","alert()");

        var key=row + " " +(cell-mainColumn);
       	var newVort = new vort(data.id,countOfVort++,row,cell-mainColumn);//поменть id у фигур
		newVort.baseClass=event.target.className;
		newVort.addParent(targets.get(key));
		newVort.cell=event.target;
        var parent=graph[targets.get(key)];
        parent.addChild(countOfVort-1);
        graphIds.set(key,countOfVort-1);
        blockTriggered=countOfVort-1;
		targets.delete(key);
		if (newVort.x===parent.x){
			newVort.ifRes=false;
		}

        changeTrigger(row, cell,data.id,newVort);
        if (parent.pos!=0 && parent.cell.className==="focusеtarget" && newVort.ifRes){
        	newVort.cell.className="focusеtarget";
		}

        graph.push(newVort);
        document.getElementById("initBox").focus();
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
    res=parse(VarBox.value);
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
    elem2.appendChild(i);
    elem2.setAttribute('onclick',"reVal(this)");
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
    /*del.setAttribute("src",'https://png.icons8.com/office/40/38A77E/cancel.png');
    del.setAttribute("width","30");
    del.setAttribute("height","30");
    del.id="delImg";*/
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
            per.children[i].remove();
            per.children[i].remove();
            per.children[i].remove();
        } else{
            m.set(name.innerHTML,trg.value);
            trg.parentNode.firstChild.innerHTML=trg.value;
            reValBlur();
        }
    }
}

function getValOfBlock(){
    var input=event.target;
    var trg=graph[blockTriggered];
    var res=parse(input.value);
    if (input.value===""){
        return;
    }
    if (res==="error" ){
        input.style.background="#DEB5B1";
        return;
    }
    trg.value=input.value;
    input.value=""; 
    input.blur();
}

function changedBlock(){
    let trg=graph[blockTriggered];
    let cell=document.getElementById("workSpace").rows[trg.x].cells[mainColumn+trg.y];
    cell.firstChild.style.border="4px solid #977676";
    cell.firstChild.style.background="#D1D6E1"
    event.target.value=trg.value===undefined?"":trg.value;
}

function belChenge(){
    let trg=graph[blockTriggered];
    let cell=document.getElementById("workSpace").rows[trg.x].cells[mainColumn+trg.y];
    cell.firstChild.style.border="none";
    cell.firstChild.style.background="none";
    event.target.value="";
    event.target.style.background="#DFE0E7";
}

function cmenu(){
    let contmenu=document.getElementById("submenu");
    let trg=event.target.parentNode;
    let block=graph[graphIds.get(trg.parentNode.rowIndex+ " "+(trg.cellIndex-mainColumn))];
    document.getElementById("initBox").value=block.value===undefined?"": block.value;
    contmenu.style.display="block";
    blockTriggered=block.pos;
    contmenu.style.left=Math.round(event.clientX-15)+"px";
    contmenu.style.top=Math.round(event.clientY-90)+"px";
    contmenu.style.width="170px";
    contmenu.style.height="150px";
    contmenu.style.opacity=0.9;
}

function closeMenu(){
    let contmenu=document.getElementById("submenu");
    contmenu.style.width="0";
    contmenu.style.height="0";
    contmenu.style.opacity=0;
}

function reValBloc(){
    document.getElementById("initBox").focus();
    closeMenu();
}

function helpPage(){
    let cnf=confirm("При переходе на туториал построенная ранее блок-схема удалится. Перейти?");
    if (cnf){
        document.location.href = 'help.html';
    }
}

function buttonPlay(){

}

////////////////////// часть парсера //////////////////////////////////////////////////////////////////////////////////////////////////////////



var oper= ["+", "=","-", "*", "/", "<", ">" , "(", ")", "?" , ":", "!", "|", "&","%" ,";", " "];
var sOper= ["=", "|","&"];

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
            t = t.skip();
            a= t.getChar();
            if  (sOper.some(t=>t===a)) {
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




var t;
var SE = 0;
function checkRes(result){
    if (result === undefined || SE === 'SE' || result==='NaN' ) {//кастыыль)
        //alert(result);
        return "error";
    }
    else {
        //alert("result = " + result);
        return  result;
    }
}

function parse(str) {
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
            if (s.has(key)) {
                SE = 'SE';
                return ;
            }
            t.next();
            if (t.getVal() === '=') {
                t.next();
                let res= Number(parseO());
                // доработаь с вариантами что значение будет bool
                if (SE!='SE'){
                    s.add(key);
                    m.set(key,res);
                    return key;
                }  else {
                    return;
                }
            }
            else {
                s.add(key);
            }
        }
        else if (s.has(t.getVal())) {
            var key = t.getVal();
            t.next();
            if (t.getVal() === '=') {
                t.next();
                m.set(key, Number(parseO()));
                return 'changes';
            }
            //не работает ++, --, *=, /=
            else if (t.getVal() === '++'){
                t.next();
                m.set(key,m.get(key)+1);
                return "changes";
            }
            else if (t.getVal() === '--'){
                t.next();
                m.set(key,m.get(key)-1);
                return "changes";
            }
            else if (t.getVal() === '+='){
                t.next();
                m.set(key,m.get(key)+Number(parseE()));
                return "changes";
            }
            else if (t.getVal() === '-='){
                t.next();
                m.set(key,m.get(key)-Number(parseE()));
                return "changes";
            }
            else if (t.getVal() === '*='){
                t.next();
                m.set(key,m.get(key)*Number(parseE()));
                return "changes";
            }
            else if (t.getVal() === '/='){
                t.next();
                m.set(key,m.get(key)/Number(parseE()));
                return "changes";
            }
            else if (m.has(key)) {
                var i = m.get(key);
                return i;
            }
            else {
                SE = 'SE';
                return;
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