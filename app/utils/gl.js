let computeKernelWeight = kernel => {
   let weight = kernel.reduce((prev, curr) => {
       return prev + curr;
   });

   return weight <= 0 ? 1 : weight;
 }

export const createProgram = (gl, vertexShader, fragmentShader) => {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!success) {
        throw ("program filed to link:" + gl.getProgramInfoLog (program));
    }

    return program;
};

export const compileShader = (gl, shaderSource, shaderType) => {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
        throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }
    
    return shader;
}

export class ImageProcessor {
    constructor(img, fragmentShader, vertexShader) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

        if (!this.gl) {
            throw('Your browser does not support WebGL');
        }

        let vs       = compileShader(this.gl, vertexShader, this.gl.VERTEX_SHADER);
        let fs       = compileShader(this.gl, fragmentShader, this.gl.FRAGMENT_SHADER);
        this.program = createProgram(this.gl, vs, fs);
            
        this.gl.useProgram(this.program);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        let positionLocation = this.gl.getAttribLocation(this.program, "a_position"); 

        // look up uniform locations
        let u_imageLoc = this.gl.getUniformLocation(this.program, "u_image"),
            u_matrixLoc = this.gl.getUniformLocation(this.program, "u_matrix");

        // provide texture coordinates for the rectangle.
        let positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0]), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.gl.createTexture());

        // Set the parameters so we can render any size image.
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        // build a matrix that will stretch our
        // unit quad to our desired size and location
        this.gl.uniformMatrix3fv(u_matrixLoc, false, [
            2, 0, 0,
            0, -2, 0,
            -1, 1, 1,
        ]);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
    }

    changeTexture(img) {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
    }

    process(parameters = {}) {
        let brightness = this.gl.getUniformLocation(this.program, 'brightness');
        let bw = this.gl.getUniformLocation(this.program, 'bw');
        let reverse = this.gl.getUniformLocation(this.program, 'reverse');
        let saturation = this.gl.getUniformLocation(this.program, 'saturation');
        let colorize = this.gl.getUniformLocation(this.program, 'colorize');
        let size = this.gl.getUniformLocation(this.program, 'textureSize');
        let useKernel = this.gl.getUniformLocation(this.program, 'useKernel');
        let median = this.gl.getUniformLocation(this.program, 'median');
        let kernel = this.gl.getUniformLocation(this.program, 'kernel[0]');
        let kernelWeight = this.gl.getUniformLocation(this.program, 'kernelWeight');
        let sobelKernelXLocation = this.gl.getUniformLocation(this.program, 'sobelKernelX[0]');
        let sobelKernelYLocation = this.gl.getUniformLocation(this.program, 'sobelKernelY[0]');
        let sobelKernelWeightLocation = this.gl.getUniformLocation(this.program, 'sobelKernelWeight');
        let sobelLocation = this.gl.getUniformLocation(this.program, 'sobel');

        this.gl.uniform2f(size, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(brightness, parameters.brightness || 0);
        this.gl.uniform1f(bw, parameters.bw || false);
        this.gl.uniform1f(reverse, parameters.reverse || false);
        this.gl.uniform1f(saturation, parameters.saturation || 0);
        this.gl.uniform3f(
            colorize,
            parameters.colorize ? parameters.colorize.r || 0 : 0,
            parameters.colorize ? parameters.colorize.g || 0 : 0,
            parameters.colorize ? parameters.colorize.b || 0 : 0,
        );

        let pKernel = parameters.kernel || [
            0, 0, 0,
            0, 1, 0,
            0, 0, 0
        ];

        let sKernelX = parameters.sobelX || [
            0, 0, 0,
            0, 1, 0,
            0, 0, 0
        ];

        let sKernelY = parameters.sobelY || [
            0, 0, 0,
            0, 1, 0,
            0, 0, 0
        ];

        this.gl.uniform1fv(kernel, pKernel);
        this.gl.uniform1f(kernelWeight, computeKernelWeight(pKernel));
        this.gl.uniform1f(useKernel, parameters.kernel ? true : false);
        this.gl.uniform1f(median, parameters.median ? true : false);
        this.gl.uniform1f(sobelLocation, (parameters.sobelX && parameters.sobelY) ? true : false);
        this.gl.uniform1f(sobelKernelWeightLocation, computeKernelWeight(sKernelX));
        this.gl.uniform1fv(sobelKernelXLocation, sKernelX);
        this.gl.uniform1fv(sobelKernelYLocation, sKernelY);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        return this.canvas;
    }
}