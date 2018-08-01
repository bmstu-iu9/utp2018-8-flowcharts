oper= ["+", "=","-", "*", "/", "<", ">" , "(", ")", "?" , ":", "!", "|", "&","%" ,";", " "/* "+=" , "-=", "++", "--", "*=", "/= */ ];
sOper= ["=", "|","&"];

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

var m = new Map();
class map {
    constructor (key, any) {
        m.set(key, any);
    }
}

let s = new Set();

class set {
    constructor(name) {
        s.add(name)
    }
}

s.add('sd');
s.add('sdw3');
s.add('z');
new map('sd', 10);
new map('sdw3', 2);
new map('z', 15);
var str1 = "sd+=7>2?3:4;";
var tkn = new token(str);
var count1 = str.indexOf(';', 0);
var SE = 0;
var result = parse(str);
function checkRes(result){
    if (result === undefined || SE === 'SE' || count1 !== str1.length-1 || result==='NaN' ) {//кастыыль)
        console.log('Syntax Error');
        return "error";
    }
    else {
        alert(result);
        console.log("result = " + result);
        return  result;
    }
}


function parse(str) {
    str1=str;
    SE=0;
    var tkn = new token(str);
    if (';' !== tkn.getVal()) {
        return checkRes(parseO());
    }

}

function parseO() {
    return parse_O(parseE());
}

function parse_O(n) {
    if (tkn.getVal() === '?') {
        if (n) {
            tkn.next();
            return parseO();
        }
        else {
            tkn.next();
            parseO();
            if (tkn.getVal() === ':') {
                tkn.next();
                return parseO();
            }
            else {
                SE = 'SE';
                return;
            }
        }
    }
    else if ( tkn.getVal() === '<') {
        tkn.next();
        return parse_O(Number(n) < Number(parseE()));
    }
    else if (tkn.getVal() === '>') {
        tkn.next();
        return parse_O(Number(n) > Number(parseE()));
    }
    else if (tkn.getVal() === '>=') {
        tkn.next();
        return parse_O(Number(n) >= Number(parseE()));
    }
    else if (tkn.getVal() === '<=') {
        tkn.next();
        return parse_O(Number(n) <= Number(parseE()));
    }
    else if (tkn.getVal() === '==') {
        tkn.next();
        return parse_O(Number(n) == Number(parseE()));
    }
    else if (tkn.getId()==="number"|| tkn.getId()==="ident" || n==="initialization"&& tkn.getVal()!=";"){
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
    if (tkn.getVal() === '+') {
        tkn.next();
        return parse_E(Number(n) + Number(parseT()));
    }
    else if (tkn.getVal() === '-') {
        tkn.next();
        return parse_E(Number(n) - Number(parseT()));
    }
    else if (tkn.getVal() === '||'){
        tkn.next();
        return parse_E(n || parseO());
    }
    else if (tkn.getId()==="number"|| tkn.getId()==="ident"){
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

    if (tkn.getVal() === '*') {
        tkn.next();
        return parse_T(Number(n) * Number(parseF()));
    } else if (tkn.getVal() === '%') {
        tkn.next();
        return parse_T(Number(n) * Number(parseF()));
    }
    else if (tkn.getVal() === '/') {
        tkn.next();
        return parse_T(Number(n) / Number(parseF()));
    }
    else if (tkn.getVal() === '&&'){
        tkn.next();
        return parse_T(n && parseF());
    }
    else if (tkn.getId()==="number"|| tkn.getId()==="ident"){
        SE = 'SE';
        return;
    }
    return n;
}

function parseF() {
    //alert(t.getVal())
    if (tkn.getId()==="number") {
        var num = tkn.getVal();
        tkn.next();
        return num;
    }
    else if (tkn.getId()==='boolean'){
        if (tkn.getVal()){
            tkn.next();
            return true;
        } else{
            tkn.next();
            return false;
        }
    }
    else if (tkn.getId()==="ident") {
        if (tkn.getVal() === 'var') {
            tkn.next();
            var key = tkn.getVal();
            if (s.has(key)) {
                SE = 'SE';
                return ;
            }
            s.add(key);
            tkn.next();
            if (tkn.getVal() === '=') {
                tkn.next();
                // доработаь с вариантами что значение будет bool
                m.set(key, Number(parseO()));
                return 'initialization';
            }
            else {
                s.add(key);
            }
        }
        else if (s.has(tkn.getVal())) {
            var key = tkn.getVal();
            tkn.next();
            if (tkn.getVal() === '=') {
                tkn.next();
                m.set(key, Number(parseO()));
                return 'changes';
            }
            //не работает ++, --, *=, /=
            else if (tkn.getVal() === '++'){
                tkn.next();
                m.set(key,m.get(key)+1);
                return "changes";
            }
            else if (tkn.getVal() === '--'){
                tkn.next();
                m.set(key,m.get(key)-1);
                return "changes";
            }
            else if (tkn.getVal() === '+='){
                tkn.next();
                m.set(key,m.get(key)+Number(parseE()));
                return "changes";
            }
            else if (tkn.getVal() === '-='){
                tkn.next();
                m.set(key,m.get(key)-Number(parseE()));
                return "changes";
            }
            else if (tkn.getVal() === '*='){
                tkn.next();
                m.set(key,m.get(key)*Number(parseE()));
                return "changes";
            }
            else if (tkn.getVal() === '/='){
                tkn.next();
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
    else if (tkn.getVal() === '(') {
        tkn.next();
        var n = parseO();
        if (tkn.getVal() === ')'){
            tkn.next();
            return n;
        } else {
            SE = 'SE';
            return ;
        }
    }
    else if (tkn.getVal() === '-') {
        tkn.next();
        if (tkn.getId()==="oper"){
            SE='SE';
            return ;
        }
        else return -1 * parseF();
    }
    else if (tkn.getVal()=== '!'){
        tkn.next();
        return !parseF();
    }
    else {
        SE='SE';
        return;
    }
}
