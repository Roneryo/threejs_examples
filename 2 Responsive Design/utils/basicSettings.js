function createCamera() {
  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  return new THREE.PerspectiveCamera(fov, aspect, near, far);
}

function setDirectionalLight(color, intensity) {
  return new THREE.DirectionalLight(color, intensity);
}

function makeInstance(scene, geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  return cube;
}
//comprueba el resize para hacer recalculo del canvas
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
export {
  createCamera,
  setDirectionalLight,
  makeInstance,
  resizeRendererToDisplaySize,
};
