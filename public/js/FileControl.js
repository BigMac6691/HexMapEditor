/*
If I wanted to reuse this code I would not put the hex map and editor varibles
inside it.  What I want to do is have the code that deals with saving and 
loading in one centralized place.
*/
class FileEditor extends SidePanel
{
    constructor(title, editor)
    {
        super(title);

        this.editor = editor;
        this.display = "flex";
        this.boundSave = this.handleSave.bind(this);
        this.boundLoad = this.handleLoad.bind(this);

        this.content.classList.add("fileDiv");
        this.content.append(HTML.create("button", {type: "button", innerHTML: "Load"}, null, {click: this.boundLoad}));
        this.content.append(HTML.create("button", {type: "button", innerHTML: "Save"}, null, {click: this.boundSave}));
        this.content.append(this.fileName = HTML.create("div", {innerHTML: "- no current file -"}));
    }

    handleSave(evt)
    {
        let fileName = prompt("Save file name:", this.fileName.innerHTML);

        if(!fileName)
            return;

        this.fileName.innerHTML = fileName;

        this.save(fileName);
        this.dispatchEvent(new CustomEvent("mapSave", {detail: fileName}));
    }

    save(fileName)
    {
        this.dispatchEvent(new CustomEvent("mapSave"));

        console.log(this.editor.hexMap);

        let data = {};
        ["offsetOn", "displayCursor", "borderColour", "defaultHexFill", "textColour", 
         "viewBoxWidth", "viewBoxHeight", "mapWidth", "mapHeight", "vpMin", "vpMax", 
         "backgroundColour", "cursor", "vpTopLeft", "vpWidthHeight"]
            .forEach(v => data[v] = this.editor.hexMap[v]);

        data.defs = [];
        this.editor.hexMap.defs.querySelectorAll("pattern").forEach(v => data.defs.push(v.outerHTML));

        ["terrainTypes", "edgeTypes", "cornerTypes", "connectorTypes"].forEach(v => 
        {
            if(this.editor.hexMap[v])
                data[v] = [...this.editor.hexMap[v]];
        });

        data.terrain = [];
        if(this.editor.hexMap.terrain)
            this.editor.hexMap.terrain.forEach((v, k) => data.terrain.push([k, v]));

        data.edges = [];
        if(this.editor.hexMap.edges)
            this.editor.hexMap.edges.forEach((v, k) => data.edges.push([k, v.innerHTML]));

        data.corners = [];
        if(this.editor.hexMap.corners)
            this.editor.hexMap.corners.forEach((v, k) => data.corners.push([k, v.innerHTML]));

        data.connectors = [];
        if(this.editor.hexMap.connectors)
            this.editor.hexMap.connectors.forEach((v, k) => data.connectors.push([k, v.innerHTML]));

        data.metadata = [];
        if(this.editor.hexMap.metadata)
            this.editor.hexMap.metadata.forEach((v, k) => 
            {
                let out = {...v, renderData: Array.from(v.renderData).map(([key, value]) => 
                {
                    let {["node"]: _, ...newValue} = value;
                    return [key, newValue];
                })};

                data.metadata.push([k, out]);
            });

        data.jumps = [];
        this.editor.hexMap.jumps.forEach(v => data.jumps.push({"from": v.from, "to": v.to, "colour": v.colour, "width": v.width}));

        data.hexes = [];
        this.editor.hexMap.hexes.forEach(row =>
        {
            let rows = [];
            row.forEach(hex =>
            {
                let temp = {};

                ["col", "row", "terrain"].forEach(v => temp[v] = hex[v]);
                ["edges", "corners", "connectors", "content"].forEach(v => temp[v] = hex[v] ? [...hex[v].keys()] : null);

                let md = [];
                if(hex.metadata)
                {
                    hex.metadata.forEach((v, k) => 
                    {
                        console.log("\n");
                        console.log(k);
                        console.log(hex.borders);
                        console.log(hex);

                        let record =
                        {
                            key: k,
                            value: v,
                            symbolIds: hex.borders 
                                ? Array.from(hex.borders)
                                    .filter(([key, value]) => key.startsWith(k))
                                    .map(([key, value]) => key)
                                : []
                        }

                        md.push(record);
                    });
                }

                temp.metadata = md;

                rows.push(temp);
            });

            data.hexes.push(rows);
        });

        localStorage.setItem(fileName, JSON.stringify(data));
        console.log(data);
    }

    handleLoad(evt)
    {
        let fileName = prompt("Load file name:", "test.hexmap.v1");

        if(!fileName)
        {
            alert(`File ${fileName} not found or empty.`);
            return;
        }

        let file = localStorage.getItem(fileName);
        
        if(!file)
        {
            alert(`Error loading file ${fileName}.`);
            return;
        }

        console.log(`Size of file=${file.length}`);

        try
        {
            let data = JSON.parse(file);

            console.log(`Size of hexes=${JSON.stringify(data.hexes).length}`);
            console.log(data);

            this.fileName.innerHTML = fileName;

            this.dispatchEvent(new CustomEvent("mapLoad", {detail: data}));
        }
        catch(e)
        {
            console.log(e);
            alert(`Exception processing ${fileName}, see console for more details.`);
        }
    }
}