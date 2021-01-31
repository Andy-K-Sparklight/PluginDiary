function logSimulator(hook) {
  hook.afterEach(() => {
    $(".log").on("click", (e) => {
      console.log("Clicked");

      let ele = $(e.target);
      var raw_all = ele.data("log");
      var index = parseInt(ele.data("index"));
      var all = raw_all.split("\n");
      var to_display = all[index + 1];
      if (!to_display) {
        ele.data("index" - 1);
        to_display = "事件模拟已结束——单击重新模拟";
      } else {
        ele.data("index", index + 1);
      }
      let container = ele.find(".container");
      container.fadeTo("slow", 0.001, () => {
        container.html(to_display);
        container.fadeTo("slow", 1);
      });
    });
  });
}
window.$docsify.plugins = window.$docsify.plugins || [];
window.$docsify.plugins.push(logSimulator);
