"use strict";
// import { createCamera } from "./utils/basicSettings.js";
// import setDirectionalLight from "./utils/basicSettings.js";
import {
  createCamera,
  setDirectionalLight,
  makeInstance,
  resizeRendererToDisplaySize,
} from "./utils/basicSettings.js";
/* global THREE */

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const camera = createCamera();
  camera.position.z = 3;
  const scene = new THREE.Scene();
  const light = setDirectionalLight(0xffffff, 1);
  light.position.set(-1, 2, 4);
  scene.add(light);

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const cubes = [
    makeInstance(scene, geometry, 0x44aa88, 0),
    makeInstance(scene, geometry, 0x8844aa, -2),
    makeInstance(scene, geometry, 0xaa8844, 2),
  ];

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
