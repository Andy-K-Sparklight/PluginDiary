# EG-1 插件开发常见失误

笔者在这里总结了一些插件开发时常见的失误，有些失误看上去永远都不会犯，但实际上它们经常出现。

- 如果使用了事件处理器，**记得注册事件处理器**。
  - 可以在 `onEnable` 中注册，也可以设置单独的方法，但一定要记得注册。
- 如果使用 `getConfig`，一定要记得**创建 `config.yml` 与** `saveDefaultConfig`。
- 记得写 `plugin.yml`，`main`、`name`、`version` 不能少。
  - `api-version` 也应当填写。
- 异步事件监听中**禁止使用** `Bukkit.XXX`。
- 如果采用自定义的方法读取文件，**记得保存**。
- 如果不确定你依赖的插件需不需要加载，**不要写在 `depend` 中**。
- 不能确定线程安全的地方**使用 `Vector`、`ConcurrentHashMap` 或 `HashTable` 进行同步**。
- 在和数据库进行交互之前，**先检查能否连接到数据库**。
- 使用其它库之前，**请先看看它们的许可证**。
- 敏感信息**必须加密**。
- 使用反射时，请一定要注意加载的类的名字。
  - 经常出现 `packageName + "ItemStack"`，最终结果为 `net.minecraft.server.v1_16_R3ItemStack`，导致 `ClassNotFoundException`。
- **绝不要**进行未经检查的强制类型转换。
- 不要用 `throw new XXXException` 和 `try/catch` 的方法来代替本该由 `if` 完成的工作。
  - 捕捉错误需要的开销远大于 `if`，`if` 只需要一条 `JMP`（`JNE`、`JE`） 指令，而捕捉异常需要创建新的对象，记录出错信息，麻烦得很。
- `PlayerEvent` 无法监听。
  - 与此类似的还有 `InventoryEvent`、`EntityEvent` 等。
- 自定义事件时不要忘了编写 `public static HandlerList getHandlerList()` 方法。
- 如果重写了 `equals` 方法，必须重写 `hashCode` 方法，使得 `equals` 的对象得到相同的 `hashCode`。
- 禁止频繁 `new` 对象，否则会给垃圾回收器带来极大的负担。
- 数组（`XXX[]`）的操作速度远高于 `List<XXX>`，请慎重选择，如果能力允许，请尽量使用数组。
- 减少 `Map<UUID, Map<String, Map<Integer, Map<String, Boolean>>>>` 这种大型嵌套 `Map`，消耗性能并且还容易出错。
- 有红线的代码（IDEA 标记错误）是无法通过编译的。
- 将依赖库**「Extract Into Output Root」**，而不是双击直接添加。
  - 后者将那个 Jar 直接包括到你的 Jar 中，那是无法运行的。
- 导入类（自动补全）时，一定要看清楚你在导入哪个包。
- NMS（OBC）功能必须进行反射，否则你的代码就只能在当前版本的服务端中运行。
- `OutputStream`、`Connection`、`ResultSet`、`PreparedStatement` 使用后记得关闭。
- `@Nonnull` 和 `@NotNull` 是不一样的，一般我们使用前者以获得更好的兼容性。
  - `javax.annotation.Nonnull` 和 `org.jetbrains.annotation.NotNull`，一看便知。

- 事件监听要打 `@EventHandler` 注解。
- 严禁使用 `@SuppressWarnings`，除非你明确知道为什么你要压制这个警告（如 `deprecation` 和 `unused`）。
  - 你压制了警告，就减少了查出错误的机会。
- 禁止 `return null`。
  - 除了 `onTabComplete` 方法中可以。如果你经常返回 `null`，等待你的只有两种结果：大量的 `requireNonNullElse` 或者 `NullPointerException`。
- 使用 `return` 来结束处理时，确保在每个不符合要求的 `if` 语句中皆 `return`。
- `ItemMeta` 是就地修改，而 `ShapedRecipe` 是复制。
  - 典型错误如 `item.setItemMeta(item.getItemMeta().setLore(...))`，会编译错误。
- `int`、`float`、`double`、`boolean`、`long` 这样的基本类型**不能被赋值为** `null`。
  - 最好的办法就是根本不要赋值 `null`。
- Maven 项目中，非 Java 代码文件需要放在 `resources` 下。
  - 否则 Maven 会忽略它们。
- 修改了代码后，如果你没有设置自动编译，记得手动构建。

---

大致就是这些，当然这和全部比起来肯定只是很少一部分，具体的错误，需要你自己记录。