class ConnectorEditor extends FeatureEditor
{
    constructor(map)
    {
        super(map);

        this.edge = HTML.create("input", {type: "number", value: 0, min: 0, max: 5});
        this.variant = HTML.create("input", {type: "number", value: 0, min: 0});

        this.parts.append(
            HTML.createLabel("Edge: ", this.edge),
            HTML.createLabel("Variant: ", this.variant));
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