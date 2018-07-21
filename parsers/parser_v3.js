oper= ["+", "=","-", "*", "/", "<", ">", ">=", "<=", "==", "(", ")", "?" , ":", "!", "||", "&&" /* "+=" , "-=", "++", "--", "*=", "/="" */ ];

class Pos {

    constructor(str) {
        this.str = str;
        this.pos = 0;
    }

    constructor(str, pos) {
        this.str = str;
        this.pos = pos;
    }

    skip() {
        return new Pos(this.str, this.pos++);
    }

    skipWhile(char) {
        if (this.getChar() === char) {
            return this.skip.skipWile(char);
        }
        return this;
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
        this(new Pos(str));
    }

    constructor(tkn){
        this.start =tkn.skipWhile(' ');
        let a= this.start.getChar();

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
        } else if (a >= '0' && a <= '9') {
            this.val = this.start.getVal("number");
            this.id="number";
        } else {
            return alert("error of token");
        }
    }

    getVal(){
        return this.val;
    }
    getId(){
        return this.id;
    }

}



function parse(str) {
    var a = new token(str);
    
}
