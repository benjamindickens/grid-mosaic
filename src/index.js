"use strict";

import "./index.scss";

export default class {
    constructor(container, options = null) {
        this.container = (typeof container === "string") ? document.querySelector(container) : container;
        this.maxTries = options?.maxTries || 60;
        this.breakpoint = options?.breakpoint || 667;
        this.otherElements = options?.otherElements || [];
        this.noSausagePatterns = options?.noSausagePatterns === false ? false : true;
        this.bg = options?.bg === false ? false : true;
        this.randomItems = options?.randomItems === false ? false : true;
        this.gaps = {
            desktop: options?.gaps?.desktop || 0,
            mobile: options?.gaps?.mobile || 0,
        };
        this.bgStyles = {
            background: options?.bgStyles?.background || null,
            classes: options?.bgStyles?.classes || null
        };
        this.items = options?.items || this.container.querySelectorAll(".mosaic-item");
        this.nextToShow = (this.items.length - 1 > 0) ? this.items.length - 1 : 0;
        this.bgAnimation = {
            delay: options?.bgAnimation?.delay === false ? false : 8000,
            effects: options?.bgAnimation?.effects || ["_illuminate-0", "_illuminate-1", "_illuminate-2", "_illuminate-3"]
        }
        this.currentGrid = [];
        this.measure = options?.measure || "px";
        this.autoplay = {
            delay: options?.autoplay?.delay === false ? false : 3000,
            effect: options?.autoplay?.effect || "default",
            preventDefaultHover: options?.autoplay?.preventDefaultHover || false,
            opacityDefaultOutDuration: options?.autoplay?.opacityDefaultOutDuration || 500,
        };
        this.dimension = {
            desktop: {
                cols: options?.dimension?.desktop?.cols || 5,
                rows: options?.dimension?.desktop?.rows || 5,
                size: options?.dimension?.desktop?.size || 90
            },
            mobile: {
                cols: options?.dimension?.mobile?.cols || 3,
                rows: options?.dimension?.mobile?.rows || 6,
                size: options?.dimension?.mobile?.size || 90
            },
        };
        this.maxItems = {
            desktop: options?.maxItems?.desktop || null,
            mobile: options?.maxItems?.mobile || null,
        };
        this.maxSize = {
            desktop: {
                y: options?.maxSize?.desktop?.y || 3,
                x: options?.maxSize?.desktop?.x || 3,
            },
            mobile: {
                y: options?.maxSize?.mobile?.y || 3,
                x: options?.maxSize?.mobile?.x || 3,
            }
        };
        this.on = {
            mouseEnter: options?.on?.mouseEnter?.bind(this) || null,
            mouseLeave: options?.on?.mouseLeave?.bind(this) || null,
            beforeInit: options?.on?.beforeInit?.bind(this) || null,
            afterInit: options?.on?.afterInit?.bind(this) || null
        }

        this.start(this.detectDevice())
    };

    detectDevice = () => {
        return (window.innerWidth < this.breakpoint) ? "mobile" : "desktop";
    };

    randomNum = (max, min = 0) => {
        return Math.floor(Math.random() * max) + min
    };

