class HexMapEditor
{
    constructor() 
    {
        let mp = document.getElementById("mapPanel");

        this.map = SVG.create({type: "svg", attr: {viewBox: "0 0 100 100", preserveAspectRatio: "none"}});
        mp.append(this.map);

        console.log(mp.scrollWidth);

        let cp = document.getElementById("controlPanel");
        
        this.viewBox = HTML.create("input", {value: this.map.getAttribute("viewBox")});
        cp.append(HTML.createLabel("View Box: ", this.viewBox));

        this.mapWidth = HTML.create("input", {type: "number", value: mp.scrollWidth});
        cp.append(HTML.createLabel("Map width: ", this.mapWidth));

        this.mapHeight = HTML.create("input", {type: "number", value: mp.scrollHeight});
        cp.append(HTML.createLabel("Map height: ", this.mapHeight));

        this.rows = HTML.create("input", {type: "number", value: 1});
        cp.append(HTML.createLabel("Rows: ", this.rows));

        this.cols = HTML.create("input", {type: "number", value: 1});
        cp.append(HTML.createLabel("Columns: ", this.cols));
    }
}