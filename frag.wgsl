struct pixelOutput_0
{
    @location(0) output_0 : vec4<f32>,
};

@fragment
fn mainPS() -> pixelOutput_0
{
    var _S1 : pixelOutput_0 = pixelOutput_0( vec4<f32>(0.20000000298023224f, 0.80000001192092896f, 0.40000000596046448f, 1.0f) );
    return _S1;
}

