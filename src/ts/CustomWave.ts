export class CustomWave {
    size: number
    realFunction: Function
    imaginaryFunction: Function
    realCoefficients: Array<number>
    imaginaryCoefficients: Array<number>

    constructor(realFunction: Function, imaginaryFunction: Function, size: number = 2048) {
        this.realFunction = realFunction
        this.imaginaryFunction = imaginaryFunction
        this.size = size
        this.realCoefficients = realFunction(size)
        this.imaginaryCoefficients = imaginaryFunction(size)

        console.log(realFunction)
        

        console.log(this.realCoefficients)
        console.log(this.imaginaryCoefficients)
    }
}