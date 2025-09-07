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

// Pipeline
const pipeline = device.createRenderPipeline({
  layout: "auto",
  vertex: { module: vsModule, entryPoint: "mainVS" },
  fragment: { module: fsModule, entryPoint: "mainPS", targets: [{ format }] },
  primitive: { topology: "triangle-list" },
});

// Render loop
function frame() {
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
  pass.draw(3);
  pass.end();
  device.queue.submit([encoder.finish()]);
  requestAnimationFrame(frame);
}
frame();