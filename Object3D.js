import { Rx, Ry, Rz, D, T, multiply, Op } from './Transformation.js'

export default class Object3D {
    vertices = []
    edges = []
    rotation = [0, 0, 0]
    position = [0, 0, 0]
    scale = [1, 1, 1]
    speed = [0, 0, 0]
    acceleration = [0, 9.8, 0]
    rotateByAxis = false
    color = 'black'

    constructor({ vertices, edges, position, scale, color, rotateByAxis }) {
        this.vertices = vertices ?? this.vertices
        this.edges = edges ?? this.edges
        this.position = position ?? this.position
        this.scale = scale ?? this.scale
        this.color = color ?? this.color
        this.rotateByAxis = rotateByAxis ?? this.position
    }

    getCenter() {
        return this.getRotateAndTranslateTransformation()[3]
    }

    getRotateAndTranslateTransformation() {
        const rx = Rx(this.rotation[0]) // вращение вокруг оси x
        const ry = Ry(this.rotation[1]) // вращение вокруг оси y
        const rz = Rz(this.rotation[2]) // вращение вокруг оси z
        const t = T(this.position) // перемещение
        if (this.rotateByAxis) {
            return multiply(t, rx, ry, rz)
        }
        return multiply(rx, ry, rz, t)
    }

    render(ctx) {
        const d = D(this.scale) // масштабирование
        const p = Op(-Math.sqrt(2) / 4, Math.sqrt(2) / 4)

        const transformation = multiply(d, this.getRotateAndTranslateTransformation(), p)

        const transformedVertices = this.vertices.map((v) => multiply([v], transformation)[0])

        ctx.strokeStyle = this.color
        ctx.beginPath()
        for (let edge of this.edges) {
            const [x1, y1] = transformedVertices[edge[0]]
            const [x2, y2] = transformedVertices[edge[1]]
            ctx.moveTo(x1 + ctx.cx, y1 + ctx.cy)
            ctx.lineTo(x2 + ctx.cx, y2 + ctx.cy)
        }
        ctx.stroke()
    }
}
