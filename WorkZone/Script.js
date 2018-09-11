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
let zoom=10;
let cellW=210;
let cellH=200;
let inMenu=false;
let firstFile=0;
let source;
let focusInitBox=false;
let Tutor = false;
let mousedown=false;
let MDL;
let MDT;

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
		this.value = "";
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
    if ( event.target.className === "droptarget")  {
        var table = document.getElementById("workSpace");
        graph[0].cell= table.rows[0].cells[mainColumn];
        var data =document.getElementById(event.dataTransfer.getData("Text"));
        var startNode= data.parentNode;
        var start= data.cloneNode(true);
        var row=event.target.parentNode.rowIndex;
        var cell =event.target.cellIndex;
        var key=row + " " +(cell-mainColumn);
        let V=graph[graphIds.get(key)];
        let parent=graph[V.parents[0]];
        let mg=document.createElement("img");
        if (V.childs.length!=0 && (data.className=="end" || data.className=="if")){
            return;
        }
        data.setAttribute("draggable", "false");
        data.setAttribute("onmouseover","initBoxVal()");
        event.target.appendChild(data);
        event.target.setAttribute('onclick',"getFocus(this)");
        event.target.setAttribute("onmouseover","initBoxVal()");
        event.target.setAttribute("onmouseout","initBoxValOff()");

        event.target.className = "lv";
        startNode.appendChild(start);
        event.target.setAttribute("contextmenu","alert()");


        V.type=data.className;
        blockTriggered=V.pos;
        if (parent.type!="if"){
            mg.setAttribute("src","img/down.png");
            mg.className="down";
            if (parent.type=="start"){
                mg.style.top="-140%";
            }
            V.cell.appendChild(mg);
        }
        if (V.type!="end"){
            document.getElementById("initBox").focus();
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

function initBoxValOff(){
    if (!focusInitBox)
        document.getElementById('initBox').placeholder="Value of Block";
}

function initBoxVal(){
    let trg=event.target;
    if (trg.tagName!="TD"){
        trg=trg.parentNode;
    }
    let row=trg.parentNode.rowIndex;
    let cell=trg.cellIndex;
    let paint=true;
    let V =graph[graphIds.get(row+ " "+(cell-mainColumn))];
    let box=document.getElementById('initBox');
    if (!focusInitBox)
        box.placeholder=V.value==undefined?"Value of Block":V.value;
}

function changeTrigger(row, cell, type, prnt, check){
    var table = document.getElementById("workSpace");
    if (type !== "end" && check && type!== "loop" && type!="romb"){
        createBlock(row+1,cell,prnt,true);
    }
    if (type=== "romb"){
        addColumn(cell+1);
        addColumn(cell);
        if (cell+1<mainColumn)
            reSetIds(row,cell-mainColumn+2,true);
        else if (cell+1>mainColumn)
            reSetIds(row,cell-mainColumn,false);
        cell++;
        createBlock(row+1,cell-1,prnt,false);
        createBlock(row+1,cell+1,prnt,true);

    }
    if (row >= document.getElementById("workSpace").rows.length-2){
        addRow();
    }
}

function reSetIds(row, cell,side){
    var V=graph[graphIds.get(row+ " "+cell)];
    reSetIdsChld(iFRoot(V),side,cell);
}

function iFRoot(W){
    while(graph[W.parents[0]].y!=0){
        W=graph[W.parents[0]];
    }
    return W;
}

function reSetIdsChld(V,side,C){
    var table=document.getElementById("workSpace");
    if (side) {
        if (C>V.y){
            graphIds.delete((V.x)+ " "+(V.y));
            graphIds.set((V.x)+ " "+(V.y-2),V.pos);
            V.y-=2;
        }else if (C==V.y){
            graphIds.delete((V.x)+ " "+(V.y));
            graphIds.set((V.x)+ " "+(V.y-1),V.pos);
            V.y--;
        }
    }else {
        if (C<V.y){
            graphIds.delete((V.x)+ " "+(V.y));
            graphIds.set((V.x)+ " "+(V.y+2),V.pos);
            V.y+=2;
        }else if (C==V.y){
            graphIds.delete((V.x)+ " "+(V.y));
            graphIds.set((V.x)+ " "+(V.y+1),V.pos);
            V.y++;
        }
    }
    for (let i of V.childs){
        reSetIdsChld(graph[i],side,C);
    }
}	

function createBlock(row, cell,prnt,ifRes){
    var table = document.getElementById("workSpace");
	let key=row+ " " +(cell-mainColumn);
    let newVort = new vort("trg",countOfVort++,row,cell-mainColumn);
    newVort.baseClass="lv";
    newVort.addParent(prnt);
	graph[prnt].addChild(countOfVort-1);
    newVort.cell=table.rows[row].cells[cell];
    newVort.cell.className="droptarget";
    graphIds.set(key,countOfVort-1);
    graph.push(newVort);
    newVort.ifRes=ifRes;
}

function createBlockV2(row, cell,prnt,ifRes){
    var table = document.getElementById("workSpace");
	let key=row+ " " +(cell-mainColumn);
    let newVort = new vort("trg",countOfVort++,row,cell-mainColumn);
    newVort.baseClass="lv";
	newVort.cell=table.rows[row].cells[cell];
    graphIds.set(key,countOfVort-1);
    graph.push(newVort);
    newVort.ifRes=ifRes;
}

function findRoot(V){
    while (V.y==graph[V.parents[0]].y && graph[V.parents[0]].type!="start" ){
        V=graph[V.parents[0]];
    }
    return V.parents[0];
}

function addColumn(pos){
    var table = document.getElementById("workSpace");
    for (var i =0;i<table.rows.length;i++){
        var newCell= document.createElement("td");
        newCell.className="lv";
        newCell.style.width=cellW;
        newCell.style.height=cellH;
        table.rows[i].insertBefore(newCell,table.rows[i].children[pos]);
    }
    if (pos<=mainColumn){
        mainColumn++;
    }
    reSize();
    resetGrid();
}

function addRow(){
    let table = document.getElementById("workSpace");
    let row = table.insertRow(-1);
    for (let i =0; i< table.rows[1].cells.length;i++){
        let cell = row.insertCell(-1);
        cell.className= table.rows[0].cells[0].className;
    }
    reSize();
    resetGrid();
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
    focusInitBox=true;
    let trg=graph[blockTriggered];
    if (!trg || trg.dead){
        return;
    }
    event.target.placeholder=trg.value==undefined?"Value of Block":trg.value;
    let cell=document.getElementById("workSpace").rows[trg.x].cells[mainColumn+trg.y];
    cell.firstChild.className="onfocus";
    if (errorOfBlock){
        cell.firstChild.className="errorblock";
        errorOfBlock=false;
    }
}

function delChange(){
    focusInitBox=false;
    let trg=graph[blockTriggered];
    let cell=document.getElementById("workSpace").rows[trg.x].cells[mainColumn+trg.y];
    event.target.placeholder="Value of Block";
    cell.firstChild.className="";
    event.target.value="";
    event.target.style.background="#DFE0E7";
}

function cmenu(){
    let contmenu=document.getElementById("submenu");
    let trg= event.target.tagName=="TD"?event.target: event.target.parentNode;
    let block=graph[graphIds.get(trg.parentNode.rowIndex+ " "+(trg.cellIndex-mainColumn))];
    contmenu.style.display="block";
    blockTriggered=block.pos;
    contmenu.style.left=Math.round(event.clientX-15)+"px";
    contmenu.style.top=Math.round(event.clientY-90)+"px";

    if (trg.id=="start" || event.target.firstChild && event.target.firstChild.id=="start" || event.target.className=="start"){
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
            lit.innerHTML="<div>| ReValue</div>";
            contmenu.insertBefore(lit,contmenu.children[0]);
        }
        contmenu.style.height="160px";
    }
    contmenu.style.width="170px";
    contmenu.style.opacity=0.95;
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
    //box.value = graph[blockTriggered].value;
    box.focus();
    closeMenu();
}

function helpPage(){
    if (inMenu)
        return;
    document.getElementById('ModalWind').style.display = "block";
    var old = document.getElementById("Glasshead");
    old.style.display = 'block';
    old = document.getElementById("Glassmenu");
    old.style.display = 'block';
    old = document.getElementById("Glassmain");
    old.style.display = 'block';
    old = document.getElementById("Glassinp");
    old.style.display = 'block';
    old = document.getElementById("GlassInpPerem");
    old.style.display = 'block';

    document.getElementById("Glasshead").onclick = function () {
        document.getElementById('ModalWindHead').style.display = "block";
    }
    document.getElementById("Glassmain").onclick = function () {
        document.getElementById('ModalWindMain').style.display = "block";
    }

    document.getElementById("Glassinp").onclick = function () {
        document.getElementById('ModalWindInp').style.display = "block";
    }

    document.getElementById("GlassInpPerem").onclick = function () {
        document.getElementById('ModalWindInpPerem').style.display = "block";
    }

    document.getElementById("Glassmenu").onclick = function () {
        document.getElementById('ModalWindMenu').style.display = "block";
    }
    window.onclick = function(event) {
        if ((event.target == document.getElementById('ModalWindHead'))) {
            document.getElementById('ModalWindHead').style.display = "none";
        }
        if (event.target == document.getElementById('ModalWindMenu')){
            document.getElementById('ModalWindMenu').style.display = "none";
        }
        if (event.target == document.getElementById('ModalWindInpPerem')){
            document.getElementById('ModalWindInpPerem').style.display = "none";
        }
        if (event.target == document.getElementById('ModalWindMain')){
            document.getElementById('ModalWindMain').style.display = "none";
        }
        if (event.target == document.getElementById('ModalWindInp')){
            document.getElementById('ModalWindInp').style.display = "none";
        }
        if (event.target == document.getElementById('ModalWind')){
            document.getElementById('ModalWind').style.display = "none";
        }


    }
    function KeyPress(e) {
        var eobj = window.event? event : e
        if (eobj.keyCode == 13 ) {
            //alert("Теперь вы готовы к освоению блок-схем");
            document.getElementById("Glasshead").style.display = "none";
            document.getElementById('ModalWindMenu').style.display = "none";
            document.getElementById("Glassmain").style.display = "none";
            document.getElementById('ModalWindHead').style.display = "none";
            document.getElementById("Glassinp").style.display = "none";
            document.getElementById('ModalWindInpPerem').style.display = "none";
            document.getElementById("GlassInpPerem").style.display = "none";
            document.getElementById('ModalWindMain').style.display = "none";
            document.getElementById("Glassmenu").style.display = "none";
            document.getElementById('ModalWindInp').style.display = "none";
            document.getElementById('ModalWind').style.display = "none";
        }
    }

    document.onkeydown = KeyPress;
}

function reSetM(){
    s.clear();
    m.clear();
    for (let i of varSet){
        m.set(i,varMap.get(i));
    }
}

// -----------------------------------DEBAG-----------------------------------

let counter = 0;
let debag=false;
let debagBlock=0;
let LD=false;
let RD=true;

function buttonDebag() {
    if (inMenu){
        return;
    }
    debag=true;
    counter = 0;
    debagBlock=0;
    document.getElementById('buttonReStart').style.display="block";
    document.getElementById('bug').style.display = 'none';
    document.getElementById('left').style.display = 'block';
    document.getElementById('right').style.display = 'block';
    graph[0].cell.firstChild.className="debagTarg";
    reSetM();
    setRes();
    LD=false;
    RD=true;
}

function whileForLeftOrRight(){
    s.clear();
    let count = counter;
    var V =graph[0];
    while(V.type!="end" && count>=0){
        count--;
        if (V.type=="start"){
            V=graph[V.childs[0]];
            reSetM();
            continue;
        }
        if (V.childs.length==0){
            alert("error Of End");
            RD=false;
            counter--;
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
            counter--;
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
    debagBlock=V.parents[0];
    cleanBlock(graph[0]);

    if (count!=-1){
        V.cell.firstChild.className="debagTarg";
        RD=false;
    } else {
        graph[debagBlock].cell.firstChild.className="debagTarg";
        RD =true;
    }
    if (counter == 0){
        LD=false;
    } else LD =true;
    setRes();
    reSetM();
}

function cleanBlock(V){
    if (V.cell.firstChild) V.cell.firstChild.className="";
    for (let i=0;i<V.childs.length;i++){
        cleanBlock(graph[V.childs[i]]);
    }
}

function buttonRight(){
    if (!RD) return;
    counter++;
    whileForLeftOrRight();
}


function buttonLeft(){
    if (!LD) return;
    counter--;
    whileForLeftOrRight();
}

// -----------------------------------DEBAG-----------------------------------

function buttonPlay(){
    if (inMenu)
        return;
    buttonReStart();
    if (document.getElementById("var").firstChild.tagName=="i"){
        return;
    }
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
                    V=graph[V.childs[1]];
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
    document.getElementById("buttonReStart").style.display="block";
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
    if (debag){
        elem.innerHTML="Debag result:";
    } else elem.innerHTML="Result:";
    varTable.insertBefore(elem,document.getElementById("var").firstChild);
    for (let item of varSet){
        newSetRes(item,m);
    }
    for (let item of s){
        newSetRes(item,m);
    }
    if (varTable.children.length==1){
        let lm= document.createElement("i");
        lm.innerHTML="NaN";
        varTable.appendChild(hr);
        varTable.appendChild(lm);
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
    s.clear();
    m.clear();
    let varTable= document.getElementById("var");
    varTable.innerHTML='<div id="addVar" style=\"height: 100%\"><input type=\"image\" src=\"https://png.icons8.com/ios/100/2a3c3c/plus.png\" width=\"40\" height=\"40\" id=\"Plas\" onclick=\"hiddenVarBox(this)\" draggable=\"false\" checked/><input type=\"text\" name=\"инициализацияПеременных\" onblur=\"returnPlas()\" placeholder=\"var [name] = [expr];\" width=\"70%\" id=\"initVarBox\" onkeydown=\"if(event.keyCode==13){ getVal(this);} else {this.style.background=\'#DFE0E7\';}\"></div>';
    for (let i of varSet){
        newSetRes(i,varMap);
    }
    if (debag){
        document.getElementById('bug').style.display= 'block';
        document.getElementById('left').style.display= 'none';
        document.getElementById('right').style.display= 'none';
        cleanBlock(graph[0]);
        debag=false;
    }
    document.getElementById('buttonReStart').style.display= 'none';
}

function buttonDelete(){
    let trg=event.target.parentNode;
    let block=graph[blockTriggered];
    let pr = graph[block.parents[0]];
    blockTriggered=block.childs[0];
    if (block.type=="if"){
        let trueCh=graph[block.childs[0]].ifRes? block.childs[0]:block.childs[1];
        let falseCh=!graph[block.childs[0]].ifRes? block.childs[0]:block.childs[1];
        let difT =findDif(block,true);
        let difF= findDif(block, false);
        pr.childs[0]==block.pos?(pr.childs[0]=trueCh) :(pr.childs[1]=trueCh);
        graph[trueCh].parents[0]=pr.pos;
        delDfs(graph[falseCh]);
        for (let i=0;i<difF;i++){
            deleteColumn(block.cell.cellIndex-1);
        }
        for (let i=0;i<findDif(graph[trueCh],false);i++){
            addColumn(block.cell.cellIndex);
        }
        if (block.y>0){
            fix(graph[trueCh],difF-findDif(graph[trueCh],false));
            alert();
        }
        ifDfs(graph[trueCh],findDif(graph[trueCh],false)+1);
        for (let i=0;i<difT-findDif(graph[trueCh],true);i++){
            deleteColumn(block.cell.cellIndex+findDif(graph[trueCh],true)+1);
        }
        reIndex(block.y);
        if (graph[trueCh].type!="trg" && pr.type!="if"){
            let mg=document.createElement("img");
            mg.setAttribute("src","img/down.png");
            mg.className="down";
            graph[trueCh].cell.appendChild(mg);
        }
    } else if (block.type=="end" || block.type=="loop"){
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

function fix(V,dif){
    V.y-=dif;
    for(let i=0;i<V.childs.length;i++){
        fix(graph[V.childs[i]],dif);
    }
}


function reIndex(side){
    let V=graph[0];
    while(V.type!="if"){
        V=graph[V.childs[0]];
    }
    reIndRec(V);
}

function reIndRec(V){
    V.cell.setAttribute('onclick',"getFocus(this)");
    if (graphIds.get((V.x)+ " "+(V.y))==V.pos)
        graphIds.delete((V.x)+ " "+(V.y));
    graphIds.set((V.cell.parentNode.rowIndex)+ " "+(V.cell.cellIndex-mainColumn),V.pos);
    V.x=V.cell.parentNode.rowIndex;
    V.y=V.cell.cellIndex-mainColumn;
    for (var i=0;i<V.childs.length;i++){
        reIndRec(graph[V.childs[i]]);
    }
}


function findDif(V,IF){
    let pos =V.y;
    while (V.type!="end" && V.type!="loop" && V.type!="trg"){
        if (V.type=="if"){
            if (IF){
                V= graph[graph[V.childs[0]].ifRes? V.childs[0]:V.childs[1]];
            } else{
                V= graph[!graph[V.childs[0]].ifRes? V.childs[0]:V.childs[1]];
            }
        } else {
            V=graph[V.childs[0]];
        }
    }
    return Math.abs(pos-V.y);
}

function deleteColumn(pos){
    var table = document.getElementById("workSpace");
    for (var i =0;i<table.rows.length;i++){
        table.rows[i].deleteCell(pos);
    }
    if (pos<=mainColumn){
        mainColumn--;
    }
    reSize();
}

function delDfs(V){
    for (let i =0; i<V.childs.length;i++){
        delDfs(graph[V.childs[i]]);
    }
    V.dead=true;
    graphIds.delete((V.x)+ " "+(V.y));
}

function ifDfs(V,dif){
    let table=document.getElementById("workSpace");
    let pr=table.rows[V.x-1].cells[mainColumn+V.y-dif];
    pr.innerHTML=V.cell.innerHTML;
    pr.className=V.cell.className;
    V.cell.innerHTML="";
    V.cell.className="lv";
    V.cell=pr;
    pr.setAttribute('onclick',"getFocus(this)");
    graphIds.set((V.x-1)+ " "+(V.y-dif),V.pos);
    graphIds.delete((V.x)+ " "+(V.y));
    V.y-=dif;
    V.x--;
    for (var i=0;i<V.childs.length;i++){
        ifDfs(graph[V.childs[i]],dif);
    }
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
    V.ifRes= V.y>=graph[V.parents[0]].y?true:false;
    graphIds.set((V.x+1)+ " "+(V.y),V.pos);
    if (graph[V.parents[0]].type=="if" && !V.ifRes){
        graphIds.delete((V.x)+ " " +(V.y));
    }
    V.cell.setAttribute('onclick',"getFocus(this)");
    V.cell.setAttribute("onmouseover","initBoxVal()");
    V.cell.setAttribute("onmouseout","initBoxValOff()");
    V.x++;
}

function reSize(){
    let zoom=document.getElementById("zoom");
    let cells=document.querySelectorAll("#workSpace TD");
    let grad=zoom.value;
    let cf= 1;
    cf+=grad>=5?0.1* Math.abs(grad-5):-0.1* Math.abs(grad-5);
    for (var item of cells){
        item.style.width=cellW=(210*cf) + "px";
        item.style.height=cellH=(200*cf) + "px";
    }
    zoom=grad;
}


function newFile(){
    if (inMenu)
        return;
    inMenu=true;
    let menu=document.getElementById("newFileMenu");
    let M=document.getElementById("Main");
    let lu=document.getElementById('newFileUl');
    menu.style.display= "block";
    if (firstFile>=1 && lu.children.length==5){
        let lu=document.getElementById('newFileUl');
        let back = document.createElement('li');
        let hr= document.createElement("hr");
        hr.size=3;
        hr.color="#334D4D";
        hr.style.width="83%";
        hr.style="opacity: 0.7;margin: 0% 10%;";
        menu.style.top="19%";
        back.innerHTML='<div>Back</div>';
        back.setAttribute('onclick',"buttonBack()");
        lu.appendChild(hr);
        lu.appendChild(back);
        let lues=document.querySelectorAll("#newFileUl li");
        for (let item of lues){
            item.style.height="26%";
        }
    }
    menu.style.opacity=1;
    M.style.opacity=0;
    document.getElementById("informationHead").style.opacity= "0";
    document.getElementById("toolsHead").style.opacity="0";
}

function settings() {
    if (inMenu)
        return;
    inMenu=true;
    let menu=document.getElementById("mainMenu");
    let M=document.getElementById("Main");
    let lu=document.getElementById('mainMenuUl');
    menu.style.display= "block";
    menu.style.opacity=1;
    M.style.opacity=0;
    document.getElementById("informationHead").style.opacity= "0";
    document.getElementById("toolsHead").style.opacity="0";
}

function buttonBack(){
    firstFile++ ;
    let M=document.getElementById("Main");
    let menu=event.target.parentNode.parentNode.parentNode;
    M.style.opacity=1;
    menu.style.opacity=0;
    document.getElementById("informationHead").style.opacity= "1";
    document.getElementById("toolsHead").style.opacity="1";
    menu.style.display= "none";
    inMenu=false;
}


function buttonNewFile(){
    firstFile++;
    inMenu=false;
    let M=document.getElementById("Main");
    let menu1=document.getElementById("newFileMenu");
    M.style.opacity=1;
    menu1.style.opasity=0;
    document.getElementById("informationHead").style.opacity= "1";
    document.getElementById("toolsHead").style.opacity="1";
    setTimeout(1000);
    menu1.style.display="none";
    let body=document.getElementById("workSpace");

    body.innerHTML='<tr><td class="lv"></td><td class="lv" id="start"><img src="img/start.png" width="60%" height="55%" class= "start"></td><td class="lv"></td></tr><tr><td class="lv"></td><td class="lv"></td><td class="lv"></td></tr><tr><td class="lv"></td><td class="lv"></td><td class="lv"></td></tr>'

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
    startV.cell.firstChild.style.margin="17%";


    var ft=new vort("trg",1,1,0);
    ft.baseClass="lv";
    ft.cell=document.getElementById("workSpace").rows[1].cells[1];
    ft.addParent(0);
    ft.cell.className="droptarget";
    graphIds.set("1 0",1);

    graph.push(startV);
    graph.push(ft);
}


// ДИЧЬ КЛЕВАЯ КЛАССНАЯ (с) ДИМА К.

function SaveDataStr() {
	var str = "";
	var key;
	
	str += document.getElementById("workSpace").innerHTML;
	
	str += "@\n";
	str += mainColumn;
	
	str += "@\n";
	
	
	for ( key of varMap) {
		str += key + " ";
	}
	str += ";\n";
	
	
	
	//инфа для вершин
	
	for (var i of graph) {
		str += i.x + " " + (i.y + mainColumn) + " " ;
		if (i.parents[0] != undefined){
			str += i.parents[0] + " ";
		}
		else
		{
			str += " ";
		}
		str += i.ifRes + ",";
	}
	str += "!\n";
	
	for ( key of graphIds) {
		str += key + " ";
	}
	
	str += ";\n";
	
	for (var i of graph) {
		for (var j of i.parents){
			str += j + " ";
		}
		str += "|";
	}
	str += ";\n";
	for (var i of graph) {
		for (var j of i.childs){
			str += j + " ";
		}
		str += "|";
	}
	str += ";\n";
	
	
	for (var i of graph) {
		str += i.type + " ";
	}
	str += ";\n";
	/*
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	for (var i of graph) {
		str += i.pos + " ";
	}
	str += ";\n";
	
	for (var i of graph) {
		str += i.x + " ";
	}
	str += ";\n";
	
	for (var i of graph) {
		str += i.y + " ";
	}
	str += ";\n";
	
	*/
	
	
	for (var i of graph) {
		str += i.dead + " ";
	}
	str += ";\n";
	
	
	for (var i of graph) {
		str += i.value + " ";
	}
	
	str += ";\n";
	
	
	
	console.log(str);
	return str;
}


function priem() {
	alert("1");
	var file = document.getElementById('uploadData').files[0];
	
	var reader = new FileReader();
	reader.onload = function(e) {
		var contents = e.target.result;
    	console.log("Содержимое файла: " + contents);
};
	reader.onerror = function(event) {
    console.error("Файл не может быть прочитан! код " + event.target.error.code);
	};
 	
	reader.readAsText(file);
	alert("!" + reader.readyState);
	
	
	var str = reader.result;
	alert(str);
	var len = str.length;
	var cnt = 0;
	var key = "";
	var val = "";
	var crewKol = 0;
	//  = "";
	alert("XYI");
	while (str.charAt(cnt) != "@")
	{
		val +=str.charAt(cnt);
		cnt++;
	}
	document.getElementById("workSpace").innerHTML = val;
	val ="";
	cnt +=2;
	while (str.charAt(cnt) != "@")
	{
		val +=str.charAt(cnt);
		cnt++;
	}
	mainColumn = Number(val);
	//alert(val);
	
	varMap.clear();
	graph = [];
	
	val = "";
	cnt +=2;
	
	while (str.charAt(cnt) != ";")
	{
		while (str.charAt(cnt) != ","){
			key += str.charAt(cnt);
			cnt++;
		}
		cnt++;
		while (str.charAt(cnt) != " "){
			val += str.charAt(cnt);
			cnt++;
		}
		cnt++;
		varMap.set(key, Number(val));
		key = "";
		val = "";
	
	}
	key = "";
	val = "";
	
	cnt += 2;
	
	countOfVort = crewKol;
	while (str.charAt(cnt) != "!")
	{
		var xx = "";
		var yy= "";
		var prntx = "";
		var ress = "";
	
			while (str.charAt(cnt) != " ")
			{
				xx +=str.charAt(cnt);
				cnt++;
			}
			cnt++;
			while (str.charAt(cnt) != " ")
			{
				yy += str.charAt(cnt);
				cnt++;
			}
			cnt++;
			while (str.charAt(cnt) != " ")
			{
				prntx += str.charAt(cnt);
				cnt++;
			}
			cnt++;
			while (str.charAt(cnt) != ",")
			{
				ress += str.charAt(cnt);
				cnt++;
			}
			cnt++;
		var ifRess = (ress == "true");
		if (prntx == ""){
			var ifPrntx = -1;
		}
		else{
			var ifPrntx = Number(prntx);
		}
		createBlockV2(Number(xx), Number(yy), 0, ifRess);
			
		crewKol++;
		countOfVort = crewKol;	
	}
	cnt+=2;
	graphIds.clear();	
	
	for (var i of graph) {
			i.parents = [];
			i.childs = [];
	}
	
	
	while (str.charAt(cnt) != ";")
	{
		while (str.charAt(cnt) != ","){
			key += str.charAt(cnt);
			cnt++;
			
		}
		cnt++;
		while (str.charAt(cnt) != " "){
			val += str.charAt(cnt);
			cnt++;
		}
		cnt++;
		graphIds.set(key, Number(val));
		key = "";
		val = "";
	}
	
	
	
	cnt += 2;
	var countV =0;
	while (str.charAt(cnt) != ";")
	{
		while (str.charAt(cnt) != "|"){
			if (str.charAt(cnt) != " ")
				s += str.charAt(cnt);
			cnt++;
		}
		cnt++;
		graph[countV].parents.push(Number(s));
				if (s == "")
			graph[countV].parents = [];
		alert("!" + countV);
		s = "";
		countV++;
	}
	countV = 0;
	s = "";
	
	cnt += 2;
	
	//alert('&!');
	
	while (str.charAt(cnt) != ";")
	{
		while (str.charAt(cnt) != "|"){
			if (str.charAt(cnt) != " ")
				s += str.charAt(cnt);
			cnt++;
		}
		cnt++;
		graph[countV].childs.push(Number(s));
		if (s == "")
			graph[countV].childs = [];
		countV++;
		s = "";
	}
	countV= 0;
	
	val ="";
	cnt+=2;
	
	//document.getElementById("workSpace").innerHTML = "";
	while (str.charAt(cnt) != ";")
	{
		while (str.charAt(cnt) != " "){
			val += str.charAt(cnt);
			cnt++;
		}
		cnt++;
		graph[countV].type=val;
		countV++;
		alert(val);
		val ="";
	}
	cnt += 2;
}

function buttonSave(){
    var type = 'data:application/octet-stream;base64, ';
    var text = SaveDataStr();
    var base = btoa(text);
    var res = type + base;
    document.getElementById('buttonSave').href = res;
    location.href=document.getElementById('buttonSave').href;
}

function saveFile() {
    var xhr = new XMLHttpRequest();
    body = "title=new&content=info";
    xhr.open('POST', '/save');
    xhr.send(body);
}

function mouseDown(){
    mousedown=true;
    MDT=event.pageY;
    MDL=event.pageX;
}

function mouseUp(){
    mousedown=false;
    supTable.style.cursor= "default";
}

let supTable=document.getElementById("main");

function hand(){
    if (mousedown){
        supTable.scrollLeft-=(event.pageX-MDL)*0.85;
        supTable.scrollTop-=(event.pageY-MDT)*0.85;
        MDT=event.pageY;
        MDL=event.pageX;
        supTable.style.cursor= "move";
    }
}

let them=1;

function greenT(){
    document.getElementById('CSSsource').href='mainStyle.css';
    let hrs= document.querySelectorAll("hr");
    for (let i of hrs){
        i.color="#596868";
    }
    them=1;
}

function blueT(){
    document.getElementById('CSSsource').href='blueStyle.css';
    let hrs= document.querySelectorAll("hr");
    for (let i of hrs){
        i.color="#3E6788";
    }
    them=2;
}

function darkT(){
    document.getElementById('CSSsource').href='darkStyle.css';
    let hrs= document.querySelectorAll("hr");
    for (let i of hrs){
        i.color="#343B45";
    }
    them=3;
}

// сделать этим функции в одной!!!

function customize(){
    let menu=document.getElementById("Сustomization");
    let menu1=event.target.parentNode.parentNode.parentNode;
    menu1.style.opacity=0;
    menu1.style.display= "none";
    menu.style.opacity=1;
    menu.style.display= "block";
}

function buttonDesign(){
    let menu=document.getElementById("design");
    let menu1=event.target.parentNode.parentNode.parentNode;
    menu1.style.opacity=0;
    menu1.style.display= "none";
    menu.style.opacity=1;
    menu.style.display= "block";
}


function login(){
    let menu=document.getElementById("Login");
    let menu1=event.target.parentNode.parentNode;
    if (menu1.tagName!="DIV")
        menu1=menu1.parentNode;
    menu1.style.opacity=0;
    menu1.style.display= "none";
    menu.style.opacity=1;
    menu.style.display= "block";
}

function reg(){
    let menu=document.getElementById("Reg");
    let menu1=event.target.parentNode.parentNode;
    if (menu1.tagName!="DIV")
        menu1=menu1.parentNode;
    menu1.style.opacity=0;
    menu1.style.display= "none";
    menu.style.opacity=1;
    menu.style.display= "block";
}

function backGO(){
    let menu=document.getElementById("newFileMenu");
    let menu1=event.target.parentNode.parentNode;
    menu1.style.opacity=0;
    menu1.style.display= "none";
    menu.style.opacity=1;
    menu.style.display= "block";   
}

let grid = true;

function gridSwitch(){
    sw=document.getElementById("switch");
    if (!grid){
        sw.src="img/switch.png";
    } else{
        sw.src="img/switchON.png";
    }
    grid=!grid;
    resetGrid();
}

function resetGrid(){
    table=document.getElementById("workSpace");
    let color="#AFB6BF";
    if (them==2){
        color="#929FB0";
    } else if (them==3){
        color="#5D6373";
    }
    let bord=grid?"1px solid "+color :"none";
    for (let i of table.rows){
        for (let j of i.cells){
            j.style.border= bord;
        }
    }
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
var mess=NaN;
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
    mess=NaN;
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
    //alert(n);
    if (t.getVal() === '+') {
        t.next();
        let ttt=Number(parseT());
        //alert(n+  " "+ttt);
        return parse_E(Number(n) + ttt);
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
    if (t.getVal()==";"){
        if (n=="changes")
            return n;
        else{
            return mess=="changes"?mess:n;
        }
    }
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
            mess=key;
            if (s.has(key) || varSet.has(key)) {
                SE = 'SE';
                return ;
            }
            t.next();
            if (t.getVal() === '=') {
                t.next();
                let res= Number(parseO());
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
            else if (t.getVal() === '++'){
                t.next();
                mess?mess:mess="changes";
                if (write){
                    if(sors.get(key)==undefined){
                        m.set(key,1);
                    } else {
                        m.set(key,Number(sors.get(key))+1);
                    }
                }
                return (write?(m.get(key)-1):1);
            }
            else if (t.getVal() === '--'){
                t.next();
                mess=mess?mess:"changes";
                if (write){
                    if(sors.get(key)==undefined){
                        m.set(key,-1);
                    } else m.set(key,Number(sors.get(key))-1);
                }
                return (write?(m.get(key)+1):1);
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
    else if (t.getVal() === '++') {
        t.next();
        if (t.getId() !== "ident") {
            let key = t.getVal();
            t.next();
            var sors;
            if (m.get(key)) {
                sors = m;
            } else {
                sors = varMap;
            }
            mess ? mess : mess = "changes";
            if (write) {
                if (sors.get(key) == undefined) {
                    m.set(key, 1);
                } else {
                    m.set(key, Number(sors.get(key)) + 1);
                }
            }
            return (write ? (m.get(key)) : 1);
        } else {
            SE ="SE";
            return;
        }
    }
    else if (t.getVal() === '--') {
        t.next();
        if (t.getId() === "ident") {
            let key = t.getVal();
            t.next();
            var sors;
            if (m.get(key)) {
                sors = m;
            } else {
                sors = varMap;
            }
            mess = mess ? mess : "changes";
            if (write) {
                if (sors.get(key) == undefined) {
                    m.set(key, -1);
                } else m.set(key, Number(sors.get(key)) - 1);
            }
            return (write ? (m.get(key)) : 1);
        }else {
            SE = "SE";
            return;
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