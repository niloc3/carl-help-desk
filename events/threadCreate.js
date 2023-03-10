const fs = require('fs')

module.exports = {
    name: 'threadCreate',
    async execute(thread, newlyCreated) {
        if (thread.joinable) await thread.join;
    },
};