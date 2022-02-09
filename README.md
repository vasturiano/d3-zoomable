d3-zoomable
==================

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![NPM Downloads][npm-downloads-img]][npm-downloads-url]

This reusable component provides an easy way to make DOM elements zoomable/pannable using mouse wheel/drag events. It is mostly a convenience wrapper around [d3-zoom](https://github.com/d3/d3-zoom) functionality which hides away some of the complexity and provides easy access to common use cases.

Supports zooming `svg` (via transform attribute), `canvas` (via context transform) or even plain `html` DOM elements (via transform style).

Check out the examples:
* [HTML](https://vasturiano.github.io/d3-zoomable/example/html/) ([source](https://github.com/vasturiano/d3-zoomable/blob/master/example/html/index.html))
* [SVG](https://vasturiano.github.io/d3-zoomable/example/svg/) ([source](https://github.com/vasturiano/d3-zoomable/blob/master/example/svg/index.html))
* [Canvas](https://vasturiano.github.io/d3-zoomable/example/canvas/) ([source](https://github.com/vasturiano/d3-zoomable/blob/master/example/canvas/index.html))

## Quick start

```js
import zoomable from 'd3-zoomable';
```
or
```js
const zoomable = require('d3-zoomable');
```
or even
```html
<script src="//unpkg.com/d3-zoomable"></script>
```
then
```js
const myZoom = zoomable();
myZoom(<DOM element to capture mouse events>)
    .svgEl(<SVG element to transform>);
```

## API reference

| Method | Description | Default |
| --- | --- | :--: |
| <b>htmlEl</b>([<i>node, d3-selection or array</i>]) | Getter/setter for the HTML DOM element to control using the `transform` style property. Also accepts a list of elements by passing an array. | |
| <b>svgEl</b>([<i>node, d3-selection or array</i>]) | Getter/setter for the SVG DOM element to control using the `transform` attribute. Also accepts a list of elements by passing an array. | |
| <b>canvasEl</b>([<i>node, d3-selection or array</i>]) | Getter/setter for the Canvas DOM element to control using context transform operations. Also accepts a list of elements by passing an array. | |
| <b>enableX</b>([<i>bool</i>]) | Getter/setter for whether to enable zooming along the X axis. | `true` |
| <b>enableY</b>([<i>bool</i>]) | Getter/setter for whether to enable zooming along the Y axis. | `true` |
| <b>scaleExtent</b>([<i>[number, number]</i>]) | Getter/setter for the zoom limits to enforce, similar to [d3-zoom scaleExtent](https://github.com/d3/d3-zoom#zoom_scaleExtent). | `[1, ∞]` |
| <b>translateExtent</b>([<i>[[number, number], [number, number]]</i>]) | Getter/setter for the pan limits to enforce, similar to [d3-zoom translateExtent](https://github.com/d3/d3-zoom#zoom_translateExtent). | `[[-∞, -∞], [+∞, +∞]]` |
| <b>current</b>() | Getter for the current transform settings, in `{ x, y, k }` syntax. |  |
| <b>zoomBy</b>(<i>number</i>[, <i>duration</i>]) | Programmatically adjust the zoom scale by a certain amount. Optionally set a transition duration (in `ms`) to animate the transformation. |  |
| <b>zoomReset</b>([<i>duration</i>]) | Programmatically reset the zoom to its initial setting (`{ x: 0, y: 0, k: 1 }`). Optionally set a transition duration (in `ms`) to animate the transformation. |  |
| <b>zoomTo</b>(<i>{ x, y, k }</i> [, <i>duration</i>]) | Programmatically apply a certain zoom setting, defined by the `x`, `y` translation, and the `k` scaling. Optionally set a transition duration (in `ms`) to animate the transformation. |  |
| <b>onChange</b>(<i>fn(newTransform, previousTransform, duration)</i>) | Callback function invoked whenever the zoom settings change, either by user interaction of programmatically. The callback arguments include the new transform (`{ x, y, k }` syntax), the previous transform, and the duration of the zoom (in `ms`) in the case of programmatic requests. | |


[npm-img]: https://img.shields.io/npm/v/d3-zoomable
[npm-url]: https://npmjs.org/package/d3-zoomable
[build-size-img]: https://img.shields.io/bundlephobia/minzip/d3-zoomable
[build-size-url]: https://bundlephobia.com/result?p=d3-zoomable
[npm-downloads-img]: https://img.shields.io/npm/dt/d3-zoomable
[npm-downloads-url]: https://www.npmtrends.com/d3-zoomable
