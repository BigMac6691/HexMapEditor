class CornerEditor extends FeatureEditor
{
    constructor(map)
    {
        super(map);

        this.help = 
        "<h1>Corner</h1>" + 
        "<p>A corner is one of the six vertices of the hexagon.  The corners are numbered from 0 (the top right) clockwise to 5; 1 is right and so on.</p>" + 
        "<p>A corner has depth (which is why it is not called vertex).  It is a rhombus with a side length of about &frac14; the hexagon's side length like so:</p>" +
        "<svg width='200px' viewBox='0 0 1000 866' preserveAspectRatio='none'>" + 
        "<use stroke='#000000' stroke-width='2' fill='#555555' xlink:href='#hexagon' x='0' y='0' width='1000' height='866'></use>" +
        "<path d='M 634.5 0 L 750 0 L 807.7 100 L 692.3 100 Z' fill='#0000ff'></path>" + 
        "</svg>" + 
        "<p>The rendering routine is optimized for this geometry.  You are free to go outside this region at your own risk.</p>" +
        "<p></p>" +
        "<p>You can define variants for each type of corner.  When a hex is assigned an corner value it will randomly pick from the available variants; you can edit this manually later if you like.  <b>IMPORTANT</b> the variants are numbered starting from zero so do not leave gaps in the sequence!</p>" +
        "<p>The SVG you provided to render the edge is captured in a <code>symbol</code> with <code>viewBox</code> of 0 0 1000 866, <code>preserveAspectRatio</code> and <code>pointer-events</code> set to 'none'. The symbol id is composed as follows: ID_eEdge_cCorner_vVariant, example: River_e0_c0_v0 is ID of River top edge variant 0.</p>";

        this.edge = HTML.create("input", {type: "number", value: 0, min: 0, max: 5});
        this.corner = HTML.create("input", {type: "number", value: 0, min: 0, max: 4});
        this.variant = HTML.create("input", {type: "number", value: 0, min: 0});

        this.parts.append(
            HTML.createLabel("Edge: ", this.edge),
            HTML.createLabel("Corner: ", this.corner),
            HTML.createLabel("Variant: ", this.variant));
    }

    handleListChange(evt)
    {
        if(!this.items.has(evt.target.value))
            return;

        let v = this.items.get(evt.target.value);

        this.id.value = v.id;
        this.edge.value = v.edge;
        this.corner.value = v.corner;
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
            corner: this.corner.value,
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
        this.corner.value = 0;
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
        return `${this.id.value}_e${this.edge.value}_c${this.corner.value}_v${this.variant.value}`;
    }
}