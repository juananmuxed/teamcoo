const treeBuild = (dataset) => {
    let hash = Object.create(null);
    dataset.forEach((item) => {
        hash[item._id] = { ...item, childs: [] };
    });
    let tree = [];
    dataset.forEach((item) => {
        if (item.parent != null && hash[item.parent]) {
            hash[item.parent].childs.push(hash[item._id]);
        } else {
            tree.push(hash[item._id]);
        }
    });
    return tree;
};

const outdated = (date) => {
    return new Date(date) < new Date();
}

const dateToBeauty = (date) => {
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth();
    const year = new Date(date).getFullYear();

    return `${day}/${month}/${year}`;
}

const dateToFormat = (dateMilliseconds) => {
    const seconds = new Date(dateMilliseconds).getSeconds();
    const minutes = new Date(dateMilliseconds).getMinutes();
    const hours = new Date(dateMilliseconds).getHours();
    const day = new Date(dateMilliseconds).getDate();
    const month = new Date(dateMilliseconds).getMonth();
    const year = new Date(dateMilliseconds).getFullYear();

    return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
};

const todayFormatToPicker = (date) => {
    let today = !date ? new Date() : new Date(date);
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
};

const generateRandomColor = (brightness) => {
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | (Math.random() * r + brightness);
        var s = n.toString(16);
        return s.length == 1 ? "0" + s : s;
    }
    return (
        "#" +
        randomChannel(brightness) +
        randomChannel(brightness) +
        randomChannel(brightness)
    );
};

const isDiferentArray = (first, second, paramfirst, paramsecond) => {
    if (!first || !second) {
        return false;
    }
    let idsFirst = first
        .map((x) => {
            if (!paramfirst) {
                return x;
            } else {
                return x[paramfirst];
            }
        })
        .sort();
    let idsSecond = second
        .map((y) => {
            if (!paramsecond) {
                return y;
            } else {
                return y[paramsecond];
            }
        })
        .sort();
    return idsFirst.join(",") !== idsSecond.join(",");
};

const generatePalette = (color, number, interval, direction) => {
    let colors = new Array(number);
    let textColors = new Array(number);
    for (let i = 0; i < number; i++) {
        colors[i] = colorLuminance(color, direction == 'up' ? i * interval * 0.01 : -i * interval * 0.01);
        textColors[i] = idealTextColor(colors[i]);
    }
    return { colors: colors, textColors: textColors };
};

const colorLuminance = (hexcolor, lum) => {
    hexcolor = String(hexcolor).replace(/[^0-9a-f]/gi, "");
    if (hexcolor.length < 6) {
        hexcolor = hexcolor.replace(/(.)/g, '$1$1');
    }
    lum = lum || 0;
    let rgb = "#",
        c;
    for (let i = 0; i < 3; ++i) {
        c = parseInt(hexcolor.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
};

const idealTextColor = (hexcolor) => {
    hexcolor = String(hexcolor).replace(/[^0-9a-f]/gi, "");
    if (hexcolor.length < 6) {
        hexcolor = hexcolor.replace(/(.)/g, '$1$1');
    }
    const nThreshold = 105
    let rgb = [], c;
    for (let i = 0; i < 3; ++i) {
        c = parseInt(hexcolor.substr(i * 2, 2), 16);
        rgb.push(("00" + c).substr(c.length));
    }

    return (255 - ((parseInt(rgb[0], 16) * 0.299) + (parseInt(rgb[1], 16) * 0.587) + (parseInt(rgb[2], 16) * 0.114))) < nThreshold ? 'black' : 'white';
}

const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

const kebabize = (str) => {
    return str && str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-');
}


const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    });
};

export {
    treeBuild,
    dateToBeauty,
    outdated,
    dateToFormat,
    todayFormatToPicker,
    generateRandomColor,
    isDiferentArray,
    generatePalette,
    colorLuminance,
    idealTextColor,
    camelize,
    kebabize,
    sleep,
};
