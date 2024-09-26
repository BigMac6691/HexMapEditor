class DefsEditor extends FeatureEditor
{
    constructor(map)
    {
        super(map);

        this.help = 
        "<h1>defs</h1>" + 
        "<p>All <code>defs</code> are instances of SVG <code>pattern</code> elements.</p>" +
        "<p>The <code>patternUnits</code> attribute is 'userSpaceOnUse', you have control of everything else.</p>" +
        "<p>The default <code>viewBox</code> for a hexagon has width of 1000 and height of 866.  This aspect ratio is correct for a true hexagon.</p>";

        this.x = HTML.create("input", {type: "number", value: 0, min: 0});
        this.y = HTML.create("input", {type: "number", value: 0, min: 0});
        this.width = HTML.create("input", {type: "number", value: 0, min: 0});
        this.height = HTML.create("input", {type: "number", value: 0, min: 0});

        this.parts.append(
            HTML.createLabel("X: ", this.x), 
            HTML.createLabel("Y: ", this.y), 
            HTML.createLabel("Width: ", this.width), 
            HTML.createLabel("Height: ", this.height));
    }

    init(list)
    {
        super.init(list);

        list.forEach(v => 
        {
            this.items.set(v.id, v);
            this.idList.append(HTML.create("option", {text: v.id, value: v.id}));
        });
    }

    handleListChange(evt)
    {
        if(!this.items.has(evt.target.value))
            return;

        let n = this.items.get(evt.target.value);

        this.id.value = n.id;
        this.x.value = n.x.baseVal.value;
        this.y.value = n.y.baseVal.value;
        this.width.value = n.width.baseVal.value;
        this.height.value = n.height.baseVal.value;
        this.svg.value = n.innerHTML;
    }

    handleCreate(evt)
    {
        if(!super.handleCreate(evt))
            return;

        let key = this.getKey();
        let n = SVG.create("pattern", 
            {
                id: this.id.value, 
                x: +this.x.value, 
                y: +this.y.value, 
                width: +this.width.value, 
                height: +this.height.value, 
                patternUnits: "userSpaceOnUse"
            });
        n.innerHTML = this.svg.value;

        this.items.set(key, n);
        this.idList.append(HTML.create("option", {text: key, value: key}));
        this.idList.value = key;
        this.hexMap.defs.append(n);
    }

    handleUpdate(evt)
    {
        if(!super.handleUpdate(evt))
            return;

        let n = this.items.get(this.getKey());

        n.setAttribute("x", this.x.value);
        n.setAttribute("y", this.y.value);
        n.setAttribute("width", this.width.value);
        n.setAttribute("height", this.height.value);
        n.innerHTML = this.svg.value;
    }

    handleDelete(evt)
    {
        if(!super.handleDelete(evt))
            return;

        let key = this.getKey();
        let n = this.items.get(key);

        this.hexMap.defs.removeChild(n);
        this.idList.removeChild(this.idList.options[this.idList.selectedIndex]);
        this.items.delete(key);

        this.clear();
    }

    clear()
    {
        this.id.value = "";
        this.x.value = 0;
        this.y.value = 0;
        this.width.value = 0;
        this.height.value = 0;
        this.svg.value = "";
    }

    getKey()
    {
        return this.id.value;
    }
}