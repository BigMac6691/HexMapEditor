class ConnectorEditor extends FeatureEditor
{
    constructor(map)
    {
        super(map);

        this.help = 
        "<h1>Connector</h1>" + 
        "<p>A connector is one of the six paths from the center of the hexagon to the center of a side.  The connectors are numbered from 0 (the top) clockwise to 5; 1 is top right and so on.</p>" + 
        "<p>The rendering routine is optimized for this geometry.  You are free to go outside this at your own risk. The important thing to consider is how they connect to each other - i.e. common end points should be used.</p>" +
        "<p>You can define variants for each type of connector.  When a hex is assigned a connector value it will randomly pick from the available variants; you can edit this manually later if you like.  <b>IMPORTANT</b> the variants are numbered starting from zero so do not leave gaps in the sequence!</p>" +
        "<p>The SVG you provided to render the connector is captured in a <code>symbol</code> with <code>viewBox</code> of 0 0 1000 866, <code>preserveAspectRatio</code> and <code>pointer-events</code> set to 'none'. The symbol id is composed as follows: ID_eEdge_vVariant, example: Road_e0_v0 is ID of Road to top edge variant 0.</p>" +
        "<p><b>NOTE</b> connectors are drawn immediatley after edges and corners.</p>";

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