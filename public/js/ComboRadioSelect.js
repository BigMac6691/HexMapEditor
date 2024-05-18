class ComboRadioSelect
{
	constructor(list, name)
	{
		this.boundChangeHandler = this.handleChange.bind(this);
	
		this.select = document.createElement("select");
		this.groupDiv = document.createElement("div");
		this.group = [];
		
        this.select.style = "display: none";
		this.groupDiv.style = "display: none";

        let div = document.createElement("div");
        div.style = "display: flex; flex-direction: column;";
		
		list.forEach(v => 
		{
			let option = document.createElement("option");
			option.text = v;
			option.value = v;
			
			this.select.append(option);
			
			let radio = document.createElement("input");
			radio.type = "radio";
			radio.value = v;
			radio.name = name;
			radio.addEventListener("change", this.boundChangeHandler);
			this.group.push(radio);
			
			let n = document.createElement("label");
			n.append(radio, radio.value);
			
            div.append(n);
		});

        this.groupDiv.append(div);
		
		this.select.addEventListener("change", this.boundChangeHandler);
		this.value = this.select.value;
		
		this.updateGroup(this.select.value);
	}
	
	show(v)
	{
		if(v)
		{
			this.select.style.display = "block";
			this.groupDiv.style.display = "none";
		}
		else
		{
			this.select.style.display = "none";
			this.groupDiv.style.display = "flex";
		}
	}
	
	handleChange(evt)
	{
		if(evt.target === this.select)
			this.updateGroup(evt.target.value);
		else
			this.select.value = evt.target.value;
		
		this.value = this.select.value;
	}
	
	updateGroup(v)
	{
		this.group.forEach(n => 
		{
			if(n.value === v)
				n.checked = true;
		});
	}
}