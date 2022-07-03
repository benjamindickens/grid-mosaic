# Install

```bash
npm install grid-mosaic
```

# Init

```bash
    new Mosaic(container, options)
```


# Options

this.container =container;
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
        this.items = options?.items || document.querySelectorAll(".mosaic-item");
        this.nextToShow = (this.items.length - 1 > 0) ? this.items.length - 1 : 0;
        this.bgAnimation = {
            delay: options?.bgAnimation?.delay === false ? false : 8000,
            effects: options?.bgAnimation?.effects || ["_illuminate-0", "_illuminate-1", "_illuminate-2", "_illuminate-3"]
        }
        this.currentGrid = [];
        this.measure = options?.measure || "px";
        this.autoplay = {
            delay: options?.autoplay?.delay === false ? false : 3500,
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