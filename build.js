const fs = require("fs");
fs.readdir("./", (e, files) => {
  files.forEach((v) => {
    if (v.endsWith(".md")) {
      fs.writeFile(
        v,
        parseLog(
          parseHide(
            parseFA(
              parseBSAlert(parseLevel(parseBtn(fs.readFileSync(v).toString())))
            )
          )
        ),
        (e) => {
          if (e) {
            console.log("Error building " + v);
          } else {
            console.log(`File ${v} emitted.`);
          }
        }
      );
    }
  });
});
function parseBtn(html) {
  return html.replace(
    "&btmbtn",
    "<button type='button' class=\"btn btn-info\" style=\"width:100%;transition:500ms;\" onclick=\"$('#hideEle').show();this.onclick=function(){};this.className='btn btn-success';this.innerHTML=this.innerHTML.replace('question','check').replace('确认行动结束','恭喜！');\"><i class=\"fa fa-question\"></i> 确认行动结束</button>"
  );
}
function parseHide(html) {
  return html
    .replace("<!-- hideS -->", "<div id='hideEle' style='display:none;'>")
    .replace("<!-- hideE -->", "</div>");
}
function parseLog(html) {
  let regex = /(?<=\<\!\-\- logS \-\-\>)[\s\S]*?(?=\<\!\-\- logE \-\-\>)/g;
  let all = html.match(regex);
  if (!all) {
    return html;
  }
  for (let x of all) {
    let allstr = x.split("\n");
    let processed = ["单击开始事件还原"];
    for (let m of allstr) {
      if (m.trim() != "") {
        processed.push(m.trim());
      }
    }
    let g = processed.join("\n");
    let start = g.split("\n")[0];
    let instance = `<div onclick='${logSimulate}' style='width:100%;height:50px;text-align:center;line-height:50px;background-color:#ffe0f0' data-index="0" data-log="${g}">${start}</div>`;
    html = html.replace(x, instance);
  }
  return html.replace(/\<\!\-\- log(S|E) \-\-\>/g, "\n");
}
function addBuildInfo(html) {
  if (!html.endsWith("<!-- ENDBUILD -->"))
    html +=
      "\n> Build at " +
      new Date().getUTCDate() +
      " with RR's Build.js\n<!-- ENDBUILD -->";
}
function parseLevel(html) {
  var LvRegex = /xhx(简易|普通|较难|危险|骨灰)/g;
  var res = LvRegex.exec(html);
  if (res) {
    switch (res[1]) {
      case "简易":
        return html.replace(
          res[0],
          `<div class='progress' style='height:20px'><div class='progress-bar bg-info' style='width:20%'>简易</div></div>`
        );
      case "普通":
        return html.replace(
          res[0],
          `<div class='progress' style='height:20px'><div class='progress-bar bg-success' style='width:40%'>普通</div></div>`
        );
      case "较难":
        return html.replace(
          res[0],
          `<div class='progress' style='height:20px'><div class='progress-bar bg-warning' style='width:60%'>较难</div></div>`
        );
      case "危险":
        return html.replace(
          res[0],
          `<div class='progress' style='height:20px'><div class='progress-bar bg-danger' style='width:80%'>危险</div></div>`
        );
      case "骨灰":
        return html.replace(
          res[0],
          `<div class='progress' style='height:20px'><div class='progress-bar bg-dark' style='width:100%'>骨灰</div></div>`
        );
    }
  } else {
    return html;
  }
}
function parseFA(html) {
  var hb = html;
  var FARegex = /&i [a-z0-9\-]*/g;
  var all = html.match(FARegex);
  if (all) {
    for (var i = 0; i < all.length; i++) {
      var iconRegex = /(?<=&i )[a-z0-9-]*/g;
      var icon = all[i].match(iconRegex) || [];
      var res = `<i class="fa fa-${icon}"></i>`;
      hb = hb.replace(all[i], res);
    }
  }
  return hb;
}
function parseBSAlert(html) {
  var hb = html;
  var BSAlertRegex = /{bsa (success|info|warning|danger|primary|secondary|dark|light)+ [^}]*}/g;
  var all = html.match(BSAlertRegex);
  if (all) {
    for (var i = 0; i < all.length; i++) {
      var typeRegex = /(?<=\{bsa )(success|info|warning|danger|primary|secondary|dark|light)/g;
      var textRegex = /(?<=\{bsa (success|info|warning|danger|primary|secondary|dark|light) )[^\}]*(?=\})/g;
      var type = all[i].match(typeRegex) || [];
      var text = all[i].match(textRegex) || [];
      var fatype;

      switch (type[0]) {
        case "success":
          fatype = "check-circle";
          break;

        case "warning":
        case "danger":
          fatype = "exclamation-triangle";
          break;

        case "info":
        case "primary":
        case "secondary":
        case "dark":
        case "light":
        default:
          fatype = "info-circle";
          break;
      }
      var res = `<div class="alert alert-${type[0] || ""}">&i ${fatype} ${
        text[0] || ""
      }</div>`;
      hb = hb.replace(all[i], res);
    }
  }
  return hb;
}
let logSimulate = `let ele = $(this);var raw_all = ele.data("log");var index = parseInt(ele.data("index"));var all = raw_all.split("\\n");var to_display = all[index + 1];if (!to_display) {ele.data("index", -1);to_display = "事件模拟已结束——单击重新模拟";\n} else {\nele.data("index", index + 1);}\nele.html(to_display);`;
