Module.register('MMM-Text', {
    defaults: {
        width: '75%',
        margin: '0 auto',
        //translation: 'de',
        textColor: '#ccc',
        textSize: '28px',
        headerTitle: "Title",
        filePath: "",
        fileContent: "",
        qrCodePath: "",
        refreshMs: 3600,
        referenceColor: '#ccc',
        referenceSize: '32px',
        showImage: true,
        blackAndWhite: true,
    },

    // start: function() {
    //     this.text = this.config.text
    //     // const payload = {
    //     //     translation: this.config.translation
    //     // };

    //     // this.sendSocketNotification('DAILY_POWER_LOAD_VERSE', payload);
    //     // setInterval(() => {
    //     //     this.sendSocketNotification('DAILY_POWER_LOAD_VERSE', payload);
    //     // }, 1000 * 60 * 60);
    // },

    getStyles: function() {
        return [
            this.file('styles.css')
        ];
    },

    getDom: function() {

        var getFilePath = () => {
            var filePath = this.config.filePath;
            return filePath;
        };

        if (getFilePath() !== "") {			
			var self = this;
			this.readFileContent(function (response) {
				self.config.fileContent = response.split(/(?:\r\n|\r|\n)/g).map((item) => item);
                console.log(self.config.fileContent)
			});
		}


        this.headerTitle = this.config.headerTitle
        const wrapper = document.createElement('div');
        wrapper.style.width = this.config.width;
        wrapper.style.margin = this.config.margin;
        wrapper.style.inlineSize = "25vw";
        wrapper.style.overflowWrap = 'break-word';
        if (this.config.fileContent) {
            // if (this.config.showImage) {
            //     wrapper.appendChild(this.createImage());
            // }
            wrapper.appendChild(this.createCard());
        } else {
            wrapper.innerHTML = this.translate('LOADING');
        }
        return wrapper;
    },

        //Read content from local file
	readFileContent: function (callback) {
		var xobj = new XMLHttpRequest(),
			path = this.file(this.config.filePath);
		xobj.overrideMimeType("application/text");
		xobj.open("GET", path, true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState === 4 && xobj.status === 200) {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	},

    truncateAtLastSpace: function(str, length, ending = '...') {
        if (str.length <= length) return str;
        let trimmedString = str.slice(0, length + 1);
        return trimmedString.slice(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))) + ending;
    },

    // createImage: function() {
    //     const imageUrl = this.text.image;
    //     let image = document.createElement('img');
    //     image.classList.add('text-image');
    //     if (this.config.blackAndWhite) {
    //         image.classList.add('text-image-blackAndWhite');
    //     }
    //     image.src = imageUrl;
    //     return image;
    // },


    refresh: function() {
		this.updateDom();
		setTimeout( () => {
			this.refresh();
		}, this.config.refreshMs);
	},


    createCard: function() {
        const card = document.createElement('div');
        card.className = "text-card";
        card.appendChild(this.createTitle());
        card.appendChild(this.createContent());
        return card;
    },

    getThisWeeksTuesday: function() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
        const distanceToTuesday = 2 - dayOfWeek; // Tuesday is 2
    
        // Adjust today's date to get this week's Tuesday
        today.setDate(today.getDate() + distanceToTuesday);
    
        // If today's day is after Tuesday, adjust to the next Tuesday
        if (dayOfWeek > 2) {
            today.setDate(today.getDate() + 7);
        }
    
        // Format the date
        const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        return formattedDate;
    },

    createContent: function() {
        const content = document.createElement('div');
        content.classList.add('text-p', 'text-content');
        content.style.color = this.config.textColor;
        content.style.fontSize = this.config.textSize;

        const headerDiv = document.createElement('div');
        headerDiv.className = "text-header";
        const p = document.createElement("p");
        p.innerHTML = "Pick Up & Delivery on " + this.getThisWeeksTuesday()
        headerDiv.appendChild(p)
        const image = document.createElement("img");
        image.setAttribute("src", this.config.qrCodePath)
        headerDiv.appendChild(image)
        content.appendChild(headerDiv);

        const hr = document.createElement('hr');
        hr.className = "text-hr";
        content.appendChild(hr);

        const div = document.createElement('div');
        content.appendChild(div);

        const h3 = document.createElement("h3");
        h3.className = "text-menu-title"
        h3.innerHTML = "Weekly Menu";
        div.appendChild(h3);
        const ul = document.createElement('ul');
        ul.classList.add('text-ul');
        this.config.fileContent.forEach(element => {
            var li = document.createElement('li');
            li.classList.add('text-li')
            li.innerHTML = element;
            ul.appendChild(li);
        });
        div.appendChild(ul)
        //content.innerHTML = this.config.fileContent;
        return content;
    },

    createTitle: function() {
        const title = document.createElement('p');
        title.classList.add('text-p', 'text-title');
        title.style.color = this.config.titleColor;
        title.style.fontSize = this.config.titleSize;
        title.innerHTML = this.headerTitle;
        return title;
    },

    // socketNotificationReceived: function(notification, payload) {
    //     if (notification === 'DAILY_POWER_ON_VERSE_RECEIVED') {
    //         this.verse = payload;
    //         this.updateDom();
    //     }
    // }


    notificationReceived: function(notification, payload) {
		if (notification == "DOM_OBJECTS_CREATED") {
			this.refresh();
		}
	}

});
