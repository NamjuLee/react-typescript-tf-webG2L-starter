import { GLUtility } from '../GL/GLUtility';
import { Application } from '..';

export class Triangle{
    public app: Application;
    public gl: WebGL2RenderingContext;
    public program: WebGLProgram;
    public fragmentShader: WebGLShader;
    public vertexShader: WebGLShader;
    public matrixLocation: WebGLProgram;
    public posBuffer: WebGLBuffer;
    public colBuffer: WebGLBuffer;
    public vertexs: Float32Array;

    public posLocAtt: number;
    public colLocAtt: number;
    public matLoc: WebGLUniformLocation;
    public colLoc: WebGLUniformLocation;
    public cVecLoc: WebGLUniformLocation;
    public mouseLoc: WebGLUniformLocation;
    public timeGL: WebGLUniformLocation;
    // startTime: number;
    // randomSeed: number;

    public vShader: WebGLShader;
    public fShader: WebGLShader;

    public v = `
    attribute vec2 a_position;

    void main() {
      gl_Position = vec4(a_position, 0, 1);
    }
    `;

    public f = `
    precision mediump float;

    uniform vec4 u_color;

    void main() {
       gl_FragColor = u_color;
        // gl_FragColor = vec4(1,0,0,0);
    }
    `;

    public positionAttribLocation: WebGLProgram;
    public colorAttribLocation: WebGLProgram;
    public translation: number[];
    public color: number[];
    public colArray: Float32Array;

    constructor(app: Application, gl: WebGL2RenderingContext, r: number = 0.2, g: number = 0.2, b: number = 0.0, a: number = 0.1) {
        this.app = app;
        this.gl = gl;
        this.color = [r, g, b, a];
        this.initShader();
        this.app.scene.geo.push(this);

    }
    public initShader() {
        const vShader = GLUtility.createShader(this.gl, this.gl.VERTEX_SHADER as unknown as WebGLShader, this.v); // '/shader/vsCanvas.glsl');
        const fShader = GLUtility.createShader(this.gl, this.gl.FRAGMENT_SHADER as unknown as WebGLShader, this.f); // '/shader/fsColor.glsl');

        if (vShader && fShader) {
            this.vShader = vShader;
            this.fShader = fShader;
            const program = GLUtility.createProgram(this.gl, vShader, fShader);
            if (program) { this.program = program; }
        }
        this.vertexs = new Float32Array([
            // left column
            0,     0.5,
            -0.5, -0.5,
            0.5,  -0.5,
            // 1, 1,
            // -1, 1,
            // -1, - 1

        ]);
    }
    public render(gl: WebGLRenderingContext) {
        gl.useProgram(this.program);
        this.posBuffer = this.gl.createBuffer() as WebGLBuffer;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexs), gl.STATIC_DRAW);

        this.posLocAtt = this.gl.getAttribLocation(this.program, 'a_position');
        this.colLoc = this.gl.getUniformLocation(this.program, 'u_color') as WebGLUniformLocation;

        // Tell the attribute how to get data out of posBuffer (ARRAY_BUFFER)
        let size = 2;          // 2 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(this.posLocAtt, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(this.posLocAtt);
        gl.uniform4fv(this.colLoc, new Float32Array(this.color));

        let primitiveType = gl.TRIANGLE_FAN; // LINE_LOOP; // gl.TRIANGLE_STRIP;
        offset = 0;
        let count = this.vertexs.length * 0.5;
        gl.drawArrays(primitiveType, offset, count);
    }
}