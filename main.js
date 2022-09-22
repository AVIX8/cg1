import Object3D from './Object3D.js'

const pressedKeys = {}
const toggleKeys = {}
const onKeydown = {}
window.addEventListener('keydown', (event) => {
    pressedKeys[event.code] = true
    toggleKeys[event.code] = !toggleKeys[event.code]
    if (onKeydown[event.code]) {
        onKeydown[event.code](event)
    }
})
window.addEventListener('keyup', (event) => {
    pressedKeys[event.code] = false
})

const fontSize = 18
const getRGBfromFPS = (fps) => {
    const g = (255 * fps) / 60
    return `rgb(${255 - g},${g},0)`
}

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
let ctx = canvas.getContext('2d')

let height, width
height = window.innerHeight
width = window.innerWidth
const resize = () => {
    height = window.innerHeight
    width = window.innerWidth
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
    ctx.font = `${fontSize}px verdana, sans-serif`
    ctx.cx = width / 2
    ctx.cy = height / 2
}
window.addEventListener('resize', resize, false)
resize()

let size = height / 4

const letterVertices = [
    [-2, -3.5],
    [-1, -3.5],
    [-1, -0.5],
    [1, -3.5],
    [2, -3.5],
    [0, 0],
    [2, 3.5],
    [1, 3.5],
    [-1, 0.5],
    [-1, 3.5],
    [-2, 3.5],
].map(([x, y]) => [x / 2, y / 3.5])
const vLen = letterVertices.length

const vertices = [...letterVertices.map((v) => [...v, -1, 1]), ...letterVertices.map((v) => [...v, 1, 1])]
const edges = [
    ...[...Array(vLen)].map((_, i) => [i, (i + 1) % vLen]),
    ...[...Array(vLen)].map((_, i) => [vLen + i, vLen + ((i + 1) % vLen)]),
    ...[...Array(vLen)].map((_, i) => [i, vLen + (i % vLen)]),
]
const scale = [size * 0.8, size, size * 0.2]
const position = [size * 0.8, -size, size * 0.2]
const letter = new Object3D({
    vertices,
    edges,
    scale: [...scale],
    position: [...position],
})
const axisX = new Object3D({
    vertices: [
        [0, 0, 0, 1],
        [1, 0, 0, 1],
    ],
    edges: [[0, 1]],
    scale: [size * 4, 0, 0],
    color: 'red',
})
const axisY = new Object3D({
    vertices: [
        [0, 0, 0, 1],
        [0, -1, 0, 1],
    ],
    edges: [[0, 1]],
    scale: [0, size * 4, 0],
    color: 'green',
})
const axisZ = new Object3D({
    vertices: [
        [0, 0, 0, 1],
        [0, 0, 1, 1],
    ],
    edges: [[0, 1]],
    scale: [0, 0, size * 4],
    color: 'blue',
})
const XYtoLetter = new Object3D({ edges: [[0, 1]], color: 'blue' })
const YZtoLetter = new Object3D({ edges: [[0, 1]], color: 'red' })
const ZXtoLetter = new Object3D({ edges: [[0, 1]], color: 'green' })

onKeydown['Enter'] = () => {
    if (letter.speed[1] == 0) letter.speed = [0, -5 * size, 0]
}
onKeydown['KeyG'] = () => {
    letter.speed[1] = 0
}
onKeydown['NumpadDecimal'] = () => {
    letter.rotateByAxis = !letter.rotateByAxis
}
onKeydown['Numpad0'] = () => {
    letter.rotation = [0,0,0]
    letter.position = [...position]
    letter.scale = [...scale]
}

