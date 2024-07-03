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
					this.editor.hexMap.terrainTypes.add("Test Terrain");
					this.terrainSelect = new ComboRadioSelect(this.editor.hexMap.terrainTypes, "terrainCRS");
					n = this.terrainSelect.groupDiv;
					break;

				case "Edges":
					this.editor.hexMap.edgeTypes.add("Test Edge");
					this.edgeSelect = new ComboRadioSelect(this.editor.hexMap.edgeTypes, "edgeCRS");
					n = this.edgeSelect.groupDiv;
					break;

				case "Connectors":
					this.editor.hexMap.connectorTypes.add("Test Connector");
					this.connectorSelect = new ComboRadioSelect(this.editor.hexMap.connectorTypes, "connectorCRS");
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
	}
}