function e(){let e=document.getElementById(`hero-flow`);if(!e||matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let t=e.getContext(`webgl`,{antialias:!1,alpha:!1,powerPreference:`low-power`,preserveDrawingBuffer:!1});if(!t)return;let n=(e,n)=>{let r=t.createShader(e);return t.shaderSource(r,n),t.compileShader(r),r},r=t.createProgram();if(t.attachShader(r,n(t.VERTEX_SHADER,`attribute vec2 p; varying vec2 vUv; void main(){ vUv=p*0.5+0.5; gl_Position=vec4(p,0.,1.); }`)),t.attachShader(r,n(t.FRAGMENT_SHADER,`
precision mediump float;
uniform float uT; uniform vec2 uM; uniform vec2 uR; uniform vec2 uTilt; uniform float uLens;
varying vec2 vUv;
const vec3 CREAM=vec3(0.984,0.965,0.937); const vec3 PALE=vec3(0.847,0.937,0.965); const vec3 TEAL=vec3(0.059,0.506,0.639);
const vec3 DEEP=vec3(0.039,0.4,0.518); const vec3 OR=vec3(0.945,0.380,0.255); const vec3 CY=vec3(0.169,0.765,0.886);
float n2(vec2 p){return sin(p.x)*sin(p.y);}
float fbm(vec2 p){float a=0.5,s=0.;for(int i=0;i<4;i++){s+=a*(0.5+0.5*n2(p));p=mat2(1.6,1.2,-1.2,1.6)*p+0.7;a*=0.5;}return s;}
vec3 field(vec2 uv){
  float t=uT*0.05;
  uv+=uTilt*0.25;
  vec2 q=vec2(fbm(uv*2.0+t),fbm(uv*2.0-t+3.1));
  float f=fbm(uv*1.5+q*1.8+vec2(t*1.4,-t));
  // keep the copy side (left) calm and light; colour gathers to the right / bottom
  float side=smoothstep(0.15,1.05,vUv.x*0.85+(1.0-vUv.y)*0.35);
  vec3 c=mix(CREAM,PALE,smoothstep(0.25,0.75,f));
  c=mix(c,TEAL,smoothstep(0.62,0.95,f*q.y*1.7)*0.85*side);
  c=mix(c,DEEP,smoothstep(0.78,1.05,q.x+q.y-f*0.6)*0.7*side);
  c=mix(c,OR,smoothstep(0.66,0.98,q.x*f*1.75)*0.75*side);
  c=mix(c,CY,smoothstep(0.86,1.0,q.y*f*1.9)*0.35*side);
  return c;
}
void main(){
  vec2 asp=vec2(uR.x/uR.y,1.0);
  vec2 uv=vUv*asp; vec2 m=uM*asp;
  vec3 base=field(uv);
  if(uLens<0.5){gl_FragColor=vec4(base,1.0);return;}
  float r=0.17; float d=length(uv-m);
  vec2 dir=(uv-m)/max(d,1e-4);
  float inside=smoothstep(r,r-0.006,d);
  float bend=pow(clamp(d/r,0.,1.),2.2);
  vec3 lensC=field(m+dir*d*mix(0.45,1.0,bend));
  lensC=mix(lensC,PALE,0.22)+0.08*smoothstep(r,0.,length(uv-m-vec2(-0.05,0.06)));
  vec3 col=mix(base,lensC,inside);
  col=mix(col,OR,smoothstep(0.024,0.016,abs(d-r-0.018)));
  gl_FragColor=vec4(col,1.0);
}`)),t.linkProgram(r),!t.getProgramParameter(r,t.LINK_STATUS))return;t.useProgram(r);let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);let a=t.getAttribLocation(r,`p`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0);let o=e=>t.getUniformLocation(r,e),s=o(`uT`),c=o(`uM`),l=o(`uR`),u=o(`uTilt`),d=o(`uLens`),f=matchMedia(`(hover: hover) and (pointer: fine)`).matches&&innerWidth>=1024;t.uniform1f(d,+!!f);let p=f?Math.min(devicePixelRatio,1.25)*.75:.5,m=()=>{let n=e.getBoundingClientRect();e.width=Math.max(2,Math.round(n.width*p)),e.height=Math.max(2,Math.round(n.height*p)),t.viewport(0,0,e.width,e.height),t.uniform2f(l,e.width,e.height)};m(),addEventListener(`resize`,m,{passive:!0});let h={x:.72,y:.55},g={x:0,y:0,set:!1},_={x:0,y:0},v={x:0,y:0},y=e.parentElement;if(f)y.addEventListener(`pointermove`,t=>{let n=e.getBoundingClientRect();g.x=(t.clientX-n.left)/n.width,g.y=1-(t.clientY-n.top)/n.height,g.set=!0},{passive:!0});else{let e=e=>{e.gamma!=null&&e.beta!=null&&(v.x=Math.max(-1,Math.min(1,e.gamma/30)),v.y=Math.max(-1,Math.min(1,(e.beta-45)/30)))},t=window.DeviceOrientationEvent;if(t&&typeof t.requestPermission==`function`){let n=r=>{r.target.closest(`a,button,input`)||(y.removeEventListener(`click`,n),t.requestPermission().then(t=>t===`granted`&&addEventListener(`deviceorientation`,e,{passive:!0})).catch(()=>{}))};y.addEventListener(`click`,n)}else t&&addEventListener(`deviceorientation`,e,{passive:!0})}let b=!0,x=0,S=0,C=performance.now(),w=e=>{let n=Math.min(.05,(e-C)/1e3);C=e,S+=n;let r=.7+.08*Math.sin(S*.4),i=.55+.06*Math.cos(S*.5),a=Math.min(1,n*3);h.x+=((g.set?g.x:r)-h.x)*a,h.y+=((g.set?g.y:i)-h.y)*a,_.x+=(v.x+.15*Math.sin(S*.21)-_.x)*Math.min(1,n*2),_.y+=(v.y+.15*Math.cos(S*.17)-_.y)*Math.min(1,n*2),t.uniform1f(s,S),t.uniform2f(c,h.x,h.y),t.uniform2f(u,_.x,_.y),t.drawArrays(t.TRIANGLES,0,3),x=requestAnimationFrame(w)},T=()=>{cancelAnimationFrame(x),b&&!document.hidden&&(C=performance.now(),x=requestAnimationFrame(w))};new IntersectionObserver(([e])=>{b=e.isIntersecting,T()}).observe(e),document.addEventListener(`visibilitychange`,T),T(),requestAnimationFrame(()=>e.classList.remove(`opacity-0`)),window.__heroFlow=!0}export{e as default};