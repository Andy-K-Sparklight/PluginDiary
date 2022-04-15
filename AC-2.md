# AC-2 向其它插件提供 API

这一节里，我们介绍如何向其它插件提供 API，并会以 HarmonyAuth SMART 为基础，编写它的 API。

首先要说明的一点是，提供 API 时是非常宽松的，基本上没有任何限制。

## 行动规划

> 行动名称：HarmonyAuth SMART API
>
> 行动代号：AC-2
>
> 行动类别：作战
>
> 涉及章节：
>
> - AC-2
>
> 难度：小僵尸

## 再谈接口

首先我们需要学习一点理论知识。

我们知道，API 是最终要被其它开发者引用的，而我们需要去实现这些 API，那么，API 在 Java 中，是怎样一种表现形式呢？

**接口**或**抽象类**。

还记得我们对接口的比方吗？

- 订酒店的人只管有没有这些服务，不管如何提供
- 服务商只管好好提供服务，不管它们被用来做啥

就是这样。

要定义一个接口，需要使用 `interface` 关键字。

```java
public interface MyInterface {
    void doThis();
    int doThat(String arg);
}
```

接口中有如下规定：

- 只允许抽象方法（即只有签名，没有方法体），除了 `default` 以外。
- 只允许定义静态常量（`public static final`），不允许成员变量

光说可能不好理解，我们写代码就知道了。

我们以 HarmonyAuth SMART 为例，演示 API 的创建方法。

## 创建模块

HarmonyAuth SMART 还是一个经典项目（没有链接到 Maven），因此这次我们就不用 Maven 了。 

创建新模块「HarmonyAuth SMART API」（「New module」时选择「Java」）。

右键 `src`，创建包，你应该非常非常熟练了。

## 制定 API

我们先根据 HarmonyAuth SMART 的实际功能，制定几个 API。

首先当然是那些和登录相关的操作。

右键你的包，「New」、「Java Class」，在弹出的窗口中选择「Interface」，接口名输入 `ILoginManager`（别的名字也是可以的）。按照 Java 编程规范，我们应该在接口名称前加上一个字母 `I`。

