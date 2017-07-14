
exports.filter = function(term, array) {
    var sublist = [];

    for (var i in array)
        if (array[i].includes(term))
            sublist.push(array[i]);

    return sublist = sublist.sort((a,b) => {
        return Math.abs(a.length - term.length) - Math.abs(b.length - term.length);
    });
}