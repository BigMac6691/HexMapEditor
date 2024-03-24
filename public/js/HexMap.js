class HexMap
{
    constructor()
    {
        this.svg = SVG.create("svg", {viewBox: "0 0 1000 866", preserveAspectRatio: "none", style: "background-color:blue"});
        this.defs = SVG.create("defs");
        this.map = SVG.create("g");
        this.svg.append(this.defs, this.map);

        this.offsetOn = 0;
        this.borderColour = "#000000";
        this.defaultHexFill = "#ffffff";

        this.svg.addEventListener("mousemove", evt => this.mouseMove(evt));
        this.svg.addEventListener("click", evt => this.mouseClick(evt));

        
        this.hexagonSymbol = SVG.create("symbol", {id: "hexagon", viewBox: "0 0 1000 866", preserveAspectRatio: "none"});
        this.hexagonSymbol.append(SVG.create("polygon", {points: "250,0 750,0 1000,433 750,866 250,866 0,433"}));
        this.svg.append(this.hexagonSymbol);

        this.loadData();

        this.labels = null;

        this.hexes = [[new Hex(this, 0, 0)]];
        this.cursor = new DOMPoint(0, 0);
        this.cursorHex = SVG.createUse("hexagon", {id: "cursor", stroke: "#ff0000", fill: "none", style: "animation: cursor 3s infinite;"});
    }

    loadData(f)
    {
        // eventually replace this with a recursive function
        DATA.defs.forEach(def =>
        {
            let n = SVG.create(def.type, def.data);

            def.children.forEach(child =>
            {
                n.append(SVG.create(child.type, child.data));
            });

            this.defs.append(n);
        });

        this.terrain = new Map();
        DATA.terrain.forEach(t =>
        {
            this.terrain.set(t.label, t);
        });
        console.log(this.terrain);
    
        this.edges = new Map();
        DATA.edges.forEach(edge =>
        {
            this.edges.set(edge.label, []);
        
            for(let e = 0; e < 6; e++)
            {
                let vArray = [];
        
                edge.data[e].forEach(v =>
                {
                    let n = SVG.create("symbol", {id: v.id, viewBox: "0 0 1000 866", preserveAspectRatio: "none"});
                    n.append(SVG.create("path", v.svg));
        
                    this.svg.append(n);
                    vArray.push({id: v.id, svg: n});
                });
        
                this.edges.get(edge.label).push(vArray);
            }
        });
        console.log(this.edges);
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

            if(pt[0] < this.hexes.length && pt[1] < this.hexes[0].length)
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

    getMap()
    {
        return this.map;
    }

    getSVG()
    {
        return this.svg;
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

                this.hexes[col][row].addToMap(this.map).drawHex(x, y, width, h)
            }
        }

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