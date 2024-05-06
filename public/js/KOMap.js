// A custom Map class that uses objects as keys and has implementations of some
// methods that will allow for partial matches on a subset of the key object's
// properties.
class KOMap extends Map
{
    // returns true as soon as it finds one partial match
    partialHas(partialKey)
    {
        for(const [k, v] of this)
        {
            const ko = JSON.parse(k);
            let match = true;

            for(const p in partialKey)
                if(partialKey[p] !== ko[p])
                {
                    match = false;
                    break;
                }
            
            if(match)
                return true;
        }

        return false;
    }

    // returns first partial match
    // 'returnKey' controls what is returned 
    //      0 = just return the value (DEFAULT), 
    //      1 = return the string key, 
    //      2 = return the object key
    partialGet(partialKey, returnType)
    {
        for(const [k, v] of this)
        {
            const ko = JSON.parse(k);
            let match = true;

            for(const p in partialKey)
                if(partialKey[p] !== ko[p])
                {
                    match = false;
                    break;
                }
            
            if(match)
                return returnType ? [(returnType === 1 ? k : ko), v] : v;
        }

        return undefined;
    }

    // returns an array of all partial matches
    // 'returnKey' controls what is returned 
    //      0 = just return the value (DEFAULT), 
    //      1 = return the string key, 
    //      2 = return the object key
    partialGetAll(partialKey, returnType)
    {
        let matches = [];

        for(const [k, v] of this)
        {
            const ko = JSON.parse(k);
            let match = true;

            for(const p in partialKey)
                if(partialKey[p] !== ko[p])
                {
                    match = false;
                    break;
                }
            
            if(match)
                matches.push(returnType ? [(returnType === 1 ? k : ko), v] : v);
        }

        return matches;
    }

    // The following methods that end in KO simply allow you to pass an object and
    // it will stringify for you.
    setKO(keyObject, value)
    {
        this.set(JSON.stringify(keyObject), value);

        return this;
    }

    hasKO(keyObject)
    {
        return this.has(JSON.stringify(keyObject));
    }

    getKO(keyObject)
    {
        return this.get(JSON.stringify(keyObject));
    }

    deleteKO(keyObject)
    {
        return this.delete(JSON.stringify(keyObject));
    }
}