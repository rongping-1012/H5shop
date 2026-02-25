import type { ApiResponse, Goods, GoodsListParams, PaginationResponse } from '@/types'

// mock 数据（用于列表 / 搜索 / 详情）
const mockGoods: Goods[] = [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro',
    desc: 'A17 Pro / 钛金属机身',
    price: 8999,
    originalPrice: 9999,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 1
  },
  {
    id: 2,
    name: '华为 Mate 60 Pro',
    desc: '昆仑玻璃 / 卫星通信',
    price: 6999,
    originalPrice: 7599,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 1
  },
  {
    id: 3,
    name: '小米 14 Pro',
    desc: '澎湃芯片 / 徕卡影像',
    price: 4699,
    originalPrice: 4999,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 1
  },
  {
    id: 4,
    name: 'OPPO Find X7',
    desc: '天玑旗舰芯片 / 柔光长焦',
    price: 4299,
    originalPrice: 4599,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 1
  },
  {
    id: 5,
    name: 'vivo X100 Pro',
    desc: '自研影像芯片 / 超感光主摄',
    price: 4999,
    originalPrice: 5299,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 1
  },
  {
    id: 6,
    name: '联想拯救者游戏本 R9000P',
    desc: '锐龙处理器 / 240Hz电竞屏',
    price: 7999,
    originalPrice: 8599,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 2
  },
  {
    id: 7,
    name: 'Apple MacBook Air 13',
    desc: 'M2 芯片 / 轻薄便携',
    price: 7999,
    originalPrice: 8999,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 2
  },
  {
    id: 8,
    name: '戴森 Dyson 吹风机 HD15',
    desc: '智能温控 / 负离子护发',
    price: 2999,
    originalPrice: 3299,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 3
  },
  {
    id: 9,
    name: '美的 变频空调 1.5匹',
    desc: '一级能效 / 静音节能',
    price: 2599,
    originalPrice: 2899,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 3
  },
  {
    id: 10,
    name: '耐克 Nike 跑步鞋',
    desc: '缓震跑鞋 / 日常通勤',
    price: 599,
    originalPrice: 799,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 5
  },
  {
    id: 11,
    name: '南方黑芝麻糊 礼盒装',
    desc: '经典营养早餐',
    price: 39,
    originalPrice: 49,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 6
  },
  {
    id: 12,
    name: 'Apple AirPods Pro 2',
    desc: '第二代主动降噪 / MagSafe 充电盒',
    price: 1899,
    originalPrice: 1999,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 1
  },
  {
    id: 13,
    name: '罗技 G Pro 无线鼠标',
    desc: '电竞级无线 / Hero 传感器',
    price: 699,
    originalPrice: 799,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 2
  },
  {
    id: 14,
    name: '西门子 滚筒洗衣机 10kg',
    desc: '变频电机 / 蒸汽除菌',
    price: 3599,
    originalPrice: 3999,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 3
  },
  {
    id: 15,
    name: '兰蔻 小黑瓶 精华 50ml',
    desc: '精华肌底液 / 提亮细腻肌肤',
    price: 869,
    originalPrice: 999,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 4
  },
  {
    id: 16,
    name: '阿迪达斯 运动卫衣',
    desc: '圆领套头 / 休闲百搭',
    price: 329,
    originalPrice: 399,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 5
  },
  {
    id: 17,
    name: '伊利 安慕希 常温酸奶',
    desc: '高端浓缩酸奶 / 205g*12盒',
    price: 69,
    originalPrice: 79,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 6
  },
  {
    id: 18,
    name: 'Switch 游戏机 OLED 港版',
    desc: '7英寸 OLED 屏 / 家庭娱乐',
    price: 2199,
    originalPrice: 2399,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 7
  },
  {
    id: 19,
    name: '网易严选 四件套 床品',
    desc: '全棉亲肤 / 多色可选',
    price: 259,
    originalPrice: 299,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 8
  },
  {
    id: 20,
    name: '德芙 巧克力礼盒 600g',
    desc: '丝滑口感 / 送礼优选',
    price: 89,
    originalPrice: 109,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 6
  }
]

/**
 * 获取商品列表
 */
export const getGoodsList = (params: GoodsListParams = {}): Promise<ApiResponse<PaginationResponse<Goods>>> => {
  const page = Number(params.page || 1)
  const pageSize = Number(params.pageSize || 10)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = mockGoods.slice(start, end)
  const hasMore = end < mockGoods.length

  return Promise.resolve({
    code: 200,
    data: {
      list,
      hasMore
    }
  })
}

/**
 * 获取商品详情
 */
export const getGoodsDetail = (id: string | number): Promise<ApiResponse<Goods>> => {
  const goods = mockGoods.find((item) => item.id === Number(id))
  if (!goods) {
    return Promise.reject({ code: 404, message: '商品不存在' })
  }
  return Promise.resolve({
    code: 200,
    data: goods
  })
}

/**
 * 搜索商品
 */
export const searchGoods = (params: { keyword?: string }): Promise<ApiResponse<Goods[]>> => {
  const keyword = params?.keyword?.toLowerCase() || ''
  const data = mockGoods.filter((item) => item.name.toLowerCase().includes(keyword))
  return Promise.resolve({
    code: 200,
    data
  })
}

/**
 * 根据分类获取商品
 */
export const getGoodsByCategory = (categoryId: string | number): Promise<ApiResponse<Goods[]>> => {
  const data = mockGoods.filter((item) => item.categoryId === Number(categoryId))
  return Promise.resolve({
    code: 200,
    data
  })
}

