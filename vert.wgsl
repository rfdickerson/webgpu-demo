struct vertexOutput_0
{
    @builtin(position) output_0 : vec4<f32>,
};

@vertex
fn mainVS(@builtin(vertex_index) vertexId_0 : u32) -> vertexOutput_0
{
    var pos_0 : array<vec2<f32>, i32(3)> = array<vec2<f32>, i32(3)>( vec2<f32>(0.0f, 0.5f), vec2<f32>(-0.5f, -0.5f), vec2<f32>(0.5f, -0.5f) );
    var _S1 : vertexOutput_0 = vertexOutput_0( vec4<f32>(pos_0[vertexId_0], 0.0f, 1.0f) );
    return _S1;
}

