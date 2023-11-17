
const _operators: Array<string> = [
    '+',
    '-',
    '*',
    '/',
    '^'
]

const _functions: Array<string> = [
    'sin',
    'cos',
    'tan',
    'sec',
    'csc',
    'cot',
    'sqrt'
]

const _numbers: Array<string> = [
    'pi',
    'e',
    'n'
]

const isNumber = (char: string): boolean => {
    return !Number.isNaN(parseFloat(char))
}

const getPrecedence = (op: string): number => {
    if(op === '^') {
        return 3
    } else if (op === '*' || op === '/') {
        return 2
    } else if (op === '+' || op === '-') {
        return 1
    } else {
        return 0
    }
}

const isLeftAssociative = (op: string): boolean => {
    return op === '+' || op === '-' || op === '*' || op === '/'
}

const popOperatorsCondition = (token: string, operators: Array<string>): boolean => {
    var top = operators[operators.length-1]
    if(token === ')') {
        return top !== '('
    } else {
        return top !== '('
                && (
                        getPrecedence(top) > getPrecedence(token)
                        || (
                                getPrecedence(top) === getPrecedence(token)
                                && isLeftAssociative(token)
                            )
                    )
    }
}

const evaluateRpn = (rpn: Array<string>, n: number): number => {
    var operands: Array<number> = []
    var result: number
    var last: number
    var secondToLast: number

    for(let i = 0; i < rpn.length; i++) {
        if(isNumber(rpn[i])) {
            operands.push(parseFloat(rpn[i]))
        } else if(_numbers.includes(rpn[i])) {
            if(rpn[i] === 'n') {
                operands.push(n)
            } else if(rpn[i] === 'e') {
                operands.push(Math.E)
            } else if(rpn[i] === 'pi') {
                operands.push(Math.PI)
            }
        } else if(_functions.includes(rpn[i])) {
            last = operands.pop()

            if(rpn[i] === 'sin') {
                operands.push(Math.sin(last))
            } else if(rpn[i] === 'cos') {
                operands.push(Math.cos(last))
            } else if(rpn[i] === 'tan') {
                operands.push(Math.tan(last))
            } else if(rpn[i] === 'sec') {
                operands.push(1.0 / Math.cos(last))
            } else if(rpn[i] === 'csc') {
                operands.push(1.0 / Math.sin(last))
            } else if(rpn[i] === 'cot') {
                operands.push(1.0 / Math.tan(last))
            } else if(rpn[i] === 'sqrt') {
                operands.push(Math.sqrt(last))
            }
        } else if(_operators.includes(rpn[i])) {
            last = operands.pop()
            secondToLast = operands.pop()

            if(rpn[i] === '+') {
                operands.push(secondToLast + last)
            } else if(rpn[i] === '-') {
                operands.push(secondToLast - last)
            } else if(rpn[i] === '*') {
                operands.push(secondToLast * last)
            } else if(rpn[i] === '/') {
                operands.push(secondToLast / last)
            } else if(rpn[i] === '^') {
                operands.push(secondToLast ^ last)
            }
        }
    }

    if(operands.length !== 1) {
        console.error("Invalid expression")
        return 0
    }

    return operands.pop()
}

//poor man's string tokenizer, please go easy on it
const processString = (expression: string): Array<string>  => {
    var tokens: Array<string> = []
    var token = ""

    expression = expression.replaceAll(" ", "")

    for(let i = 0; i < expression.length; i++) {
        if(isNumber(expression[i])) {
            if(!token || isNumber(token[token.length-1])) {
                token += expression[i]
            } else {
                tokens.push(token)
                token = expression[i]
            }
        } else if(_operators.includes(expression[i])) {
            if(token) {
                tokens.push(token)
                tokens.push(expression[i])
                token = ""
            } else if(expression[i] === '-') {
                //handle - as a sign, not operator
                if(
                    tokens.length === 0
                    || tokens[tokens.length-1] === '('
                    || _operators.includes(tokens[tokens.length-1]))
                {
                    token = expression[i]
                    token += expression[++i]
                } else {
                    tokens.push(expression[i])
                }
            } else {
                tokens.push(expression[i])
            }
        } else if(_numbers.includes(expression[i]) && (!token || isNumber(token[token.length-1]))) {
            if(token) {
                tokens.push(token)
                tokens.push(expression[i])
                token = ""
            } else {
                tokens.push(expression[i])
            }
        } else if(expression[i] === '(' || expression[i] === ')') {
            if(token) {
                tokens.push(token)
                tokens.push(expression[i])
                token = ""
            } else {
                tokens.push(expression[i])
            }
        } else {
            if(!token || !isNumber(token[token.length-1])) {
                token += expression[i]
            } else {
                tokens.push(token)
                token = expression[i]
            }
        }
    }

    if(token) {
        tokens.push(token)
    }

    if(tokens.length == 0) {
        tokens.push("0")
    }

    return tokens
}

const shuntingYard = (tokens: Array<string>): Array<string> => {
    var outputQueue: Array<string> = []
    var operatorStack: Array<string> = []

    var token: string
    for(let i = 0; i < tokens.length; i++) {
        token = tokens[i]

        if(token === '(') {
            operatorStack.push(token)
        } else if(token === ')') {
            while(popOperatorsCondition(token, operatorStack)) {
                outputQueue.push(operatorStack.pop())
            }
            operatorStack.pop()
            if(_functions.includes(operatorStack[operatorStack.length-1])) {
                outputQueue.push(operatorStack.pop())
            }
        } else if(_numbers.includes(token) || isNumber(token)) {
            outputQueue.push(token)
        } else if(_functions.includes(token)) {
            operatorStack.push(token)
        } else if(_operators.includes(token)) {
            while(popOperatorsCondition(token, operatorStack)) {
                outputQueue.push(operatorStack.pop())
            }
            operatorStack.push(token)
        }
    }

    while(operatorStack.length > 0) {
        token = operatorStack.pop()
        if(token !== '(') {
            outputQueue.push(token)
        }
    }

    return outputQueue
}

const generateFunction = (rpn: Array<string>): Function => {
    return (n: number): Array<number> => {
        var values: Array<number> = [0]
        for(let i = 1; i < n; i++) {
            values.push(evaluateRpn(rpn, i))
        }
        return values
    }
}

export const parseWaveFunction = (expression: string): Function => {
    /*
    console.log("input string: ")
    console.log(expression)
    const tokenizedExpression: Array<string> = processString(expression)
    console.log("tokenized: ")
    console.log(tokenizedExpression)
    const postFixTokens: Array<string> = shuntingYard(tokenizedExpression)
    console.log("shunted: ")
    console.log(postFixTokens)
    const func = generateFunction(postFixTokens)
    console.log("function: ")
    console.log(func)
    return
    */
    return generateFunction(shuntingYard(processString(expression)))
}