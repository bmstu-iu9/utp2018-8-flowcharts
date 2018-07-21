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
        alert(a);
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
            alert("error of token3");
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
var t = new token("lol= 235(sd + 23) - 1 * sdw3;");
while(t.getVal() != ";"){
    alert(t.getVal());
    t.next();
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

new map('x', 10);
new map('y', 2);
new map('z', 15);
var str = 'x/y+z';
console.log("result = " + parse());

function parse(str) {
    var a = new token(str);
    var n;
    if (-1 !== this.getChar()) {
        n = parseE();
        console.log(n);
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
    if (this.getId() === 'boolean') {
        parseEE();
    }
    return parse_E(parseT());
}

//<comparison> ::=
//      <arith_expr> <comparison_op> <arith_expr>
function parseNew(n)  {
    if (this.getVal() === '>=') {
        this.construct();
        return (n >= parseF());
    } else if (this.getVal() === '<=') {
        this.construct();
        return (n <= parseF());
    }
    else if (this.getVal() === '>') {
        this.construct();
        return (n > parseF());
    }
    else if (this.getVal() === '==') {
        this.construct();
        return (n === parseF());
    }
    else if (this.getVal() === '<') {
        this.construct();
        return (n < parseF());
    }
    return n;
}

//<arith_expr> ::=
//         <arith_expr> + <term>
//         | <arith_expr> - <term>
//         | <term>.
function parse_E(n) {
    if (this.getVal() === '+') {
        this.construct();
        return parse_E(n + parseT());
    }
    if (this.getVal() === '-') {
        this.construct();
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
    if (this.getVal() === '*') {
        this.construct();
        return parse_T(n * parseF());
    }
    if (this.getVal() === '/') {
        this.construct();
        return parse_T(n / parseF());
    }
    if (this.getId() === 'boolean') {
        parseEE();
    }
    return n;
}

//<value> ::=
// 	var <ident> = <expr> .
// 	| <expr> .
// 	| <ident> = <expr> .
function parseF() {
    if (this.getId() === 'number') {
        var num = this.getVal();
        this.construct();
        return num;
    }
    else if (this.getId() === 'ident') {
        if (this.getVal() === 'var') {
            var key = this.getVal();
            this.construct();
            if (this.getVal() === '=') {
                this.construct();
                var any = this.getVal();
                m.set(key, any);
            }
            else {
                s.add(key);
            }
        }
        if (m.has(this.getVal())) {
            var n;
            var i = m.get(this.getVal());
            this.construct();
            return i;
        }
        else {
            console.log('SE');
            return;
        }
    }
    else if (sym === '(') {
        this.construct();
        var n = parseE();
        //проверка, что есть ")"
        // expect(Tag.RPAREN);
        return n;
    }
    if (this.getVal() === '-') {
        // expect(Tag.DIF);
        return -1 * parseF();
    }
    if (this.getId() === 'boolean') {
        this.construct();
        parseEE();
    }
    //не должен выводить ничего
    return 1;
}
