class Hex
{
    static SVG_DIGITS = 
    [
        " m 6 0 l 25 0 l 0 -50 l -25 0 l 0 50 m 25 0", // 0
        " m 6 -40 l 12.5 -10 l 0 50 m -12.5 0 l 25 0", // 1
        " m 6 -50 l 25 0 l 0 25 l -25 0 l 0 25 l 25 0", // 2
        " m 6 -50 l 25 0 l 0 25 l -25 0 m 25 0 l 0 25 l -25 0 m 25 0", // 3
        " m 31 -25 l -25 0 l 15 -25 l 0 50 m 10 0", // 4
        " m 31 -50 l -25 0 l 0 25 l 25 0 l 0 25 l -25 0 m 25 0", // 5
        " m 31 -50 l -25 0 l 0 25 l 25 0 l 0 25 l -25 0 l 0 -25 m 25 25", // 6
        " m 6 -50 l 25 0 l -12.5 50 m 12.5 0",  // 7
        " m 6 0 l 25 0 l 0 -50 l -25 0 l 0 50 m 0 -25 l 25 0 m 0 25", // 8
        " m 6 0 l 25 0 l 0 -50 l -25 0 l 0 25 l 25 0 m 0 25" // 9
    ];

    // NOTE a lot of logic here supports the editor - we don't want that!
    // When adding something here it is coming from the load map process
    // therefore it should just be straight up assignments not checking etc.
    constructor(m, col, row)
    {
        this.hexMap = m;
        this.col = col;
        this.row = row;
        this.svg = SVG.create("g");

        this.terrain = null;
        this.edges = null;
        this.corners = null;
        this.connectors = null;
        this.metadata = null;
        this.borders = null;
        this.content = null;

        let id = `${col},${row}`;
        let colLen = this.hexMap.hexes ? `${this.hexMap.hexes.length}`.length : 1;
        let rowLen = this.hexMap?.hexes?.[0] ? `${this.hexMap.hexes[0].length}`.length : 1;
        let symbolId = `HexLabel-${this.col},${this.row}`;
        let symbol = SVG.create("symbol", {id: symbolId, viewBox: `0 0 ${this.hexMap.viewBoxWidth} ${this.hexMap.viewBoxHeight}`, preserveAspectRatio: "none", "pointer-events": "none"});
        
        this.idPath = SVG.create("path", {d: "M 0 0", stroke: this.hexMap.textColour, "stroke-width": "2.5", fill: "none"});

        symbol.append(this.idPath);
        this.svg.append(symbol);

        this.buildIdPath(colLen, rowLen, 500 - (31 * (colLen + rowLen) - 6) / 2);

        this.hexId = SVG.createUse(symbolId);
        this.hexTerrain = SVG.createUse("hexagon", {id: id, stroke: this.hexMap.borderColour, "stroke-width": "2", fill: this.hexMap.defaultHexFill});

        this.svg.append(this.hexTerrain, this.hexId);
    }

    buildIdPath(colLen, rowLen, labelOffset)
    {
        let path = `M ${labelOffset} 160`;
        let digits = `${this.col.toString().padStart(colLen, "0")}${this.row.toString().padStart(rowLen, "0")}`.split("");
        digits.forEach(d => path += Hex.SVG_DIGITS[+d]);

        this.idPath.setAttribute("d", path);
    }

    setTerrain(value)
    {
        if(!value)
            return;

        this.terrain = value;
        this.hexTerrain.setAttribute("fill", this.hexMap.terrain.get(value.type)[value.variant].fill);
    }

    addEdge(value) // {edge (none, river), index, variant}
    {
        if(!this.edges)
            this.edges = new KOMap();

        let n = SVG.createUse(`${value.edge}_e${value.edgeIndex}_v${value.variant}`);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.edges.setKO(value, n);
        this.svg.append(this.edges.getKO(value));
    }

    addCorner(value)
    {
        if(!this.corners)
            this.corners = new KOMap();

        let n = SVG.createUse(`${value.edge}_e${value.edgeIndex}_c${value.cornerType}_v${value.variant}`);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.corners.setKO(value, n);
        this.svg.append(this.corners.getKO(value));
    }

    addConnector(value) // {edge (none, rail), index, variant}
    {
        if(!this.connectors)
            this.connectors = new KOMap();

        let n = SVG.createUse(`${value.edge}_e${value.edgeIndex}_v${value.variant}`);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.connectors.setKO(value, n);
        this.svg.append(this.connectors.getKO(value));
    }

    addMetadata(value) // look into ways to have complex - i.e. more than one value for a given key.  E.g. two stars...
    {  
        if(!this.metadata)
            this.metadata = new KOMap();

        this.metadata.set(value.key, value.value);

        let md = this.hexMap.metadata.get(value.key);

        if(md.renderType === "Icon") // so looking like I need a separate collection for each render type :(
        // ya the draw hex method is where the dimensions are set, it only works here when editing
        {
            console.log("\n");
            console.log(this);
            console.log(value);
            console.log(md);
            let use = `${value.key}_v0`;
            console.log(use);
            let n = SVG.createUse(use);
            n.setAttribute("x", this.hexTerrain.x.baseVal.value);
            n.setAttribute("y", this.hexTerrain.y.baseVal.value);
            n.setAttribute("width", this.hexTerrain.width.baseVal.value);
            n.setAttribute("height", this.hexTerrain.height.baseVal.value);

            this.svg.append(n);
        }
    }

    addBorder(value)
    {
        if(!this.borders)
            this.borders = new KOMap();

        let n = SVG.createUse(value.id);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.borders.set(value.id, n);
        this.svg.append(n);
    }

    drawHex(x, y, w, h)
    {
        if(arguments.length == 4)
        {
            this.hexTerrain.setAttribute("x", x);
            this.hexTerrain.setAttribute("y", y);
            this.hexTerrain.setAttribute("width", w);
            this.hexTerrain.setAttribute("height", h);
            this.hexTerrain.setAttribute("stroke", this.hexMap.borderColour);
            this.hexTerrain.setAttribute("fill", this.terrain ? 
                                                this.hexMap.terrain.get(this.terrain.type)[this.terrain.variant].fill : 
                                                this.hexMap.defaultHexFill);

            let details = [this.edges, this.corners, this.connectors, this.borders, [this.hexId]];

            details.forEach(detail =>
            {
                if(detail)
                {
                    detail.forEach(element =>
                    {
                        element.setAttribute("x", x);
                        element.setAttribute("y", y);
                        element.setAttribute("width", w);
                        element.setAttribute("height", h);
                    });
                }
            });
        }
    }
}