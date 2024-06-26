class ControlUI extends EventTarget
{
    constructor(title)
    {
        super();

        this.boundClick = this.handleClick.bind(this);
        
        this.title = HTML.create("h3", {textContent: title}, null, {click: this.boundClick});
        this.content = HTML.create("div", {style: "display: none;"});
        this.display = "block";

        this.div = HTML.create("div", null, ["controlDiv"]);
        this.div.append(this.title, this.content);
    }

    handleClick(evt)
    {
        console.log(evt);

        this.content.style.display = this.content.style.display === "none" ? this.display : "none";
    }
}