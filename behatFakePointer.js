class BehatFakePointer
{
    constructor (pointerLayerId)
    {
        this.pointerLayerId = pointerLayerId;
        this.pointerLayer = null;
        // Start the pointer in the centre of the viewport.
        this.pointerX = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 2;
        this.pointerY = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / 2;
        self = this;
    }

    /**
     * Create the fake pointer layer and display it.
     */
    pointerShow()
    {
        if (this.pointerLayer === null) {
            this.pointerLayer = document.createElement('div');
            let pointerLayerImage = document.createElement('div');

            // Add attributes and styling to the pointer layer.
            this.pointerLayer.setAttribute('id', this.pointerLayerId);
            this.pointerLayer.style.left = this.pointerX + 'px';
            this.pointerLayer.style.top = this.pointerY + 'px';

            // Add the pointer layer and image to the DOM.
            let body = document.getElementsByTagName('body');
            body[0].append(this.pointerLayer);
            this.pointerLayer.append(pointerLayerImage);
            this.pointerLayer.style.opacity = 0;
            this.pointerLayer.style.display = 'block';

            this.pointerLayer.animate({
                opacity: 1
            }, {
                fill: "forwards",
                duration: 500
            });
        }
    };

    /**
     * Move the fake pointer to the element identified by the xPath.
     *
     * @param xPath
     */
    pointerMove(xPath)
    {
        this.pointerShow();

        // Identify the target element and get it's dimensions.
        let element = this.getElementByXpath(xPath);
        let domRect = element.getBoundingClientRect();
        // Calculate the centre point of the target element for the new position.
        this.pointerX = domRect.x + ((domRect.right - domRect.left) / 2) - (this.pointerLayer.offsetWidth / 3);
        this.pointerY = domRect.y + ((domRect.bottom - domRect.top) / 2) + (this.pointerLayer.offsetHeight / 4) + window.pageYOffset;

        // Move the fake pointer to the center of the element.
        this.pointerLayer.animate({
            left: this.pointerX + 'px',
            top: this.pointerY + 'px'
        }, {
            fill: "forwards",
            duration: 500,
            endDelay: 500
        }).onfinish = (e) => {
            element.hover();
        };
    };

    /**
     * Animate the pointer moving it up and down in a single motion.
     *
     * @param iterations The number of times to move up and down.
     * @param travel The number of verical pixels to travel.
     * @param duration The milliseconds to complete each setp of teh animation.
     */
    pointerUpAndDown(iterations, travel, duration)
    {
        this.pointerShow();

        this.pointerLayer.animate({
            top: this.pointerY - travel + 'px'
        }, {
            fill: "forwards",
            direction: "alternate",
            iterations: iterations * 2,
            duration: duration,
        });
    };

    /**
     * Animate the fake pointer to suggest an element had been clicked.
     */
    pointerClick()
    {
        this.pointerUpAndDown(1, 5, 50)
    };

    /**
     * Animate the pointer to highlight the element it's positioned over.
     */
    pointerHighlight()
    {
        this.pointerUpAndDown(2, 10, 250)
    };

    /**
     * Activate the focus on an element identified by the given xPath (Behat doesn't do this).
     *
     * @param xPath
     */
    elementFocus(xPath)
    {
        let element = this.getElementByXpath(xPath);
        // Focus on the related input if it's a label.
        if (element.getAttribute('for'))
            element = document.getElementById(element.getAttribute('for'));

        element.focus();
    };

    /**
     * Scroll to the element identified by the given xPAth.
     *
     * @param xPath
     */
    elementScrollTo(xPath)
    {
        let element = this.getElementByXpath(xPath);
        element.scrollIntoView({behavior: 'smooth', block: 'center' });
    }

    /**
     * Get an element from the DOm using an xpath reference.
     *
     * @param xpath
     * @returns {Node}
     */
    getElementByXpath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    };

    /**
     * Create a pause in execution.
     *
     * @param milliseconds
     */
    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
            console.log('.');
        } while (currentDate - date < milliseconds);
    };
}

// Instantiate the class so Behat has access to the functions.
let behatFakePointer = new BehatFakePointer('fakePointerLayer');
