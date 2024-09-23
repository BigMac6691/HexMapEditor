class HexEditor extends SidePanel
{
    constructor(title, editor)
    {
        super(title);

        this.editor = editor;

        this.editor.hexMap.svg.addEventListener("click", this.handleMouseClick.bind(this));

        this.hexId = HTML.create("p", {innerHTML: "column, row"});

        this.content.append(this.hexId);
    }

    showHex(hex)
    {
        this.hexId.innerHTML = `${hex.col}, ${hex.row}`;

        console.log("\n" + this.hexId.innerHTML);
        console.log(hex.terrain);
        console.log(hex.edges);
        console.log(hex.corners);
        console.log(hex.connectors);
        console.log(hex.metadata);
        console.log(hex.content);
    }

    handleMouseClick(evt)
    {
        if(!evt.target.id.includes(","))
			return;

		let hex = this.editor.hexMap.getHexFromId(evt.target.id);

        this.showHex(hex);
    }
}