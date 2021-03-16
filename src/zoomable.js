import { select as d3Select } from 'd3-selection';
import { transition as d3Transition } from 'd3-transition';
import { interpolateNumber as d3InterpolateNumber } from 'd3-interpolate';
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity } from 'd3-zoom';
import Kapsule from 'kapsule';

export default Kapsule({
  props: {
    htmlEl: { onChange(el, state) {
      state.htmlEls = (!el ? [] : el instanceof Array ? el : [el])
        .map(el => typeof el === 'object' && !!el.node && typeof el.node === 'function'
          ? el // already a D3 selection
          : d3Select(el)
        );
    }, triggerUpdate: false },
    svgEl: { onChange(el, state) {
      state.svgEls = (!el ? [] : el instanceof Array ? el : [el])
        .map(el => typeof el === 'object' && !!el.node && typeof el.node === 'function'
          ? el // already a D3 selection
          : d3Select(el)
        );
    }, triggerUpdate: false },
    canvasEl: { onChange(el, state) {
      state.canvasCtxs = (!el ? [] : el instanceof Array ? el : [el])
        .map(el => typeof el === 'object' && !!el.node && typeof el.node === 'function'
          ? el.node().getContext('2d') // D3 selection
          : el.getContext('2d')
        );
    }, triggerUpdate: false },
    enableX: { default: true, triggerUpdate: false },
    enableY: { default: true, triggerUpdate: false },
    scaleExtent: { default: [1, Infinity], onChange(extent, state) { extent && state.zoom.scaleExtent(extent)}, triggerUpdate: false },
    translateExtent: { onChange(extent, state) { extent && state.zoom.translateExtent(extent)}, triggerUpdate: false },
    onChange: { triggerUpdate: false }
  },

  methods: {
    current(state) {
      return ({ ...state.zoomTransform })
    },
    zoomBy: function(state, k, duration = 0) {
      if (state.initialised) {
        state.transitionDuration = duration;
        state.el.call(state.zoom.scaleBy, k);
      }
      return this;
    },
    zoomReset: function(state, duration = 0) {
      if (state.initialised) {
        state.transitionDuration = duration;
        state.el.call(state.zoom.transform, d3ZoomIdentity);
      }
      return this;
    },
    zoomTo: function(state, { x = 0, y = 0, k = 1 }, duration = 0) {
      if (state.initialised) {
        state.transitionDuration = duration;
        state.el.call(state.zoom.transform, d3ZoomIdentity
          .scale(k)
          .translate(x, y)
        );
      }
      return this;
    }
  },

  stateInit: () => ({
    zoom: d3Zoom().filter(ev => !ev.button && !ev.dblclick),
    zoomTransform: { x: 0, y: 0, k: 1 }
  }),

  init(el, state) {
    const isD3Selection = !!el && typeof el === 'object' && !!el.node && typeof el.node === 'function';
    state.el = d3Select(isD3Selection ? el.node() : el);

    state.el
      .call(state.zoom
        .on('zoom', function(ev) {
          const tr = ({ ...ev.transform });

          !state.enableX && (tr.x = 0);
          !state.enableY && (tr.y = 0);

          const prevTr = state.zoomTransform;
          state.zoomTransform = tr;

          const duration = state.transitionDuration || 0;
          state.transitionDuration = 0; // reset it

          const scX = state.enableX ? tr.k : 1;
          const scY = state.enableY ? tr.k : 1;

          state.htmlEls.forEach(el => {
            (duration ? el.transition().duration(duration) : el)
              .style('transform', `translate(${tr.x}px, ${tr.y}px) scale(${scX}, ${scY})`);
          });

          state.svgEls.forEach(el => {
            (duration ? el.transition().duration(duration) : el)
              .attr('transform', `translate(${tr.x}, ${tr.y}) scale(${scX}, ${scY})`);
          });

          state.canvasCtxs.forEach((ctx, idx) => {
            const applyTr = ({ x, y, scX, scY }) => {
              ctx.setTransform(scX, 0, 0, scY, x, y);
            };

            duration
              ? d3Transition().duration(duration).tween(`animate-ctx-${idx}`, () => {
                const xIpol = d3InterpolateNumber(prevTr.x, tr.x);
                const yIpol = d3InterpolateNumber(prevTr.y, tr.y);
                const scXIpol = state.enableX ? d3InterpolateNumber(prevTr.k, tr.k) : () => 1;
                const scYIpol = state.enableY ? d3InterpolateNumber(prevTr.k, tr.k) : () => 1;

                return t => applyTr({ x: xIpol(t), y: yIpol(t), scX: scXIpol(t), scY: scYIpol(t) });
              })
              : applyTr({ scX, scY, ...tr });
          });

          state.onChange && state.onChange(tr, prevTr, duration);
        })
      );

    state.el.on('dblclick.zoom', null); // Disable double-click zoom

}
});
