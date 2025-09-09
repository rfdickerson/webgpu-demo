import {
  vec3,
  mat4,
} from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js';

const width = 800;
const height = 600;

const fov = 60 * Math.PI / 180
const aspect = width / height;
const near = 0.1;
const far = 1000;
const perspective = mat4.perspective(fov, aspect, near, far);

const canvas = document.getElementById("gpuCanvas");
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();

// Configure the canvas
const context = canvas.getContext("webgpu");
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({
  device,
  format,
  alphaMode: "opaque",
});

// Load shaders
const vs = await (await fetch('vert.wgsl')).text();
const fs = await (await fetch('frag.wgsl')).text();
const vsModule = device.createShaderModule({ code: vs });
const fsModule = device.createShaderModule({ code: fs });




const bgl0 = device.createBindGroupLayout({
  entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} }],
});
const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [bgl0] });


// Pipeline
const pipeline = device.createRenderPipeline({
  layout: pipelineLayout,
  vertex: { module: vsModule, entryPoint: "mainVS" },
  fragment: { module: fsModule, entryPoint: "mainPS", targets: [{ format }] },
  primitive: { topology: "triangle-list" },
});

// --- Uniform buffer (rotation matrix) ---
const uniformBufferSize = 16 * 4; // 4x4 floats = 64 bytes
const uniformBuffer = device.createBuffer({
  size: uniformBufferSize,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const bindGroup0 = device.createBindGroup({
  layout: bgl0,
  entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
});

// --- Helper: build rotation matrix (column-major) ---
function rotZ4x4(theta) {
  const c = Math.cos(theta), s = Math.sin(theta);
  // column-major for WGSL
  return new Float32Array([
    c,  s, 0, 0,
   -s,  c, 0, 0,
    0,  0, 1, 0,
    0,  0, 0, 1,
  ]);
}

// Render loop
let t0 = performance.now();
function frame() {

      const t = (performance.now() - t0) * 0.001;     // seconds
  const m = rotZ4x4(t);                           // rotate over time
  device.queue.writeBuffer(uniformBuffer, 0, m);  // upload matrix



  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 1.0, g: 1.0, b: 1.0, a: 1 },
      loadOp: "clear",
      storeOp: "store",
    }],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup0);
  pass.draw(3);
  pass.end();
  device.queue.submit([encoder.finish()]);
  requestAnimationFrame(frame);
}
frame();