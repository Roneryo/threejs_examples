# Threejs Fundamentals

<p>Este es el primer articulo en la serie de articulos acerca de Threejs</p>

Threejs suele confundirse con WebGL ya que e la mayotia de las veces , pero no siempre three.js usa WebGL para dibujar 3D.

    WebGL es un sistema de bajo nivel que solamente dibuja puntos lineas y triangulos.

Para hacer cualquier cosa funcional con WebGL por lo general requiere bastante codigo y es ahi donde entra threejs.

Maneja escenas, luces, sombras, materiales,texturas, matematicas 3d y todo como si hubiese esrito WebGL directamente.

En estos tutoriales asumiremos que sabes JavaScript, y, la mayoria del tiempo vamos a usar ES6.

La mayoria de los navegadores que soportan three.js se actualizan automaticamente por lo que la mayoria de los usuarios deberian poder ejecutar el codigo.

Si te gustaria ejecutar el codigo en navegadores muy viejos deberias considerar transpilar el codigo ES6 con Babel.

Por supuesto los usuarios con navegadores tan viejos posiblemente no puedan ejecutar Three.js

Cuando estamos aprendiendo un lenguaje de programacion la primera cosa que hacemos es ejecutar un `print` de `"Hello world"`

Para el mundo 3d la tarea mas comun es crear un cubo 3d. Entonces Empecemos con un "Hello Cube!"
Primero empezamos con una etiqueta `<canvas>`

```html
<body>
  <canvas id="c"></canvas>
</body>
```

Threejs dibujara en un canvas por lo que debemos ubicarlo y pasarlo a three.js

```html
<script>
  'use strict';

  /* global THREE */

  function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
    ...
</script>
```

#### Nota

> Hay algunos detalles esotéricos aquí.

> > Si no le pasas el `<canvas>` ca threejs entonces el creara uno para ti, pero tendras que agregarlo al document.

Donde agregarlo puedee cambiar segun el caso de uso y tendras que cambiar tu codigo poree lo que pasar un lienso a three.js se siente un poco mas flexible.

Puedo colocar el lienzo en cualquier lugar y el codigo lo encontrara. Como si tuviera un codigo para insertar el lienzo en el documento y posiblemente tendrias que cambiar el codigo dependiendo de mi caso de uso.

Después de buscar el lienzo, creamos un **WebGLRenderer**. El renderizador es el responsable de tomar todos los datos que proporciona y representarlos en el lienzo.

En el pasado ha habido otros renderizadores como **CSSRenderer**, **CanvasRenderer** y en el futuro puede haber un WebGL2Renderer o **WebGPURenderer**. Por ahora, está el **WebGLRenderer** que usa WebGL para renderizar 3D en el lienzo.

---

```javascript
const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
```

<u>**fov**</u> es la abreviatura de <u>**campo de visión**</u>. En este caso 75 grados en la dimensión vertical. Tenga en cuenta que la mayoría de los ángulos en three.js están en radianes, pero por alguna razón la cámara de perspectiva toma grados.

El <u>**aspect**</u> es el aspecto de visualización del lienzo. Repasaremos los detalles en otro artículo, pero de forma predeterminada, un lienzo tiene 300x150 píxeles, lo que hace que el aspecto sea 300/150 o 2.

<u>**near**</u> and <u>**far**</u> representan el espacio frente a la cámara que se renderizará. Todo lo que esté antes o después de ese rango se recortará (no se dibujará).

<img src="https://r105.threejsfundamentals.org/threejs/lessons/resources/frustum-3d.svg" alt=""/>

> Esas 4 configuraciones definen un "frustum". Un tronco es el nombre de una forma tridimensional que es como una pirámide con la punta cortada. En otras palabras, piense en la palabra "frustum" como otra forma 3D como esfera, cubo, prisma, tronco.

La altura de los planos cercano y lejano está determinada por el campo de visión. El ancho de ambos planos está determinado por el campo de visión y el aspecto. Se dibujará cualquier cosa dentro del frustum definido.

Cualquier cosa fuera no lo hará.

Por defecto, la cámara mira hacia abajo en el eje -Z con +Y hacia arriba.

