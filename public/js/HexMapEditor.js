class HexMapEditor
{
    constructor() 
    {
        this.hexMap = new HexMap();

        this.initMap();
        this.makeUI();
    }

    initMap()
    {
        this.hexMap.initMap();
    }

    makeUI()
    {
        let mp = document.getElementById("mapPanel");
        mp.append(this.hexMap.svg); 

        // File panel
        this.fileControl = new FileEditor("File", this);
        let div0 = this.fileControl.div;

        // SVG attributes
        this.svgControl = new SVGEditor("SVG Attributes", this);
        this.fileControl.addEventListener("mapLoad", this.svgControl.handleMapLoad.bind(this.svgControl));
        let div1 = this.svgControl.div;

        // Model atributes
        this.modelControl = new ModelControl("Model Attributes", this);
        this.fileControl.addEventListener("mapLoad", this.modelControl.handleMapLoad.bind(this.modelControl));
        let div2 = this.modelControl.div;

        // Hex attributes
        this.mapEditor = new MapEditor("MapData", this);
        this.fileControl.addEventListener("mapLoad", this.mapEditor.handleMapLoad.bind(this.mapEditor));
        let div3 = this.mapEditor.div;

        // Feature editor 
        let div4 = this.makeFeatureDiv();
        
        let div5 = HTML.create("div", null, ["controlDiv"]);
        div5.append(HTML.create("h3", {textContent: "Hex Editor"}));

        document.getElementById("controlPanel").append(div0, div1, div2, div3, div4, div5);
    }

    makeFeatureDiv()
    {
        this.featureUIDiv = HTML.create("div", null, ["controlDiv"]);
        this.featureUIDiv.append(HTML.create("h3", {textContent: "Feature Editor"}));

        let list = ["defs", "Terrain", "Edges", "Corners", "Connectors", "Meta"];

        this.featureList = new Map();
        let menu = HTML.create("div", {id: "featureMenu"}, ["menuContainer"]);
        this.featureUIDiv.append(menu);

        list.forEach(m => 
        {
            let n = HTML.create("div", {innerHTML: m}, ["menuItem"], {click: this.boundMenuClick});
            menu.append(n);

            switch(m)
            {
                case list[0]:
                    n.classList.add("menuItemSelected"); // initial menu option

                    this.defsEditor = new DefsEditor(this.hexMap);
                    this.defsEditor.display(true); // initial visible editor

                    this.featureList.set(n, this.defsEditor.uiDiv);
                    this.featureUIDiv.append(this.defsEditor.uiDiv);
                    break;
                case list[1]:
                    console.log(this.hexMap);
                    this.terrainEditor = new TerrainEditor(this.hexMap);
                    this.featureList.set(n, this.terrainEditor.uiDiv);
                    this.featureUIDiv.append(this.terrainEditor.uiDiv);
                    break;
                case list[2]:
                    this.edgeEditor = new EdgeEditor(this.hexMap);
                    this.featureList.set(n, this.edgeEditor.uiDiv);
                    this.featureUIDiv.append(this.edgeEditor.uiDiv);
                    break;
                case list[3]:
                    this.cornerEditor = new CornerEditor(this.hexMap);
                    this.featureList.set(n, this.cornerEditor.uiDiv);
                    this.featureUIDiv.append(this.cornerEditor.uiDiv);
                    break;
                case list[4]:
                    this.connectorEditor = new ConnectorEditor(this.hexMap);
                    this.featureList.set(n, this.connectorEditor.uiDiv);
                    this.featureUIDiv.append(this.connectorEditor.uiDiv);
                    break;
                case list[5]:
                    // this.hexUIDiv.append(this.buildMetaDiv(n));
                    this.featureList.set(n, HTML.create("div"));
                    break;
            }
        });

        return this.featureUIDiv;        
    }

    handleMenu(evt)
    {
        let parentMenu = evt.target.parentElement;
        let currentMenu = parentMenu.querySelector(".menuItemSelected");

        currentMenu.classList.remove("menuItemSelected");

        if(parentMenu.id === "mapDataMenu")
            this.menuList.get(currentMenu).style.display = "none";
        else
            this.featureList.get(currentMenu).style.display = "none";

        evt.target.classList.add("menuItemSelected");

        if(parentMenu.id === "mapDataMenu")
            this.menuList.get(evt.target).style.display = "block";
        else
            this.featureList.get(evt.target).style.display = "flex";
    }

    addMetadata(hex)
    {
        let mdList = new Map();
        for(const [k, v] of this.metadata)
            if(v[0].checked)
                mdList.set(k, v[1].value);

        let offset = this.hexMap.offsetOn ? (hex.col % 2 ? -1 : 0) : (hex.col % 2 ? 0 : -1);
        let adj = 
        [
            this.hexMap.getHexFromId(`${hex.col},${hex.row - 1}`),
            this.hexMap.getHexFromId(`${hex.col + 1},${hex.row + offset}`),
            this.hexMap.getHexFromId(`${hex.col + 1},${hex.row + offset + 1}`),
            this.hexMap.getHexFromId(`${hex.col},${hex.row + 1}`),
            this.hexMap.getHexFromId(`${hex.col - 1},${hex.row + offset + 1}`),
            this.hexMap.getHexFromId(`${hex.col - 1},${hex.row + offset}`)
        ];

        for(const [k, v] of mdList)
        {
            let valueChange = hex?.metadata?.get(k) !== v;

            if(!valueChange) // if no change in property value skip to next incoming property
                continue;

            hex.addMetadata({key: k, value: v});

            let md = this.hexMap.metadata.get(k);

            if(md.renderRules[0].type === "border") // at this point you know that a property value has changed
            {
                if(valueChange) // if a value changes remove all borders for that value from selected hex only
                {
                    for(let side = 0; side < 6; side++)
                    {
                        let borderId = `${md.renderRules[0].symbol}_${side}`;
                        let border = hex?.borders?.get(borderId);

                        if(border)
                        {
                            hex.svg.removeChild(border);
                            hex.borders.delete(borderId);
                        }
                    }
                }

                for(let side = 0; side < 6; side++)
                {
                    let borderId = `${md.renderRules[0].symbol}_${side}`;

                    if(v === adj[side]?.metadata?.get(k)) // an adjacent hex has the same property value
                    {
                        let oppId = `${md.renderRules[0].symbol}_${(side + 3) % 6}`; // look for side opposite this side
                        let oppBorder = adj[side].borders.get(oppId);

                        if(oppBorder)
                        {
                            adj[side].svg.removeChild(oppBorder);
                            adj[side].borders.delete(oppId);
                        }
                    }
                    else // do we add matching border on other side?
                        hex.addBorder({id: borderId});
                } // for sides
            }
            else
                throw new Error(`Unknown rendering rule ${md.renderRules[0].type} for metadata.`);
        } // for passed meta
    }
}