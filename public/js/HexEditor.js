class HexEditor extends SidePanel
{
    constructor(title, editor)
    {
        super(title);

        this.editor = editor;
        this.display = "flex";
        this.content.classList.add("featureCol");
        this.inputMap = new Map(); // key input, value what type it is, edge corner, etc.
        this.boundTextListener = this.handleTextChange.bind(this);

        this.editor.hexMap.svg.addEventListener("click", this.handleMouseClick.bind(this));

        this.hexId = HTML.create("p", {innerHTML: "Hex Id: column, row", style:"text-align: center;"});

        this.content.append(this.hexId);
    }

    showHex(hex) // found other bug - loading an new map adds to the existing editors, ppssible other things as well...
    {
        this.inputMap.clear();
        this.content.innerHTML = "";

        this.hex = hex;
        this.hexId.innerHTML = `Hex Id: ${hex.col}, ${hex.row}`;

        this.content.append(this.hexId, HTML.create("p", {innerHTML: "<b>Terrain</b>"}));
        let n = HTML.create("input", {type: "text", value: JSON.stringify(hex.terrain), "flex-grow": "1"}, null, {change: this.boundTextListener});
        this.inputMap.set(n, {type: "terrain", original: JSON.stringify(hex.terrain)});
        this.content.append(n);

        ["edges", "corners", "connectors", "metadata", "content"].forEach(f => 
        {
            this.content.append(HTML.create("p", {innerHTML: `<b>${f.charAt(0).toUpperCase()}${f.slice(1)}</b>`}));

            if(hex[f])
            {
                hex[f].forEach((v, k) =>
                {
                    n = HTML.create("input", {type: "text", value: k, "flex-grow": "1"}, null, {change: this.boundTextListener});
                    this.inputMap.set(n, {type: f, original: k});
                    this.content.append(n);
                });
            }
        });
    }

    handleTextChange(evt)
    {
        let newValue = ""
        
        try
        {
            newValue = JSON.parse(evt.target.value);
        }
        catch(error)
        {
            console.log(error);

            alert("JSON parsing error!\nAction aborted, see console for details.");
            return;
        }
        
        let input = this.inputMap.get(evt.target);

        switch(input.type)
        {
            case "terrain":
                this.hex.setTerrain(newValue);
                break;

            case "edges":
                this.hex.edges.get(input.original).remove();
                this.hex.edges.delete(input.original);
                this.hex.addEdge(newValue);
                break;

            case "corners":
                this.hex.corners.get(input.original).remove();
                this.hex.corners.delete(input.original);
                this.hex.addCorner(newValue);
                break;

            case "connectors":
                this.hex.connectors.get(input.original).remove();
                this.hex.connectors.delete(input.original);
                this.hex.addConnector(newValue);
                break;
            
            case "metadata":
                this.hex.metadata.get(input.original).forEach(n => n.remove());
                this.hex.metadata.delete(input.original);
                this.hex.addMetadata(newValue);
                break;

            case "content":
                break;

            default:
                throw new Error(`Unknown hex edit type [${input.type}]`);
        }
    }

    handleMouseClick(evt)
    {
        if(!evt.target.id.includes(","))
			return;

		let hex = this.editor.hexMap.getHexFromId(evt.target.id);

        this.showHex(hex);
    }
}