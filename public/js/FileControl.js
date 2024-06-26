class FileControl extends ControlUI
{
    constructor(title)
    {
        super(title);

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

        this.dispatchEvent("mapSave")
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
        
        if(file)
        {
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
        else
        {
            alert(`Error loading file ${fileName}.`);
            return;
        }
    }
}