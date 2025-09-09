struct _MatrixStorage_float4x4_ColMajorstd140_0
{
    @align(16) data_0 : array<vec4<f32>, i32(4)>,
};

struct SLANG_ParameterGroup_Params_std140_0
{
    @align(16) rot_0 : _MatrixStorage_float4x4_ColMajorstd140_0,
};

@binding(0) @group(0) var<uniform> Params_0 : SLANG_ParameterGroup_Params_std140_0;
struct vertexOutput_0
{
    @builtin(position) output_0 : vec4<f32>,
};

@vertex
fn mainVS(@builtin(vertex_index) vertexId_0 : u32) -> vertexOutput_0
{
    var pos_0 : array<vec2<f32>, i32(3)> = array<vec2<f32>, i32(3)>( vec2<f32>(0.0f, 0.5f), vec2<f32>(-0.5f, -0.5f), vec2<f32>(0.5f, -0.5f) );
    var _S1 : vertexOutput_0 = vertexOutput_0( (((vec4<f32>(pos_0[vertexId_0], 0.0f, 1.0f)) * (mat4x4<f32>(Params_0.rot_0.data_0[i32(0)][i32(0)], Params_0.rot_0.data_0[i32(1)][i32(0)], Params_0.rot_0.data_0[i32(2)][i32(0)], Params_0.rot_0.data_0[i32(3)][i32(0)], Params_0.rot_0.data_0[i32(0)][i32(1)], Params_0.rot_0.data_0[i32(1)][i32(1)], Params_0.rot_0.data_0[i32(2)][i32(1)], Params_0.rot_0.data_0[i32(3)][i32(1)], Params_0.rot_0.data_0[i32(0)][i32(2)], Params_0.rot_0.data_0[i32(1)][i32(2)], Params_0.rot_0.data_0[i32(2)][i32(2)], Params_0.rot_0.data_0[i32(3)][i32(2)], Params_0.rot_0.data_0[i32(0)][i32(3)], Params_0.rot_0.data_0[i32(1)][i32(3)], Params_0.rot_0.data_0[i32(2)][i32(3)], Params_0.rot_0.data_0[i32(3)][i32(3)])))) );
    return _S1;
}

