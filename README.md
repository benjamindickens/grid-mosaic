# Installation

```bash
npm install grid-mosaic
```

# Initialization

```bash
new Mosaic(".mosaic", options)
```




# Options

```bash
  this.measure = options?.measure || "px";
```

```bash
this.maxTries = number || default: 60 ;
```
the max amount of tries of calculation an item position

```bash
this.breakpoint = number || 667;
```
query value that applies data when recalculation needs to be done because of device view port;

```bash
otherElements = options?.otherElements || [];
```

```bash
bg = options?.bg === false ? false : true;
```

```bash
noSausagePatterns = options?.noSausagePatterns === false ? false : true;
```

```bash
randomItems = options?.randomItems === false ? false : true;
```
    
```bash
gaps = {
        desktop: options?.gaps?.desktop || 0,
        mobile: options?.gaps?.mobile || 0,
       };
```

```bash
bgStyles = {
        background: options?.bgStyles?.background || null,
        classes: options?.bgStyles?.classes || null
        };
```

```bash
items = options?.items || document.querySelectorAll(".mosaic-item");
```

```bash
bgAnimation = {
            delay: options?.bgAnimation?.delay === false ? false : 8000,
            effects: options?.bgAnimation?.effects || ["_illuminate-0", "_illuminate-1", "_illuminate-2", "_illuminate-3"]
        }
```

```bash
autoplay = {
            delay: options?.autoplay?.delay === false ? false : 3500,
            effect: options?.autoplay?.effect || "default",
            preventDefaultHover: options?.autoplay?.preventDefaultHover || false,
            opacityDefaultOutDuration: options?.autoplay?.opacityDefaultOutDuration || 500,
        };
```
        
```bash
dimension = {
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
```

```bash
maxItems = {
            desktop: options?.maxItems?.desktop || null,
            mobile: options?.maxItems?.mobile || null,
        };
```

```bash
maxSize = {
            desktop: {
                y: options?.maxSize?.desktop?.y || 3,
                x: options?.maxSize?.desktop?.x || 3,
            },
            mobile: {
                y: options?.maxSize?.mobile?.y || 3,
                x: options?.maxSize?.mobile?.x || 3,
            }
        };
```

```bash
this.on = {
            mouseEnter: options?.on?.mouseEnter?.bind(this) || null,
            mouseLeave: options?.on?.mouseLeave?.bind(this) || null,
            beforeInit: options?.on?.beforeInit?.bind(this) || null,
            afterInit: options?.on?.afterInit?.bind(this) || null
        }
```