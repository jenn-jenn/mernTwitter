const validText = (str) => {
    // make sure str is a string and not string with spaces
    return typeof str === 'string' && str.trim().length > 0 // trim spaces
}

module.exports = validText;