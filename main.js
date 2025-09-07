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

// Vertex + Fragment shaders (WGSL)
const shaderCode = `
@vertex
fn vs_main(@builtin(vertex_index) idx : u32) -> @builtin(position) vec4f {
  var pos = array<vec2f, 3>(
    vec2f(0.0, 0.5),
    vec2f(-0.5, -0.5),
    vec2f(0.5, -0.5)
  );
  return vec4f(pos[idx], 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4f {
  return vec4f(0.6, 0.8, 0.4, 1.0);
}`;

// Create shader module
const shaderModule = device.createShaderModule({ code: shaderCode });

// Pipeline
const pipeline = device.createRenderPipeline({
  layout: "auto",
  vertex: { module: shaderModule, entryPoint: "vs_main" },
  fragment: { module: shaderModule, entryPoint: "fs_main", targets: [{ format }] },
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