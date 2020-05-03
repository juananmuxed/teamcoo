const idEqualArray = (first, second , param) => {
    let idsFirst = first.map(x => {return x[param]}).sort()
    let idsSecond = second.map(y => {return y[param]}).sort()
    return (idsFirst.join(',') === idsSecond.join(',') )
}

let array1 = ['2','4','1','3']
let array2 = ['1','2','3','4']
let array3 = ['1','2','3','4','5']
let array4 = ['2424','1414','414','4151']

console.log(idEqualArray(array1,array2))
console.log(idEqualArray(array1,array3))
console.log(idEqualArray(array3,array4))