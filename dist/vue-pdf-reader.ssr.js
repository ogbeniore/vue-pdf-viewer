'use strict';Object.defineProperty(exports,'__esModule',{value:true});var pdfjs=require('pdfjs-dist'),pdfjsWorker=require('pdfjs-dist/build/pdf.worker.entry');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var pdfjs__default=/*#__PURE__*/_interopDefaultLegacy(pdfjs);var pdfjsWorker__default=/*#__PURE__*/_interopDefaultLegacy(pdfjsWorker);function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}var Page = {
  props: ["page"],
  computed: {
    canvasAtttrs: function canvasAtttrs() {
      var _this$viewport = this.viewport,
          width = _this$viewport.width,
          height = _this$viewport.height;
      width = Math.ceil(width);
      height = Math.ceil(height);
      return {
        width: width,
        height: height,
        class: "pdf-page"
      };
    }
  },
  watch: {
    page: function page(_page, oldPage) {
      this.destroyPage(oldPage);
    }
  },
  created: function created() {
    this.viewport = this.page.getViewport({
      scale: window.devicePixelRatio || 1
    });
  },
  mounted: function mounted() {
    this.drawPage();
  },
  beforeDestroy: function beforeDestroy() {
    this.destroyPage(this.page);
  },
  methods: {
    drawPage: function drawPage() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var viewport, canvasContext, renderContext, renderTask;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!_this.renderTask) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                viewport = _this.viewport;
                canvasContext = _this.$el.getContext("2d");
                renderContext = {
                  canvasContext: canvasContext,
                  viewport: viewport
                };
                _context.next = 7;
                return _this.page.render(renderContext).promise;

              case 7:
                renderTask = _context.sent;

                if (renderTask) {
                  _this.renderTask = renderTask;
                } else {
                  _this.destroyRenderTask();
                }

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    destroyPage: function destroyPage(page) {
      if (!page) return; // PDFPageProxy#_destroy
      // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html

      page._destroy(); // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html


      if (this.renderTask) this.renderTask.cancel();
    },
    destroyRenderTask: function destroyRenderTask() {
      if (!this.renderTask) return; // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html

      this.renderTask.cancel();
      delete this.renderTask;
    }
  },
  render: function render(h) {
    var attrs = this.canvasAtttrs;
    return h("canvas", {
      attrs: attrs
    });
  }
};//
var script = {
  name: "KPDFViewer",
  components: {
    Page: Page
  },
  props: {
    PdfUrl: {
      type: String,
      required: true
    }
  },
  data: function data() {
    return {
      pages: [],
      pdf: ""
    };
  },
  mounted: function mounted() {
    var _this = this;

    pdfjs__default['default'].GlobalWorkerOptions.workerSrc = pdfjsWorker__default['default'];
    var pdfLoader = pdfjs__default['default'].getDocument({
      url: this.PdfUrl
    }); // Get document from urls

    pdfLoader.promise.then(function (doc) {
      var range = [];

      for (var index = 1; index <= doc.numPages; index++) {
        range.push(index);
      }

      var promises = range.map(function (number) {
        return doc.getPage(number);
      });
      Promise.all(promises).then(function (pages) {
        _this.pages = pages;
      });
    });
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_vm.pages && _vm.pages.length ? _vm._ssrNode("<div class=\"pdf__wrapper\" data-v-d94e4fc4>", "</div>", [_vm._ssrNode("<div class=\"pdf__header\" data-v-d94e4fc4><p data-v-d94e4fc4>" + _vm._ssrEscape(_vm._s(_vm.name) + " - " + _vm._s(_vm.pages.length) + " Pages") + "</p></div> "), _vm._ssrNode("<div class=\"pdf\" data-v-d94e4fc4>", "</div>", _vm._l(_vm.pages, function (page) {
    return _c('Page', {
      key: page.pageNumber,
      attrs: {
        "page": page
      }
    });
  }), 1)], 2) : _vm._ssrNode("<div data-v-d94e4fc4>Loading...</div>")]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-d94e4fc4_0", {
    source: ".pdf-page[data-v-d94e4fc4]{width:100%;margin-bottom:.5rem}.pdf__wrapper[data-v-d94e4fc4]{height:calc(100vh - 7rem);overflow:auto;max-height:90vh;position:sticky;top:7rem;margin-bottom:3rem}.pdf__header[data-v-d94e4fc4]{padding:1rem;background:#000;color:#fff;text-align:center;position:sticky;top:0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-d94e4fc4";
/* module identifier */

var __vue_module_identifier__ = "data-v-d94e4fc4";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component

var install = function installVuePdfReader(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('VuePdfReader', __vue_component__);
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__;