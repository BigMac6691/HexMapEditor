/*
If I wanted to reuse this code I would not put the hex map and editor varibles
inside it.  What I want to do is have the code that deals with saving and 
loading in one centralized place.
*/
class FileEditor extends Editor
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
        console.log(this.editor.hexMap);
        let data = {};
        ["offsetOn", "displayCursor", "borderColour", "defaultHexFill", "textColour", "viewBoxWidth", "viewBoxHeight", "mapWidth", "mapHeight", "backgroundColour", "cursor", "jumpColour", "jumpWidth"]
            .forEach(v => data[v] = this.editor.hexMap[v]);

        data.defs = [];
        for(let e of this.editor.hexMap.defs.children)
            data.defs.push(e.outerHTML);

        ["terrainTypes", "edgeTypes", "cornerTypes", "connectorTypes"].forEach(v => 
        {
            if(this.editor.hexMap[v])
                data[v] = [...this.editor.hexMap[v]];
        });

        console.log(this.editor.hexMap.terrain);

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
            this.editor.hexMap.metadata.forEach((v, k) => data.metadata.push([k, v]));

        data.borders = [];
        if(this.editor.hexMap.borders)
            this.editor.hexMap.borders.forEach((v, k) => data.borders.push([k, v]));

        data.jumps = [];
        this.editor.hexMap.jumps.forEach(v => data.jumps.push({"from": v.from, "to": v.to}));

        data.hexes = [];
        this.editor.hexMap.hexes.forEach(row =>
        {
            let rows = [];
            row.forEach(hex =>
            {
                let temp = {};

                ["col", "row", "terrain"].forEach(v => temp[v] = hex[v]);
                ["edges", "corners", "connectors", "borders", "content"].forEach(v => temp[v] = hex[v] ? [...hex[v].keys()] : null);
                ["metadata"].forEach(v => temp[v] = hex[v] ? [...hex[v]] : null);

                rows.push(temp);
            });

            data.hexes.push(rows);
        });

        localStorage.setItem(fileName, JSON.stringify(data));
        console.log(data);
    }

    handleLoad(evt)
    {
        let fileName = prompt("Load file name:", "test.hexmap");

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

            this.load(data);
            this.dispatchEvent(new CustomEvent("mapLoad", {detail: data}));
        }
        catch(e)
        {
            console.log(e);
            alert(`Exception processing ${fileName}, see console for more details.`);
        }
    }

    load(data)
    {
        while(this.editor.hexMap.defs.lastChild)
            this.editor.hexMap.defs.removeChild(this.editor.hexMap.defs.lastChild);

        this.editor.hexMap.svg.querySelectorAll("symbol").forEach(n => 
        {
            if(n.id !== "hexagon")
                this.editor.hexMap.svg.removeChild(n);
        });

        this.editor.hexMap.loadFile(data);
        this.editor.initMap();
        
        // since all the following are in their own classes they need to listen for the load event
        this.editor.makeHexUI();
        this.editor.defsEditor.init(this.editor.hexMap.defs.querySelectorAll("pattern"));
        this.editor.terrainEditor.init(this.editor.hexMap.terrain);
        this.editor.edgeEditor.init(this.editor.hexMap.edges);
    }
}