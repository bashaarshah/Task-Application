module.exports = {
    generateRandomString,
}
// TODO ask about function*
function* generateRandomString(len=8) {
    while (true) {
        let result = ""
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (let i = 0; i < len; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        yield result;
    }
}