class EdgeEditor extends FeatureEditor
{
    constructor(map)
    {
        super(map);

        this.help = 
        "<h1>Edge</h1>" + 
        "<p>An edge is one of the six sides of the hexagon.  The edges are numbered from 0 (the top) clockwise to 5; 1 is top right and so on.</p>" + 
        "<p>An edge has depth (which is why it is not called side).  It is a trapezoid with a short side width of about &frac12; the hexagon side length and a height of about &#8529; the bounding rectangle height like so:</p>" +
        "<svg width='200px' viewBox='0 0 1000 866' preserveAspectRatio='none'>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='0' width='1000' height='866'></use>" +
        "<path d='M 365.5 0 L 634.5 0 L 692.3 100 L 307.7 100 Z' fill='#0000ff'></path>" + 
        "</svg>" + 
        "<p>The rendering routine is optimized for this geometry.  You are free to go outside this region at your own risk.</p>" +
        "<p>The gaps to the left and right of the edge are called <code>corners</code>.  You should pick a point on the side of the edge and have all edges and corners meet at that point to make them appear continuous when drawn.</p>" +
        "<p>You can define variants for each type of edge.  When a hex is assigned an edge value it will randomly pick from the available variants; you can edit this manually later if you like.  <b>IMPORTANT</b> the variants are numbered starting from zero so do not leave gaps in the sequence!</p>" +
        "<p>The SVG you provided to render the edge is captured in a <code>symbol</code> with <code>viewBox</code> of 0 0 1000 866, <code>preserveAspectRatio</code> and <code>pointer-events</code> set to 'none'. The symbol id is composed as follows: ID_eEdge_vVariant, example: River_e0_v0 is ID of River top edge variant 0.</p>" +
        "<p><b>NOTE</b> edges and corners are drawn first.</p>";

        this.edge = HTML.create("input", {type: "number", value: 0, min: 0, max: 5});
        this.variant = HTML.create("input", {type: "number", value: 0, min: 0});

        this.parts.append(
            HTML.createLabel("Edge: ", this.edge),
            HTML.createLabel("Variant: ", this.variant));
    }

    init(list)
    {
        super.init(list);

        list.forEach((v, k) => 
        {
            let key = JSON.parse(k);
            let record =
            {
                id: key.type,
                edge: key.edgeIndex,
                variant: key.variant,
                svg: v.innerHTML,
                node: v
            }

            this.items.set(v.id, record);
            this.idList.append(HTML.create("option", {text: v.id, value: v.id}));
        });
    }

    handleListChange(evt)
    {
        if(!this.items.has(evt.target.value))
            return;

        let v = this.items.get(evt.target.value);

        this.id.value = v.id;
        this.edge.value = v.edge;
        this.variant.value = v.variant;
        this.svg.value = v.svg;
    }

    handleCreate(evt)
    {
        if(!super.handleCreate(evt))
            return;

        let key = this.getKey();
        let n = SVG.create("symbol", {id: key, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
        n.innerHTML = this.svg.value;

        let v = 
        {
            id: this.id.value, 
            edge: this.edge.value,
            variant: this.variant.value, 
            svg: this.svg.value,
            node: n
        };

        this.items.set(key, v);
        this.idList.append(HTML.create("option", {text: key, value: key}));
        this.idList.value = key;
        this.hexMap.svg.append(n);
    }

    handleUpdate(evt)
    {
        if(!super.handleUpdate(evt))
            return;

        let v = this.items.get(this.getKey());

        v.svg = this.svg.value;
        v.node.innerHTML = this.svg.value;
    }

    handleDelete(evt)
    {
        if(!super.handleDelete(evt))
            return;

        this.idList.removeChild(this.idList.options[this.idList.selectedIndex]);
        this.hexMap.removeChild(this.items.get(this.getKey()).node);
        this.items.delete(this.getKey());

        this.id.value = "";
        this.edge.value = 0;
        this.variant.value = 0;
        this.svg.value = "";
    }

    handleShow()
    {
        let hex = this.hexMap.getHexFromId("0,0");
        let key = this.getKey();        
        let n = SVG.createUse(key);
        n.setAttribute("x", 0);
        n.setAttribute("y", 0);
        n.setAttribute("width", 1000);
        n.setAttribute("height", 866);

        hex.svg.append(n);
    }

    getKey()
    {
        return `${this.id.value}_e${this.edge.value}_v${this.variant.value}`;
    }
}