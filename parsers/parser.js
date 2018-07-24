var oper= ["+", "=","-", "*", "/", "<", ">" , "(", ")", "?" , ":", "!", "|", "&" ,";", " "/* "+=" , "-=", "++", "--", "*=", "/= */ ];
var sOper= ["=", "|","&","+","-"];

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

var sym;


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
var str = "sd*2>10?true:false;";
var t = new token(str);

var SE = 0;
var result = parse();
var count = str.indexOf(';', 0);
if (result === undefined || SE === 'SE' || count !== str.length-1) {
    console.log('Syntax Error');
}
else {
    console.log("result = " + result);
}

function parse() {
    if (';' !== t.getVal()) {
        var n =  parseO();
        return n;
    }

}

/*
<O>  ::= <E> <O'>.
<O'> ::= == <E> <O'>.
<E>  ::= <T> <E’>.
<E’> ::= + <T> <E’> | - <T> <E’> | .
<T>  ::= <F> <T’>.
<T’> ::= * <F> <T’> | / <F> <T’> | .
<F>  ::= <number> | <var> | ( <O> ) | - <F> | ! <F> | <bool>.
*/

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
            t.next();
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
    if ( t.getVal() === '<') {
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
    }
    else if (t.getVal() === '/') {
        t.next();
        return parse_T(Number(n) / Number(parseF()));
    }
    else if (t.getVal() === '&&'){
        t.next();
        return parse_T(n && parseF());
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
            s.add(key);
            t.next();
            if (t.getVal() === '=') {
                t.next();
                if (s.has(key)) {
                    SE = 'SE';
                    return ;
                }
                var p = parseO();
                // доработаь с вариантами что значение будет bool
                m.set(key, Number(p));
                return 'initialization';
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
                m.set(key, Number(parseE()));
                return 'initialization';
            }
            else if (t.getVal() === '++'){
                t.next();
                m.set(key,m.get(key)+1);
            }
            else if (t.getVal() === '--'){
                t.next();
                m.set(key,m.get(key)+1);
            }
            else if (t.getVal() === '*='){
                t.next();
                m.set(key,m.get(key)*Number(parseE()));
            }
            else if (t.getVal() === '/='){
                t.next();
                m.set(key,m.get(key)/Number(parseE()));
            }
            var i = m.get(key);
            return i;
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
        // expect(Tag.DIF);
        t.next();
        return -1 * parseF();
    }
    else if (t.getVal()=== '!'){
        t.next();
        return !parseF();
    }
}

