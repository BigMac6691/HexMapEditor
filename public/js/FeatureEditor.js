class FeatureEditor extends EventTarget
{
    constructor(map)
    {
        this.help = "This is the editing interface for a feature.";
        this.hexMap = map;
        this.items = new Map();

        this.boundCreate = this.handleCreate.bind(this);
        this.boundUpdate = this.handleUpdate.bind(this);
        this.boundDelete = this.handleDelete.bind(this);
        this.boundShow = this.handleShow.bind(this);
        this.boundClear = this.handleClear.bind(this);
        this.boundChange = this.handleListChange.bind(this);
        this.boundHelp = this.handleHelp.bind(this);

        this.uiDiv = HTML.create("div", {style: "display: none;"}, ["featureCol"]);
        this.idList = HTML.create("select", {size: "6", style: "min-width: 10em; max-width: 50%"}, null, {change: this.boundChange});
        this.parts = HTML.create("div", null, ["featureCol"]);
        this.svg = HTML.create("textarea");
        this.svg.rows = 5;

        this.id = HTML.create("input", {type: "text"});
        this.parts.append(HTML.createLabel("ID: ", this.id));

        let tempDiv1 = HTML.create("div", null, ["featureRow"]);
        tempDiv1.append(this.idList, this.parts);

        let buttonDiv = HTML.create("div", null, ["featureRow"]);
        buttonDiv.append(HTML.create("button", {textContent: "Create"}, null, {click: this.boundCreate}), 
                        HTML.create("button", {textContent: "Update"}, null, {click: this.boundUpdate}), 
                        HTML.create("button", {textContent: "Delete"}, null, {click: this.boundDelete}),
                        HTML.create("button", {textContent: "Show"}, null, {click: this.boundShow}),
                        HTML.create("button", {textContent: "Clear"}, null, {click: this.boundClear}),
                        HTML.create("button", {innerHTML: "&#10067;"}, null, {click: this.boundHelp}));

        this.uiDiv.append(tempDiv1, this.svg, buttonDiv);
    }

    init(list)
    {
        this.clear();
        this.items.clear();

        while(this.idList.options.length)
            this.idList.remove(0);
    }

    getKey()
    {
        return "";
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
        let key = this.getKey();

        if(!key)
        {
            alert("Missing or invalid id.");
            return false;
        }

        if(this.items.has(key))
        {
            alert(`Duplicate id "${key}"`);
            return false;
        }    

        return true;
    }

    handleUpdate(evt)
    {
        let key = this.getKey();

        if(!key)
        {
            alert("Missing or invalid id.");
            return false;
        }

        if(!this.items.has(key))
        {
            alert(`Record with id "${key}" not found.`);
            return false;
        }

        return true;
    }

    handleDelete(evt)
    {
        let key = this.getKey();

        if(!key)
        {
            alert("Missing or invalid id.");
            return false;
        }

        if(!this.items.has(key))
        {
            alert(`Record with id "${key}" not found.`);
            return false;
        }

        return true;
    }

    clear()
    {
        this.id.value = "";
    }

    handleShow()
    {
        console.log("Showing something...");
    }

    handleClear()
    {
        this.hexMap.hexes = [[new Hex(this.hexMap, 0, 0)]];
        this.hexMap.initMap();
    }

    handleHelp()
    {
        let dialog = document.getElementById("helpDialog");
        let content = document.getElementById("helpContent");
        
        content.innerHTML = this.help;
        dialog.showModal();
        dialog.scrollTop = 0;
    }
}