const viu = document.createElement('div')

viu.style = `
    display: none;
    background: #000;
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    padding: 50px 100px;
    box-sizing: border-box;
    text-align: center;
    overflow-y: auto;
    z-index: 99999999999;
`

window.document.body.appendChild(viu)

const holder = {
    serve: false,
    open: false,
}

const buidTrace = (target) => {
    let trace = ''
    let limit = 5

    while (target && limit-- > 0) {
        trace += `.${target.className}`
        target = target.parentElement
    }

    return trace
}

const toggle = () => {
    if (holder.open) {
        viu.style.display = 'none'
        viu.innerHTML = ''
        window.document.body.style.overflow = 'auto'
    } else {
        const images = []
        const doms = document.querySelectorAll('img')
        const traceMap = {}

        doms.forEach((d) => {
            const trace = buidTrace(d)

            if (!traceMap[trace]) {
                traceMap[trace] = 1
            } else {
                traceMap[trace]++
            }

            images.push({
                src: d.src || d.getAttribute('data-src'),
                trace,
            })
        })

        const topTraces = Object.keys(traceMap).sort((t1, t2) => {
            return traceMap[t2] - traceMap[t1]
        })

        viu.innerHTML = images
            .filter(i => i.trace === topTraces[0])
            .map((image) => {
                return `<img src="${image.src}" style="max-width: 300px; vertical-align: top; margin: 5px">`
            })

        viu.style.display = 'block'
        window.document.body.style.overflow = 'hidden'
    }

    holder.open = !holder.open
}

window.addEventListener('keydown', (e) => {
    if (holder.serve) {
        e.preventDefault()
        holder.serve = false

        if (e.key === '/') {
            toggle()
        }

        return
    }

    if (e.ctrlKey && e.key === '/') {
        holder.serve = true
        return
    }
})