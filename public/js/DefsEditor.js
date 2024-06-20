class DefsEditor extends FeatureEditor
{
    constructor(map)
    {
        super(map);

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

        this.items.set(this.id.value, n);
        this.idList.append(HTML.create("option", {text: this.id.value, value: this.id.value}));
        this.idList.value = this.id.value;
        this.hexMap.defs.append(n);
    }

    handleUpdate(evt)
    {
        if(!super.handleUpdate(evt))
            return;

        let n = this.items.get(this.id.value);

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

        let n = this.items.get(this.id.value);

        this.hexMap.defs.removeChild(n);
        this.idList.removeChild(this.idList.options[this.idList.selectedIndex]);
        this.items.delete(this.id.value);

        this.id.value = "";
        this.x.value = 0;
        this.y.value = 0;
        this.width.value = 0;
        this.height.value = 0;
        this.svg.value = "";
    }
}