class HexMap
{
    constructor()
    {
        this.backgroundColour = "#0000ff";
        this.viewBoxWidth = "1000";
        this.viewBoxHeight = "866";
        this.mapWidth = 0; // default
        this.mapHeight = 0; // default
        this.svg = SVG.create("svg", {viewBox: `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`, preserveAspectRatio: "none", style: `background-color:${this.backgroundColour}`});
        this.defs = SVG.create("defs");
        this.map = SVG.create("g");
        this.svg.append(this.defs, this.map);

        this.offsetOn = 0;
        this.jumpNextIndex = 0;
        this.jumpColour = "#ff0000";
        this.jumpWidth = 6;
        this.borderColour = "#000000";
        this.defaultHexFill = "#ffffff";
        this.textColor = "#000000";

        this.svg.addEventListener("mousemove", evt => this.mouseMove(evt));
        this.svg.addEventListener("click", evt => this.mouseClick(evt));
        
        this.hexagonSymbol = SVG.create("symbol", {id: "hexagon", viewBox: "0 0 1000 866", preserveAspectRatio: "none"});
        this.hexagonSymbol.append(SVG.create("polygon", {points: "250,0 750,0 1000,433 750,866 250,866 0,433"}));
        this.svg.append(this.hexagonSymbol);

        this.terrainTypes = new Set();
        this.edgeTypes = new Set();
        this.cornerTypes = new Set();
        this.connectorTypes = new Set();
        this.jumps = new Map();
        this.metadata = new Map();
        this.hexes = [[new Hex(this, 0, 0)]];

        this.displayCursor = true;
        this.cursor = new DOMPoint(0, 0);
        this.cursorHex = SVG.createUse("hexagon", {id: "cursor", stroke: "#ff0000", fill: "none", "pointer-events": "none"});
    }

    loadFile(data)
    {
        console.log("HexMap.loadFile");
        console.log(data);

        ["offsetOn", "borderColour", "defaultHexFill", "textColor", "viewBoxWidth", "viewBoxHeight", "mapWidth", "mapHeight", "backgroundColour", "cursor", "jumpColour", "jumpWidth"]
            .forEach(v => this[v] = data[v] ?? this[v]);

        ["terrainTypes", "edgeTypes", "cornerTypes", "connectorTypes"].forEach(v => this[v] = data[v] ?? this[v]);

        data.defs.forEach(v => this.defs.insertAdjacentHTML("beforeend", v));

        this.terrain = new Map(data.terrain.map((v, k) => [v[0], v[1]]));

        this.edges = new KOMap();
        data.edges.forEach(v => 
        {
            let n = SVG.create("symbol", {id: v[0], viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
            n.innerHTML = v[1];
        
            this.svg.append(n);
            this.edges.set(v[0], n);
        });

        this.corners = new KOMap();
        data.corners.forEach(v => 
        {
            let n = SVG.create("symbol", {id: v[0], viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
            n.innerHTML = v[1];
        
            this.svg.append(n);
            this.corners.set(v[0], n);
        });

        this.connectors = new KOMap();
        data.connectors.forEach(v => 
        {
            let n = SVG.create("symbol", {id: v[0], viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
            n.innerHTML = v[1];
        
            this.svg.append(n);
            this.connectors.set(v[0], n);
        });

        this.metadata = new Map(data.metadata.map((v, k) => [v[0], v[1]]));

        this.borders = new KOMap();
        data.borders.forEach(v => 
        {
            this.borders.set(v[0], v[1]);

            for(let i = 0; i < 6; i++)
            {
                let n = SVG.create("symbol", {id: `${v[0]}_${i}`, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
                n.innerHTML = v[1].innerHtml[i];
    
                this.svg.append(n);
            }
        });

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

        mapPanel.style.fontSize = `${100 / (this.hexes[0].length + (this.hexes.length > 1 ? 0.5 : 0))}px`;
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

        let vb = this.svg.getAttribute("viewBox").split(/\s+|,/);
        let w = +vb[2] / (3 * this.hexes.length + 1);
        let h = +vb[3] / (this.hexes[0].length + (this.hexes.length > 1 ? 0.5 : 0));
        let width = 4 * w;

        for(let col = 0; col < this.hexes.length; col++)
        {
            let x = 3 * w * col;
            let offset = this.hexes.length > 1 ? (col % 2 === this.offsetOn ? 0 : h / 2) : 0;

            for(let row = 0; row < this.hexes[col].length; row++)
            {
                let y = h * row + offset;

                this.map.append(this.hexes[col][row].svg);
                this.hexes[col][row].drawHex(x, y, width, h);
            }
        }

        this.drawJumps();
        this.drawCursor();
    }

    drawMap()
    {
        let vb = this.svg.getAttribute("viewBox").split(/\s+|,/);
        let w = +vb[2] / (3 * this.hexes.length + 1);
        let h = +vb[3] / (this.hexes[0].length + (this.hexes.length > 1 ? 0.5 : 0));
        let width = 4 * w;

        console.log(`drawMap w=${w}, h=${h}`);

        for(let col = 0; col < this.hexes.length; col++)
        {
            let x = 3 * w * col;
            let offset = this.hexes.length > 1 ? (col % 2 === this.offsetOn ? 0 : h / 2) : 0;

            for(let row = 0; row < this.hexes[col].length; row++)
            {
                let y = h * row + offset;

                this.hexes[col][row].drawHex(x, y, width, h)
            }
        }

        this.drawJumps();
        this.drawCursor();
    }

    drawJumps()
    {
        console.log("drawing jumps...");

        this.jumps.forEach(j =>
        {
            let coords = [];
            [this.getHexFromId(j.from), this.getHexFromId(j.to)].forEach(hex =>
            {
                let x = +hex.hexTerrain.x.baseVal.value + hex.hexTerrain.width.baseVal.value / 2;
                let y = +hex.hexTerrain.y.baseVal.value + hex.hexTerrain.height.baseVal.value / 2;
                    
                coords.push(x, y);
            });
    
            j.svg = SVG.create("line", {x1 : coords[0], y1 : coords[1], x2 : coords[2], y2 : coords[3], stroke : this.jumpColour, "stroke-width" : this.jumpWidth, class : "jumpLine"});
            this.map.append(j.svg);
        });
    }
}