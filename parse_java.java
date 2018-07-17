import java.util.Arrays;
import java.util.HashMap;
import java.util.Scanner;
import java.util.function.IntPredicate;

class Position {
    private String text;
    private int index, line, col;

    public Position(String text) {
        this(text, 0,1,1);
    }

    private Position(String text, int index, int line, int col) {
        this.text = text;
        this.index = index;
        this.line = line;
        this.col = col;
    }

    public String substring(int follow) {
        return text.substring(index,follow);
    }

    public int getChar() {
        return index < text.length() ? text.codePointAt(index) : -1;
    }

    public int getIndex() {
        return index;
    }

    public String getText() {
        return text;
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
                return new Position(text, index+1, line+1,1);
            default:
                return new Position(text, index + (c > 0xFFFF ? 2:1),line, col+1);
        }
    }

    public Position skipWhile(IntPredicate p) {
        Position pos = this;
        while (pos.satisfies(p)) pos = pos.skip();
        return pos;
    }

    public String toString() {
        return String.format("(%d,&d)", line, col);
    }
}

class SyntaxError extends Exception {
    public SyntaxError(Position pos, String msg) {
        super(String.format("%s", "error"));
    }
}

enum Tag {
    EQ,
    EQ_EQ,
    BIG,
    BIG_EQ,
    MIN,
    MIN_EQ,
    IDENT,
    STRING,
    VAR,
    NUMBER,
    MUL,
    DIV,
    ADD,
    DIF,
    LPAREN,
    RPAREN,
    END_OF_TEXT;

    public String toString() {
        switch (this) {
            case IDENT: return "identifier";
            case STRING: return "string";
            case VAR: return "var";
            case NUMBER: return "number";
            case MUL: return "*";
            case DIV: return "/";
            case ADD: return "+";
            case DIF: return "-";
            case EQ: return "=";
            case EQ_EQ:return "==";
            case BIG: return ">";
            case BIG_EQ: return ">=";
            case MIN:return "<";
            case MIN_EQ:return "<=";
            case LPAREN: return "'('";
            case RPAREN: return "')'";
            case END_OF_TEXT: return "end of text";
        }
        throw new RuntimeException("unreachable code");
    }
}

class Token {
    private Tag tag;
    private Position start, follow;
    private String var;
    private int number;

    public Position getStart() {
        return start;
    }

    public Position getFollow() {
        return follow;
    }

    public int getNumber() {
        return number;
    }

    public String getVar() {
        return var;
    }

    public Token(String text) throws SyntaxError {
        this(new Position(text));
    }

    private Token(Position cur) throws SyntaxError {
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
            case '*':
                tag = Tag.MUL;
                break;
            case '/':
                tag = Tag.DIV;
                break;
            case '+':
                tag = Tag.ADD;
                break;
            case '-':
                tag = Tag.DIF;
                break;
            case '>':
                tag = Tag.BIG;
                break;
            case '<':
                tag = Tag.MIN;
                break;
            case '=':
                tag = Tag.EQ;
                break;
            /*case '>=':
                tag = Tag.BIG_EQ;
                break;
            case '<=':
            tag = Tag.MIN_EQ;
            break;
            */

            default:
                if (start.satisfies(Character::isLetter)) {
                    follow = getFollow().skipWhile(Character::isLetterOrDigit);
                    tag = Tag.VAR;
                    var = getStart().substring(getFollow().getIndex());
                } else if (start.satisfies(Character::isDigit)) {
                    follow = getFollow().skipWhile(Character::isDigit);
                    number = Integer.parseInt(start.substring(follow.getIndex()));
                    if (follow.satisfies(Character::isLetter)) {
                        throw new SyntaxError(follow, "delimiter expected");
                    }
                    tag = Tag.NUMBER;
                }
                else if (start.getChar()=='>' &&  follow.getChar()=='='){
                    tag = Tag.BIG_EQ;
                }else if (start.getChar()=='=' && follow.getChar()=='>') {
                    tag = Tag.MIN_EQ;
                }
                else if (start.getChar()=='=' && follow.getChar()=='=') {
                    tag = Tag.EQ_EQ;
                } else
                {
                    throwError("invalid character");
                }
        }
    }

    public void throwError(String msg) throws SyntaxError {
        throw new SyntaxError(start, msg);
    }

    public boolean matches(Tag ...tags) {
        return Arrays.stream(tags).anyMatch(t -> tag == t);
    }

    public Token next() throws SyntaxError {
        return new Token(follow);
    }
}

public class parse_java {
    private static Token sym;
    private static HashMap<String, Integer> hashMap = new HashMap<>();
    private static Tag num;
    private static Scanner in;

