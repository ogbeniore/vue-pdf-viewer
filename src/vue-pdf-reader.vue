<template>
  <div>
    <div v-if="pages && pages.length" class="pdf__wrapper">
      <div class="pdf__header">
        <p>{{ name }} - {{ pages.length }} Pages</p>
      </div>
      <div class="pdf">
        <Page v-for="page in pages" :key="page.pageNumber" :page="page" />
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import Page from "./Page";

export default {
  name: "KPDFViewer",
  components: {
    Page,
  },
  props: {
    PdfUrl: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    pages: [],
    pdf: "",
  }),
  mounted() {
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    let pdfLoader = pdfjs.getDocument({ url: this.PdfUrl }); // Get document from urls
    pdfLoader.promise.then((doc) => {
      const range = [];
      for (let index = 1; index <= doc.numPages; index++) {
        range.push(index);
      }
      const promises = range.map((number) => doc.getPage(number));
      Promise.all(promises).then((pages) => {
        this.pages = pages;
      });
    });
  },
};
</script>
<style scoped>
.pdf-page {
  width: 100%;
  margin-bottom: 0.5rem;
}
.pdf__wrapper {
  height: calc(100vh - 7rem);
  overflow: auto;
  max-height: 90vh;
  position: sticky;
  top: 7rem;
  margin-bottom: 3rem;
}
.pdf__header {
  padding: 1rem;
  background: black;
  color: #ffffff;
  text-align: center;
  position: sticky;
  top: 0;
}
</style>