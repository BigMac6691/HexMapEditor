class HexEditor extends SidePanel
{
    constructor(title, editor)
    {
        super(title);

        this.editor = editor;
        this.display = "flex";
        this.content.classList.add("featureCol");
        this.inputMap = new Map(); // key input, value original value.  Need more work, need to know what aspect is being altered: edge, corner, connector, etc.
        this.boundTextListener = this.handleTextChange.bind(this);

        this.editor.hexMap.svg.addEventListener("click", this.handleMouseClick.bind(this));

        this.hexId = HTML.create("p", {innerHTML: "Hex Id: column, row", style:"text-align: center;"});

        this.content.append(this.hexId);
    }

    showHex(hex) // found other bug - loading an new map adds to the existing editors, ppssible other things as well...
    {
        this.inputMap.clear();
        this.content.innerHTML = "";
        this.hexId.innerHTML = `Hex Id: ${hex.col}, ${hex.row}`;

        this.content.append(this.hexId, HTML.create("p", {innerHTML: "<b>Terrain</b>"}));
        let n = HTML.create("input", {type: "text", value: JSON.stringify(hex.terrain), "flex-grow": "1"}, null, {change: this.boundTextListener});
        this.inputMap.set(n, hex.terrain);
        this.content.append(n);

        ["edges", "corners", "connectors", "metadata", "content"].forEach(f => 
        {
            this.content.append(HTML.create("p", {innerHTML: `<b>${f.charAt(0).toUpperCase()}${f.slice(1)}</b>`}));

            if(hex[f])
            {
                hex[f].forEach((v, k) =>
                {
                    n = HTML.create("input", {type: "text", value: k, "flex-grow": "1"}, null, {change: this.boundTextListener});
                    this.inputMap.set(n, k);
                    this.content.append(n);
                });
            }
        });
    }

    handleTextChange(evt)
    {
        console.log(evt);
    }

    handleMouseClick(evt)
    {
        if(!evt.target.id.includes(","))
			return;

		let hex = this.editor.hexMap.getHexFromId(evt.target.id);

        this.showHex(hex);
    }
}