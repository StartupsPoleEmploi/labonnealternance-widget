// Remove accent + lowercase
export function cleanTerm(term) {
    let str = term.toLowerCase();
    // Detect when normalize is not available
    if (typeof ''.normalize === 'function') {
        str = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } else {
        // Specific case (for Safari 9)
        let a = ['à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù', 'ú', 'û', 'ü' , 'œ'];
        let b = ['a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'oe'];

        let i = a.length;
        while(i--) str = str.replace(a[i], b[i]);
    }

    return str;
}

export function computeNewIndex(key, currentIndex, collectionSize) {
    let newIndex;

    if(key === 'ArrowUp') {
        // Select last element
        if(currentIndex <= 0) newIndex = collectionSize;
        else newIndex = currentIndex - 1;
        return newIndex;
    } else if(key === 'ArrowDown') {
        // Select last element
        if(currentIndex < 0 || currentIndex === collectionSize - 1) newIndex = 0;
        else newIndex = currentIndex + 1;
        return newIndex;
    }

    throw new Error(`Unknown key ${key}`);
}


export function isEmpty(obj) {
    return obj === undefined || obj === null || Object.keys(obj).length === 0;
}