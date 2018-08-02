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
	if (obj.className=="hidden"){
		if (trg===Ht){
			if (iMenu.className=="hidden"){
				main.style.width="91%";
				main.style.left="9%";
			}else{
				main.style.width="75%";
				main.style.left="9%";
			}
		}else{
			if (menu.className=="hidden"){
				main.style.width="84%";
				main.style.left="0%";
			}else{
				main.style.width="75%";
				main.style.left="9%";
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
				main.style.width="91%";
				main.style.left="9%";
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
    elem2.innerHTML = m.get(res);
    prt.insertBefore(elem1,lastCh);
    prt.insertBefore(elem2,lastCh);
    prt.insertBefore(hr,lastCh);
	VarBox.value="";
	VarBox.style.display="none";
	trg.width=50;
	trg.height=50;
	trg.style.opacity=1;
}

function returnPlas(){
	let trg= document.getElementById("Plas");
	let VarBox= document.getElementById("initVarBox");
	VarBox.style.display="none";
	trg.width=50;
	trg.height=50;
	trg.style.opacity=1;
}

function newFile(){
	document.getElementById("body").parentNode.replaceChild(source,document.getElementById("body"));
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
function checkRes(result,str ){
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
        return checkRes(parseO(),str);
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
            s.add(key);
            t.next();
            if (t.getVal() === '=') {
                t.next();
                // доработаь с вариантами что значение будет bool
                m.set(key, Number(parseO()));
                return key;
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

