class HTML
{
    constructor()    {    }

    static createLabel(name, input)
    {
        const n = document.createElement("label");
        n.append(name, input);

        return n;
    }

    static create(type, opts, clazz)
    {
        const n = document.createElement(type);

        if(opts)
            for(const [k, v] of Object.entries(opts))
                n[k] = v;

        if(clazz)
            clazz.forEach(c => n.classList.add(c));

        return n;
    }
}