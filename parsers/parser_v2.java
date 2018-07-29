import java.util.*;
import java.util.function.IntPredicate;


enum Tag {
    IDENT, NUMBER, LPAREN, RPAREN, END_OF_TEXT, OPER1,OPER2,COMPAR, TERN1,TERN2,END_OF_FUNC, FUNC_CALL,COMMA,MIN;
    public String toString() {
        switch (this) {
            case COMMA: return ",";
            case IDENT: return "identifier";
            case NUMBER: return "number";
            case LPAREN: return "(";
            case RPAREN: return ")";
            case END_OF_TEXT: return "endoftext";
            case OPER1: return "+ -";
            case OPER2: return "* /";
            case TERN1: return "?";
            case TERN2: return ":";
            case COMPAR: return  "= < > <> <= >=";
            case END_OF_FUNC: return ";";
            case FUNC_CALL: return ":=";
        }
        throw new RuntimeException("unreachable code");
    }
}


class Position {
    public String text;
    public int index, line, col;

    Position(String text) {
        this(text, 0, 1, 1);
    }

    private Position(String text, int index, int line, int col) {
        this.text = text;
        this.index = index;
        this.line = line;
        this.col = col;
    }

    public int getChar() {
        return index < text.length() ? text.codePointAt(index) : -1;
    }

    public boolean satisfies(IntPredicate p) {
        return p.test(getChar());
    }

    public Position skip() {
        int c = getChar();
        switch (c) {
            case -1:
                return this;
            case '\n':
                return new Position(text, index + 1, line + 1, 1);
            default:
                return new Position(text, index + (c > 0xFFFF ? 2 : 1), line, col + 1);
        }
    }

    public Position skipWhile(IntPredicate p) {
        Position pos = this;
        while (pos.satisfies(p)) pos = pos.skip();
        return pos;
    }

    public String toString() {
        return String.format("(%d, %d)", line, col);
    }
}

class token {
    public Tag tag;
    private Position start, follow;
    token(String text){
        this(new Position(text));
    }

    private token(Position cur) {
        start = cur.skipWhile(Character::isWhitespace);
        follow = start.skip();
        switch (start.getChar()) {
            case -1:
                tag = Tag.END_OF_TEXT;
                break;
            case '(':
                tag = Tag.LPAREN;
                break;
            case ')':
                tag = Tag.RPAREN;
                break;
            case ',' :
                tag= Tag.COMMA;
                break;
            case ';':
                tag=Tag.END_OF_FUNC;
                break;
            case '?':
                tag=Tag.TERN1;
                break;
            case ':':
                if (follow.getChar()=='='){
                    tag=Tag.FUNC_CALL;
                    follow=follow.skip();
                    break;
                }
                tag=Tag.TERN2;
                break;
            default:
                if (start.satisfies(Character::isLetter)) {
                    follow = follow.skipWhile(Character::isLetterOrDigit);
                    tag = Tag.IDENT;
                } else if (start.satisfies(Character::isDigit)) {
                    follow = follow.skipWhile(Character::isDigit);
                    if (follow.satisfies(Character::isLetter)) {
                        System.out.print("error");
                        System.exit(0);
                    }
                    tag = Tag.NUMBER;
                }else if (start.getChar()== '*' || start.getChar()=='/'){
                    tag=Tag.OPER2;
                }else if (start.getChar()== '-' || start.getChar()=='+'){
                    tag =Tag.OPER1;
                }else if (start.getChar()== '=' || start.getChar()=='>' || start.getChar()== '<' || start.getChar()=='>' &&  follow.getChar()=='=' || start.getChar()== '<' && follow.getChar()=='=' || start.getChar()=='<' && follow.getChar()=='>'){
                    tag=Tag.COMPAR;
                    if (follow.getChar()=='=' || follow.getChar()=='>'){
                        follow=follow.skip();
                    }
                }else {
                    System.out.print("error");
                    System.exit(0);
                }
        }
    }

    public boolean matches(Tag ...tags) {
        return Arrays.stream(tags).anyMatch(t -> tag == t);
    }

    public String getString(){
        String name = "";
        Position t=start;
        while (t.index != follow.index) {
            name += String.valueOf(t.text.charAt(t.index));
            t=t.skip();
        }
        return name;
    }


    public token next() {
        /*System.out.print(start + " ");
        System.out.println(start.text.charAt(start.index));*/
        return new token(follow);
    }
}

public class Modules {
    private static int time=1, count=1;
    private static token a;
    private static String name,Br="";
    private static HashSet<String> A;
    private static HashMap<String, Integer> argsNum;
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        in.useDelimiter("\\Z");
        A=new HashSet<>();
        argsNum=new HashMap<>();
        String text = in.next();
        a= new token(text);
        pars();
    }

    private static void expect(Tag tag){
        if (!a.matches(tag)) {
            System.out.print("error");
            System.exit(0);
        }
        a=a.next();
    }

    //<function> ::= <ident> ( <formal-args-list> ) := <expr> ; .
    static void pars(){
        if (!a.matches(Tag.END_OF_TEXT)){
            parsProgram();
            pars();
        }
    }

    static void parsProgram() {
        if (a.matches(Tag.IDENT)) {
            name=a.getString();
            names.put(name,new Point(name));
            A.add(name);
            a=a.next();
        } else {
            System.out.print("error");
            System.exit(0);
        }
        expect(Tag.LPAREN);
        parsFormalList();
        expect(Tag.RPAREN);
        expect(Tag.FUNC_CALL);
        parsExpr();
        expect(Tag.END_OF_FUNC);
    }

    //<expr> ::=
    //    <comparison_expr> ? <comparison_expr> : <expr>
    //    | <comparison_expr>.
    static void parsExpr() {
        parsCom();
        if (a.matches(Tag.TERN1)) {
            a=a.next();
            parsCom();
            expect(Tag.TERN2);
            parsExpr();
        }
    }

    //<comparison_expr> ::=
    //    <arith_expr> <comparison_op> <arith_expr>
    //    | <arith_expr>.
    static void parsCom(){
        parsArifm();
        if (a.matches(Tag.COMPAR)){
            a=a.next();
            parsArifm();
        }
    }

    //<arith_expr> ::=
    //    <arith_expr> + <term>
    //    | <arith_expr> - <term>
    //    | <term>.
    static void parsArifm(){
        parsTerm();
        if (a.matches(Tag.OPER1)){
            a=a.next();
            parsArifm();
        }
    }


    //<term> ::=
    //    <term> * <factor>
    //    | <term> / <factor>
    //    | <factor>.
    static void parsTerm(){
        parsFactor();
        if (a.matches(Tag.OPER2)){
            a=a.next();
            parsTerm();
        }
    }

    //<factor> ::=
    //    <number>
    //    | <ident>
    //    | ( <expr> )
    //    | - <factor>.
    static void parsFactor(){
        if (a.matches(Tag.NUMBER)){
            a=a.next();
        } else if (a.matches(Tag.IDENT)) {
            String t =a.getString();
            names.get(name).addBr(t);
            a = a.next();
        } else if (a.matches(Tag.LPAREN)){
            a=a.next();
            parsExpr();
            expect(Tag.RPAREN);
        } else if (a.matches(Tag.OPER1)){
            a=a.next();
            parsFactor();
        }else {
            System.out.print("error");
            System.exit(0);
        }
    }
}

