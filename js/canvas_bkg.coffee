canvas = document.getElementsByTagName("canvas")[0]
ctx = null
grad = null
body = document.getElementsByTagName("body")[0]
color = 255
canvasAdjust = true
if canvas.getContext("2d")
    ctx = canvas.getContext("2d")
    ctx.clearRect 0, 0, 900, 700
    ctx.save()
    grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 900)
    grad.addColorStop 0, "#000"
    grad.addColorStop 1, "rgb(" + color + ", " + color + ", " + color + ")"
    ctx.fillStyle = grad
    ctx.fillRect 0, 0, 900, 700
    ctx.save()
    body.onmousemove = (event) ->
        if canvasAdjust
            width = window.innerWidth
            height = window.innerHeight
            x = event.clientX
            y = event.clientY
            rx = 900 * x / width
            ry = 700 * y / height
            xc = ~~(256 * x / width)
            yc = ~~(256 * y / height)
            grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, 900)
            grad.addColorStop 0, "#000"
            grad.addColorStop 1, [ "rgb(", xc, ", ", (255 - xc), ", ", yc, ")" ].join("")
            ctx.fillStyle = grad
            ctx.fillRect 0, 0, 900, 700
        null

    body.onclick = (event) ->
        if canvasAdjust 
            canvasAdjust = false 
        else 
            canvasAdjust = true
        null
