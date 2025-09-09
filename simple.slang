[[vk::binding(0, 0)]]
cbuffer Params : register(b0, space0) { 
    float4x4 rot; 
}


[shader("vertex")]
float4 mainVS(uint vertexId : SV_VertexID) : SV_Position
{
    float2 pos[3] = { float2(0, 0.5), float2(-0.5, -0.5), float2(0.5, -0.5) };
    float4 p = float4(pos[vertexId], 0, 1);
    p = mul(rot, p);
    return p;
}

[shader("fragment")]
float4 mainPS() : SV_Target0
{
    return float4(0.2, 0.8, 0.4, 1.0);
}