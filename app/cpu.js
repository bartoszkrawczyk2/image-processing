import 'babel-polyfill';
import { append, createCanvas, renderResult } from './utils/dom';
import RGBtoHSV from 'rgb-hsv';
import HSVtoRGB from 'hsv-rgb';
import hsv2rgb from 'hsv2rgb';

let img = new Image();
let app = document.getElementById('app');
let performanceStart;

img.onload = () => {
    append(app, 'original image (source: <a target="_blank" href="https://unsplash.com/photos/KvD36NRFjl4">unsplash</a>)', img);

    let originalCanvas = createCanvas(img);
    let originalCtx = originalCanvas.getContext('2d');
    originalCtx.drawImage(img, 0, 0);
    let originalPixels = new Uint8ClampedArray(originalCtx.getImageData(0, 0, img.width, img.height).data);
    let computeR, computeG, computeB;
    let outputR = 0, outputG = 0, outputB = 0;
    let line = img.width * 4;
    let hsv, rgb;
    let ch, cs, cv;

    let getNeighbors = (pixelPos, kernelSize = 3, pixels = originalPixels, l = line) => {
        if (!(kernelSize % 2)) throw new Error('Invalid kernel size');
        
        let pos = 0;
        let outputPixels = new Uint8ClampedArray(kernelSize*kernelSize);
        let kernelMiddle = Math.floor(kernelSize / 2);

        for (let i = -kernelMiddle; i < kernelSize - kernelMiddle; i++) {
            for (let j = -(kernelMiddle * 4); j <= kernelMiddle * 4; j += 4) {
                outputPixels[pos] = pixels[pixelPos + i*l + j];
                pos++;
            }
        }

        return outputPixels;
    }



    // ------------------------ black & white ------------------------ //

    performanceStart = performance.now();

    let bwPixels = new Uint8ClampedArray(originalPixels);
    let average = 0;

    for (let i = 0; i < bwPixels.length; i += 4) {
        average = (originalPixels[i] + originalPixels[i+1] + originalPixels[i+2]) / 3; 
        bwPixels[i] = bwPixels[i+1] = bwPixels[i+2] = average;
    }

    renderResult(`black & white`, performance.now() - performanceStart, img, app, bwPixels);



    // ------------------------ brightness ------------------------ //

    performanceStart = performance.now();

    let brightnessPixels = new Uint8ClampedArray(originalPixels);

    for (let i = 0; i < brightnessPixels.length; i += 4) { 
        brightnessPixels[i]   = originalPixels[i]   + 70;
        brightnessPixels[i+1] = originalPixels[i+1] + 70;
        brightnessPixels[i+2] = originalPixels[i+2] + 70;
    }

    renderResult(`brightness`, performance.now() - performanceStart, img, app, brightnessPixels);



    // ------------------------ reverse ------------------------ //

    performanceStart = performance.now();

    let reversePixels = new Uint8ClampedArray(originalPixels);

    for (let i = 0; i < reversePixels.length; i += 4) { 
        reversePixels[i]   = 255 - originalPixels[i];
        reversePixels[i+1] = 255 - originalPixels[i+1];
        reversePixels[i+2] = 255 - originalPixels[i+2];
    }

    renderResult(`reverse`, performance.now() - performanceStart, img, app, reversePixels);



    // ------------------------ saturation ------------------------ //

    performanceStart = performance.now();

    let saturationPixels = new Uint8ClampedArray(originalPixels);

    for (let i = 0; i < saturationPixels.length; i += 4) { 
        hsv = RGBtoHSV(originalPixels[i], originalPixels[i+1], originalPixels[i+2]);
        hsv[1] += 30;
        rgb = HSVtoRGB(hsv[0], hsv[1], hsv[2]);

        saturationPixels[i]   = rgb[0];
        saturationPixels[i+1] = rgb[1];
        saturationPixels[i+2] = rgb[2];
    }

    renderResult(`saturation`, performance.now() - performanceStart, img, app, saturationPixels);



    // ------------------------ bw colorize ------------------------ //

    performanceStart = performance.now();

    let bwcPixels = new Uint8ClampedArray(originalPixels);

    for (let i = 0; i < bwcPixels.length; i += 4) {
        average = (originalPixels[i] + originalPixels[i+1] + originalPixels[i+2]) / 3; 
        bwcPixels[i] = bwcPixels[i+1] = bwcPixels[i+2] = average;

        bwcPixels[i]   += 40;
        bwcPixels[i+1] += 10;
        bwcPixels[i+2] -= 5;
    }

    renderResult(`b&w + colorize`, performance.now() - performanceStart, img, app, bwcPixels);



    // ------------------------ blur ------------------------ //    

    let blurKernel = [
        0.102059, 0.115349, 0.102059,
        0.115349, 0.130371, 0.115349,
        0.102059, 0.115349, 0.102059,
    ];

    performanceStart = performance.now();

    let blurPixels = new Uint8ClampedArray(originalPixels);

    for (let i = 0; i < blurPixels.length; i += 4) {
        outputR = 0; outputG = 0; outputB = 0;

        computeR = getNeighbors(i);
        computeG = getNeighbors(i+1);
        computeB = getNeighbors(i+2);

        for (let i = 0; i < blurKernel.length; i++) {
            outputR += computeR[i] * blurKernel[i];
            outputG += computeG[i] * blurKernel[i];
            outputB += computeB[i] * blurKernel[i];
        }

        blurPixels[i]   = outputR;
        blurPixels[i+1] = outputG;
        blurPixels[i+2] = outputB;
    }

    renderResult(`blur`, performance.now() - performanceStart, img, app, blurPixels);



    // ------------------------ emboss ------------------------ //

    let embossKernel = [
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2,
    ];

    performanceStart = performance.now();

    let embossPixels = new Uint8ClampedArray(originalPixels);

    for (let i = 0; i < embossPixels.length; i += 4) {
        outputR = 0; outputG = 0; outputB = 0;

        computeR = getNeighbors(i);
        computeG = getNeighbors(i+1);
        computeB = getNeighbors(i+2);

        for (let i = 0; i < embossKernel.length; i++) {
            outputR += computeR[i] * embossKernel[i];
            outputG += computeG[i] * embossKernel[i];
            outputB += computeB[i] * embossKernel[i];
        }

        embossPixels[i]   = outputR;
        embossPixels[i+1] = outputG;
        embossPixels[i+2] = outputB;
    }

    renderResult(`emboss`, performance.now() - performanceStart, img, app, embossPixels);



    // ------------------------ median filter ------------------------ //

    performanceStart = performance.now();

    let medianPixels = new Uint8ClampedArray(originalPixels);

    for (let i = 0; i < medianPixels.length; i += 4) {
        computeR = getNeighbors(i, 5);
        computeG = getNeighbors(i+1, 5);
        computeB = getNeighbors(i+2, 5);

        medianPixels[i]   = computeR.sort((a, b) => a - b)[Math.floor(computeR.length / 2)];
        medianPixels[i+1] = computeG.sort((a, b) => a - b)[Math.floor(computeG.length / 2)];
        medianPixels[i+2] = computeB.sort((a, b) => a - b)[Math.floor(computeB.length / 2)];
    }

    renderResult(`median filter 5x5`, performance.now() - performanceStart, img, app, medianPixels);



    // ------------------------ sobel ------------------------ //

    performanceStart = performance.now();
    
    let xKernel = [
        1, 0, -1,
        2, 0, -2,
        1, 0, -1
    ];

    let yKernel = [
        1, 2, 1,
        0, 0, 0,
        -1, -2, -1
    ];

    let sobelPixels = new Uint8ClampedArray(bwPixels);
    let resultX, resultY, neighbors, result, dir, val;

    for (let i = 0; i < bwPixels.length; i += 4) {
        resultX = 0; resultY = 0;

        neighbors = getNeighbors(i, 3, bwPixels);

        for (let i = 0; i < xKernel.length; i++) {
            resultX += neighbors[i] * xKernel[i];
        }

        for (let i = 0; i < yKernel.length; i++) {
            resultY += neighbors[i] * yKernel[i];
        }
        
        result = Math.sqrt((resultX * resultX) + (resultY * resultY));
        
        sobelPixels[i]   = result;
        sobelPixels[i+1] = result;
        sobelPixels[i+2] = result;
    }

    renderResult(`sobel`, performance.now() - performanceStart, img, app, sobelPixels);
}

img.src = 'example.jpg';