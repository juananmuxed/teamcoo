const isDiferentArray = (first, second , paramfirst, paramsecond) => {
    let idsFirst = first.map(x => {return x[paramfirst]}).sort()
    let idsSecond = second.map(y => {return y[paramsecond]}).sort()
    return (idsFirst.join(',') !== idsSecond.join(',') )
}

let array1 = [{param:'1'},{param:'2'},{param:'3'},{param:'4'}]
let array2 = [{param:'3'},{param:'2'},{param:'1'},{param:'4'}]
let array3 = [{param:'124'},{param:'44'},{param:'12'},{param:'41'}]
let array4 = [{otherparam:'1'},{otherparam:'2'},{otherparam:'3'},{otherparam:'4'}]

console.log(isDiferentArray(array1,array2,'param','param'))
console.log(isDiferentArray(array1,array3,'param','param'))
console.log(isDiferentArray(array1,array4,'param','otherparam'))