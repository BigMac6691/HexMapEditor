class FeatureEditor
{
    constructor(map)
    {
        this.hexMap = map;
        this.items = new Map();

        this.boundCreate = this.handleCreate.bind(this);
        this.boundUpdate = this.handleUpdate.bind(this);
        this.boundDelete = this.handleDelete.bind(this);
        this.boundShow = this.handleShow.bind(this);
        this.boundClear = this.handleClear.bind(this);
        this.boundChange = this.handleListChange.bind(this);

        this.uiDiv = HTML.create("div", {style: "display: none;"}, ["featureCol"]);
        this.idList = HTML.create("select", {size: "6", style: "min-width: 10em; max-width: 50%"}, null, {change: this.boundChange});
        this.parts = HTML.create("div", null, ["featureCol"]);
        this.svg = HTML.create("textarea");
        this.svg.rows = 5;

        this.id = HTML.create("input", {type: "text"});
        this.parts.append(HTML.createLabel("ID: ", this.id));

        let tempDiv1 = HTML.create("div", null, ["featureRow"]);
        tempDiv1.append(this.idList, this.parts);

        let tempDiv2 = HTML.create("div", null, ["featureRow"]);
        tempDiv2.append(HTML.create("button", {textContent: "Create"}, null, {click: this.boundCreate}), 
                        HTML.create("button", {textContent: "Update"}, null, {click: this.boundUpdate}), 
                        HTML.create("button", {textContent: "Delete"}, null, {click: this.boundDelete}),
                        HTML.create("button", {textContent: "Show"}, null, {click: this.boundShow}),
                        HTML.create("button", {textContent: "Clear"}, null, {click: this.boundClear}));

        this.uiDiv.append(tempDiv1, this.svg, tempDiv2);
    }

    display(v)
    {
        this.uiDiv.style.display = v ? "flex" : "none";
    }

    handleListChange(evt)
    {
        console.log(evt);
    }

    handleCreate(evt)
    {
        if(!this.id.value)
        {
            alert("Missing or invalid id.");
            return false;
        }

        if(this.items.has(this.id.value))
        {
            alert(`Duplicate id "${this.id.value}"`);
            return false;
        }    

        return true;
    }

    handleUpdate(evt)
    {
        if(!this.id.value)
        {
            alert("Missing or invalid id.");
            return false;
        }

        if(!this.items.has(this.id.value))
        {
            alert(`Record with id "${this.id.value}" not found.`);
            return false;
        }

        return true;
    }

    handleDelete(evt)
    {
        if(!this.id.value)
        {
            alert("Missing or invalid id.");
            return false;
        }

        if(!this.items.has(this.id.value))
        {
            alert(`Record with id "${this.id.value}" not found.`);
            return false;
        }

        return true;
    }

    handleShow()
    {
        console.log("Showing something...");
    }

    handleClear()
    {
        this.hexMap.hexes = [[new Hex(hexMap, 0, 0)]];
        this.hexMap.initMap();
    }
}