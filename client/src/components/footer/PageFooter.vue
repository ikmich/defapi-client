<template>
  <div id="pageFooterWrapper">
    <div id="pageFooter">
      <div class="contents">
        <a href="https://github.com/ikmich/defapi" target="_blank">
          <!--suppress HtmlUnknownTarget -->
          <img class="github-logo" src="/img/GitHub_Logo.png" alt="Github Logo"
        /></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageFooter'
};
</script>

<style scoped>
#pageFooter {
  background-color: #e6e5e6;
  border-top: 1px solid #d9d9d9;
  margin-top: 32px;
  padding: 24px;
  display: flex;
  justify-content: center;
}

#pageFooter .contents {
  display: inline-flex;
}

#pageFooter .github-logo {
  opacity: 0.4;
  height: 24px;
}

#pageFooter .github-logo:hover {
  opacity: 1;
}
</style>
