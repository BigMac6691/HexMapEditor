class Hex
{
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
        this.content = null;

        let id = `${col},${row}`;

        this.hexId = SVG.createText(id, {x: 500, y: 110});
        this.hexTerrain = SVG.createUse("hexagon", {id: id, stroke: this.hexMap.borderColour, "stroke-width": "2", fill: this.hexMap.defaultHexFill});

        this.svg.append(this.hexTerrain, this.hexId);
    }

    setTerrain(value)
    {
        this.terrain = value;
        this.hexTerrain.setAttribute("fill", this.terrain?.data ? this.terrain.data.fill : this.hexMap.defaultHexFill);
    }

    addEdge(value) // {edge (none, river), index, variant}
    {
        if(value.edge === "None")
        {
            this.handleNone(this.edges, value);
            return;
        }

        if(!this.edges)
            this.edges = new Map();

        let edge = this.hexMap.edges.get(value.edge)[value.edgeIndex][value.variant];

        if(this.edges.has(edge.id))
            return;

        let n = SVG.createUse(edge.id, edge.svg);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.edges.set(edge.id, [value, n]);

        this.svg.append(this.edges.get(edge.id)[1]);
    }

    addCorner(value)
    {

    }

    addConnector(value) // {edge (none, rail), index, variant}
    {
        if(value.edge === "None")
        {
            this.handleNone(this.connectors, value);
            return;
        }

        if(!this.connectors)
            this.connectors = new Map();

        let connector = this.hexMap.connectors.get(value.edge)[value.edgeIndex][value.variant];

        if(this.connectors.has(connector.id))
            return;

        let n = SVG.createUse(connector.id, connector.svg);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.connectors.set(connector.id, [value, n]);

        this.svg.append(this.connectors.get(connector.id)[1]);
    }

    // separate borders from metadata - have the editor do all the calculations for borders
    addMetadata(value)
    {  
        if(!this.metadata)
            this.metadata = new Map();

        let offset = this.hexMap.offsetOn ? (this.col % 2 ? -1 : 0) : (this.col % 2 ? 0 : -1);
        let adj = 
        [
            this.hexMap.getHexFromId(`${this.col},${this.row - 1}`),
            this.hexMap.getHexFromId(`${this.col + 1},${this.row + offset}`),
            this.hexMap.getHexFromId(`${this.col + 1},${this.row + offset + 1}`),
            this.hexMap.getHexFromId(`${this.col},${this.row + 1}`),
            this.hexMap.getHexFromId(`${this.col - 1},${this.row + offset + 1}`),
            this.hexMap.getHexFromId(`${this.col - 1},${this.row + offset}`)
        ];

        console.log(" ");
        console.log(adj);

        for(const [k, v] of value)
        {
            if(this.metadata.get(k) === v) // if no change in property value skip to next incoming property
                continue;

            this.metadata.set(k, v);

            let md = this.hexMap.metadata.get(k);

            console.log(`Hex ${this.col},${this.row} -> (${md.renderRules[0].type}) ${k}::${v} render symbol ${md.renderRules[0].symbol}`);

            if(md.renderRules[0].type === "border") // at this point you know that a property value has changed
            {
                if(!this.borders)
                    this.borders = new Map();

                for(let side = 0; side < 6; side++)
                {
                    let borderId = `${md.renderRules[0].symbol}_${side}`;

                    console.log(borderId);

                    if(v === adj[side]?.metadata?.get(k)) // an adjacent hex has the same property value
                    {
                        let id = `${md.renderRules[0].symbol}_${(side + 3) % 6}`; // look for side opposite this side
                        let d = adj[side].borders.get(id);

                        if(d)
                        {
                            adj[side].svg.removeChild(d);
                            adj[side].borders.delete(id);
                        }
                    }
                    else
                    {
                        let n = SVG.createUse(borderId);
                        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
                        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
                        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
                        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

                        this.svg.append(n);
                        this.borders.set(borderId, n);
                    }
                } // for sides
            }
            else
                throw new Error(`Unknown rendering rule ${md.renderRules[0].type} for metadata.`);
        } // for passed meta
    }

    handleNone(map, value)
    {
        if(!map)
            return;

        for(const [k, v] of map)
        {
            if(v[0].edgeIndex === value.edgeIndex)
            {
                this.svg.removeChild(v[1]);
                map.delete(k);
                return;
            }
        }

        return;
    }

    drawHex(x, y, w, h)
    {
        if(arguments.length == 4)
        {
            this.hexTerrain.setAttribute("x", x);
            this.hexTerrain.setAttribute("y", y);
            this.hexTerrain.setAttribute("width", w);
            this.hexTerrain.setAttribute("height", h);

            if(this.edges)
                this.edges.forEach(edge =>
                {
                    if(edge)
                    {
                        edge[1].setAttribute("x", x);
                        edge[1].setAttribute("y", y);
                        edge[1].setAttribute("width", w);
                        edge[1].setAttribute("height", h);
                    }
                });
        }

        if(arguments.length == 4)
            this.drawId(x, y, w, h);
    }

    drawId(x, y, w, h)
    {
        this.hexId.setAttribute("x", `${x + w / 2}`);
        this.hexId.setAttribute("y", `${y + h * 0.21}`);
    }
}