export default {
  props: ["page"],
  computed: {
    canvasAtttrs() {
      let { width, height } = this.viewport;
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

      const { viewport } = this;
      const canvasContext = this.$el.getContext("2d");
      const renderContext = { canvasContext, viewport };
      const renderTask = await this.page.render(renderContext).promise;

      if (renderTask) {
        this.renderTask = renderTask;
      } else {
        this.destroyRenderTask();
      }
    },
    destroyPage(page) {
      if (!page) return;

      // PDFPageProxy#_destroy
      // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html
      page._destroy();

      // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html
      if (this.renderTask) this.renderTask.cancel();
    },
    destroyRenderTask() {
      if (!this.renderTask) return;

      // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html
      this.renderTask.cancel();
      delete this.renderTask;
    }
  },
  render(h) {
    const { canvasAtttrs: attrs } = this;
    return h("canvas", { attrs });
  }
};