const update = (td) => {
    td = td * 0.001
    const rotationSpeed = (pressedKeys.CapsLock ? 3 : 30) * td * 0.1
    const movementSpeed = (pressedKeys.CapsLock ? 5 : 50) * td * 10

    if (pressedKeys.Numpad5 ^ pressedKeys.Numpad8) {
        letter.rotation[0] += (pressedKeys.Numpad8 ? -1 : 1) * rotationSpeed
    }
    if (pressedKeys.Numpad4 ^ pressedKeys.Numpad6) {
        letter.rotation[1] += (pressedKeys.Numpad6 ? -1 : 1) * rotationSpeed
    }
    if (pressedKeys.Numpad7 ^ pressedKeys.Numpad9) {
        letter.rotation[2] += (pressedKeys.Numpad7 ? -1 : 1) * rotationSpeed
    }

    if (pressedKeys.NumpadAdd ^ pressedKeys.NumpadSubtract) {
        letter.scale = letter.scale.map((s) => s * (pressedKeys.NumpadAdd ? 1.1 : 0.9))
    }

    if (pressedKeys.KeyA ^ pressedKeys.KeyD) {
        letter.position[0] += (pressedKeys.KeyA ? -1 : 1) * movementSpeed
    }
    if (pressedKeys.Space ^ pressedKeys.ShiftLeft) {
        letter.position[1] += (pressedKeys.Space ? -1 : 1) * movementSpeed
    }
    if (pressedKeys.KeyW ^ pressedKeys.KeyS) {
        letter.position[2] += (pressedKeys.KeyW ? -1 : 1) * movementSpeed
    }

    if (toggleKeys.KeyG) {
        letter.speed = letter.speed.map((s, i) => s + letter.acceleration[i] * td * size)
        letter.position = letter.position.map((p, i) => p + letter.speed[i] * td)
        if (letter.position[1] > 0) {
            letter.position[1] = 0
            letter.speed[1] = 0
        }
    }

    const [x, y, z] = letter.getCenter()
    XYtoLetter.vertices = [
        [x, y, 0, 1],
        [x, y, z, 1],
    ]
    YZtoLetter.vertices = [
        [0, y, z, 1],
        [x, y, z, 1],
    ]
    ZXtoLetter.vertices = [
        [x, 0, z, 1],
        [x, y, z, 1],
    ]
}

const clear = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
}

const chartMaxWidth = 250
const fpsChart = Array(chartMaxWidth).fill(0)
const showStats = (timeDelta, startTime) => {
    const fps = 1000 / timeDelta
    while (fpsChart.length > chartMaxWidth) fpsChart.shift()
    fpsChart.push(fps)

    ctx.fillStyle = `#0000000f`
    ctx.fillRect(0, fontSize + 8, chartMaxWidth, 60)

    for (let i = 0; i < fpsChart.length - 1; i++) {
        ctx.strokeStyle = getRGBfromFPS(fpsChart[i])
        ctx.beginPath()
        ctx.moveTo(i, fontSize + 68 - fpsChart[i])
        ctx.lineTo(i + 1, fontSize + 68 - fpsChart[i + 1])
        ctx.stroke()
    }

    ctx.fillStyle = getRGBfromFPS(fps)
    ctx.fillText(`fps: ${fps}`, 0, fontSize, chartMaxWidth)
    ctx.fillText(`renderTime: ${Date.now() - startTime} ms`, chartMaxWidth + 8, fontSize, chartMaxWidth)
}

let prevTime = 0
function render(curTime) {
    const renderStartTime = Date.now()
    const deltaTime = curTime - prevTime
    prevTime = curTime

    clear()
    update(deltaTime)
    ctx.lineWidth = 3
    for (let i = 0; i < 1; i++) {
        
        axisX.render(ctx)
        axisY.render(ctx)
        axisZ.render(ctx)
        ctx.setLineDash([10, 5])
        XYtoLetter.render(ctx)
        YZtoLetter.render(ctx)
        ZXtoLetter.render(ctx)
        ctx.setLineDash([])
        letter.render(ctx)  
    }

    showStats(deltaTime, renderStartTime)
    requestAnimationFrame(render)
}
requestAnimationFrame(render)
