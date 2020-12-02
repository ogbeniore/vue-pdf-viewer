import pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

var Page = {
  props: ["page"],
  computed: {
    canvasAtttrs() {
      let {
        width,
        height
      } = this.viewport;
      width = Math.ceil(width);
      height = Math.ceil(height);
      return {
        width,
        height,
        class: "pdf-page"
      };
    }

  },
  watch: {
    page(page, oldPage) {
      this.destroyPage(oldPage);
    }

  },

  created() {
    this.viewport = this.page.getViewport({
      scale: window.devicePixelRatio || 1
    });
  },

  mounted() {
    this.drawPage();
  },

  beforeDestroy() {
    this.destroyPage(this.page);
  },

  methods: {
    async drawPage() {
      if (this.renderTask) return;
      const {
        viewport
      } = this;
      const canvasContext = this.$el.getContext("2d");
      const renderContext = {
        canvasContext,
        viewport
      };
      const renderTask = await this.page.render(renderContext).promise;

      if (renderTask) {
        this.renderTask = renderTask;
      } else {
        this.destroyRenderTask();
      }
    },

    destroyPage(page) {
      if (!page) return; // PDFPageProxy#_destroy
      // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html

      page._destroy(); // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html


      if (this.renderTask) this.renderTask.cancel();
    },

    destroyRenderTask() {
      if (!this.renderTask) return; // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html

      this.renderTask.cancel();
      delete this.renderTask;
    }

  },

  render(h) {
    const {
      canvasAtttrs: attrs
    } = this;
    return h("canvas", {
      attrs
    });
  }

};

//
var script = {
  name: "KPDFViewer",
  components: {
    Page
  },
  props: {
    PdfUrl: {
      type: String,
      required: true
    }
  },
  data: () => ({
    pages: [],
    pdf: ""
  }),

  mounted() {
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    let pdfLoader = pdfjs.getDocument({
      url: this.PdfUrl
    }); // Get document from urls

    pdfLoader.promise.then(doc => {
      const range = [];

      for (let index = 1; index <= doc.numPages; index++) {
        range.push(index);
      }

      const promises = range.map(number => doc.getPage(number));
      Promise.all(promises).then(pages => {
        this.pages = pages;
      });
    });
  }

};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_vm.pages && _vm.pages.length ? _c('div', {
    staticClass: "pdf__wrapper"
  }, [_c('div', {
    staticClass: "pdf__header"
  }, [_c('p', [_vm._v(_vm._s(_vm.name) + " - " + _vm._s(_vm.pages.length) + " Pages")])]), _vm._v(" "), _c('div', {
    staticClass: "pdf"
  }, _vm._l(_vm.pages, function (page) {
    return _c('Page', {
      key: page.pageNumber,
      attrs: {
        "page": page
      }
    });
  }), 1)]) : _c('div', [_vm._v("Loading...")])]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-d94e4fc4_0", {
    source: ".pdf-page[data-v-d94e4fc4]{width:100%;margin-bottom:.5rem}.pdf__wrapper[data-v-d94e4fc4]{height:calc(100vh - 7rem);overflow:auto;max-height:90vh;position:sticky;top:7rem;margin-bottom:3rem}.pdf__header[data-v-d94e4fc4]{padding:1rem;background:#000;color:#fff;text-align:center;position:sticky;top:0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-d94e4fc4";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component

const install = function installVuePdfReader(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('VuePdfReader', __vue_component__);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default __vue_component__;
