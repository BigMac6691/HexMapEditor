class Hex
{
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

        this.hexId = SVG.createText(id, {x: 500, y: 110});
        this.hexTerrain = SVG.createUse("hexagon", {id: id, stroke: this.hexMap.borderColour, "stroke-width": "2", fill: this.hexMap.defaultHexFill});

        this.svg.append(this.hexTerrain, this.hexId);
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

    addMetadata(value)
    {  
        if(!this.metadata)
            this.metadata = new KOMap();

        this.metadata.set(value.key, value.value);
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

            let details = [this.edges, this.corners, this.connectors, this.borders];

            details.forEach(detail =>
            {
                if(detail)
                {
                    detail.forEach(attribute =>
                    {
                        attribute.setAttribute("x", x);
                        attribute.setAttribute("y", y);
                        attribute.setAttribute("width", w);
                        attribute.setAttribute("height", h);
                    });
                }
            });

            this.drawId(x, y, w, h);
        }
    }

    drawId(x, y, w, h)
    {
        this.hexId.setAttribute("stroke", this.hexMap.textColor);
        this.hexId.setAttribute("x", `${x + w / 2}`);
        this.hexId.setAttribute("y", `${y + h * 0.21}`);
    }
}