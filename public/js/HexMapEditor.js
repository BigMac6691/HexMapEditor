class HexMapEditor
{
    constructor() 
    {
        this.boundSVGChange = this.handleSVGChange.bind(this);
        this.boundMapModelChange = this.handleMapModelChange.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseClick = this.handleMouseClick.bind(this);
        this.boundKeypress = this.handleKeypress.bind(this);
        
        this.painting = false;

        this.hexMap = new HexMap();
        this.hexMap.svg.addEventListener("mousemove", this.boundMouseMove);
        this.hexMap.svg.addEventListener("click", this.boundMouseClick);

        this.hexMap.svg.addEventListener("mouseenter", () => 
        {
            this.hexMap.svg.style.cursor = "crosshair";
            document.addEventListener("keydown", this.boundKeypress);
        });

        this.hexMap.svg.addEventListener("mouseleave", () => 
        {
            this.hexMap.svg.style.cursor = "default";
            this.painting = false;
            document.removeEventListener("keydown", this.boundKeypress);
        });

        this.makeUI();
        this.hexMap.initMap();
    }

    makeUI()
    {
        let mp = document.getElementById("mapPanel");
        mp.append(this.hexMap.getSVG());

        // SVG attributes
        let div1 = this.makeSVGUI(mp);        

        // Model atributes
        let div2 = this.makeModelUI();

        // Hex attributes
        let div3 = this.makeHexUI();

        document.getElementById("controlPanel").append(div1, div2, div3);
    }

    makeSVGUI(mp)
    {
        let div = HTML.create("div", null, ["controlDiv"]);
        div.append(HTML.create("h3", {textContent: "SVG Attributes"}));

        let vbDiv = HTML.create("div");
        this.viewBoxWidth = HTML.create("input", {type: "number", value: "1000"}, null, {change: this.boundSVGChange});
        vbDiv.append(HTML.createLabel("View Box Width: ", this.viewBoxWidth));

        this.viewBoxHeight = HTML.create("input", {type: "number", value: "866"}, null, {change: this.boundSVGChange});
        vbDiv.append(HTML.createLabel(" Height: ", this.viewBoxHeight));
        div.append(vbDiv);

        let svgDiv = HTML.create("div");
        this.mapWidth = HTML.create("input", {type: "number", name: "width", value: mp.scrollWidth}, null, {change: this.boundSVGChange});
        svgDiv.append(HTML.createLabel("SVG Width: ", this.mapWidth, "px"));

        this.mapHeight = HTML.create("input", {type: "number", name: "height", value: mp.scrollHeight}, null, {change: this.boundSVGChange});
        svgDiv.append(HTML.createLabel(" Height: ", this.mapHeight, "px"));
        div.append(svgDiv);

        this.backgroundColour = HTML.create("input", {type: "color", value: "#0000ff"}, null, {change: this.boundSVGChange});
        div.append(HTML.createLabel("Background colour: ", this.backgroundColour));

        return div;
    }

    makeModelUI()
    {
        let div = HTML.create("div", null, ["controlDiv"]);
        div.append(HTML.create("h3", {textContent: "Model Attributes"}));

        let crDiv = HTML.create("div");
        this.cols = HTML.create("input", {type: "number", value: this.hexMap.hexes.length, min: 1}, null, {change: this.boundMapModelChange});
        crDiv.append(HTML.createLabel("Map Columns: ", this.cols));

        this.rows = HTML.create("input", {type: "number", value: this.hexMap.hexes[0].length, min: 1}, null, {change: this.boundMapModelChange});
        crDiv.append(HTML.createLabel(" Rows: ", this.rows));
        div.append(crDiv);

        this.borderColour = HTML.create("input", {type: "color", value: this.hexMap.borderColour}, null, {change: this.boundMapModelChange});
        div.append(HTML.createLabel("Border Colour: ", this.borderColour));

        this.defaultTerrainColour = HTML.create("input", {type: "color", value: this.hexMap.defaultHexFill}, null, {change: this.boundMapModelChange});
        div.append(HTML.createLabel("Default Hex Colour: ", this.defaultTerrainColour));

        return div;
    }

    makeHexUI()
    {
        let div = HTML.create("div", null, ["controlDiv"]);
        div.append(HTML.create("h3", {textContent: "Hex Attributes"}));

        this.mouseMove = HTML.create("p", {innerHTML: "Mouse location x, y"});
        this.mouseClick = HTML.create("p", {innerHTML: "Click location: x, y"});
        div.append(this.mouseMove, this.mouseClick);

        this.paintSelect = HTML.create("select");
        HTML.addOptions(this.paintSelect, 
            [
                {text: "None", value: "none"}, 
                {text: "Terrain", value: "terrain"},
                {text: "Edges", value: "edges"},
                {text: "Connectors", value: "connectors"},
                {text: "Jumps", value: "jumps"},
                {text: "Meta", value: "meta"},
                {text: "Content", value: "content"}
            ]);
        div.append(HTML.createLabel("Paint: ", this.paintSelect));

        this.terrainSelect = HTML.createSelect(this.hexMap.terrain);
        div.append(HTML.createLabel("Terrain: ", this.terrainSelect));

        this.edgeSelect = HTML.createSelect(this.hexMap.edges);
        div.append(HTML.createLabel("Edge: ", this.edgeSelect));

        this.boundJumpChange = this.handleJumpChange.bind(this);
        this.boundJumpSelect = this.handleJumpSelect.bind(this);
        this.boundJumpButtons = this.handleJumpButtons.bind(this);

        let jumpDiv = HTML.create("div");
        this.jumpFromCol = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundJumpChange});
        this.jumpFromRow = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundJumpChange});
        jumpDiv.append(HTML.createLabel("Jump from: ", this.jumpFromCol), HTML.createLabel(", ", this.jumpFromRow));

        this.jumpToCol = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundJumpChange});
        this.jumpToRow = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundJumpChange});
        jumpDiv.append(HTML.createLabel(" to ", this.jumpToCol), HTML.createLabel(", ", this.jumpToRow));
        div.append(jumpDiv);

        jumpDiv = HTML.create("div");
        this.jumpCreate = HTML.create("button", {type: "button", innerHTML: "Create"}, null, {click: this.boundJumpButtons});
        this.jumpDelete = HTML.create("button", {type: "button", innerHTML: "Delete", style: "display:none"}, null, {click: this.boundJumpButtons});
        this.jumpSelect = HTML.create("select", null, null, {change: this.boundJumpSelect});
        let data = [{text: "New Jump", value: "new"}];
        this.hexMap.jumps.forEach((v, k) => data.push({text: `Jump ${v.from} to ${v.to}`, value: k}));
        HTML.addOptions(this.jumpSelect, data);
        jumpDiv.append(HTML.createLabel("Jumps: ", this.jumpSelect), " ", this.jumpCreate, " ", this.jumpDelete);
        div.append(jumpDiv);

        return div;
    }

    handleKeypress(evt)
    {
        this.painting = !this.painting;

        if(this.painting)
            this.hexMap.svg.style.cursor = "cell";
        else
            this.hexMap.svg.style.cursor = "crosshair";
    }

    handleSVGChange(evt)
    {
        if(evt.target === this.viewBoxWidth || evt.target === this.viewBoxHeight)
        {
            this.hexMap.getSVG().setAttribute("viewBox", `0 0 ${this.viewBoxWidth.value} ${this.viewBoxHeight.value}`);
            // this.recalculatePolygon();
        }
        else if(evt.target === this.backgroundColour)
            this.hexMap.getSVG().style.background = evt.target.value;
        else
            this.hexMap.getSVG().setAttribute(evt.target.name, evt.target.value);
    }

    handleMapModelChange(evt)
    {
        console.log("Map model change...");

        this.hexMap.borderColour = this.borderColour.value;
        this.hexMap.defaultHexFill = this.defaultTerrainColour.value;

        let c = +this.cols.value;
        let r = +this.rows.value;
        let model = this.hexMap.hexes;
        let modelChange = c != model.length || r != model[0].length

        // Handle column changes
        if(c < model.length)
            model.length = c;
        else if(c > model.length)
        {
            while(model.length < c)
                model.push(Array.from({length: model[0].length}, (_, n) => new Hex(this.hexMap, model.length, n)));
        }

        // Handle row changes
        if(r < model[0].length)
            model.forEach(row => row.length = r);
        else if(r > model[0].length)
        {
            let n = r - model[0].length;

            for(let ci = 0; ci < model.length; ci++)
                for(let ri = 0; ri < n; ri++)
                    model[ci].push(new Hex(this.hexMap, ci, model[ci].length))
        }

        if(modelChange)
        {
            let mapPanel = document.getElementById("mapPanel");
            mapPanel.style.fontSize = `${100 / (this.hexMap.hexes[0].length + (this.hexMap.hexes.length > 1 ? 0.5 : 0))}px`;

            console.log(`Font size: ${mapPanel.style.fontSize}`);

            this.hexMap.cursor.x = Math.min(this.hexMap.hexes.length - 1, this.hexMap.cursor.x);
            this.hexMap.cursor.y = Math.min(this.hexMap.hexes[0].length - 1, this.hexMap.cursor.y);

            this.hexMap.initMap();
        }
        else
            this.hexMap.drawMap();
    }

    handleMouseMove(evt)
    {
        if(!evt.target.id.includes(","))
            return;

        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.hexMap.svg.getScreenCTM().inverse());
        this.mouseMove.innerHTML = `Mouse location: ${Math.trunc(pt.x * 100) / 100}, ${Math.trunc(pt.y * 100) / 100} in hex ${evt.target.id} isPainting ${this.painting}`;

        if(this.painting)
        {
            if(this.paintSelect.value === "jumps")
                this.updateJump(evt.target.id, false);
            else
                this.updateHex(evt.target.id, pt);
        }
    }

    handleMouseClick(evt)
    {
        if(!evt.target.id.includes(","))
            return;

        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.hexMap.svg.getScreenCTM().inverse());
        this.mouseClick.innerHTML = `Click location: ${Math.trunc(pt.x * 100) / 100}, ${Math.trunc(pt.y * 100) / 100} with id ${evt.target.id}`;

        if(this.paintSelect.value === "jumps")
            this.updateJump(evt.target.id, true);
        else
            this.updateHex(evt.target.id, pt);
    }

    handleJumpButtons(evt)
    {
        if(evt.target === this.jumpCreate)
        {
            let index = this.hexMap.jumpNextIndex++;
            let jump = {from: `${+this.jumpFromCol.value},${+this.jumpFromRow.value}`, 
                        to:`${+this.jumpToCol.value},${+this.jumpToRow.value}`,
                        svg: this.jumpLine};
        
            this.hexMap.jumps.set(index, jump);
            HTML.addOptions(this.jumpSelect, [{text: `Jump ${jump.from} to ${jump.to}`, value: index}]);
            this.jumpSelect.value = index;
            this.jumpSelect.dispatchEvent(new Event("change"));
        }
        else if( evt.target === this.jumpDelete)
        {
            let index = this.jumpSelect.selectedIndex;
            let jump = this.hexMap.jumps.get(+this.jumpSelect.value);

            this.jumpLine = null;
            this.hexMap.jumps.delete(+this.jumpSelect.value);
            this.hexMap.map.removeChild(jump.svg);

            this.jumpSelect.value = "new";
            this.jumpSelect.dispatchEvent(new Event("change"));
            this.jumpSelect.remove(index);
        }
    }

    updateJump(id, endPoint)
    {
        let coords = id.split(",");
        let hex = this.hexMap.getHexFromId(id);

        let x = +hex.hexTerrain.x.baseVal.value + hex.hexTerrain.width.baseVal.value / 2;
        let y = +hex.hexTerrain.y.baseVal.value + hex.hexTerrain.height.baseVal.value / 2

        if(this.jumpStart) // start point already selected
        {
            this.jumpLine.setAttribute("x2", x);
            this.jumpLine.setAttribute("y2", y);

            this.jumpToCol.value = coords[0];
            this.jumpToRow.value = coords[1];
            
            if(endPoint) // mouse was clicked to create jump end
            {
                this.painting = false;
                this.jumpStart = null;
            }
        }
        else
        {
            if(this.jumpSelect.value === "new")
            {
                this.jumpLine = SVG.create("line", {x1: x, y1: y, x2: x, y2: y, stroke: "#ff0000", "stroke-width": "6", class: "jumpLine"});
                this.hexMap.map.append(this.jumpLine);
            }
            else
            {
                this.jumpLine = this.hexMap.jumps.get(+this.jumpSelect.value).svg;

                this.jumpLine.setAttribute("x1", x);
                this.jumpLine.setAttribute("y1", y);
            }

            console.log(this.jumpLine);

            this.jumpFromCol.value = coords[0];
            this.jumpFromRow.value = coords[1];

            this.jumpStart = hex;
            this.painting = true;           
        }
    }

    handleJumpChange(evt) // column row inputs changed
    {
        let isFrom = evt.target === this.jumpFromCol || evt.target === this.jumpFromRow;
        let id = null;

        if(isFrom)
            id = this.jumpFromCol.value + "," + this.jumpFromRow.value;
        else
            id = this.jumpToCol.value + "," + this.jumpToRow.value;

        let hex = this.hexMap.getHexFromId(id);

        let x = +hex.hexTerrain.x.baseVal.value + hex.hexTerrain.width.baseVal.value / 2;
        let y = +hex.hexTerrain.y.baseVal.value + hex.hexTerrain.height.baseVal.value / 2;

        if(isFrom)
        {
            this.jumpLine.setAttribute("x1", x);
            this.jumpLine.setAttribute("y1", y);
        }
        else
        {
            this.jumpLine.setAttribute("x2", x);
            this.jumpLine.setAttribute("y2", y);
        }
    }

    handleJumpSelect(evt)
    {
        let ids = [];

        if(evt.target.value === "new")
        {
            ids = [0, 0, 0, 0];
            this.jumpLine = null;
            this.jumpCreate.style.display = "inline";
            this.jumpDelete.style.display = "none";
        }
        else
        {
            let jump = this.hexMap.jumps.get(+evt.target.value);

            ids.push(...jump.from.split(","), ...jump.to.split(","));
            this.jumpLine = jump.svg;
            this.jumpCreate.style.display = "none";
            this.jumpDelete.style.display = "inline";
        }

        this.jumpStart = null;
        this.painting = false;
        this.jumpFromCol.value = ids[0];
        this.jumpFromRow.value = ids[1];
        this.jumpToCol.value = ids[2];
        this.jumpToRow.value = ids[3];
    }

    updateHex(id, pt)
    {
        if(this.paintSelect.value === "none")
            return;

        let hex = this.hexMap.getHexFromId(id);

        // console.log(hex.svg.innerHTML);
        // console.log(hex.svg.outerHTML);

        if(this.paintSelect.value === "terrain")
            hex.setTerrain(this.hexMap.terrain.get(this.terrainSelect.value));

        if(this.paintSelect.value === "edges") // need to develop a way to remove an edge, changing is easy.
        {
            let y = +hex.hexTerrain.y.baseVal.value;
            let h = hex.hexTerrain.height.baseVal.value / 4;
            let dy = pt.y - y;
            let rh = h / 5;

            let x = +hex.hexTerrain.x.baseVal.value;
            let w = hex.hexTerrain.width.baseVal.value / 4;
            let dx = pt.x - x;
            let rw = w / 5;
            let edgeIndex = -1;

            if(Math.abs(w / 2 - dx) < rw) //  top left and bottom left
                edgeIndex = Math.abs(h - dy) < rh ? 5 : (Math.abs(3 * h - dy) < rh ? 4 : -1);
            else if(Math.abs(3.5 * w - dx) < rw) // top right and bottom right
                edgeIndex = Math.abs(h - dy) < rh ? 1 : (Math.abs(3 * h - dy) < rh ? 2 : -1);
            else if(Math.abs(2 * w - dx) < rw) //  top and bottom
                 edgeIndex = dy < rh ? 0 : (Math.abs(4 * h - dy) < rh ? 3 : -1);

            if(edgeIndex >= 0)
                hex.addEdge({"edge" : this.edgeSelect.value, "edgeIndex" : edgeIndex, "variant" : 0});
        }
        
        if(this.paintSelect.value === "connectors") // roads and rails
            hex.terrain = this.terrain.get(this.terrainSelect.value);

        if(this.paintSelect.value === "meta") // country resources 
            hex.terrain = this.terrain.get(this.terrainSelect.value);

        if(this.paintSelect.value === "content") // units
            hex.terrain = this.terrain.get(this.terrainSelect.value);
    }
}