    private static void expect(Tag tag) throws SyntaxError {
        if (!sym.matches(tag)) {
            sym.throwError(tag.toString() + " expected");
        }
        sym = sym.next();
    }

    public static void main(String[] args) {
        in = new Scanner(System.in);
        String text = in.nextLine();
        try {
            sym = new Token(text);
            System.out.println(parse());
        } catch (SyntaxError e) {
            System.out.println(e.getMessage());
        }
    }

    private static int parse() throws SyntaxError {
        // System.out.println(parseE());
        int n;
        if (!sym.matches(Tag.END_OF_TEXT)) {
            n = parseE();
            parse();
        }
        else {
            n = parseE();
            expect(Tag.END_OF_TEXT);
        }
        return n;

    }

    //<E>  ::= <T> <E’>.
    private static void parseEE() throws SyntaxError {
        //sym = sym.next();
        boolean ans =  parseNew(parseF());
        System.out.println(ans);
    }

    private static int parseE() throws SyntaxError {
        if (sym.next().matches(Tag.MIN) || sym.next().matches(Tag.BIG) || sym.next().matches(Tag.BIG_EQ) || sym.next().matches(Tag.MIN_EQ) || sym.next().matches(Tag.EQ)) {
            parseEE();
        }
        //System.out.println("loool");
        return parse_E(parseT());
    }

    private static boolean parseNew(int n) throws SyntaxError {
        // System.out.println(12);
        //sym = sym.next();
        if (sym.next().matches(Tag.EQ) && sym.matches(Tag.BIG)) {
            sym = sym.next().next();
            return (n >= parseF());
        } else if (sym.next().matches(Tag.EQ) && sym.matches(Tag.MIN)) {
            sym = sym.next().next();
            return (n <= parseF());
        }
        else if (sym.matches(Tag.BIG)) {
            sym = sym.next();
            System.out.println("   " +n);
            return (n > parseF());
        }
        else if (sym.next().matches(Tag.EQ) && sym.matches(Tag.EQ)) {
            sym = sym.next().next();
            return (n == parseF());
        }
        else {
            sym = sym.next();
            return (n < parseF());
        }
    }

    //<E’> ::= + <T> <E’> | - <T> <E’> | .
    private static int parse_E(int n) throws SyntaxError {
        if (sym.matches(Tag.ADD)) {
            sym = sym.next();
            return parse_E(n + parseT());
        }
        if (sym.matches(Tag.DIF)) {
            sym = sym.next();
            return parse_E(n - parseT());
        }
        return n;
    }

    //<T>  ::= <F> <T’>.
    private static int parseT() throws SyntaxError {
        return parse_T(parseF());
    }

    //<T’> ::= * <F> <T’> | / <F> <T’> | .
    private static int parse_T(int n) throws SyntaxError {
        if (sym.matches(Tag.MUL)) {
            sym = sym.next();
            return parse_T(n * parseF());
        }
        if (sym.matches(Tag.DIV)) {
            sym = sym.next();
            return parse_T(n / parseF());
        }
        if (sym.next().matches(Tag.MIN) || sym.next().matches(Tag.BIG)) {
            boolean a = parseNew(parseF());
            System.out.println(a);
        }
        return n;
    }

    //<F>  ::= <number> | <var> | ( <E> ) | - <F>.
    private static int parseF() throws SyntaxError {
        if (sym.matches(Tag.NUMBER)) {
            int n = sym.getNumber();
            sym = sym.next();
            return n;
        }
        if (sym.matches(Tag.VAR)) {
            int n;
            if (hashMap.containsKey(sym.getVar())) {
                n = hashMap.get(sym.getVar());
                sym = sym.next();
            } else {
                int i = in.nextInt();
                System.out.println(i);
                hashMap.put(sym.getVar(), i);
                n = hashMap.get(sym.getVar());
                sym = sym.next();
            }
            return n;
        }
        if (sym.matches(Tag.LPAREN)) {
            sym = sym.next();
            int n = parseE();
            expect(Tag.RPAREN);
            return n;
        }
        if (sym.matches(Tag.DIF)) {
            expect(Tag.DIF);
            return -1 * parseF();
        }
        if (sym.next().matches(Tag.BIG) || sym.next().matches(Tag.MIN) || sym.next().matches(Tag.BIG_EQ) || sym.next().matches(Tag.MIN_EQ) || sym.next().matches(Tag.EQ)) {
            sym = sym.next();
            parseEE();
        }
       // System.out.println("this is here");
        //не должен выводить ничего
        return 1;
    }
}