---

Pondremos nuestro cubo en el origen, por lo que debemos mover la cámara un poco hacia atrás desde el origen para poder ver algo.

```javascript
camera.position.z = 2;
```

Esto es lo que estamos buscando.
<img src="https://r105.threejsfundamentals.org/threejs/lessons/resources/scene-down.svg"/>

En el diagrama de arriba podemos ver que nuestra cámara está en z = 2. Está mirando hacia abajo en el eje -Z. Nuestro frustum comienza a 0,1 unidades del frente de la cámara y llega a 5 unidades frente a la cámara.

Debido a que en este diagrama estamos mirando hacia abajo, el campo de visión se ve afectado por el aspecto.

Nuestro lienzo es dos veces más ancho que alto, por lo que el campo de visión transversal será mucho más amplio que nuestros 75 grados especificados, que es el campo de visión vertical.

A continuación hacemos una <u>**Scene**</u>. Una <u>**Scene**</u> en three.js es la raíz de una forma de gráfico de escena. Cualquier cosa que desee que dibuje three.js debe agregarse a la escena. Cubriremos más detalles sobre <a href="https://r105.threejsfundamentals.org/threejs/lessons/threejs-scenegraph.html">cómo funcionan las escenas en un artículo futuro</a>.

```javascript
const scene = new THREE.Scene();
```

A continuación, creamos un <u>**BoxGeometry**</u> que contiene los datos de un cuadro. Casi cualquier cosa que queramos mostrar en Three.js necesita geometría que defina
los vértices que conforman nuestro objeto 3D.

```javascript
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
```

Luego creamos un material básico y establecemos su color. Los colores se pueden especificar utilizando valores de color hexadecimales de 6 dígitos de estilo CSS estándar.

```javascript
const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
```

Luego creamos una malla. Una Malla en three representa la combinación de una Geometría (la forma del objeto) y un Material (cómo dibujar el objeto, brillante o plano, qué color, qué textura(s) aplicar, etc.) as well as the position, orientation, and scale of that object in the scene.

```javascript
const cube = new THREE.Mesh(geometry, material);
```

Y finalmente añadimor la malla a la scena

```javascript
scene.add(cube);
```

Luego podemos renderizar la escena llamando a la función de renderizado del renderizador y pasándole la escena y la cámara.

```javascript
renderer.render(scene, camera);
```

Es un poco difícil decir que es un cubo 3D ya que lo estamos viendo directamente en el eje -Z y el cubo en sí está alineado con el eje, por lo que solo vemos una sola cara.

Vamos a animarlo girando y, con suerte, eso dejará en claro que se está dibujando en 3D. Para animarlo, renderizaremos dentro de un bucle de renderizado usando <u>**requestAnimationFrame**</u>.

Aca esta nuestro ciclo

```javascript
function render(time) {
  time *= 0.001; // convert time to seconds

  cube.rotation.x = time;
  cube.rotation.y = time;

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
```

<u>**requestAnimationFrame**</u> es una solicitud al navegador de que desea animar algo. Le pasas una función para que la llamen. En nuestro caso esa función es **<u>render</u>**.


El navegador llamará a su función y si actualiza algo relacionado con la visualización de la página, el navegador volverá a mostrar la página. En nuestro caso estamos llamando a three

La función __<u>renderer.render</u>__ que dibujará nuestra escena.


la funcion <u>__requestAnimationFrame__</u> pasa el tiempo desde que la página se cargó en nuestra función. Ese tiempo se pasa en milisegundos. Encuentro que es mucho más fácil trabajar con segundos, así que aquí estamos convirtiendo eso a segundos.

Luego establecemos la rotación X e Y del cubo en el tiempo actual. 

Estas rotaciones están en radianes. Hay 2 pi radianes en un círculo, por lo que nuestro cubo debería girar una vez en cada eje en aproximadamente 6,28 segundos.

Luego renderizamos la escena y solicitamos otro cuadro de animación para continuar nuestro ciclo.

Fuera del ciclo, llamamos a requestAnimationFrame una vez para iniciar el ciclo.