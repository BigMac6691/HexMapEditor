class ComboRadioSelect extends EventTarget
{
	constructor(list, name)
	{
		super();

		this.name = name;
		this.boundChangeHandler = this.handleChange.bind(this);
	
		this.select = document.createElement("select");
		this.radioDiv = document.createElement("div");
		this.groupDiv = document.createElement("div");
		this.group = [];
		
        this.select.style = "display: none";
		this.radioDiv.style = "display: flex; flex-direction: column;";
		this.groupDiv.style = "display: none";

		this.selectDisplay = "block";
		this.groupDisplay = "flex";

		this.select.addEventListener("change", this.boundChangeHandler);

        this.init(list);
	}

	init(list)
	{
		while(this.groupDiv.lastElementChild) // clears radio, need to clear select as well
			this.groupDiv.removeChild(this.groupDiv.lastElementChild);

		list.forEach(v => this.addItem(v, this.name));

		this.groupDiv.append(this.radioDiv);
		
		this.value = this.select.value;
		
		this.updateGroup(this.select.value);
	}

	addItem(value)
	{
		let option = document.createElement("option");
		option.text = value;
		option.value = value;
		
		this.select.append(option);
		
		let radio = document.createElement("input");
		radio.type = "radio";
		radio.value = value;
		radio.name = this.name;
		radio.addEventListener("change", this.boundChangeHandler);
		this.group.push(radio);
		
		let n = document.createElement("label");
		n.append(radio, radio.value);

		this.radioDiv.append(n);
	}

	removeItem(value)
	{
		for(let i = 0; i < this.select.length; i++)
			if(this.select.options[i].value === value)
				this.select.remove(i);

		for(let i = 0; i < this.group.length; i++)
			if(this.group[i].value === value)
				this.group[i].parentElement.remove();

		this.group.filter(radioButton => radioButton.value !== value);
	}

	updateItem(valueOld, valueNew)
	{

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