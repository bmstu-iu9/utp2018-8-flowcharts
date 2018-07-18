var sym;

let map = new Map([
    ['x',  10],
    ['y',   2],
    ['z', 15]
]);
var str = 'x/y+z';
sym = str[0];
var ind = 0;
console.log("result = " + parse());
var num;

//console.log(next());

function parse() {
    // System.out.println(parseE());
    var n;
    if (ind < str.length) {
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

function sym_next() {
    sym = str[ind+1];
    ind++;
    return sym;

}

function next() {
    var sym_new = str[ind+1];
    return sym_new;

}


//<E>  ::= <T> <E’>.
function parseEE() {
    var a =  parseNew(parseF());
    console.log("ans "+a);
}

function parseE() {
    if (sym === '<' || sym === '>' || sym === '=') {
        parseEE();
    }
    return parse_E(parseT());
}

function parseNew(n)  {
    if (sym === '>' && next() === '=') {
        sym_next();
        sym_next();
        return (n >= parseF());
    } else if (next() === '=' && sym === '<') {
        sym_next();
        sym_next();
        return (n <= parseF());
    }
    else if (sym === '>') {
        sym_next();
        return (n > parseF());
    }
    else if (sym === '=' && next() === '=') {
        sym_next();
        sym_next()
        return (n === parseF());
    }
    else if (sym === '<') {
        sym_next();
        return (n < parseF());
    }
    return n;
}

//<E’> ::= + <T> <E’> | - <T> <E’> | .
function parse_E(n) {
    if (sym === '+') {
        sym_next();
        return parse_E(n + parseT());
    }
    if (sym === '-') {
        sym_next();
        return parse_E(n - parseT());
    }
    return n;
}

//<T>  ::= <F> <T’>.
function parseT() {
    return parse_T(parseF());
}

//<T’> ::= * <F> <T’> | / <F> <T’> | .
function parse_T(n) {
    if (sym === '*') {
        sym_next();
        return parse_T(n * parseF());
    }
    if (sym === '/') {
        sym_next();
        return parse_T(n / parseF());
    }
    if (next() === '<' || next() === '>' || next() === '=') {
        parseEE();
    }
    return n;
}

//<F>  ::= <number> | <var> | ( <E> ) | - <F>.
// если число, то вернуть число
// если переменная, то найти значение переменной в map и вернуть
function parseF() {
    if (Number(sym)) {
        var num = sym;
        sym_next();
        return num;
    }
    if (Symbol(sym)) {
        var n;
            var i = map.get(sym);
            sym_next();
        return i;
    }
    if (sym === '(') {
        sym_next();
        var n = parseE();
        //проверка, что есть ")"
        // expect(Tag.RPAREN);
        return n;
    }
    if (sym === '-') {
        // expect(Tag.DIF);
        return -1 * parseF();
    }
    if (next() === '>' || next() === '<' || next() === '=') {
        sym_next();
        parseEE();
    }
    //не должен выводить ничего
    return 1;
}
