class HexMap
{
    constructor()
    {
        this.svg = SVG.create("svg", {viewBox: "0 0 1000 866", preserveAspectRatio: "none", style: "background-color:blue"});
        this.defs = SVG.create("defs");
        this.map = SVG.create("g");
        this.svg.append(this.defs, this.map);

        this.offsetOn = 0;
        this.jumpNextIndex = 0;
        this.borderColour = "#000000";
        this.defaultHexFill = "#ffffff";
        this.textColor = "#000000";

        this.svg.addEventListener("mousemove", evt => this.mouseMove(evt));
        this.svg.addEventListener("click", evt => this.mouseClick(evt));
        
        this.hexagonSymbol = SVG.create("symbol", {id: "hexagon", viewBox: "0 0 1000 866", preserveAspectRatio: "none"});
        this.hexagonSymbol.append(SVG.create("polygon", {points: "250,0 750,0 1000,433 750,866 250,866 0,433"}));
        this.svg.append(this.hexagonSymbol);

        // this.loadData();

        this.cursor = new DOMPoint(0, 0);
        this.cursorHex = SVG.createUse("hexagon", {id: "cursor", stroke: "#ff0000", fill: "none", "pointer-events": "none"});
    }

    loadFile(fileName)
    {
        let file = localStorage.getItem(fileName);
        console.log(`Size of file=${file.length}`);
        let data = JSON.parse(file);
        console.log(`Size of hexes=${JSON.stringify(data.hexes).length}`);
        console.log(data);

        ["offsetOn", "borderColour", "defaultHexFill", "textColor", "vbWidth", "vbHeight", "width", "height", "background", "cursor"]
            .forEach(v => this[v] = data[v]);

        ["terrainTypes", "edgeTypes", "cornerTypes", "connectorTypes"].forEach(v => this[v] = data[v]);

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
        console.log(this);
    }

    loadData(f)
    {
        this.vbWidth = DATA.mapMetadata.vbWidth;
        this.vbHeight = DATA.mapMetadata.vbHeight;
        this.width = DATA.mapMetadata.width;
        this.height = DATA.mapMetadata.height;
        this.background = DATA.mapMetadata.background;

        this.svg.setAttribute("viewBox", `0 0 ${this.vbWidth} ${this.vbHeight}`);
        this.svg.style.backgroundColor = this.background;

        this.borderColour = DATA.mapMetadata.borderColor;
        this.defaultHexFill = DATA.mapMetadata.defaultHexFill;
        this.textColor = DATA.mapMetadata.textColor;
        this.offsetOn = DATA.mapMetadata.offsetOn;

        // eventually replace this with a recursive function
        DATA.defs.forEach(record =>
        {
            let n = SVG.create(record.type, record.data);

            record.children.forEach(child =>
            {
                n.append(SVG.create(child.type, child.data));
            });

            this.defs.append(n);
        });

        this.terrain = new Map();
        this.terrainTypes = new Set();
        DATA.terrain.forEach(t =>
        {
            this.terrainTypes.add(t.label);
            this.terrain.set(t.label, t.data);
        });
    
        this.edges = new Map();
        this.edgeTypes = new Set();
        DATA.edges.forEach(record =>
        {
            this.edgeTypes.add(record.label);

            for(let e = 0; e < 6; e++) // each edge
            {
                record.data[e].forEach((v, i) =>
                {
                    let id = `${record.label}_e${e}_v${i}`;
                    let n = SVG.create("symbol", {id: id, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});

                    n.innerHTML = v;
        
                    this.svg.append(n);
                    this.edges.set(id, n);
                });
            }
        });

        this.corners = new Map();
        this.cornerTypes = new Set();
        DATA.corners.forEach(record =>
        {
            this.cornerTypes.add(record.label);

            for(let e = 0; e < 6; e++)
            {
                record.data[e].forEach((v, c) =>
                {
                    v.forEach((p, i) =>
                    {
                        let id = `${record.label}_e${e}_c${c}_v${i}`;
                        let n = SVG.create("symbol", {id: id, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});

                        n.innerHTML = p;

                        this.svg.append(n);
                        this.corners.set(id, n);
                    });
                });
            }
        });

        this.connectors = new Map();
        this.connectorTypes = new Set();
        DATA.connectors.forEach(record =>
        {
            this.connectorTypes.add(record.label);

            for(let e = 0; e < 6; e++) // each connector
            {
                record.data[e].forEach((v, i) =>
                {
                    let id = `${record.label}_e${e}_v${i}`;
                    let n = SVG.create("symbol", {id: id, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
                    n.innerHTML = v;
        
                    this.svg.append(n);
                    this.connectors.set(id, n);
                });
            }
        });

        // Metadata begins here!
        this.metadata = new Map();
        DATA.metadata.forEach(record =>
        {
            this.metadata.set(record.label, record);
        });

        // Borders begins here!
        this.borders = new Map();
        DATA.borders.forEach(record =>
        {
            this.borders.set(record.id, record);

            for(let i = 0; i < 6; i++)
            {
                let n = SVG.create("symbol", {id: `${record.id}_${i}`, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
                n.innerHTML = record.innerHtml[i];
    
                this.svg.append(n);
            }
        });

        // Map data begins here!
        this.hexes = [];
        for(let col = 0; col < DATA.mapMetadata.columns; col++)
        {
            let rows = [];

            for(let row = 0; row < DATA.mapMetadata.rows; row++)
                rows.push(new Hex(this, col, row));
            
            this.hexes.push(rows);
        }

        this.jumpNextIndex = DATA.jumps.length;
        this.jumps = new Map(DATA.jumps.map((jump, index) => [index, jump]));

        let mapPanel = document.getElementById("mapPanel");
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

        this.cursorHex.setAttribute("x", target.x.baseVal.value);
        this.cursorHex.setAttribute("y", target.y.baseVal.value);
        this.cursorHex.setAttribute("width", target.width.baseVal.value);
        this.cursorHex.setAttribute("height", target.height.baseVal.value);

        this.map.append(this.cursorHex);
    }

    clearMap()
    {
        while(this.map.firstChild)
            this.map.removeChild(this.map.firstChild);
    }

    initMap()
    {
        this.clearMap();

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

        this.jumps.forEach(j =>
        {
            let coords = [];
            [this.getHexFromId(j.from), this.getHexFromId(j.to)].forEach(hex =>
            {
                let x = +hex.hexTerrain.x.baseVal.value + hex.hexTerrain.width.baseVal.value / 2;
                let y = +hex.hexTerrain.y.baseVal.value + hex.hexTerrain.height.baseVal.value / 2;
                
                coords.push(x, y);
            });

            j.svg = SVG.create("line", {x1 : coords[0], y1 : coords[1], x2 : coords[2], y2 : coords[3], stroke : "#ff0000", "stroke-width" : "6", class : "jumpLine"});
            this.map.append(j.svg);
        });

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

        this.drawCursor();
    }
}