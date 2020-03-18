const isDebugMode = () => {
    return process.env.NODE_ENV !== 'production'
};

export default {
    log: function() {
        isDebugMode() && console.log.apply(console, arguments)
    },

    error: function() {
        isDebugMode() && console.error.apply(console, arguments)
    },

    warn: function() {
        isDebugMode() && console.warn.apply(console, arguments)
    },

    info: function() {
        isDebugMode() && console.info.apply(console, arguments)
    }
}
