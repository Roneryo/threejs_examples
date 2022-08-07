Este es el segundo artículo de una serie de artículos sobre three.js. <a href="../1 Fundamentals/Readme.md">El primer artículo trataba sobre los fundamentos.</a> Si aún no lo ha leído, es posible que desee comenzar allí.

Este artículo trata sobre cómo hacer que su aplicación three.js responda a cualquier situación.

Hacer que una página web responda generalmente se refiere a que la página se muestre bien en pantallas de diferentes tamaños, desde computadoras de escritorio hasta tabletas y teléfonos.

Para three.js, hay aún más situaciones a considerar. Por ejemplo, un editor 3D con controles a la izquierda, derecha, arriba o abajo es algo que podríamos querer manejar. Un diagrama en vivo en medio de un documento es otro ejemplo.

En la última muestra, usamos un `<canvas>` simple sin CSS ni tamaño

```html
<canvas id="c"></canvas>
```

Ese `<canvas>` tiene un tamaño predeterminado de 300x150 píxeles CSS.

En la plataforma web la forma recomendada de establecer el tamaño de algo es usar CSS.

Hagamos que el lienzo llene la página agregando CSS

```css
html,
body {
  margin: 0;
  height: 100%;
}
#c {
  width: 100%;
  height: 100%;
  display: block;
}
```

En HTML, el cuerpo tiene un margen de 5 píxeles de forma predeterminada, por lo que establecer el margen en 0 elimina el margen. Establecer el html y la altura del cuerpo al 100% hace que llenen la ventana. De lo contrario, son tan grandes como el contenido que los llena.

Ahora le decimos al elemento `id=c` que tenga el 100% del tamaño de su contenedor, que en este caso es el cuerpo del documento.

Finalmente configuramos su `display` en `block`. El modo de visualización predeterminado de un `canvas` es en `inline`. Los elementos `inline` pueden terminar agregando espacios en blanco a lo que se muestra. Al configurar el `canvas` para bloquear ese problema desaparece.

Puede ver que el `canvas` ahora está llenando la página, pero hay 2 problemas. Uno de nuestros cubos está estirado. No son cubos, son más como cajas.

Demasiado alto o demasiado ancho. Abra el ejemplo en su propia ventana y cambie su tamaño. Verás como los cubos se estiran a lo ancho y alto.

<img src="https://r105.threejsfundamentals.org/threejs/lessons/resources/images/resize-incorrect-aspect.png" alt="">

El segundo problema es que se ven de baja resolución o en bloques y borrosos. Estira la ventana muy grande y realmente verás el problema.

<img src="https://r105.threejsfundamentals.org/threejs/lessons/resources/images/resize-low-res.png" alt=""></img>

Arreglemos primero el problema de la elasticidad. Para hacerlo, debemos configurar el aspecto de la cámara en el aspecto del tamaño de visualización del lienzo. Podemos hacerlo observando las propiedades `clientWidth` y `clientHeight` del lienzo.

Actualizaremos nuestro bucle de renderizado de esta manera

```javascript
function render(time) {
  time *= 0.001;

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  ...
}
```

Abra el ejemplo en una ventana separada y cambie el tamaño de la ventana y debería ver que los cubos ya no se estiran ni alto ni ancho. Mantienen el aspecto correcto independientemente del tamaño de la ventana.

<img src="https://r105.threejsfundamentals.org/threejs/lessons/resources/images/resize-correct-aspect.png" alt=""></img>

Ahora arreglemos el bloqueo.

Los elementos de `canvas` tienen 2 tamaños. Un tamaño es el tamaño que se muestra el lienzo en la página. Eso es lo que establecemos con CSS.

El tamaño interno de un lienzo, su resolución, a menudo se denomina tamaño de búfer de dibujo. En three.js podemos establecer el tamaño del búfer de dibujo del lienzo llamando a `renderer.setSize`.

¿Qué tamaño debemos elegir? La respuesta más obvia es "del mismo tamaño que se muestra el lienzo". Nuevamente, para hacer eso, podemos mirar las propiedades `clientWidth` y `clientHeight` del lienzo.

Escribamos una función que verifique si el lienzo del renderizador aún no tiene el tamaño que se muestra y, de ser así, establezca su tamaño.

```javascript
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
```

Observe que verificamos si el `canvas` realmente necesita ser redimensionado. Cambiar el tamaño del lienzo es una parte interesante de la especificación del `canvas` y es mejor no establecer el mismo tamaño si ya es el tamaño que queremos.

