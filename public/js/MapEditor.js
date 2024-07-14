class MapEditor extends Editor
{
    constructor(title, editor)
    {
        super(title);

        this.editor = editor;
        this.display = "flex";
        this.content.classList.add("featureCol");

		this.editor.hexMap.svg.addEventListener("mousemove", this.handleMouseMove.bind(this));
		this.editor.hexMap.svg.addEventListener("click", this.handleMouseClick.bind(this));

		this.mouseMove = HTML.create("p", {innerHTML: "Mouse location x, y"});
        this.mouseClick = HTML.create("p", {innerHTML: "Click location: x, y"});
		this.content.append(this.mouseMove, this.mouseClick);

		let menu = new Menu("block");
		this.content.append(menu.div);
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

				// case "Meta":
				// 	break;

				default:
					n = HTML.create("div", {innerHTML: `DIV:${m}`});
			}

			this.content.append(n);
			menu.addItem(m, n);
		});
	}

	// do move and click only need listeners here?
	// yep all the other editors effect all map not parts
	// keypress and painitng are needed here as well
	handleMouseMove(evt)
	{
		if(!evt.target.id.includes(","))
            return;

        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.editor.hexMap.svg.getScreenCTM().inverse());
        this.mouseMove.innerHTML = `Mouse location: ${Math.trunc(pt.x * 100) / 100}, ${Math.trunc(pt.y * 100) / 100} in hex ${evt.target.id} isPainting ${this.editor.painting}`;
	}

	handleMouseClick(evt)
	{
		if(!evt.target.id.includes(","))
			return;

		let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.editor.hexMap.svg.getScreenCTM().inverse());
		this.mouseClick.innerHTML = `Click location: ${Math.trunc(pt.x * 100) / 100}, ${Math.trunc(pt.y * 100) / 100} with id ${evt.target.id}`;
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
        
        // since all the following are in their own classes they need to listen for the load event
        this.editor.defsEditor.init(this.editor.hexMap.defs.querySelectorAll("pattern"));
        this.editor.terrainEditor.init(this.editor.hexMap.terrain);
        this.editor.edgeEditor.init(this.editor.hexMap.edges);

		this.jumpEditor.handleMapLoad(evt); // order is important 
	}
}