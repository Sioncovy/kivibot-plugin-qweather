import { KiviPlugin, http, dayjs, makeForwardMsg } from '@kivibot/core'
import { config } from './config'

const { version } = require('../package.json')
const plugin = new KiviPlugin('qweather', version)

plugin.onMounted((bot) => {
  plugin.saveConfig(Object.assign(config, plugin.loadConfig()))

  /**
   * 获取城市 location 坐标
   * @param location 查询的地区
   * @param adm 上级地区（用于重名时的区分），可选
   */
  const getCityInfo = async (location: string, adm?: string) => {
    const { data: cityInfo } = await http.get(
      'https://geoapi.qweather.com/v2/city/lookup',
      {
        params: {
          key: config.key,
          location,
          adm,
        },
      }
    )
    return cityInfo
  }
  plugin.onCmd('天气帮助', (event) => {
    event.reply(`天气插件使用指北
    天气预报：提供从今天开始的 3|7|10|15|30 天天气状况
      命令格式：天气预报 <天数> <地区> [上级地区] 
      eg. 天气预报 3 武侯 成都
    实时天气：提供当前最新的天气状况
      命令格式：实时天气 <地区> [上级地区] 
      eg. 实时天气 武侯 成都
    tips: <>为必带参数 []为可选参数`)
  })

  plugin.onCmd('天气预报', async (event, params) => {
    const [count, location, adm] = params
    const cityInfo = await getCityInfo(location, adm)
    // 地区有误或者请求失败
    if (!cityInfo || cityInfo.code !== '200') {
      event.reply(config.msg1)
      return
    }
    // 地区信息
    const city = cityInfo['location'][0]
    // 地区坐标
    const locationId: string = city['id']
    // 请求3天天气预报数据
    const { data: weatherInfo } = await http.get(
      `https://devapi.qweather.com/v7/weather/${count}d?`,
      {
        params: {
          key: config.key,
          location: locationId,
        },
      }
    )
    // 获取实时天气数据失败
    if (!weatherInfo || weatherInfo.code !== '200') {
      event.reply(config.msg2)
      return
    }
    const { daily } = weatherInfo
    const weather = [
      `下面播报 「${city['adm1']} ${city['adm2']} ${city['name']}」 未来 ${count} 天天气状况`,
    ]
    daily.forEach((day: any) => {
      weather.push(
        `日期：${day['fxDate']}\n气温：${day['tempMin']}~${day['tempMax']} ℃\n日间状况：${day['textDay']}\n夜间状况：${day['textNight']}\n日出日落：${day['sunrise']} | ${day['sunset']}\n月升月落：${day['moonrise']} | ${day['moonset']}\n月相：${day['moonPhase']}\n`
      )
    })
    const msg = await makeForwardMsg.call(
      bot,
      weather.map((message: string) => {
        return {
          nickname: bot?.nickname,
          user_id: bot?.uin as number,
          message,
        }
      }),
      config.title1,
      `这是接下来 ${count} 天的天气哟`
    )
    event.reply(msg)
  })

  plugin.onCmd('实时天气', async (event, params) => {
    const [location, adm] = params
    const cityInfo = await getCityInfo(location, adm)
    // 地区有误或者请求失败
    if (!cityInfo || cityInfo.code !== '200') {
      event.reply(config.msg1)
      return
    }
    // 地区信息
    const city = cityInfo['location'][0]
    // 地区坐标
    const locationId: string = city['id']
    // 请求实时天气数据
    const { data: weatherInfo } = await http.get(
      'https://devapi.qweather.com/v7/weather/now',
      {
        params: {
          key: config.key,
          location: locationId,
        },
      }
    )
    // 获取实时天气数据失败
    if (!weatherInfo || weatherInfo.code !== '200') {
      event.reply(config.msg2)
      return
    }

    const weather = weatherInfo['now']

    event.reply(
      `下面播报 「${city['adm1']} ${city['adm2']} ${
        city['name']
      }」 天气\n温度：${weather['temp']} ℃\n体感温度：${
        weather['feelsLike']
      } ℃\n天气情况：${weather['text']}\n风向：${
        weather['windDir']
      }\n风力等级：${weather['windScale']} 级\n风速：${
        weather['windSpeed']
      } 公里/小时\n相对湿度：${weather['humidity']}%\n小时累计降水量：${
        weather['precip']
      } mm\n大气压强：${weather['pressure']} 百帕\n能见度：${
        weather['vis']
      } 公里\n云量：${weather['cloud']}\n更新时间：${dayjs(
        weather['obsTime']
      ).format('YYYY-MM-DD HH:mm:ss')}`
    )
  })
})

export { plugin }
