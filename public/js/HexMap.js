class HexMap
{
    constructor()
    {
        this.backgroundColour = "#0000ff";
        this.viewBoxWidth = "1000";
        this.viewBoxHeight = "866";
        this.mapWidth = 0; // default
        this.mapHeight = 0; // default
        this.vpMin = 1; // default
        this.vpMax = 1; // default
        this.svg = SVG.create("svg", {tabindex: "0", viewBox: `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`, preserveAspectRatio: "none", style: `background-color:${this.backgroundColour}`});
        this.defs = SVG.create("defs");
        this.map = SVG.create("g");
        this.svg.append(this.defs, this.map);

        this.offsetOn = 0;
        this.jumpNextIndex = 0;
        this.borderColour = "#000000";
        this.defaultHexFill = "#ffffff";
        this.textColour = "#000000";

        this.svg.addEventListener("mousemove", evt => this.mouseMove(evt));
        this.svg.addEventListener("click", evt => this.mouseClick(evt));
        this.svg.addEventListener("wheel", evt => this.mouseWheel(evt));

        this.boundKeypress = this.handleKeyPress.bind(this);

        this.svg.addEventListener("mouseenter", () => document.addEventListener("keydown", this.boundKeypress));
        this.svg.addEventListener("mouseleave", () => document.removeEventListener("keydown", this.boundKeypress));
        
        this.hexagonSymbol = SVG.create("symbol", {id: "hexagon", viewBox: "0 0 1000 866", preserveAspectRatio: "none"});
        this.hexagonSymbol.append(SVG.create("polygon", {points: "250,0 750,0 1000,433 750,866 250,866 0,433"}));
        this.svg.append(this.hexagonSymbol);

        this.terrainTypes = new Set();
        this.terrain = new Map();
        this.edgeTypes = new Set();
        this.edges = new KOMap();
        this.cornerTypes = new Set();
        this.connectorTypes = new Set();
        this.connectors = new KOMap();
        this.jumps = new Map();
        this.metadata = new Map();
        this.hexes = [[new Hex(this, 0, 0)]];

        this.displayCursor = true;
        this.cursor = new DOMPoint(0, 0);
        this.vpTopLeft = new DOMPoint(0, 0);
        this.vpWidthHeight = new DOMPoint(4, 4);
        this.cursorHex = SVG.createUse("hexagon", {id: "cursor", stroke: "#ff0000", fill: "none", "pointer-events": "none"});
    }

    loadFile(data)
    {
        console.log("HexMap.loadFile");
        console.log(data);

        ["offsetOn", "borderColour", "defaultHexFill", 
         "textColour", "viewBoxWidth", "viewBoxHeight", 
         "mapWidth", "mapHeight", "vpMin", "vpMax", 
         "backgroundColour", "cursor", "vpTopLeft", 
         "vpWidthHeight"]
            .forEach(v => this[v] = data[v] ?? this[v]);

        ["terrainTypes", "edgeTypes", "cornerTypes", "connectorTypes"].forEach(v => this[v] = data[v] ?? this[v]);

        data.defs.forEach(v => this.defs.insertAdjacentHTML("beforeend", v));

        this.terrain = new Map(data.terrain.map((v, k) => [v[0], v[1]]));

        this.edges = new KOMap();
        data.edges.forEach(v => 
        {
            let key = JSON.parse(v[0]);
            let n = SVG.create("symbol", {id: `${key.type}_e${key.edgeIndex}_v${key.variant}`, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
            n.innerHTML = v[1];
        
            this.defs.append(n);
            this.edges.setKO(key, n);
        });

        this.corners = new KOMap();
        data.corners.forEach(v => 
        {
            let key = JSON.parse(v[0]);
            let n = SVG.create("symbol", {id: `${key.type}_e${key.edgeIndex}_c${key.cornerType}_v${key.variant}`, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
            n.innerHTML = v[1];
        
            this.defs.append(n);
            this.corners.setKO(key, n);
        });

        this.connectors = new KOMap();
        data.connectors.forEach(v => 
        {
            let key = JSON.parse(v[0]);
            let n = SVG.create("symbol", {id: `${key.type}_e${key.edgeIndex}_v${key.variant}`, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
            n.innerHTML = v[1];
        
            this.defs.append(n);
            this.connectors.setKO(key, n);
        });

        this.metadata = new Map();
        data.metadata.forEach(v =>
        {
            this.metadata.set(v[0], v[1]);

            v[1].renderData.forEach(rd => 
            {
                let n = SVG.create("symbol", {id: rd[0], viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
                n.innerHTML = rd[1].svg;
                rd[1].node = n;
    
                this.defs.append(n);
            });
        });
        console.log("metadata");
        console.log(this.metadata);

        this.jumps = new Map();
        data.jumps.forEach(v => this.jumps.set(this.jumpNextIndex++, v));

        this.hexes = [];
        data.hexes.forEach(column => 
        {
            let columnHexes = [];
            column.forEach(rowHex => 
            {
                let hex = new Hex(this, rowHex.col, rowHex.row);

                hex.setTerrain(rowHex.terrain);
                
                if(rowHex.edges)
                    rowHex.edges.forEach(v => hex.addEdge(JSON.parse(v)));

                if(rowHex.corners)
                    rowHex.corners.forEach(v => hex.addCorner(JSON.parse(v)));

                if(rowHex.connectors)
                    rowHex.connectors.forEach(v => hex.addConnector(JSON.parse(v)));

                if(rowHex.borders)
                    rowHex.borders.forEach(v => hex.addBorder({id: v}));

                if(rowHex.metadata)
                    rowHex.metadata.forEach(v => hex.addMetadata({key: v[0], value: v[1]}));

                columnHexes.push(hex);
            });

            this.hexes.push(columnHexes);
        });

        console.log("HexMap loadFile(data) complete...");
    }

    mouseMove(evt)
    {
        if(!evt.target.id.includes(","))
            return;
    }

    mouseClick(evt)
    {
        if(!evt.target.id.includes(","))
            return;

        let coords = evt.target.id.split(",");
        this.cursor.x = coords[0];
        this.cursor.y = coords[1];

        this.drawCursor();
    }

    mouseWheel(evt)
    {
        this.resizeViewPort(evt.deltaY);
        this.initMap();
    }

    handleKeyPress(evt)
	{
        // so there is a wee issue with arrow key events working on the SVG and on any focused element that accepts key events
        // this solves it but it forces the svg element to be focusable and have focus - typically by clicking on it which also sets the curosr...
        // console.log(document.activeElement);
        if(document.activeElement !== this.svg)
            return;

        switch(evt.key)
        {
            case "ArrowUp":
                this.vpTopLeft.y =  Math.max(0, this.vpTopLeft.y - 1);
                break;

            case "ArrowDown":
                this.vpTopLeft.y =  Math.min(this.hexes[0].length - 1, this.vpTopLeft.y + 1);
                break;

            case "ArrowLeft":
                this.vpTopLeft.x =  Math.max(0, this.vpTopLeft.x - 1);
                break;

            case "ArrowRight":
                this.vpTopLeft.x =  Math.min(this.hexes.length - 1, this.vpTopLeft.x + 1);
                break;

            case "+":
                this.resizeViewPort(-1); // counterintuitive, "+" means zoom in, show more detail which means have fewer cols
                break;

            case "-":
                this.resizeViewPort(+1); // counterintuitive, "-" means zoom out, show less detail which means have more cols
                break;

            default:
                return;
        }

        this.initMap();
	}

    resizeViewPort(zoom)
    {
        if(zoom > 0) // zoom out i.e. make view port have more columns
        {
            this.vpWidthHeight.x = Math.min(this.vpMax, this.vpWidthHeight.x + 1);
            this.vpWidthHeight.y = Math.min(this.vpMax, this.vpWidthHeight.y + 1);
        }
        else // zoom in i.e. make view port have fewer columns
        {
            this.vpWidthHeight.x = Math.max(this.vpMin, this.vpWidthHeight.x - 1);
            this.vpWidthHeight.y = Math.max(this.vpMin, this.vpWidthHeight.y - 1);
        }
    }

    getHexFromId(id)
    {
        let hex = null;

        if(id.includes(","))
        {
            let pt = id.split(",");

            if(pt[0] >= 0 && pt[0] < this.hexes.length && pt[1] >= 0 && pt[1] < this.hexes[0].length)
                hex = this.hexes[pt[0]][pt[1]];
        }

        return hex;
    }

    drawCursor()
    {
        let target = this.hexes[this.cursor.x][this.cursor.y].hexTerrain;

        if(this.map.contains(this.cursorHex))
            this.map.removeChild(this.cursorHex); // the cursor has to be added last to be the topmost element or it won't appear.

        if(this.cursor.x < this.vpTopLeft.x || this.cursor.x > this.vpTopLeft.x + this.vpWidthHeight.x)
            return;

        if(this.cursor.y < this.vpTopLeft.y || this.cursor.y > this.vpTopLeft.x + this.vpWidthHeight.y)
            return;

        if(this.displayCursor)
        {
            this.cursorHex.setAttribute("x", target.x.baseVal.value);
            this.cursorHex.setAttribute("y", target.y.baseVal.value);
            this.cursorHex.setAttribute("width", target.width.baseVal.value);
            this.cursorHex.setAttribute("height", target.height.baseVal.value);

            this.map.append(this.cursorHex);
        }
    }

    clearMap()
    {
        while(this.map.firstChild)
            this.map.removeChild(this.map.firstChild);
    }

    initMap()
    {
        this.clearMap();

        this.svg.style = `background-color: ${this.backgroundColour}; cursor: default;`;

        let startCol = this.vpTopLeft.x > 0 ? this.vpTopLeft.x - 1 : this.vpTopLeft.x; 
        let startRow = this.vpTopLeft.y > 0 ? this.vpTopLeft.y - 1 : this.vpTopLeft.y; 
        let colLimit = Math.min(this.hexes.length, this.vpTopLeft.x + this.vpWidthHeight.x);
        let rowLimit = Math.min(this.hexes[0].length, this.vpTopLeft.y + this.vpWidthHeight.y);
        let w = +this.viewBoxWidth / (3 * this.vpWidthHeight.x + 1);
        let h = +this.viewBoxHeight / (this.vpWidthHeight.y + (this.hexes.length > 1 ? 0.5 : 0));
        let width = 4 * w;

        colLimit += colLimit < this.hexes.length ? 1 : 0;
        rowLimit += rowLimit < this.hexes[0].length ? 1 : 0;

        let colLen = this.hexes ? `${this.hexes.length}`.length : 1;
        let rowLen = this?.hexes?.[0] ? `${this.hexes[0].length}`.length : 1;
        let labelOffset = 500 - (31 * (colLen + rowLen) - 6) / 2;

        for(let col = startCol; col < colLimit; col++)
        {
            let x = 3 * w * (col - this.vpTopLeft.x);
            let offset = this.hexes.length > 1 ? (col % 2 === this.offsetOn ? 0 : h / 2) : 0;

            for(let row = startRow; row < rowLimit; row++)
            {
                this.hexes[col][row].buildIdPath(colLen, rowLen, labelOffset);

                let y = h * (row - this.vpTopLeft.y) + offset;

                this.map.append(this.hexes[col][row].svg);
                this.hexes[col][row].drawHex(x, y, width, h);
            }
        }

        this.drawJumps();
        this.drawCursor();
    }

    // drawMap() // GlobalAttributePanal around line 176 calls this!
    // {
    //     console.log("drawMap()...?");
    //     let vb = this.svg.getAttribute("viewBox").split(/\s+|,/);
    //     let w = +vb[2] / (3 * this.hexes.length + 1);
    //     let h = +vb[3] / (this.hexes[0].length + (this.hexes.length > 1 ? 0.5 : 0));
    //     let width = 4 * w;

    //     console.log(`drawMap w=${w}, h=${h}`);

    //     for(let col = 0; col < this.hexes.length; col++)
    //     {
    //         let x = 3 * w * col;
    //         let offset = this.hexes.length > 1 ? (col % 2 === this.offsetOn ? 0 : h / 2) : 0;

    //         for(let row = 0; row < this.hexes[col].length; row++)
    //         {
    //             let y = h * row + offset;

    //             this.hexes[col][row].drawHex(x, y, width, h)
    //         }
    //     }

    //     this.drawJumps();
    //     this.drawCursor();
    // }

    drawJumps()
    {
        let tlHex = this.getHexFromId(`${this.vpTopLeft.x},${this.vpTopLeft.y}`);
        let baseWidth = +tlHex.hexTerrain.width.baseVal.value;
        let baseHeight = +tlHex.hexTerrain.height.baseVal.value;

        this.jumps.forEach(j =>
        {
            let coords = [];
            [this.getHexFromId(j.from), this.getHexFromId(j.to)].forEach(hex =>
            {
                let x = (hex.col - this.vpTopLeft.x) * (baseWidth * 0.75) + baseWidth / 2;
                let y = (hex.row - this.vpTopLeft.y + 0.5) * baseHeight + (hex.col % 2 === this.offsetOn ? 0 : baseHeight / 2);
                    
                coords.push(x, y);
            });
    
            j.svg = SVG.create("line", {x1 : coords[0], y1 : coords[1], x2 : coords[2], y2 : coords[3], stroke : j.colour, "stroke-width" : j.width, class : "jumpLine"});
            this.map.append(j.svg);
        });
    }
}