#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform sampler2D u_image;
uniform float brightness;
uniform bool bw;
uniform bool reverse;
uniform bool useKernel;
uniform float saturation;
uniform vec3 colorize;
uniform vec2 textureSize;
uniform float kernel[9];
uniform float kernelWeight;
uniform float sobelKernelX[9];
uniform float sobelKernelY[9];
uniform float sobelKernelWeight;
uniform bool median;
uniform bool sobel;
varying vec2 v_texCoord;
float neighborsR[25];
float neighborsG[25];
float neighborsB[25];

void sortNeighbors() {
    for (int i = 1; i < 25; i++) {
        for (int j=0; j < (25 -1); j++) {
            if (neighborsR[j+1] > neighborsR[j]) { 
                float temp = neighborsR[j];
                neighborsR[j] = neighborsR[j+1];
                neighborsR[j+1] = temp;
            }

            if (neighborsG[j+1] > neighborsG[j]) { 
                float temp = neighborsG[j];
                neighborsG[j] = neighborsG[j+1];
                neighborsG[j+1] = temp;
            }

            if (neighborsB[j+1] > neighborsB[j]) { 
                float temp = neighborsB[j];
                neighborsB[j] = neighborsB[j+1];
                neighborsB[j+1] = temp;
            }
          }
     }
}

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    vec2 onePixel = vec2(1.0, 1.0) / textureSize;
    
    color.rgb += brightness;
    
    if (bw == true) {
        color.rgb = (color.r + color.g + color.b) / vec3(3.0);
    };

    if (reverse == true) {
        color.r = 1.0 - color.r;
        color.g = 1.0 - color.g;
        color.b = 1.0 - color.b;
    };

    vec3 hsv = rgb2hsv(vec3(color));
    hsv.y += saturation;
    color = vec4(hsv2rgb(vec3(hsv)), 1);

    color.rgb += colorize;

    if (useKernel == true) {
        vec4 colorSum =
            texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * kernel[0] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * kernel[1] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * kernel[2] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * kernel[3] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * kernel[4] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * kernel[5] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * kernel[6] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * kernel[7] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * kernel[8] ;
        
        color = vec4((colorSum / kernelWeight).rgb, 1.0);
    }

    if (sobel == true) {
        float sumX =
            texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)).r * sobelKernelX[0] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)).r * sobelKernelX[1] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)).r * sobelKernelX[2] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)).r * sobelKernelX[3] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)).r * sobelKernelX[4] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)).r * sobelKernelX[5] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)).r * sobelKernelX[6] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)).r * sobelKernelX[7] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)).r * sobelKernelX[8] ;

        float sumY =
            texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)).r * sobelKernelY[0] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)).r * sobelKernelY[1] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)).r * sobelKernelY[2] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)).r * sobelKernelY[3] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)).r * sobelKernelY[4] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)).r * sobelKernelY[5] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)).r * sobelKernelY[6] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)).r * sobelKernelY[7] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)).r * sobelKernelY[8] ;

        float result = sqrt((sumX*sumX) + (sumY*sumY));
        color = vec4(result, result, result, 1.0);
    }

    if (median == true) {
        neighborsR[0] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, -2)).r;
        neighborsR[1] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, -2)).r;
        neighborsR[2] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, -2)).r;
        neighborsR[3] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, -2)).r;
        neighborsR[4] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, -2)).r;

        neighborsR[5] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, -1)).r;
        neighborsR[6] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)).r;
        neighborsR[7] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)).r;
        neighborsR[8] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)).r;
        neighborsR[9] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, -1)).r;

        neighborsR[10] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, 0)).r;
        neighborsR[11] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, 0)).r;
        neighborsR[12] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, 0)).r;
        neighborsR[13] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, 0)).r;
        neighborsR[14] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, 0)).r;

        neighborsR[15] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, 1)).r;
        neighborsR[16] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, 1)).r;
        neighborsR[17] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, 1)).r;
        neighborsR[18] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, 1)).r;
        neighborsR[19] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, 1)).r;

        neighborsR[20] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, 2)).r;
        neighborsR[21] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, 2)).r;
        neighborsR[22] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, 2)).r;
        neighborsR[23] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, 2)).r;
        neighborsR[24] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, 2)).r;



        neighborsG[0] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, -2)).g;
        neighborsG[1] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, -2)).g;
        neighborsG[2] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, -2)).g;
        neighborsG[3] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, -2)).g;
        neighborsG[4] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, -2)).g;

        neighborsG[5] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, -1)).g;
        neighborsG[6] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)).g;
        neighborsG[7] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)).g;
        neighborsG[8] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)).g;
        neighborsG[9] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, -1)).g;

        neighborsG[10] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, 0)).g;
        neighborsG[11] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, 0)).g;
        neighborsG[12] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, 0)).g;
        neighborsG[13] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, 0)).g;
        neighborsG[14] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, 0)).g;

        neighborsG[15] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, 1)).g;
        neighborsG[16] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, 1)).g;
        neighborsG[17] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, 1)).g;
        neighborsG[18] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, 1)).g;
        neighborsG[19] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, 1)).g;

        neighborsG[20] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, 2)).g;
        neighborsG[21] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, 2)).g;
        neighborsG[22] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, 2)).g;
        neighborsG[23] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, 2)).g;
        neighborsG[24] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, 2)).g;



        neighborsB[0] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, -2)).b;
        neighborsB[1] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, -2)).b;
        neighborsB[2] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, -2)).b;
        neighborsB[3] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, -2)).b;
        neighborsB[4] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, -2)).b;

        neighborsB[5] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, -1)).b;
        neighborsB[6] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)).b;
        neighborsB[7] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)).b;
        neighborsB[8] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)).b;
        neighborsB[9] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, -1)).b;

        neighborsB[10] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, 0)).b;
        neighborsB[11] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, 0)).b;
        neighborsB[12] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, 0)).b;
        neighborsB[13] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, 0)).b;
        neighborsB[14] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, 0)).b;

        neighborsB[15] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, 1)).b;
        neighborsB[16] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, 1)).b;
        neighborsB[17] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, 1)).b;
        neighborsB[18] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, 1)).b;
        neighborsB[19] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, 1)).b;

        neighborsB[20] = texture2D(u_image, v_texCoord + onePixel * vec2(-2, 2)).b;
        neighborsB[21] = texture2D(u_image, v_texCoord + onePixel * vec2(-1, 2)).b;
        neighborsB[22] = texture2D(u_image, v_texCoord + onePixel * vec2( 0, 2)).b;
        neighborsB[23] = texture2D(u_image, v_texCoord + onePixel * vec2( 1, 2)).b;
        neighborsB[24] = texture2D(u_image, v_texCoord + onePixel * vec2( 2, 2)).b;

        sortNeighbors();

        color.r = neighborsR[25/2];
        color.g = neighborsG[25/2];
        color.b = neighborsB[25/2];
    }
    
    gl_FragColor = color;
}