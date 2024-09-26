class SidePanel extends EventTarget
{
    constructor(title)
    {
        super();

        this.boundTitleClick = this.handleTitleClick.bind(this);
        
        this.title = HTML.create("h3", {textContent: title, style: "cursor: pointer;"}, null, {click: this.boundTitleClick});
        this.content = HTML.create("div", {style: "display: none;"});
        this.display = "block"; // default value

        this.div = HTML.create("div", null, ["controlDiv"]);
        this.div.append(this.title, this.content);
    }

    handleTitleClick(evt)
    {
        this.content.style.display = this.content.style.display === "none" ? this.display : "none";
    }
}