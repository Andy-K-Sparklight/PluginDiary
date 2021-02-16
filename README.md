# ? ? ? 首页

欢迎阅读本教程，本教程旨在介绍基于 Bukkit API 的 Minecraft 服务端插件开发方法。

---

## 编写本教程的目的

笔者一开始编写插件是看 MCBBS 中的早期教程，然而那时候的教程无一例外使用的都是 Eclipse。对于笔者而言，曾经用 Eclipse 写 Mod 的痛苦还记忆犹新，因此笔者采用了 IDEA 进行开发。后来笔者又阅读了几份较新的教程，但发现有些部分它们并没有涵盖到（大致从本教程的第 4 章开始）。

笔者一度在反射和 MySQL 那里遇到困难，因此想与其在问答版回答问题还不如写成教程，于是便编写了这样一份教程。

## 关于本教程中部分内容的说明

1. 作者在编写时尽最大努力使内容真实有效，但无任何保证。
2. 对自然人的称呼中，使用某一特定的性别表述仅是为编写方便，并无任何象征或指代意义。
3. 本教程中的代码部分，作者授予您等同于作者所拥有的权利（复制、修改、再分发），无需署名或申请额外的许可，**仅仅代码部分才如此**！文本内容采用 CC-BY-3.0 协议许可，见下。
4. 教程中引用的所有文本内容均得到作者的或者该作品许可中的授权，效果截图来自作者计算机。
5. 音乐全部引用自 [网易云音乐](https://music.163.com)，本站点未存储任何文件。

## 技术信息

本教程站点是基于 docsify 构建的，采用了 docsify-themeable 进行渲染。

主要字体采用 FiraCode，按钮部分来自 Bootstrap，剧情模拟和行动确认是由笔者的 `build.js` 和 `log.js` 完成的。

保证页面正常运作的代码由 jsDelivr 为您加速。

GitHub Pages 托管了本站点。

---

## 法律信息

本教程使用 [知识共享署名 3.0 中国大陆许可协议](https://creativecommons.org/licenses/by/3.0/cn/) 进行许可。

![CC-BY-3.0-CN](https://cdn.jsdelivr.net/gh/Andy-K-Sparklight/PluginDiary/img/by.svg)

本教程中少量游戏截图来自于游戏 《Minecraft: Java Edition》（《我的世界：Java 版》），根据其开发公司 Mojang Studios AB 在许可条款中的[相应说明](https://account.mojang.com/terms?ref=ft#brand)，我们可以使用它。

本教程不是 Minecraft 官方产品，不是来自 Minecraft 并且未经 Minecraft 认可。本教程与 Mojang Studios AB  没有关联，也不是来自 Mojang Studios AB。

本教程中提供的开发工具 AdoptOpenJDK、IntelliJ IDEA Community 以及使用到的软件 MySQL Community 等均是自由软件或在其许可条款中允许了我们将其链接到本站点。所有的链接都指向原始站点，**本站点没有分发或存储任何相关文件**。

部分内容出于教学作用选自网络，现在此注明出处：

- [RUNOOB 菜鸟教程](https://www.runoob.com)，已在 [此处](https://www.runoob.com/disclaimer) 得到了普适的授权。
- [Bukkit Development Note](https://bdn.tdiant.net)，其许可协议已附在其首页。
- [Paper-API JavaDocs](https://papermc.io/javadocs/paper/1.16/overview-summary.html)，该网站的内容采用 MIT 许可证进行授权，见 [此处](https://github.com/PaperMC/papermc.io/blob/master/LICENSE)。
- [中文 Minecraft Wiki 镜像](https://wiki.biligame.com/mc/Minecraft_Wiki)，由于要求相同方式共享，与我们的许可不兼容，因此仅链接到本站而不进行任何引用。

---

侧边栏展现了整个教程的结构，单击即可跳转到对应章节。

