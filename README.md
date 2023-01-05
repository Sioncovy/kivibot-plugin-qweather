# 天气插件 for KiviBot

[![npm-version](https://img.shields.io/npm/v/kivibot-plugin-qweather?color=527dec&label=kivibot-plugin-qweather&style=flat-square)](https://npm.im/kivibot-plugin-qweather)
[![dm](https://shields.io/npm/dm/kivibot-plugin-qweather?style=flat-square)](https://npm.im/kivibot-plugin-qweather)

[`KiviBot`](https://beta.kivibot.com) 的基于和风天气api的天气插件，目前支持实时天气与天气预报。

**安装**

```shell
/plugin add qweather
```

**启用**

```shell
/plugin on qweather
```

**使用**

私聊和群聊都可

```shell
命令：
天气帮助：输出本插件使用指北

天气插件使用指北
  天气预报：提供从今天开始的 3|7|10|15|30 天天气状况
    命令格式：天气预报 <天数> <地区> [上级地区] 
    eg. 天气预报 3 武侯 成都
  实时天气：提供当前最新的天气状况
    命令格式：实时天气 <地区> [上级地区] 
    eg. 实时天气 武侯 成都
  tips: <>为必带参数 []为可选参数
```
1. 在 [和风天气](https://dev.qweather.com/docs/configuration/project-and-key) 中获取key，免费额度每天1000次请求
2. 启用插件后，会生成配置文件，在 `/data/config/qweather/config.json` 中，将获得的key值填入 `config.json` 中
3. 重新加载插件即可

配置项说明
```json
{
  // 和风天气key
  "key": "",
  // 搜索目标地区坐标失败的提示
  "msg1": "",
  // 获取目标地区天气失败的提示
  "msg2": "",
  // 天气预报转发记录的标题
  "title1": "",
}
```