    shuffleNodes = (nodes) => {
        const array = [...nodes].slice();
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    setBgItems = (device) => {
        let row = 1,
            column = 1,
            i = 0;
        while (i < this.bg.length) {
            if (column > this.dimension[device].cols) {
                row++;
                column = 1;
            }
            this.bg[i].style.gridArea = `${row} / ${column} / span 1 / span 1`;
            column++;
            i++;
        }
    };

    updateMaxItems = () => {
        for (const key in this.maxItems) {
            if (this.maxItems[key] >= this.items.length) {
                this.maxItems[key] = this.items.length;
            } else if (this.maxItems[key] === null) {
                this.maxItems[key] = this.items.length;
            }
        }
    };

    updateCurrentDeviceStatus = (device) => {
        if (device === "desktop") {
            this.container.classList.remove("_mosaic-mobile")
        } else {
            this.container.classList.add("_mosaic-mobile")
        }
    };

    setGrid = (device, init = false) => {
        this.updateCurrentDeviceStatus(device);
        !init && this.resetImgPosition();
        this.container.style.gridTemplate = `repeat(${this.dimension[device].rows}, ${this.dimension[device].size + this.measure}) / repeat(${this.dimension[device].cols}, minmax(${this.dimension[device].size + this.measure}, 1fr))`;
        if (this.gaps[device] || this.gaps[device] === 0) this.container.style.gap = this.gaps[device] + this.measure;
        this.setBgItems(device);
    };

    createBgItems = () => {
        if (!this.bg) return;

        if (this.bgStyles.background) document.documentElement.style.setProperty('--mosaic-default-bg-color', this.bgStyles.background);

        const maxCells = this.dimension.desktop.cols * this.dimension.desktop.rows;
        const mobCells = this.dimension.mobile.cols * this.dimension.mobile.rows;
        let html = [];
        do {
            const isHidden = html.length >= mobCells ? "_hidden" : "";
            html.push(this.createBg(isHidden));
        } while (html.length < maxCells)

        this.container.insertAdjacentHTML("afterbegin", html.join(""))

        this.bg = this.container.querySelectorAll(".mosaic-bg");

    };

    createBg = (hidden) => {
        const randomClass = this.bgStyles.classes ? this.bgStyles.classes[this.randomNum(this.bgStyles.classes.length, 0)] : "";
        return `<div class="js-bg mosaic-bg ${randomClass} ${hidden}"></div>`
    };

    shuffleItems = (items) => {
        if (this.randomItems) this.items = this.shuffleNodes(items);
        else this.items = [...this.items];
    };

    initBgAnimation = () => {
        if (!this.bgAnimation.delay || !this.bg) return;

        this.setBgAnimation();
        setInterval(() => {
            this.setBgAnimation();
        }, this.bgAnimation.delay)
    };

    setBgAnimation = () => {
        this.bg.forEach((item, index) => {
            const randomIndex = this.randomNum(12, 5);
            if (index % randomIndex === 0) {
                const randomAnimation = this.bgAnimation.effects[this.randomNum(this.bgAnimation.effects.length, 0)];
                item.classList.add(randomAnimation);
            } else {
                item.classList.remove(...this.bgAnimation.effects);
            }
        })
    };

    placeInGrid = (el, pattern) => {
        const {yStart, xStart, yEnd, xEnd} = pattern;
        el.style.gridArea = `${yStart} / ${xStart} / span ${yEnd}/ span ${xEnd}`
    };

    getCoordinates = (el, pattern, device, forOthers = false) => {

        const position = {
            yStart: forOthers ? pattern[0] : this.randomNum(this.dimension[device].rows - pattern.y, 1),
            xStart: forOthers ? pattern[1] : this.randomNum(this.dimension[device].cols - pattern.x, 1),
            yEnd: forOthers ? pattern[2] : pattern.y,
            xEnd: forOthers ? pattern[3] : pattern.x,
        }
        const coordinates = [];
        let rows = (position.yStart + position.yEnd) - position.yStart;
        let cols = (position.xStart + position.xEnd) - position.xStart;

        do {
            let row = rows;
            let col = cols;

            do {
                coordinates.push([row + position.yStart, col + position.xStart]);
                col--;
            } while (col)

            rows--;
        } while (rows)

        return {el, position, coordinates};

    };

    checkOverlap = (current) => {
        return this.currentGrid.some(gridItem => {
            return gridItem.coordinates.some(gridCoordinate => {
                return current.coordinates.some((currentCoordinate) => {
                    return currentCoordinate[0] === gridCoordinate[0] && currentCoordinate[1] === gridCoordinate[1];
                })
            })
        })
    };

    resetImgPosition = () => {
        this.currentGrid.forEach((item) => {
            item.el.style.gridArea = "none";
            item.el.classList.add("_hidden");
        });
        this.currentGrid = [];
    };

    setOthersElements = (device) => {
        this.otherElements.forEach((el) => {
            if (el.coordinates[device]) {
                const current = this.getCoordinates(el.el, el.coordinates[device], device, true);
                this.placeInGrid(current.el, current.position);
                this.currentGrid.push(current);
            }
        })
    };

    updateSausagePattern = (pattern) => {
        if (pattern.x === 1 && pattern.y > 2) {
            pattern.y = this.randomNum(2, 1)
        } else if (pattern.y === 1 && pattern.x > 2) {
            pattern.x = this.randomNum(2, 1)
        }
    };

    setPosition = (el, device) => {
        let remainingTries = this.maxTries;

        const currentPattern = {
            y: this.randomNum(this.maxSize[device].y, 1),
            x: this.randomNum(this.maxSize[device].x, 1)
        };

        if (this.noSausagePatterns) this.updateSausagePattern(currentPattern);

        let current = null;
        let overlap = null;

        const validatePosition = () => {
            current = this.getCoordinates(el, currentPattern, device);
            return this.checkOverlap(current);
        }

        do {
            overlap = validatePosition();
            if (remainingTries < this.maxTries - 40) {
                currentPattern.y = 2;
                currentPattern.x = 2;
            } else if (remainingTries < this.maxTries - 20) {
                currentPattern.y = 1;
                currentPattern.x = 1;
            }
            remainingTries--;
        } while (overlap && remainingTries)

        this.placeInGrid(current.el, current.position);

        this.currentGrid.push(current);

    };

    debounceDeviceChange = (delay) => {
        let last = this.detectDevice();
        let timeline = false;

        return () => {
            if (timeline) return;
            timeline = true;

            setTimeout(() => {
                const current = this.detectDevice();

                if (last === current) {
                    timeline = false;
                    return;
                }

                this.reCalcGrid(current);
                timeline = false;
                last = current;

            }, delay)
        }
    };

    updatePosition = (device) => {
        for (let i = 0; i < this.items.length; i++) {
            if (i < this.maxItems[device]) {
                this.setPosition(this.items[i], device);
                this.items[i].classList.remove("_hidden");
            } else {
                if (i === this.maxItems[device]) this.nextToShow = i - 1;
                this.items[i].classList.add("_hidden");
            }
        }
    };

    reCalcGrid = (device) => {
        this.setGrid(device)
        this.setOthersElements(device);
        this.updatePosition(device);
    };

    setMouseListeners = () => {
        this.items.forEach((img) => {
            img.addEventListener("mouseenter", (e) => {
                if (!e.currentTarget.classList.contains("js-hovered")) {
                    e.currentTarget.classList.add("js-hovered");
                    this.on.mouseEnter && this.on.mouseEnter(e);
                }
            });

            img.addEventListener("mouseleave", (e) => {
                if (e.currentTarget.classList.contains("js-hovered")) {
                    e.currentTarget.classList.remove("js-hovered");
                    this.on.mouseLeave && this.on.mouseLeave(e);
                }
            });
        })
    };

    switchItems = (device, hovered, removingEl) => {
        const isEqual = this.items.length === this.maxItems[device];
        this.items.splice(hovered ? 1 : 0, 1);
        const indexInGrid = this.currentGrid.findIndex((item) => item.el === removingEl);
        indexInGrid && this.currentGrid.splice(indexInGrid, 1);
        removingEl.classList.remove("_hidden-animation");
        removingEl.classList.add("_hidden");
        if (isEqual) {
            this.setPosition(removingEl, device);
            removingEl.classList.remove("_hidden");
        } else {
            const nextEl = this.items.length === 0 ? removingEl : this.items[this.nextToShow];
            this.setPosition(nextEl, device);
            nextEl.classList.remove("_hidden");
        }

        this.items.push(removingEl);
    };


    defaultAutoPlay = () => {
        const prevent = this.autoplay.preventDefaultHover;
        const device = this.detectDevice();
        const isHovered = prevent ? false : this.items[0].classList.contains("js-hovered");
        const toRemove = isHovered ? this.items[1] : this.items[0];

        if (!toRemove || isHovered && this.maxItems[device] < 2) return;

        toRemove.classList.add("_hidden-animation");

        setTimeout(() => {
            toRemove.classList.remove("_hidden-animation");
            if (toRemove.classList.contains("js-hovered") && !prevent) return;
            this.switchItems(device, isHovered, toRemove);
        }, this.autoplay.opacityDefaultOutDuration)

    };

    initAutoplay = () => {
        if (!this.autoplay.delay || !this.items) return;
        if (this.autoplay.effect === "default") this.autoplay.effect = this.defaultAutoPlay;

        setInterval(() => {
            this.autoplay.effect();
        }, this.autoplay.delay)
    };

    showInMosaic = () => {
        this.container.classList.add("mosaic-init")
    };

    beforeInit = () => {
        this.on.beforeInit && this.on.beforeInit();
    };

    afterInit = () => {
        this.on.afterInit && this.on.afterInit();
        this.showInMosaic();
    };

    init = (device) => {
        if (this.items.length === 0) return;
        this.updateMaxItems();
        this.setOthersElements(device);
        this.createBgItems();
        this.initBgAnimation();
        this.setGrid(device, true);
        this.shuffleItems(this.items);
        this.updatePosition(device)
        this.initAutoplay()
        this.setMouseListeners();
        window.addEventListener("resize", this.debounceDeviceChange(500));
    };

    start = (device) => {
        this.beforeInit()
        this.init(device)
        this.afterInit()
    };


};
