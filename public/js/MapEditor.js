class MapEditor extends SidePanel
{
    constructor(title, editor)
    {
        super(title);

        this.editor = editor;
        this.display = "flex";
		this.painting = false;
        this.content.classList.add("featureCol");

		this.boundKeypress = this.handleKeyPress.bind(this);

		this.editor.hexMap.svg.addEventListener("mousemove", this.handleMouseMove.bind(this));
		this.editor.hexMap.svg.addEventListener("click", this.handleMouseClick.bind(this));
		this.editor.hexMap.svg.addEventListener("mouseenter", () => 
		{
			this.editor.hexMap.svg.style.cursor = "crosshair";
			document.addEventListener("keydown", this.boundKeypress);
		});

		this.editor.hexMap.svg.addEventListener("mouseleave", () => 
		{
			this.editor.hexMap.svg.style.cursor = "default";
			this.painting = false;
			document.removeEventListener("keydown", this.boundKeypress);
		});

		this.mouseMove = HTML.create("p", {innerHTML: "Mouse location x, y"});
        this.mouseClick = HTML.create("p", {innerHTML: "Click location: x, y"});
		this.content.append(this.mouseMove, this.mouseClick);

		this.menu = new Menu("block");
		this.content.append(this.menu.div);
		["None", "Terrain", "Edges", "Connectors", "Jumps", "Meta"]
		.forEach(m =>
		{
			let n = null;

			switch(m)
			{
				case "None":
					n = HTML.create("div");					
					break;

				case "Terrain":
					this.terrainSelect = new ComboRadioSelect(this.editor.hexMap.terrainTypes, "terrainTypes");
					n = this.terrainSelect.groupDiv;
					break;

				case "Edges":
					this.edgeSelect = new ComboRadioSelect(this.editor.hexMap.edgeTypes, "edgeTypes");
					n = this.edgeSelect.groupDiv;
					break;

				case "Connectors":
					this.connectorSelect = new ComboRadioSelect(this.editor.hexMap.connectorTypes, "connectorTypes");
					n = this.connectorSelect.groupDiv;
					break;

				case "Jumps":
					this.jumpEditor = new JumpEditor(this.editor);
					n = this.jumpEditor.div;
					break;

				case "Meta":
					this.metaEditor = new MetaEditor(this.editor);
					n = this.metaEditor.div;
					break;

				default:
					n = HTML.create("div", {innerHTML: `DIV:${m}`});
			}

			this.content.append(n);
			this.menu.addItem(m, n);
		});
	}

	handleKeyPress(evt)
	{
		console.log(evt);

		// jumps are special as they cover more than one hex
		if(this.jumpEditor.div.style.display !== "none")
		{
			this.jumpEditor.handleKeyPress(evt);
			return;
		}
		
		if(evt.key === "Control")
			this.painting = !this.painting;

		if(this.painting)
            this.editor.hexMap.svg.style.cursor = "cell";
        else
            this.editor.hexMap.svg.style.cursor = "crosshair";
	}

	handleMouseMove(evt)
	{
		if(!evt.target.id.includes(","))
            return;

        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.editor.hexMap.svg.getScreenCTM().inverse());
        this.mouseMove.innerHTML = `Mouse location: ${Math.trunc(pt.x * 100) / 100}, ${Math.trunc(pt.y * 100) / 100} in hex ${evt.target.id} isPainting ${this.painting}`;

		if(!this.painting)
			return;

		let hex = this.editor.hexMap.getHexFromId(evt.target.id);

		this.updateHex(hex, pt);
	}

	handleMouseClick(evt)
	{
		if(!evt.target.id.includes(","))
			return;

		let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.editor.hexMap.svg.getScreenCTM().inverse());
		this.mouseClick.innerHTML = `Click location: ${Math.trunc(pt.x * 100) / 100}, ${Math.trunc(pt.y * 100) / 100} with id ${evt.target.id}`;

		let hex = this.editor.hexMap.getHexFromId(evt.target.id);
		
		this.updateHex(hex, pt);
	}

	updateHex(hex, pt)
	{
		switch(this.menu.getSelected())
		{
			case "None":
				break;

			case "Terrain":
				hex.setTerrain({type: this.terrainSelect.value, variant: 0});
				break;

			case "Edges":
				this.addEdge(hex, pt);
				break;

			case "Connectors":
				this.addConnector(hex, pt);
				break;

			case "Jumps":
				// special case handled in separate class
				break;

			case "Meta":
				this.metaEditor.addMetadata(hex);
				break;

			default:
				throw new Error(`Unknown map menu [${this.menu.getSelected()}]`);
		}
	}

	handleNone(hex, map, value)
    {
        if(!map)
            return;

        let matches = map.partialGetAll({edgeIndex: value.edgeIndex}, 2);

        matches.forEach(v => 
        {
            hex.svg.removeChild(v[1]);
            map.deleteKO(v[0]);
        });
    }

	nearestEdge(hex, pt)
    {
        let y = +hex.hexTerrain.y.baseVal.value;
        let h = hex.hexTerrain.height.baseVal.value / 4;
        let dy = pt.y - y;
        let rh = h / 5;

        let x = +hex.hexTerrain.x.baseVal.value;
        let w = hex.hexTerrain.width.baseVal.value / 4;
        let dx = pt.x - x;
        let rw = w / 5;
        
        let edgeIndex = -1;

        if(Math.abs(w / 2 - dx) < rw) //  top left and bottom left
            edgeIndex = Math.abs(h - dy) < rh ? 5 : (Math.abs(3 * h - dy) < rh ? 4 : -1);
        else if(Math.abs(3.5 * w - dx) < rw) // top right and bottom right
            edgeIndex = Math.abs(h - dy) < rh ? 1 : (Math.abs(3 * h - dy) < rh ? 2 : -1);
        else if(Math.abs(2 * w - dx) < rw) //  top and bottom
             edgeIndex = dy < rh ? 0 : (Math.abs(4 * h - dy) < rh ? 3 : -1);

        return edgeIndex;
    }

	addEdge(hex, pt)
    {
        let edgeIndex = this.nearestEdge(hex, pt);

		if(edgeIndex < 0)
			return;

        let curEdgeType = null;
        let value = {"type" : this.edgeSelect.value, "edgeIndex" : edgeIndex, "variant" : 0};

        if(value.edge === "None")
        {
            curEdgeType = hex?.edges?.partialHas({"edgeIndex": edgeIndex}) ? hex.edges.partialGet({"edgeIndex": edgeIndex}, 2)[0].edge : null;
            this.handleNone(hex, hex.edges, value);
        }
        else// if(!hex.edges || !hex.edges.partialHas(value))
        {
            curEdgeType = this.edgeSelect.value;
            hex.addEdge(value);
        }
        
        let offset = this.editor.hexMap.offsetOn ? (hex.col % 2 ? -1 : 0) : (hex.col % 2 ? 0 : -1);
        let adj = 
        [
            this.editor.hexMap.getHexFromId(`${hex.col},${hex.row - 1}`),
            this.editor.hexMap.getHexFromId(`${hex.col + 1},${hex.row + offset}`),
            this.editor.hexMap.getHexFromId(`${hex.col + 1},${hex.row + offset + 1}`),
            this.editor.hexMap.getHexFromId(`${hex.col},${hex.row + 1}`),
            this.editor.hexMap.getHexFromId(`${hex.col - 1},${hex.row + offset + 1}`),
            this.editor.hexMap.getHexFromId(`${hex.col - 1},${hex.row + offset}`)
        ];

        this.addCorner(hex, adj, curEdgeType, (edgeIndex + 5) % 6); // corner before edge
        this.addCorner(hex, adj, curEdgeType, edgeIndex); // corner after edge
    }

	addCorner(hex, adj, edgeType, cornerIndex)
    {
        this.handleNone(hex, hex.corners, {"type": edgeType, "edgeIndex": cornerIndex});

        let edgeBefore = hex.edges ? hex.edges.partialHas({"edgeIndex": cornerIndex}) : false;
        let edgeAfter = hex.edges ? hex.edges.partialHas({"edgeIndex": (cornerIndex + 1) % 6}) : false;
        let edgeOpp1 = adj[cornerIndex]?.edges ? adj[cornerIndex].edges.partialHas({"edgeIndex": (cornerIndex + 2) % 6}) : false;
        let edgeOpp2 = adj[(cornerIndex + 1) % 6]?.edges ? adj[(cornerIndex + 1) % 6].edges.partialHas({"edgeIndex": (cornerIndex + 5) % 6}) : false;
        let corner = edgeBefore ? 1 : 0;

        if(edgeAfter)
            corner +=2;

        if(edgeBefore && !edgeAfter)
            corner += edgeOpp2 ? 3 : 0;

        if(!edgeBefore && edgeAfter)
            corner += edgeOpp1 ? 3 : 0;

        if(corner > 0) 
            hex.addCorner({"type" : edgeType, "edgeIndex" : cornerIndex, "cornerType": corner - 1, "variant" : 0});
    }

	addConnector(hex, pt)
    {
        let edgeIndex = this.nearestEdge(hex, pt);

        if(edgeIndex < 0)
			return;

        let value = {"type": this.connectorSelect.value, "edgeIndex": edgeIndex, "variant": 0};

        if(value.edge === "None")
            this.handleNone(hex, hex.connectors, value);
        else if(!hex.connectors || !hex.connectors.partialHas(value))
            hex.addConnector(value);
    }

	handleMapLoad(evt)
	{
		console.log("MapEditor - map load event...");

		// first clear everything before loading
		while(this.editor.hexMap.defs.lastChild)
            this.editor.hexMap.defs.removeChild(this.editor.hexMap.defs.lastChild);

        this.editor.hexMap.svg.querySelectorAll("symbol").forEach(n => 
        {
            if(n.id !== "hexagon")
                this.editor.hexMap.svg.removeChild(n);
        });

		this.terrainSelect.init(evt.detail.terrainTypes, "terrainTypes");
		this.edgeSelect.init(evt.detail.edgeTypes, "edgeTypes");
		this.connectorSelect.init(evt.detail.connectorTypes, "connectorTypes");

		this.editor.hexMap.loadFile(evt.detail);
		this.editor.initMap();
        
		this.editor.svgEditorControl.handleMapLoad(evt);
		this.jumpEditor.handleMapLoad(evt); // order is important 
		this.metaEditor.handleMapLoad(evt);
	}
}