![INTERFACE.png](https://s2.loli.net/2022/04/15/hB7N9uK1DXOayjJ.png)

```java
package rarityeg.harmonyauth.api;

import java.util.UUID;

public interface ILoginManager {
    /**
     * Check if the player has logged in.
     *
     * @param id The uuid of the player.
     * @return If this player has logged in.
     */
    boolean isLoggedIn(UUID id);

    /**
     * Set a player logged in, password is not essential.
     *
     * @param id The uuid of the player.
     */
    void login(UUID id);
}


```

可以看到，功能非常简单（因为 HarmonyAuth SMART 的对外交流方式主要是 CLI 的钩子），但 JavaDocs 很多。

!> **认真编写 JavaDocs**！<br/>你的实现无法被其它开发者看到，他们不能通过分析源代码来了解这个方法做什么，唯一的参考就是 JavaDocs，你不会希望经历那种对着写得不明不白的 JavaDocs 时，怎么想都想不明白的那种体验的！

然后我们再创建一个 `IStoredDataManager` 用于修改已经存储的数据。

```java
package rarityeg.harmonyauth.api;

import java.util.UUID;

public interface IStoredDataManager {
    /**
     * Set the password hash for a player.
     * Please ensure that the play knows the new password!
     *
     * @param id   The uuid of the player.
     * @param hash The MD5 hash of the password.
     */
    void setPasswordHash(UUID id, String hash);

    /**
     * Set the IForgot state of the player.
     *
     * @param id          The uuid of the player.
     * @param isInIforgot Whether the player is in IForgot mode.
     */
    void setIForgotState(UUID id, boolean isInIforgot);

    /**
     * Get the IForgot state of the player.
     *
     * @param id The uuid of the player.
     * @return The IForgot state.
     */
    boolean getIForgotState(UUID id);

    /**
     * Set the IForgot reason of the player.<br/>
     * <code>&lt;Internal&gt; Accepted.</code> for accepted and <code>&lt;Internal&gt; Rejected.</code> for rejected.
     *
     * @param id     The uuid of the player.
     * @param reason The IForgot reason.
     */
    void setIForgotReason(UUID id, String reason);

    /**
     * Get the IForgot reason of the player.
     *
     * @param id The uuid of the player.
     * @return The IForgot reason.
     */
    String getIForgotReason(UUID id);
}

```

功能同样很简单。

?> **不止于接口**<br/>虽然这里我们用的是接口，但 API 中不仅可以使用接口，还可以使用一般的类，抽象类等等。API 从本质上来说只是从插件本体中剥离下来的「一层」而已。API **本身也是一种类库**，因此自然可以使用类。<br/>某种意义上来说，插件本体实际上也相当于一个「臃肿的」API。实际上我们已经见到过了，是什么呢？「spigot-1.16.5」嘛。虽然它是一个完整的服务端，但实际上它也「相当于」服务端的 API。

## 实现 API

接下来我们来实现这些 API。

首先，为了实现 API，我们需要将 API 作为 HarmonyAuth SMART 的依赖。

打开「Project Structure」，选择「HarmonyAuth SMART」，在右边选项卡中打开「Dependencies」，单击左下方的「+」、「Module dependency」（这次我们是依赖自己的模块，因此选这个），并在弹出窗口中选择 「HarmonyAuth SMART API」。

![DEPMODULE.png](https://s2.loli.net/2022/04/15/pbzUNH7nK9XI1xW.png)

单击「OK」、「Apply」、「OK」。

接下来回到 HarmonyAuth SMART 的代码中，新建两个类，分别叫做 `APILoginManager` 和 `APIStoredDataManager`。`APILoginManager` 实现 `ILoginManager`，`APIStoredDataManager` 实现 `IStoredDataManager`。

实现起来很简单，大家看代码吧。

```java
package rarityeg.harmonyauthsmart;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;
import rarityeg.harmonyauth.api.ILoginManager;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public class APILoginManager implements ILoginManager {
    @Override
    public boolean isLoggedIn(UUID id) {
        return !RuntimeDataManager.hasRestrictUUID(id);
    }

    @Override
    public void login(UUID id) {
        if (isLoggedIn(id)) {
            return;
        }
        new BukkitRunnable() {
            @Override
            public void run() {
                Player p = Bukkit.getPlayer(id);
                if (p == null) {
                    return;
                }
                RuntimeDataManager.removeRestrictUUID(id);
                p.setWalkSpeed(EventHarmony.originSpeed.get(id));
                p.sendMessage(Util.getAndTranslate("msg.login-success"));
                List<String> hooks = Util.generateHooks("hook.on-login-success", p.getName());
                for (String cmd : hooks) {
                    Util.dispatchCommandAsServer(cmd);
                }
                IDataManager idm;
                if (HarmonyAuthSMART.instance.getConfig().getBoolean("mysql.enabled") && !HarmonyAuthSMART.dbError) {
                    idm = new DBDataManager();
                } else {
                    idm = new FileDataManager();
                }
                new BukkitRunnable() {
                    @Override
                    public void run() {
                        idm.setIForgotManualReason(id, "");
                        idm.setIForgotState(id, false);
                        idm.setLastLoginTime(id, new Date());
                    }
                }.runTaskAsynchronously(HarmonyAuthSMART.instance);
            }
        }.runTask(HarmonyAuthSMART.instance);
    }
}
```

实现部分就不需要那么详细地编写 JavaDocs 了，但注释还是很有用的，如果需要请尽管写~

下面是 `APIStoredDataManager` 的代码。


```java
package rarityeg.harmonyauthsmart;

import rarityeg.harmonyauth.api.IStoredDataManager;

import java.util.UUID;

public class APIStoredDataManager implements IStoredDataManager {

    @Override
    public void setPasswordHash(UUID id, String hash) {
        getDataManager().setPasswordHash(id, hash);
    }

    @Override
    public void setIForgotState(UUID id, boolean isInIforgot) {
        getDataManager().setIForgotState(id, isInIforgot);
    }

    @Override
    public boolean getIForgotState(UUID id) {
        return getDataManager().getIForgotState(id);
    }

    @Override
    public void setIForgotReason(UUID id, String reason) {
        getDataManager().setIForgotManualReason(id, reason);
    }

    @Override
    public String getIForgotReason(UUID id) {
        return getDataManager().getIForgotManualReason(id);
    }

    private IDataManager getDataManager() {
        if (HarmonyAuthSMART.instance.getConfig().getBoolean("mysql.enabled") && !HarmonyAuthSMART.dbError) {
            return new DBDataManager();
        } else {
            return new FileDataManager();
        }
    }
}
```

## 注册到 Bukkit

现在接口创建好了，实现也完成了，接下来怎么做呢？

嗯……我们现在面对的问题是，**如何在开发者只有接口，不知道它的实现类的情况下，获得该接口对应的对象**。

解决这个问题的方法就是利用 `RegisteredServiceProvider`。Bukkit 的这个机制允许我们将接口和实现「分开」，只需要把接口交给其他开发者，开发者通过 `RegisteredServiceProvider` 重新获得对应的类。

?> **到底怎么回事**？<br/>（为了方便表述，下面我们将「依赖你的插件的那个插件」称为「X 插件」）<br/>X 插件的开发者们只有接口（`IStoredDataManager` 等），**没有它们对应的实现**（`APIStoredDataManager`），因此他们无法通过 `new` 创建一个新的对象。<br/>X 插件不知道实现的类是哪一个，但 Bukkit 应该知道，因为 X 插件需要的实现在我们的插件中，而我们的插件正是由 Bukkit 加载的。<br/>`RegisteredServiceProvider` 做的事无非就是「牵线」，其它插件提供给它一个需求（接口），它就返回注册好的一个对象，**代替了 `new` 的工作**，仅此而已。<br/>另外，API 的本质实际上就是要将「对外开放的一部分」分离出去，因此在你的 API 中应该**只包含你希望被其它插件使用的内容**。

那我们需要在主类的 `onLoad` 方法中注册这两个服务，注册服务很简单：

```java
@Override
public void onLoad() {
    Bukkit.getServicesManager().register(ILoginManager.class, new APILoginManager(), this, ServicePriority.Normal);
    
    Bukkit.getServicesManager().register(IStoredDataManager.class, new APIStoredDataManager(), this, ServicePriority.Normal);
}
```

注册方法的签名如下：

```java
public void register(
    Class<T> aClass,
    T provider,
    Plugin plugin,
    ServicePriority priority
)
```

第一个参数是接口的 `class`，传入接口的 `class` 属性即可。

第二个参数是提供方的对象，这里只能提供对象，于是我们实例化一个 `APILoginManager` 作为服务提供方了。这也告诉我们，实现方法时**不要使用** `static`！（实际上接口中也不允许 `static` 方法被重写）

第三个参数是插件实例，在插件主类中注册时是 `this`。

第四个参数是优先级，只能取 `ServicePriority` 中的值，从 `Lowest` 到 `Highest`。这表示当**同一个**插件的**两个服务**都注册了**同一个接口**时，优先使用哪个服务。正常情况下一般不会出现，因为没人会傻到给自己注册两个冲突的服务。一般设为 `ServicePriority.Normal`。

这样我们就已经注册好了，Bukkit 下次收到 `getRegistration(IStoredDataManager.class)` 这样的请求时，就知道「哦，这家伙需要 `IStoredDataManager` 的一个实现啊，好办，这里有，给你！」

最后就是打包的问题了。

## 构建与打包

由于我们修改了 HarmonyAuth SMART 的代码，我们也需要修改它们的构建方式。

基本上要遵循如下两个原则：

- API（HarmonyAuth SMART API）构建时**不能**包含任何实现中的类，否则开发者编译时会出现错误
- 实现（HarmonyAuth SMART）构建时**必须**包含 API，否则当注册服务时会出现 `ClassNotFoundException` 异常

这样就很好解决了。

### 构建 HarmonyAuth SMART

打开「Project Structure」，转到「Artifacts」，修改 HarmonyAuth SMART 的构建方案：

- Extracted 'mysql-connector-java-8.0.23.jar/'（AC-1-3 中添加）
- 'HarmonyAuth SMART' compile output（AC-1-2 中添加）
- **'HarmonyAuth SMART API' compile output（现在添加）**

![ARTIFACT.png](https://s2.loli.net/2022/04/15/tNEwy3pimazfYsR.png)

*在右侧单击「HarmonyAuth SMART API」左侧的小三角将它展开，双击其中的「'HarmonyAuth SMART API' compile output」即可将它添加到左边。*

勾选「Include in project build」。

### 构建 API

不要关闭窗口，单击左上角的「+」、「JAR」、「Empty」，将它命名为「HarmonyAuth SMART API」（这个名字真的无所谓！）。

在右侧找到「'HarmonyAuth SMART API' compile output」，将它添加到左边，这样构建时就仅含有 API 的内容。

勾选「Include in project build」。「Apply」、「OK」。

现在单击绿色锤子按钮，然后查收 `HarmonyAuth SMART API.jar` 和 `HarmonyAuth SMART.jar`，现在你可以把 API 发给别的开发者了！HarmonyAuth SMART 的开发也算正式完工了！

## 打包的选择

有时候我们会用到第三方库，这时候打包应该怎么选择呢？

记住这样几条规则：

- 打包本体时，**如果一个组件在运行时存在，那就不需要打包，否则就需要打包**，以下是详细规则：

  - **必须**打包的有（不打包可能出现错误）：
    - 你自己的插件本体
    - 你自己的插件 API
    - 所有**非插件支援库**（如 JDBC）

  - **不能**打包的有（打包后可能会出现错误）：
    - 其它插件本体（如 Vault 本体，会 `InvalidPluginException`）
    - 服务端或者服务端 API（会出现未知的错误）
  - **不必**打包的有（没有打包的必要）：
    - 前置插件的 API（如 Vault API）
    - 其它没有在上面提到的东西

- 打包 API 时，**如果开发者能够获取这个组件，就不需要打包，否则就需要打包**，规则如下：

  - **必须**打包的有：
    - 如果 **API 中**（注意**不是**本体中！）包含了前置插件的 API 中的类，哪怕**只是一个类**，也需要打包完整的这个前置插件的 API（不是本体！）
    - 如果 **API 中**包含了非插件支援库（如 JDBC）的类，哪怕**只是一个类**，也需要打包完整的这个支援库

  - **不能**打包的有：
    - 本体不能打包的内容，API 中一样不能打包
    - API 应当是**独立的**，本体需要包含 API，但 API 不能包含本体

那什么叫「包含」呢？

举个例子吧，如果我的 API 接口中有一个方法是：

```java
public void sendMail(String content)
```

虽然它的**功能是发送邮件**，但该方法**本身没有使用邮件相关的类**，因此打包这个 API 时就**不需要**打包邮件支援库。

相比之下，如果我有一个方法：

```java
public Mail getMail();
```

即使它仅仅使用了 `Mail` 类，但这个类定义在邮件支援库中，打包这个 API 时就**应当**打包邮件支援库的 API（如果它提供了，否则就直接打包整个支援库）。

就是这样的原理。

---

那么再看一个例子，你知道 Vault 是一个分离了 API 的插件，那么，现在我们有几个其它的插件：

- NotEnoughMoney，需要依赖 Vault，同样提供了分离的 API
- CutieShop，需要依赖 NotEnoughMoney

现在你是 CutieShop 的开发人员，你需要为你的插件编写 API，虽然你巧妙地进行了设计，没有使用 NotEnoughMoney 的类，但你的 API 中不可避免的使用到了 Vault API 中的类，那么你的 API 构建时，需要打包哪些资源呢？请选择（可以多选）：

1. Vault 本体
2. Vault API
3. NotEnoughMoney 本体
4. NotEnoughMoney API
5. CutieShop 本体

答案是什么？

答案是 2，只有 2。因为你**只用到了 Vault API 的类**。也就是说，如果你的 API 用到了其它的 API，也**只需要打包那个 API**，不需要打包对应的本体。

---

再把题目改一下，如果你不得不使用 NotEnoughMoney API 中的类和 Vault API 中的类，那么应该打包哪些呢？

4 吗？只有 4 吗？

答案是 2 和 4。因为虽然 NotEnoughMoney API 依赖了 Vault API，但它的 API 中**未必包含了 Vault API 中的内容**。所以 Vault API 还是要带着。

本次行动的源代码：https://github.com/Andy-K-Sparklight/PluginDiaryCode/tree/master/HarmonyAuth%20SMART%20API/src

## 行动结束

战斗不费吹灰之力，很简单，但这场战役很重要，因为我们已经具备了开发一个完整的、可应用的、可扩展的插件的能力。按下按钮吧，这是属于你的胜利。

<button type='button' class="btn btn-info" style="width:100%;transition:500ms;" onclick="$('#hideEle').show();this.onclick=function(){};this.className='btn btn-success';this.innerHTML=this.innerHTML.replace('question','check').replace('确认行动结束','恭喜！');"><i class="fa fa-question"></i> 确认行动结束</button>

<div id='hideEle' style='display:none;'>

> 行动结果：胜利

这就是有关向其它插件提供 API 的方法了。话说，本小马好累啊~

好吧，稍微休息一下，听首歌，我们准备进入第 7 章。

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height="86" src="//music.163.com/outchain/player?type=2&id=31649687&auto=0&height=66"></iframe>

</div>