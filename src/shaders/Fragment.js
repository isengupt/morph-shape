
export var fragment = `

uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vNormal;


void main()	{
  
    float diff = abs(dot(normalize(vec3(1.,1.,1.)),vNormal));
    
    vec3 a = vec3(0.5,0.5,0.5);
    vec3 b = vec3(0.5,0.5,0.5);
    vec3 c = vec3(2.0,1.0,0.0);
    vec3 d = vec3(0.50,0.20,0.25);
    vec3 color = a + b * cos(2. * 3.1415925 * (c * diff+d + time /5. ));



    
    gl_FragColor = vec4(color,1.);

}
`;