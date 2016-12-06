import 'babel-polyfill';
import { renderResult, append } from './utils/dom';
import { processGl, ImageProcessor } from './utils/gl';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

let img = new Image();
let app = document.getElementById('app');
let performanceStart;

img.onload = () => {
    let image;

    try {
        image = new ImageProcessor(img, fragmentShader(), vertexShader());
    } catch(e) {
        let errorText = document.createElement('p');
        errorText.innerText = e;
        app.appendChild(errorText);
        return;
    }

    append(app, 'original image (source: <a target="_blank" href="https://unsplash.com/photos/KvD36NRFjl4">unsplash</a>)', img);




    // ------------------------ black & white ------------------------ //

    performanceStart = performance.now();
    
    let bw = image.process({
        bw: true
    });

    renderResult('black & white', performance.now() - performanceStart, img, app, bw);


    // copy for filters based on monochromatic image (sobel filter)
    let bwImage = document.createElement('canvas');
    let bwImageCtx = bwImage.getContext('2d');
    bwImage.width = img.width;
    bwImage.height = img.height;
    bwImageCtx.drawImage(bw, 0, 0);



    // ------------------------ brightness ------------------------ //

    performanceStart = performance.now();
    
    let brightness = image.process({
        brightness: 0.25
    });

    renderResult('brightness', performance.now() - performanceStart, img, app, brightness);



    // ------------------------ reverse ------------------------ //

    performanceStart = performance.now();
    
    let reverse = image.process({
        reverse: true
    });

    renderResult('reverse', performance.now() - performanceStart, img, app, reverse);
    


    // ------------------------ saturation ------------------------ //

    performanceStart = performance.now();
    
    let saturation = image.process({
        saturation: 0.28
    });

    renderResult('saturation', performance.now() - performanceStart, img, app, saturation);



    // ------------------------ bw & colorize ------------------------ //

    performanceStart = performance.now();
    
    let bwcolorize = image.process({
        bw: true,
        colorize: {
            r: 0.23,
            g: 0.08,
            b: -0.01
        }
    });

    renderResult('b&w + colorize', performance.now() - performanceStart, img, app, bwcolorize);
    


    // ------------------------ blur ------------------------ //

    performanceStart = performance.now();
    
    let blur = image.process({
        kernel: [
            0.102059, 0.115349, 0.102059,
            0.115349, 0.130371, 0.115349,
            0.102059, 0.115349, 0.102059
        ]
    });

    renderResult('blur', performance.now() - performanceStart, img, app, blur);



    // ------------------------ emboss ------------------------ //

    performanceStart = performance.now();
    
    let emboss = image.process({
        kernel: [
            -2, -1, 0,
            -1, 1, 1,
            0, 1, 2,
        ]
    });

    renderResult('emboss', performance.now() - performanceStart, img, app, emboss);



    // ------------------------ median ------------------------ //

    performanceStart = performance.now();
    
    let median = image.process({
        median: true
    });

    renderResult('median filter 5x5', performance.now() - performanceStart, img, app, median);


    // ------------------------ sobel ------------------------ //

    performanceStart = performance.now();

    image.changeTexture(bwImage);
    
    let sobel = image.process({
        sobelX: [
            1, 0, -1,
            2, 0, -2,
            1, 0, -1
        ],
        sobelY: [
            1, 2, 1,
            0, 0, 0,
            -1, -2, -1
        ]
    });

    renderResult('sobel', performance.now() - performanceStart, img, app, sobel);
}

img.src = 'example.jpg';