export const oscilloscopeInit = (
        canvasOscElement: HTMLCanvasElement,
        canvasSpectElement: HTMLCanvasElement,
        source: AnalyserNode) => {

    const atNode = (first: number, tolerance: number = 0) => {
        return first >= 128 - tolerance && first <= 128 + tolerance
    }

    const getStabilizedWaveform = (size: number) => {
        let waveformSnapshot: Uint8Array = new Uint8Array(size)
        var greatestSlope = 0
        var greatestSlopes = []

        for(let i = size / 2; i < dataArrayOsc.length - size / 2; i++) {
            if(atNode(dataArrayOsc[i])) {
                if(Math.abs(dataArrayOsc[i+3] - dataArrayOsc[i-3]) > greatestSlope) {
                    greatestSlope = Math.abs(dataArrayOsc[i+3] - dataArrayOsc[i-3])
                    greatestSlopes = []
                    greatestSlopes.push(i)
                } else if(Math.abs(dataArrayOsc[i+3] - dataArrayOsc[i-3]) === greatestSlope) {
                    greatestSlopes.push(i)
                }
            }
        }

        if(greatestSlopes.length === 0) {
            for(let i = 0; i < size; i++) {
                waveformSnapshot[i] = dataArrayOsc[i]
            }
        } else {
            var middleIndex = greatestSlopes[Math.floor(greatestSlopes.length / 2)]
            var invert = (
                            dataArrayOsc[middleIndex]
                            - dataArrayOsc[middleIndex + 3]
                        ) > 0
            var startIndex = middleIndex - size / 2

            if(invert) {
                for(let i = 0; i < size; i++) {
                    waveformSnapshot[i] = 255 - dataArrayOsc[i + startIndex]
                }
            } else {
                for(let i = 0; i < size; i++) {
                    waveformSnapshot[i] = dataArrayOsc[i + startIndex]
                }
            }
        }

        return waveformSnapshot
    }

    const trimSpectrograph = () => {
        let trimIndex = dataArraySpect.length - 1
        for(let i = dataArraySpect.length - 1; i >= 0; i--) {
            if(dataArraySpect[i] > 0) {
                trimIndex = i
                break
            }
        }

        let spectrographSnapshot = new Uint8Array(trimIndex + 1)

        for(let i = 0; i < trimIndex; i++) {
            spectrographSnapshot[i] = dataArraySpect[i]
        }
        return spectrographSnapshot
    }

    const drawOsc = () => {
        source.getByteTimeDomainData(dataArrayOsc)
        const waveformArray: Uint8Array = getStabilizedWaveform(bufferLength / 4)


        canvasOsc.fillRect(0, 0, widthOsc, heightOsc)
        canvasOsc.beginPath()

        const sliceWidth = (widthOsc * 1.0) / waveformArray.length
        let x = 0
        let y = heightOsc - (heightOsc * waveformArray[0]) / 255.0
        canvasOsc.moveTo(x,y)

        for(let i = 0; i < waveformArray.length; i++) {
            canvasOsc.lineTo(x,y)

            x+=sliceWidth
            y = heightOsc - (heightOsc * waveformArray[i]) / 255.0
        }

        canvasOsc.stroke()
    }

    const drawSpect = () => {
        source.getByteFrequencyData(dataArraySpect)
        const spectArray: Uint8Array = trimSpectrograph()

        canvasSpect.fillRect(0, 0, widthSpect, heightSpect)
        canvasSpect.beginPath()

        const sliceWidth = (widthSpect * 1.0) / spectArray.length
        let x = 0
        let y = heightSpect
        canvasSpect.moveTo(x,y)
        for(let i = 0; i < spectArray.length; i++) {   
 
            canvasSpect.lineTo(x,y)

            x+=sliceWidth
            y = heightSpect - (heightSpect * spectArray[i]) / 255.0
        }

        canvasSpect.lineTo(widthSpect, heightSpect)
        canvasSpect.stroke()
    }

    const canvasOsc = canvasOscElement.getContext('2d')
    const heightOsc = canvasOscElement.height
    const widthOsc = canvasOscElement.width
    source.fftSize = 16384
    const bufferLength = 8192
    const dataArrayOsc = new Uint8Array(bufferLength)

    canvasOsc.fillStyle = "rgb(255,255,255)"
    canvasOsc.lineWidth = 1
    canvasOsc.strokeStyle = "rgb(0,0,0)"

    const canvasSpect = canvasSpectElement.getContext('2d')
    const heightSpect = canvasSpectElement.height
    const widthSpect = canvasSpectElement.width
    //source.fftSize = 8192
    //const bufferLength = 4096
    const dataArraySpect = new Uint8Array(bufferLength)

    canvasSpect.fillStyle = "rgb(255,255,255)"
    canvasSpect.lineWidth = 1
    canvasSpect.strokeStyle = "rgb(0,0,0)"


    var animationInterval = 32.25
    let intIdOsc = setInterval(drawOsc, animationInterval)
    let intIdSpect = setInterval(drawSpect, animationInterval)
}