class TerrainEditor extends FeatureEditor
{
    constructor(map)
    {
        super(map);

        this.help = 
        "<h1>Terrain</h1>" + 
        "<p>Terrain is always applied using <code>fill</code>. You can use <code>url(#patternId)</code> to reference patterns defined in the <code>defs</code> section of the SVG document.</p>" +
        "<p>You can define variants of each type of terrain.  When a hex is assigned a terrain value it will randomly pick from the available variants; you can edit this manually later if you like.  <b>IMPORTANT</b> the variants are numbered starting from zero so do not leave gaps in the sequence!</p>";

        this.variant = HTML.create("input", {type: "number", value: 0, min: 0});

        this.parts.append(HTML.createLabel("Variant: ", this.variant));
    }

    init(list)
    {
        super.init(list);

        list.forEach((v, k) => 
        {
            v.forEach((svg, i) =>
            {
                let key = `${k}_v${i}`;
                let t =
                {
                    id: k,
                    variant: i,
                    fill: svg.fill
                }

                this.items.set(key, t);
                this.idList.append(HTML.create("option", {text: key, value: key}));
            });
        });
    }

    handleListChange(evt)
    {
        if(!this.items.has(evt.target.value))
            return;

        let v = this.items.get(evt.target.value);

        this.id.value = v.id;
        this.variant.value = v.variant;
        this.svg.value = v.fill;
    }

    handleCreate(evt)
    {
        if(!super.handleCreate(evt))
            return;

        let key = this.getKey();
        let v = {id: this.id.value, variant: this.variant.value, fill: this.svg.value};

        this.items.set(key, v);
        this.idList.append(HTML.create("option", {text: key, value: key}));
        this.idList.value = key;

        let list = [];
        this.items.forEach((value, k) => 
        {
            if(value.id === this.id.value)
                list[+value.variant] = v;
        });

        this.hexMap.terrain.set(v.id, list);
        this.dispatchEvent(new CustomEvent("change", {detail: {cmd: "create.terrain", key: key, value: v}}));
    }

    handleUpdate(evt)
    {
        if(!super.handleUpdate(evt))
            return;

        let v = this.items.get(this.getKey());

        v.fill = this.svg.value;

        this.hexMap.terrain.get(v.id)[v.variant].fill = v.fill;
        this.hexMap.initMap();
    }

    handleDelete(evt)
    {
        if(!super.handleDelete(evt))
            return;

        let key = this.getKey();
        let v = this.items.get(key);

        this.idList.removeChild(this.idList.options[this.idList.selectedIndex]);
        this.items.delete(key);

        this.clear();
        this.dispatchEvent(new CustomEvent("change", {detail: {cmd: "delete.terrain", key: key, value: v}}));
    }

    clear()
    {
        this.id.value = "";
        this.variant.value = 0;
        this.svg.value = "";
    }

    handleShow()
    {
        let hex = this.hexMap.getHexFromId("0,0");

        hex.hexTerrain.setAttribute("fill", this.items.get(this.getKey()).fill);
    }

    getKey()
    {
        return `${this.id.value}_v${this.variant.value}`;
    }
}