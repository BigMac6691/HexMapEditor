class JumpEditor
{
	constructor(editor)
	{
		this.editor = editor;
		this.boundChange = this.handleChange.bind(this);
		this.boundButtons = this.handleButtons.bind(this);

        this.editor.hexMap.svg.addEventListener("mousemove", this.handleMouseMove.bind(this));
        this.editor.hexMap.svg.addEventListener("click", this.handleMouseClick.bind(this));

		this.div = HTML.create("div", {style: "display:none"});
        let tempDiv = HTML.create("div", {style: "padding-bottom: 0.5em;"});

        this.fromCol = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundChange});
        this.fromRow = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundChange});
        tempDiv.append(HTML.createLabel("Jump from: ", this.fromCol), HTML.createLabel(", ", this.fromRow));

        this.toCol = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundChange});
        this.toRow = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundChange});
        tempDiv.append(HTML.createLabel(" to ", this.toCol), HTML.createLabel(", ", this.toRow));
        this.div.append(tempDiv);

        tempDiv = HTML.create("div");
        this.create = HTML.create("button", {type: "button", innerHTML: "Create"}, null, {click: this.boundButtons});
        this.delete = HTML.create("button", {type: "button", innerHTML: "Delete", style: "display:none"}, null, {click: this.boundButtons});
        this.select = HTML.create("select", null, null, {change: this.handleSelect.bind(this)});

        let data = [{text: "New Jump", value: "new"}];
        this.editor.hexMap.jumps.forEach((v, k) => data.push({text: `Jump ${v.from} to ${v.to}`, value: k}));
        HTML.addOptions(this.select, data);
        tempDiv.append(HTML.createLabel("Jumps: ", this.select), " ", this.create, " ", this.delete);
        
        this.jumpStart = null;
        this.jumpLine = null;
        this.div.append(tempDiv);
	}

    handleMouseMove(evt)
    {
        if(this.div.style.display === "none" || !evt.target.id.includes(",") || !this.jumpStart)
            return;

        let coords = evt.target.id.split(",");
        let hex = this.editor.hexMap.getHexFromId(evt.target.id);

        let x = +hex.hexTerrain.x.baseVal.value + hex.hexTerrain.width.baseVal.value / 2;
        let y = +hex.hexTerrain.y.baseVal.value + hex.hexTerrain.height.baseVal.value / 2

        this.jumpLine.setAttribute("x2", x);
        this.jumpLine.setAttribute("y2", y);

        this.toCol.value = coords[0];
        this.toRow.value = coords[1];
    }

    handleMouseClick(evt)
    {
        if(this.div.style.display === "none" || !evt.target.id.includes(","))
            return;

        let coords = evt.target.id.split(",");
        let hex = this.editor.hexMap.getHexFromId(evt.target.id);

        let x = +hex.hexTerrain.x.baseVal.value + hex.hexTerrain.width.baseVal.value / 2;
        let y = +hex.hexTerrain.y.baseVal.value + hex.hexTerrain.height.baseVal.value / 2

        if(this.jumpStart)
        {
            this.toCol.value = coords[0];
            this.toRow.value = coords[1];
            this.jumpStart = null;
        }
        else
        {
            if(this.select.value === "new")
            {
                this.jumpLine = SVG.create("line", {x1: x, y1: y, x2: x, y2: y, stroke: this.editor.modelControl.jumpColour.value, "stroke-width": this.editor.modelControl.jumpWidth.value, class: "jumpLine"});
                this.editor.hexMap.map.append(this.jumpLine);
            }
            else
            {
                this.jumpLine = this.editor.hexMap.jumps.get(+this.select.value).svg;
                this.jumpLine.setAttribute("x1", x);
                this.jumpLine.setAttribute("y1", y);
            }

            this.fromCol.value = coords[0];
            this.fromRow.value = coords[1];
            this.jumpStart = hex;
        }
    }

	handleButtons(evt)
    {
        if(evt.target === this.create)
        {
            let index = this.editor.hexMap.jumpNextIndex++;
            let jump = 
            {
                from: `${+this.fromCol.value},${+this.fromRow.value}`, 
                to:`${+this.toCol.value},${+this.toRow.value}`,
                svg: this.jumpLine
            };
        
            this.editor.hexMap.jumps.set(index, jump);
            HTML.addOptions(this.select, [{text: `Jump ${jump.from} to ${jump.to}`, value: index}]);

            this.select.value = index;
            this.select.dispatchEvent(new Event("change"));
        }
        else if(evt.target === this.delete)
        {
            let index = this.select.selectedIndex;
            let jump = this.editor.hexMap.jumps.get(+this.select.value);

            this.jumpLine = null;
            this.editor.hexMap.jumps.delete(+this.select.value);
            this.editor.hexMap.map.removeChild(jump.svg);

            this.select.value = "new";
            this.select.dispatchEvent(new Event("change"));
            this.select.remove(index);
        }
    }

	handleChange(evt) // column row inputs changed
    {
        let isFrom = evt.target === this.fromCol || evt.target === this.fromRow;
        let id = null;

        if(isFrom)
            id = this.fromCol.value + "," + this.fromRow.value;
        else
            id = this.toCol.value + "," + this.toRow.value;

        let hex = this.editor.hexMap.getHexFromId(id);

        let x = +hex.hexTerrain.x.baseVal.value + hex.hexTerrain.width.baseVal.value / 2;
        let y = +hex.hexTerrain.y.baseVal.value + hex.hexTerrain.height.baseVal.value / 2;

        if(this.select.value === "new")
        {
            if(!this.jumpStart)
            {
                this.jumpStart = this.editor.hexMap.getHexFromId(`${this.fromCol.value},${this.fromRow.value}`);

                let startX = +this.jumpStart.hexTerrain.x.baseVal.value + this.jumpStart.hexTerrain.width.baseVal.value / 2;
                let startY = +this.jumpStart.hexTerrain.y.baseVal.value + this.jumpStart.hexTerrain.height.baseVal.value / 2;

                this.jumpLine = SVG.create("line", {x1: startX, y1: startY, x2: startX, y2: startY, stroke: "#ff0000", "stroke-width": "6", class: "jumpLine"});
                this.editor.hexMap.map.append(this.jumpLine);
            }
        }
        else
        {
            this.jumpLine = this.editor.hexMap.jumps.get(+this.select.value).svg;
        }

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

    handleSelect(evt)
    {
        let ids = [];

        if(evt.target.value === "new")
        {
            ids = [0, 0, 0, 0];
            this.jumpStart = null;
            this.jumpLine = null;
            this.create.style.display = "inline";
            this.delete.style.display = "none";
        }
        else
        {
            let jump = this.editor.hexMap.jumps.get(+evt.target.value);

            ids.push(...jump.from.split(","), ...jump.to.split(","));
            this.jumpStart = this.editor.hexMap.getHexFromId(jump.from);
            this.jumpLine = jump.svg;
            this.create.style.display = "none";
            this.delete.style.display = "inline";
        }

        this.fromCol.value = ids[0];
        this.fromRow.value = ids[1];
        this.toCol.value = ids[2];
        this.toRow.value = ids[3];
    }

	handleMapLoad(evt)
	{
		console.log("JumpEditor - map load event...");

        while(this.select.options.length > 1)
            this.select.remove(1);

        this.editor.hexMap.jumps.forEach((j, i) =>
        {
            HTML.addOptions(this.select, [{text: `Jump ${j.from} to ${j.to}`, value: i}]);
        });
	}
}