export const Rx = (angle) => {
    const sn = Math.sin(angle)
    const cs = Math.cos(angle)
    return [
        [1, 0, 0, 0],
        [0, cs, sn, 0],
        [0, -sn, cs, 0],
        [0, 0, 0, 1],
    ]
}

export const Ry = (angle) => {
    const sn = Math.sin(angle)
    const cs = Math.cos(angle)
    return [
        [cs, 0, -sn, 0],
        [0, 1, 0, 0],
        [sn, 0, cs, 0],
        [0, 0, 0, 1],
    ]
}

export const Rz = (angle) => {
    const sn = Math.sin(angle)
    const cs = Math.cos(angle)
    return [
        [cs, sn, 0, 0],
        [-sn, cs, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]
}

export const Op = (a,b) => {
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [a, b, 1, 0],
        [0, 0, 0, 1],
    ]
}

export const D = ([x, y, z]) => [
    [x, 0, 0, 0],
    [0, y, 0, 0],
    [0, 0, z, 0],
    [0, 0, 0, 1],
]

export const T = ([x, y, z]) => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [x, y, z, 1],
]

export const ONE = () => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]

export const multiply = (...matrices) => {
    let cur = ONE()
    matrices.forEach((matrix) => {
        const nxt = Array(4)
        for (let r = 0; r < 4; ++r) {
            nxt[r] = Array(4)
            for (let c = 0; c < 4; ++c) {
                nxt[r][c] = 0
                for (let i = 0; i < matrix.length; ++i) {
                    nxt[r][c] += cur[r][i] * matrix[i][c]
                }
            }
        }
        cur = nxt
    })
    
    return cur
}
