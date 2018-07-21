var oper= ["+", "=","-", "*", "/", "<", ">", ">=", "<=", "==", "(", ")", "?" , ":", "!", "||", "&&" ,";", " "/* "+=" , "-=", "++", "--", "*=", "/="" */ ];
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
                    alert("error of Syntax1");
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
                    alert("error of Syntax2");
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
      //  console.log(a);
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
            console.log("error of token3");
            return "error"
        }
        if (this.val === "error"){
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

var t = new token("var lol= 235+sd/sdw3 + 23;");
/*while(t.getVal() != ";"){
    alert(t.getVal());
    t.next();
}*/
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
new map('sd', 10);
new map('sdw3', 2);
new map('z', 15);
var str = 'var lol= 235+sd/sdw3 + 23;';
console.log("result = " + parse());

function parse() {
    //var a = new token(str);
    var n;
    if (';' !== t.getVal()) {
        //console.log(t.getVal());
        n = parseE();
       // console.log(n);
        parse();
        return n;
    }
    else {
        //return 'Syntax Error'
        return parseE();
    }
}

function parseEE() {
    var a =  parseNew(parseF());
    console.log("ans "+a);
}

//<E>  ::= <T> <E’>.
function parseE() {
    if (t.getId() === 'boolean') {
        parseEE();
    }
    return parse_E(parseT());
}

//<comparison> ::=
//      <arith_expr> <comparison_op> <arith_expr>
function parseNew(n)  {
    if (t.getVal() === '>=') {
        t.next();
        return (n >= parseF());
    } else if (t.getVal() === '<=') {
        t.next();
        return (n <= parseF());
    }
    else if (t.getVal() === '>') {
        t.next();
        return (n > parseF());
    }
    else if (t.getVal() === '==') {
        t.next();
        return (n === parseF());
    }
    else if (t.getVal() === '<') {
        t.next();
        return (n < parseF());
    }
    return n;
}

//<arith_expr> ::=
//         <arith_expr> + <term>
//         | <arith_expr> - <term>
//         | <term>.
function parse_E(n) {
    if (t.getVal() === '+') {
        t.next();
        return parse_E(n + parseT());
    }
    if (t.getVal() === '-') {
        t.next();
        return parse_E(n - parseT());
    }
    return n;
}

//<T>  ::= <F> <T’>.
function parseT() {
    return parse_T(parseF());
}

//<term> ::=
//         <term> * <factor>
//         | <term> / <factor>
//         | <factor>.
function parse_T(n) {
    if (t.getVal() === '*') {
        t.next();
        return parse_T(n * parseF());
    }
    if (t.getVal() === '/') {
        t.next();
        return parse_T(n / parseF());
    }
    if (t.getId() === 'boolean') {
        parseEE();
    }
    return n;
}

//<value> ::=
// 	var <ident> = <expr> .
// 	| <expr> .
// 	| <ident> = <expr> .
function parseF() {
    if (Number(t.getVal())) {
        var num = t.getVal();
        t.next();
        return num;
    }
    else if (Symbol(t.getVal())) {
        if (t.getVal() === 'var') {
            t.next();
            var key = t.getVal();
            s.add(key);
            t.next();
            if (t.getVal() === '=') {
                t.next();
                m.set(key, parseE());
                return;
            }
            else {
                s.add(key);
            }
        }
       // console.log(t);
        if (s.has(t.getVal())) {
            var key = t.getVal();
            t.next();
            if (t.getVal() === '=') {
                t.next();
                m.set(key, parseE());
            }
            var n;
            var i = m.get(t.getVal());
            t.next();
            return i;
        }
        else {
            //console.log('SE');
            return 'SE';
        }
    }
    else if (sym === '(') {
        t.next();
        var n = parseE();
        //проверка, что есть ")"
        // expect(Tag.RPAREN);
        return n;
    }
    if (t.getVal() === '-') {
        // expect(Tag.DIF);
        return -1 * parseF();
    }
    if (t.getId() === 'boolean') {
        t.next();
        parseEE();
    }
    //не должен выводить ничего
    //return 1000;
}
