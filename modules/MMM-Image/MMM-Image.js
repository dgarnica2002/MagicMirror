/* Magic Mirror
 * Module: MMM-Image
 *
 * By Mykle1 and Daniel Garnica
 * Refactored code for FCHH 
 */
Module.register("MMM-Image", {
    // Default module config.
    defaults: {
        style: '1', // 1-52
        maxWidth: "100%", // Adjusts size of images. Retains aspect ratio.
        imagesPath: '', // Overrides style. Local path or internet URL's.
        updateInterval: 5 * 60 * 1000, // set in config.js
        animationSpeed: 3000,
    },

    start: function() {

        this.imageURLs = null;
        this.imageIndex = -1;
        //	console.log(this.eyesUrls[this.config.style]);
        if (this.config.imagesPath != null) {
            this.sendSocketNotification("RETRIEVE_FILENAMES", this.config.imagesPath);
        }
        else {
            console.log("Images path is empty")
        }
        // ADDED: Schedule update timer courtesy of ninjabreadman
        var self = this;
        setInterval(function() {
            self.refreshImage(); // use config.animationSpeed or revert to zero @ninjabreadman
        }, self.config.updateInterval);

    },

    getStyles: function() {
        return ["MMM-EyeCandy.css"]
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        var image = document.createElement("img");
        var getTimeStamp = new Date();
        if (this.imageURLs != null) {
            image.classList.add = "photo";
            console.log(this.imageURLs)
            image.src = this.config.imagesPath + "/" + this.imageURLs[this.imageIndex] + "?seed=" + getTimeStamp;
            console.log(image.src);
            image.style.maxWidth = this.config.maxWidth;
            image.style.maxHeight = "80%";
            image.style.paddingBottom = "1vw";
            wrapper.appendChild(image);
        }
        else {
            wrapper.innerHTML = this.translate("LOADING");
        }
        // else if (this.config.style != '') {
        //     image.classList.add = "photo";
        //     image.src = this.url + "?seed=" + getTimeStamp;

        //     image.style.maxWidth = this.config.maxWidth;
        // }

        return wrapper;
    },

    refreshImage: function() {
        const numOfImages = this.imageURLs ? this.imageURLs.length : 0;
        if (this.imageIndex + 1 == numOfImages) {
            this.imageIndex = 0;
        }
        else {
            this.imageIndex += 1;
        }
        console.log("current index", this.imageIndex)
        this.updateDom(this.config.animationSpeed || 0);
    },

    /////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_LOGO') {
            this.hide();
        } else if (notification === 'SHOW_LOGO') {
            this.show(1000);
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if(notification == "RETRIEVED_FILENAMES") {
            console.log(payload)
            this.imageURLs = payload;
        }
    }
});
