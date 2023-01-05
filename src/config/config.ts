export interface WeatherConfig {
  key: string
  msg1: string
  msg2: string
  title1: string
}

export const config: WeatherConfig = {
  // 和风天气key
  key: '',
  // 搜索目标地区坐标失败的提示
  msg1: '竟是无法被发现之地！恐怖如斯~',
  // 获取目标地区天气失败的提示
  msg2: '此地有强大结界，无法窥探其中详情',
  // 天气预报转发记录的标题
  title1: '你的天气预报，请查收~',
}
