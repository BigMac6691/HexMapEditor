class MetaSVGEditor extends FeatureEditor
{
    constructor(map)
    {
        super(map);

        console.log("MetaSVGEditor constructor");
        console.log(map);

        this.help = 
        "<h1>Meta</h1>" + 
        "<p>A connector is one of the six paths from the center of the hexagon to the center of a side.  The connectors are numbered from 0 (the top) clockwise to 5; 1 is top right and so on.</p>" + 
        "<p>The rendering routine is optimized for this geometry.  You are free to go outside this at your own risk. The important thing to consider is how they connect to each other - i.e. common end points should be used.</p>" +
        "<p>You can define variants for each type of connector.  When a hex is assigned a connector value it will randomly pick from the available variants; you can edit this manually later if you like.  <b>IMPORTANT</b> the variants are numbered starting from zero so do not leave gaps in the sequence!</p>" +
        "<p>The SVG you provided to render the connector is captured in a <code>symbol</code> with <code>viewBox</code> of 0 0 1000 866, <code>preserveAspectRatio</code> and <code>pointer-events</code> set to 'none'. The symbol id is composed as follows: ID_eEdge_vVariant, example: Road_e0_v0 is ID of Road to top edge variant 0.</p>" +
        "<p><b>NOTE</b> connectors are drawn immediatley after edges and corners.</p>";

        this.allowMultiples = HTML.create("input", {type: "checkbox"});

        this.inputType = new ComboRadioSelect(["Select", "Number", "String"], "metaInputType");
        this.inputType.selectDisplay = "inline-block";
        this.inputType.show(true);
        this.inputType.addEventListener("change", (evt) => this.selectListLabel.style.display = evt.detail.value === "Select" ? "block" : "none");

        this.selectList = HTML.create("input", {type: "string"});
        this.selectListLabel = HTML.createLabel("Values: ", this.selectList); // display varies

        this.renderType = new ComboRadioSelect(["Icon", "Border"], "metaRenderType");
        this.renderType.selectDisplay = "inline-block";
        this.renderType.show(true);
        this.renderType.addEventListener("change", (evt) => this.edgeLabel.style.display = evt.detail.value === "Border" ? "block" : "none");

        this.edge = HTML.create("input", {type: "number", value: 0, min: 0, max: 5});
        this.edgeLabel = HTML.createLabel("Edge: ", this.edge); // display varies
        this.edgeLabel.style.display = "none";

        this.variant = HTML.create("input", {type: "number", value: 0, min: 0});

        this.parts.append(
            HTML.createLabel("Allow Multiples: ", this.allowMultiples),
            HTML.createLabel("Input: ", this.inputType.select),
            this.selectListLabel,
            HTML.createLabel("Render: ", this.renderType.select),
            this.edgeLabel,
            HTML.createLabel("Variant: ", this.variant));
    }

    getKey()
    {
        return this.edgeLabel.style.display === "none" 
                ? `${this.id.value}_v${this.variant.value}`
                : `${this.id.value}_e${this.edge.value}_v${this.variant.value}`;
    }

    init(list) 
    {
        super.init(list);

        list.forEach((v, k) => 
        {
            let vMeta =
            {
                id: k, 
                allowMultiples: v.allowMultiples,
                renderType: v.renderType,
                inputType: v.inputType,
                selectList: v.selectList,
                renderData: new Map()
            };

            this.hexMap.metadata.set(k, vMeta);

            v.renderData.forEach(render =>
            {
                let key = render[0];
                let vRender = 
                {
                    edge: render[1].edge,
                    variant: render[1].variant,
                    svg: render[1].svg,
                    node: document.getElementById(key)
                };
                
                vMeta.renderData.set(key, vRender);

                this.items.set(key, vMeta);
                this.idList.append(HTML.create("option", {text: key, value: key}));
            });
        });

        console.log(this.items);
        console.log(this.hexMap.metadata);
    }

    handleListChange(evt)
    {
        if(!this.items.has(evt.target.value))
            return;

        let v = this.items.get(evt.target.value);
        console.log("handleListChange()...");
        console.log(v);

        this.id.value = v.id;
        this.allowMultiples.checked = v.allowMultiples;
        this.inputType.setValue(v.inputType);
        this.selectList.value = v.selectList;
        this.renderType.setValue(v.renderType);

        let r = v.renderData.get(evt.target.value);

        this.edge.value = r.edge;
        this.variant.value = r.variant;
        this.svg.value = r.svg;
    }

    handleCreate(evt)
    {
        if(!super.handleCreate(evt))
            return;

        console.log("Inside MetaSVGEditor handleCreate()...");

        let key = this.getKey();
        let n = SVG.create("symbol", {id: key, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
        n.innerHTML = this.svg.value;

        let vMeta = null;
        let vRender = 
        {
            edge: this.edge.value,
            variant: this.variant.value, 
            svg: this.svg.value,
            node: n
        };

        if(this.items.has(key))
            vMeta = this.metaMap.get(key);
        else
        {
            vMeta =
            {
                id: this.id.value, 
                allowMultiples: this.allowMultiples.checked,
                renderType: this.renderType.value,
                inputType: this.inputType.value,
                selectList: this.selectList.value.split(","),
                renderData: new Map()
            };
        }

        vMeta.renderData.set(key, vRender);

        this.items.set(key, vMeta);
        this.idList.append(HTML.create("option", {text: key, value: key}));
        this.idList.value = key;

        this.hexMap.metadata.set(vMeta.id, vMeta);
        this.hexMap.defs.append(n);

        console.log(this.hexMap);

        this.dispatchEvent(new CustomEvent("change", {detail: {cmd: "create.meta", key: key, value: vMeta}}));
    }

    handleUpdate(evt)
    {
        if(!super.handleUpdate(evt))
            return;

        let key = this.getKey();
        let v = this.items.get(key);
        let r = v.renderData.get(key);

        v.allowMultiples = this.allowMultiples.checked; // may need to trigger a review of all existing hexes if this goes to false
        r.svg = this.svg.value;
        r.node.innerHTML = this.svg.value;
    }

    handleDelete(evt)
    {
        if(!super.handleDelete(evt))
            return;

        let key = this.getKey();

        this.idList.removeChild(this.idList.options[this.idList.selectedIndex]);
        this.hexMap.defs.removeChild(this.items.get(key).renderData.get(key).node);
        this.items.delete(key);

        this.id.value = "";
        this.allowMultiples.checked = false;
        this.selectList.value = "";
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
}