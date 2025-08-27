
function RemoveSources(inputString) {
    let ProcessingString = inputString;
    let positionStart = -1
    let positionEnd = -1
    //vie multiple sources- totale lengte word minder as sources uitgehaal is, maar gaan aan by sy laaste posisie.
    // dit wil se dat as daar 2 sources langes mekaar gaan wees gaan die 2de source die posisie kry van die eerste
    // source daarom gaan dit nie uitgehaal word nie tensy die loop van agter af begin
    for (let i = ProcessingString.length; i >= 0; i--) {
        if (ProcessingString[i] == '】') {
            positionEnd = i
        }
        else if (ProcessingString[i] == '【') {
            positionStart = i
        }
        // found a matching start and end tag and remove value in between
        if (positionStart > -1 && positionEnd > -1) {
            let splitOne = ProcessingString.substring(0, positionStart);
            let splitTwo = ProcessingString.substring(positionEnd + 1)
            ProcessingString = splitOne + splitTwo
            positionEnd = -1;
            positionStart = -1
        }

    }
    console.log(ProcessingString)
    return ProcessingString;
}

module.exports = RemoveSources