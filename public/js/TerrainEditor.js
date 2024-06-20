class TerrainEditor extends FeatureEditor
{
    constructor(map)
    {
        super(map);
    }

    handleListChange(evt)
    {
        if(!this.items.has(evt.target.value))
            return;

        let n = this.items.get(evt.target.value);

        this.id.value = n.id;
        this.svg.value = n.innerHTML;
    }

    handleCreate(evt)
    {
        if(!super.handleCreate(evt))
            return;

        this.items.set(this.id.value, this.svg.value);
        this.idList.append(HTML.create("option", {text: this.id.value, value: this.id.value}));
        this.idList.value = this.id.value;
    }

    handleUpdate(evt)
    {
        if(!super.handleUpdate(evt))
            return;

        this.items.set(this.id.value, this.svg.value);
    }

    handleDelete(evt)
    {
        if(!super.handleDelete(evt))
            return;

        this.idList.removeChild(this.idList.options[this.idList.selectedIndex]);
        this.items.delete(this.id.value);

        this.id.value = "";
        this.svg.value = "";
    }

    handleShow()
    {
        
    }
}