const treeBuild = (dataset) => {

    let hash = Object.create(null)
    dataset.forEach(item => {
        hash[item._id] = { ...item, childs: [] }
    })
    let tree = []
    dataset.forEach(item => {
        if (item.parent != null) {
            hash[item.parent].childs.push(hash[item._id])
        }
        else {
            tree.push(hash[item._id])
        }
    })
    return tree

}

const dateToFormat = (dateMilliseconds) => {
    const seconds = new Date(dateMilliseconds).getSeconds()
    const minutes = new Date(dateMilliseconds).getMinutes()
    const hours = new Date(dateMilliseconds).getHours()
    const day = new Date(dateMilliseconds).getDate()
    const month = new Date(dateMilliseconds).getMonth()
    const year = new Date(dateMilliseconds).getFullYear()

    let formatedData = new String
    formatedData = hours + ':' + minutes + ':' + seconds + ' - ' + day + '/' + month + '/' + year

    return formatedData
}

const todayFormatToPicker = () => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
}

const generateRandomColor = (brightness) => {
    function randomChannel(brightness){
        var r = 255-brightness;
        var n = 0|((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length==1) ? '0'+s : s;
      }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness)
}

export { treeBuild, dateToFormat , todayFormatToPicker , generateRandomColor}