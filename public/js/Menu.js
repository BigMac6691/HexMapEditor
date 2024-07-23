class Menu
{
	constructor(display)
	{
		this.display = display;
		this.items = new Map();
		this.div = HTML.create("div", null, ["menuContainer"]);
		this.boundClick = this.handleClick.bind(this);
	}

	addItem(label, node)
	{
		let n = HTML.create("div", {innerHTML: label}, ["menuItem"], {click: this.boundClick});
		
		this.div.append(n);
		this.items.set(n, node);

		if(this.items.size === 1)
			n.classList.toggle("menuItemSelected");
		else
			node.style.display = "none";
	}

	handleClick(evt)
	{
		let current = this.div.querySelector(".menuItemSelected");

		current.classList.toggle("menuItemSelected");
		this.items.get(current).style.display = "none";

		evt.target.classList.toggle("menuItemSelected");
		this.items.get(evt.target).style.display = this.display;
	}

	getSelected()
	{
		return this.div.querySelector(".menuItemSelected").innerHTML;
	}
}