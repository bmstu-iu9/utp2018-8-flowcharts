oper= ["+", "=","-", "*", "/", "<", ">", ">=", "<=", "==", "(", ")", "?" , ":", "!", "||", "&&" /* "+=" , "-=", "++", "--", "*=", "/="" */ ];

class Pos {

    constructor(str) {
        this.str = str;
        this.pos = 0;
    }

    constr (str, pos) {
        this.str = str;
        this.pos = pos;
    }

    skip() {
        return this.constr(this.str, this.pos++);
    }

    skipWhile(char) {
        if (this.getChar() === char) {
            return this.skip.skipWhile(char);
        }
        return this;
    }

    getPos() {
        return this.pos;
    }

    getChar() {
        return this.str[this.pos];
    }

     getVal(type) {
        if (type === "number") {
            let t = this;
            let res = "";
            let a = this.getChar();
            while (a >= '0' && a <= '9') {
                res += a;
                t = t.skip;
                a = t.getChar();
            }
            this.pos = t.pos;
            return res;
        } else if (type === "ident") {
            let t = this;
            let res = "";
            let a = this.getChar();
            while (a >= 'a' && a <= 'z' || a >= '0' && a <= '9' || a >= 'A' && a <= 'Z') {
                res += a;
                t = t.skip;
                a = t.getChar();
            }
            this.pos = t.pos;
            return res;
        }
    }

}

class token {
    constructor(str){
        new Pos(str);
        this.construct(str);
    }

    construct(tkn){
        this.start = tkn.skipWhile(' ');
        let a = this.start.getChar();

        if (oper.some(t => t === a)){
            this.val=a;
            this.id="oper";
        }
        if (a > 'a' && a < 'z') {
            this.val = start.getVal("ident");
            this.id="ident";
            if (this.val === "true" || this.val === "false"){
                this.id="boolean";
            }
        } else {
            if (a >= '0' && a <= '9') {
                this.val = this.start.getVal("number");
                this.id = "number";
            } else {
                return alert("error of token");
            }
        }
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

new map('x', 10);
new map('y', 2);
new map('z', 15);
var str = 'x/y+z';
console.log("result = " + parse(str));

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
    console.log("ans " + a);
}

//<E>  ::= <T> <E’>.
function parseE() {
   // parseF();
    //if (this.getId() === 'boolean') {
      //  parseEE();
    //}
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
            this.construct();
            var key = this.getVal();
            s.add(key);
            this.construct();
            if (this.getVal() === '=') {
                this.construct();
               // var any = this.getVal();
                m.set(key, parseF());
            }
            else {
                s.add(key);
            }
        }
        if (s.has(this.getVal())) {
            var i;
            if (m.has(this.getVal())) {
                var n;
                i = m.get(this.getVal());
                this.construct();
                return i;
            }
            else if (this.getVal() === '=') {
                this.construct();
                m.set(i,parseF());
            }
        }
        else {
            console.log('SE');
            return;
        }
    }
  /*  else if (sym === '(') {
        this.construct();
        var n = parseE();
        //проверка, что есть ")"
        // expect(Tag.RPAREN);
        return n;
    }
    if (this.getVal() === '-') {
        // expect(Tag.DIF);
        return -1 * parseF();
    }*/

    if (this.getId() === 'boolean') {
        this.construct();
        parseEE();
    }
    //не должен выводить ничего
    return 1;
}
