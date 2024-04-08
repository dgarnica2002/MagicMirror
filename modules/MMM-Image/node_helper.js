const NodeHelper = require("node_helper");
const fs = require('fs');

module.exports = NodeHelper.create({

    socketNotificationReceived: function (notification, payload) {
        if (notification == "RETRIEVE_FILENAMES") {
            const fileNames = fs.readdirSync("." + payload);
            this.sendSocketNotification("RETRIEVED_FILENAMES", fileNames);
        }
    }
});


