module.exports = {
    linkState: function (field, value, callback) {
        if (typeof value === 'function') {
            callback = value;
            value = undefined;
        }
        return {
            value: typeof value !== 'undefined' ? this.state[field] == value : this.state[field],
            requestChange: function (newValue) {
                if (typeof value !== 'undefined') {
                    newValue = value
                }
                var state = {};
                state[field] = newValue;
                this.setState(state, callback);
            }.bind(this)
        };
    }
};