Una vez que sabemos si necesitamos cambiar el tamaño o no, llamamos a `renderer.setSize` y pasamos el nuevo ancho y alto. Es importante pasar `false` al final. `render.setSize` establece de forma predeterminada el tamaño CSS del lienzo, pero hacerlo no es lo que queremos.

Queremos que el navegador continúe funcionando como lo hace con todos los demás elementos, que es usar CSS para determinar el tamaño de visualización del elemento. No queremos que los `canvas` usados ​​por tres sean diferentes a otros elementos.

Tenga en cuenta que nuestra función devuelve `true` si se cambió el tamaño del `canvas`. Podemos usar esto para comprobar si hay otras cosas que deberíamos actualizar. Modifiquemos nuestro bucle de renderizado para usar la nueva función.

```javascript
function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  ...
}
```

Dado que el aspecto solo cambiará si el tamaño de visualización del `canvas` cambió, solo establecemos el aspecto de la cámara si `resizeRendererToDisplaySize` devuelve `true`.

---

# Handling HD-DPI displays

HD-DPI significa pantallas de puntos por pulgada de alta densidad. Esa es la mayoría de las Mac hoy en día y muchas máquinas con Windows, así como casi todos los teléfonos inteligentes.

La forma en que esto funciona en el navegador es que usan píxeles CSS para establecer los tamaños que se supone que son iguales, independientemente de la resolución de la pantalla. El navegador simplemente representará el texto con más detalle pero con el mismo tamaño físico.

Hay varias formas de manejar HD-DPI con three.js. La primera es simplemente no hacer nada especial. Este es posiblemente el más común. La renderización de gráficos 3D requiere mucha potencia de procesamiento de la GPU.

Las GPU móviles tienen menos potencia que las computadoras de escritorio, al menos a partir de 2018 y, sin embargo, los teléfonos móviles suelen tener pantallas de muy alta resolución.

Los teléfonos actuales de primera línea tienen una relación HD-DPI de 3x, lo que significa que por cada píxel de una pantalla que no es HD-DPI, esos teléfonos tienen 9 píxeles. Eso significa que tienen que hacer 9 veces el renderizado.

Calcular 9x los píxeles es mucho trabajo, así que si dejamos el código como está, calcularemos 1x los píxeles y el navegador lo dibujará a 3x el tamaño (3x por 3x = 9x píxeles).

Para cualquier aplicación pesada de three.js, eso es probablemente lo que desea; de lo contrario, es probable que obtenga una velocidad de fotogramas lenta.

Dicho esto, si realmente desea renderizar a la resolución del dispositivo, hay un par de formas de hacerlo en three.js.

Una es decirle a three.js un multiplicador de resolución usando renderer.setPixelRatio. Le pregunta al navegador cuál es el multiplicador de píxeles CSS a píxeles del dispositivo y lo pasa a three.js

```javascript
renderer.setPixelRatio(window.devicePixelRatio);
```

Después de eso, cualquier llamada a **`renderer.setSize`** usará mágicamente el tamaño que solicite multiplicado por la relación de píxeles que haya pasado.

**Esto NO SE RECOMIENDA. Vea abajo La otra forma es hacerlo usted mismo cuando cambia el tamaño del lienzo.**

---

La otra forma es hacerlo usted mismo cuando cambia el tamaño del lienzo.

```javascript
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
```

Esta segunda forma es objetivamente mejor.

¿Por qué? Porque significa que obtengo lo que pido.

Hay muchos casos cuando usamos three.js donde necesitamos saber el tamaño real del búfer de dibujo del lienzo. Por ejemplo, al hacer un filtro de posprocesamiento, o si estamos creando un sombreador que accede a gl_FragCoord, si estamos haciendo una captura de pantalla, o leyendo píxeles para la selección de GPU, para dibujar en un lienzo 2D, etc. Hay muchos casos en los que si usamos setPixelRatio, entonces nuestro tamaño real será diferente al tamaño que solicitamos y tendremos que adivinar cuándo usar el tamaño que solicitamos y cuándo usar el tamaño que está usando three.js. Al hacerlo nosotros mismos, siempre sabemos que el tamaño que se utiliza es el tamaño que solicitamos. No hay ningún caso especial en el que la magia esté sucediendo detrás de escena.
