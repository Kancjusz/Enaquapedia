export const vertex = `

    varying vec3 pos;
    varying vec3 posUnprojected;
    uniform float uTime;

    void main() {

        vec4 newPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        pos = newPosition.xyz;
        posUnprojected = position;

        float depth = (1. / newPosition.z);

        gl_PointSize = 25. * depth*log(depth*300.);

        float time = uTime * 0.04;
        vec4 posShift = vec4(sin(uTime * depth)*0.1,cos(uTime * depth)*0.1,abs(sin(uTime * depth)*0.1),0.0);

        gl_Position =  newPosition + posShift;
    }
`

export const fragment = `

    varying vec3 pos;
    varying vec3 posUnprojected;
    uniform float uTime;
    uniform float uSceneHeight;

    float PI = 3.1415926535897932384626433832795;

    void main() {
        vec2 st = gl_PointCoord.xy;
        float mid = 0.5;

        float posSum = posUnprojected.x + posUnprojected.y + posUnprojected.z;
        float posProduct = posUnprojected.x * posUnprojected.y * posUnprojected.z;

        float rand = (sin(PI/posProduct * posSum * 1234.5678)+1.)*0.5;
        float shapePick = ceil(rand * 4.);

        float rotation = (PI/posSum + posProduct / pos.z) * sin(uTime * 0.004);

        st = vec2(
          cos(rotation) * (st.x - mid) + sin(rotation) * (st.y - mid) + mid,
          cos(rotation) * (st.y - mid) - sin(rotation) * (st.x - mid) + mid
        );

        float x = sin(st.x * PI) * sin(st.x * PI) * sin(st.x * PI) * sin(st.x * PI) * sin(st.x * PI);
        float y = sin(st.y * PI) * sin(st.y * PI) * sin(st.y * PI) * sin(st.y * PI) * sin(st.y * PI);

        float x1 = x*y;
        float x2 = max(sin(st.x * 5. * PI + sin(st.y * 4.* PI)) * x,0.);
        float x3 = max(sin(st.y * 5. * PI + sin(st.x * 4.* PI)) * x,0.);
        
        float x4 = max(sin(y*x*4.),0.)*(x1+x2+x3);
        float x5 = clamp((x3+x2)*(x+y)*0.25+sin(y*4.)*x*0.75,0.,1.);

        float alphaShape = x2 * shapePick + x1 * (1.-shapePick);
        alphaShape = float(shapePick == 1.) * x1 + float(shapePick == 2.) * x2 + float(shapePick == 3.) * x4 + float(shapePick == 4.) * x5;
        float alphaDistance = min((1. / pos.z) * 1.5,1.);
        float alphaDepth = (posUnprojected.y+uSceneHeight)/uSceneHeight;

        float alpha = alphaShape * alphaDistance * alphaDistance * alphaDepth * 3.;
        

        gl_FragColor = vec4(vec3(1.),alpha * clamp(sin(0.4*(uTime+st.x)*rand)*(1.-gl_PointCoord.y)*2.,0.2+(1.-gl_PointCoord.y),1.));
    }
`