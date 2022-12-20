class xquery {
    constructor(arg) {
        return document.querySelector(arg)
    }
}

function $(arg) {
    return new xquery(arg)
}

export { $ }