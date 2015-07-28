
import AstUtils = require('./AstUtils');

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "forbidden evalScript: ";

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoEvalScriptWalker(sourceFile, this.getOptions()));
    }
}

class NoEvalScriptWalker extends Lint.RuleWalker {

    protected visitCallExpression(node: ts.CallExpression) {
        this.validateExpression(node);
        super.visitCallExpression(node);
    }

    private validateExpression(node : ts.CallExpression) : void {
        var expression: ts.Expression = node.expression;
        var functionName : string = AstUtils.getFunctionName(node);
        if (functionName === 'evalScript') {
            var msg : string = Rule.FAILURE_STRING + expression.getFullText().trim();
            this.addFailure(this.createFailure(expression.getStart(), expression.getWidth(), msg));
        }
    }
}
