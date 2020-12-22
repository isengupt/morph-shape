import React, { Component } from "react";
import * as THREE from "three";
import { vertex } from "./shaders/Vertex";
import { fragment } from "./shaders/Fragment";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
class Scene extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container = document.getElementById("scene");
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.mount.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );

    this.camera.position.set(0, 0, 6);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.composer = new EffectComposer( this.renderer );
    this.time = 0;
    this.setupResize();
    this.addObjects();
    this.animate();
    this.resize();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.renderPass = new RenderPass( this.scene, this.camera );
this.composer.addPass( this.renderPass );

this.glitchPass = new GlitchPass();
this.composer.addPass( this.glitchPass );

    

    this.geometry = new THREE.ParametricBufferGeometry(
      this.torFunction,
      100,
      100
    );
    this.geometry1 = new THREE.ParametricBufferGeometry(
      this.graykleinFunction,
      100,
      100
    );

    this.geometry.setAttribute('position1', new THREE.BufferAttribute(this.geometry1.attributes.position.array, 3));

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  sphereFunction(u, v, target) {
    u *= Math.PI;
    v *= -Math.PI * 2;

    let x = Math.sin(u) * Math.sin(v);
    let y = Math.sin(u) * Math.cos(v);
    let z = Math.cos(u);

    target.set(x, y, z);
  }

  torFunction(u, v, target) {
    u *= Math.PI*2;
    v *= Math.PI * 2;
    v -=- Math.PI;

    let x = Math.cos(v) + Math.sin(u)*Math.cos(v);
    let y = Math.sin(v) + Math.sin(u)*Math.sin(v);
    let z = Math.cos(u);

    target.set(x, y, z);
  }

  kleinFunction(u, v, target) {
    let a = 1;
    u *= Math.PI * 2 - Math.PI;
    v *= Math.PI * 2;

    let x =
      Math.cos(u) *
      (a +
        Math.sin(v) * Math.cos(u / 2) -
        (Math.sin(2 * v) * Math.sin(u / 2)) / 2);
    let y =
      Math.sin(u) *
      (a +
        Math.sin(v) * Math.cos(u / 2) -
        (Math.sin(2 * v) * Math.sin(u / 2)) / 2);
    let z =
      Math.sin(u / 2) * Math.sin(v) + (Math.cos(u / 2) * Math.sin(2 * v)) / 2;

    target.set(x, y, z);
  }

  graykleinFunction(u, v, target) {
    let a = 3;
    let n = 2;
    let m = 1;
    u *= Math.PI * 4;
    v *= Math.PI * 2;

    let x = (a + Math.cos(n*u / 2.0) * Math.sin(v) - Math.sin(n*u/2.0) * Math.sin(2*v))*Math.cos(m*u/2.0); 
    let y = (a + Math.cos(n*u / 2.0) * Math.sin(v) - Math.sin(n*u/2.0) * Math.sin(2*v))*Math.sin(m*u/2.0);
    let z = Math.sin(n*u/2.0) * Math.sin(v) + Math.cos(n*u/2.0) * Math.sin(2*v)

    target.set(x, y, z);
  }

  planeFunction(u, v, target) {
    let x = u;
    let y = v;
    let z = 0;

    target.set(x, y, z);
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  setupResize = () => {
    window.addEventListener("resize", this.resize);
  };

  resize = () => {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    console.log("resize");

    /*  this.imageAspect = 853 / 1280;

    let a1;
    let a2;

    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    const dist = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2* (180/Math.PI) * Math.atan(height/(2*dist));

    if (this.width / this.height > 1) {
      this.plane.scale.x = this.camera.aspect;
    } else {
      this.plane.scale.y = 1 / this.camera.aspect;
    } */

    this.camera.updateProjectionMatrix();
    console.log(this.camera);
  };

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;

    /*   this.geometry.vertices.forEach((vector) => {
      let u = (vector.x + 0.5) * Math.PI * 2;
      let v = (vector.y + 0.5) * Math.PI;

      vector.x = Math.sin(u) * Math.sin(v);
      vector.y = Math.sin(u) * Math.cos(v);
      vector.z = Math.cos(u);

      //v.z = 0.5*Math.sin(v.y * 50.);
    }); */

    //this.geometry.vertices.needsUpdate = true;

    this.frameId = requestAnimationFrame(this.animate);
    this.composer.render();
    this.renderScene();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        id="scene"
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default Scene;
