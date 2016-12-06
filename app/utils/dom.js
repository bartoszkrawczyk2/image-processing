export let append = (app, title, image, time = '') => {
    let d = document.createElement('div');
    let p = document.createElement('p');
    p.innerHTML = `${title}${time ? ` <b>${time.toFixed(2)}ms</b>` : ''}`;
    d.appendChild(p);
    d.appendChild(image);
    d.className = 'box';
    app.appendChild(d);
}

export let createCanvas = (img) => {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    return canvas;
}

export let renderResult = (title, time, img, app, processedImage) => {
    let canvas = createCanvas(img);
    let ctx = canvas.getContext('2d');

    if (processedImage.length) {
        ctx.putImageData(new ImageData(processedImage, img.width, img.height), 0, 0);
    } else {
        ctx.drawImage(processedImage, 0, 0);
    }
    
    append(app, title, canvas, time);
};