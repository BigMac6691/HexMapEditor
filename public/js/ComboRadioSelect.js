class ComboRadioSelect extends EventTarget
{
	constructor(list, name)
	{
		super();

		this.boundChangeHandler = this.handleChange.bind(this);
	
		this.select = document.createElement("select");
		this.groupDiv = document.createElement("div");
		this.group = [];
		
        this.select.style = "display: none";
		this.groupDiv.style = "display: none";

		this.selectDisplay = "block";
		this.groupDisplay = "flex";

		this.select.addEventListener("change", this.boundChangeHandler);

        this.init(list, name);
	}

	init(list, name)
	{
		while(this.groupDiv.lastElementChild) // clears radio, need to clear select as well
			this.groupDiv.removeChild(this.groupDiv.lastElementChild);

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
		
		this.value = this.select.value;
		
		this.updateGroup(this.select.value);
	}
	
	show(v)
	{
		if(v)
		{
			this.select.style.display = this.selectDisplay;
			this.groupDiv.style.display = "none";
		}
		else
		{
			this.select.style.display = "none";
			this.groupDiv.style.display = this.groupDisplay;
		}
	}

	// display(v)
	// {
	// 	if(v)
	// 	{
	// 		if(this.select.style.display === 'none')
	// 		{
	// 			this.select.style.display = this.selectDisplay;
	// 			this.groupDiv.style.display = "none";
	// 		}
	// 		else
	// 		{
	// 			this.select.style.display = "none";
	// 			this.groupDiv.style.display = this.groupDisplay;
	// 		}
	// 	}
	// 	else
	// 	{
	// 		this.select.style.display = "none";
	// 		this.groupDiv.style.display = "none";
	// 	}
	// }

	handleChange(evt)
	{
		if(evt.target === this.select)
			this.updateGroup(evt.target.value);
		else
			this.select.value = evt.target.value;
		
		this.value = this.select.value;

		this.dispatchEvent(new CustomEvent("change", {detail: {value: this.value}}));
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