import type { ApiResponse, Goods, GoodsListParams, PaginationResponse } from '@/types'

// mock 数据（用于列表 / 搜索 / 详情）
export const mockGoods: Goods[] = [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro',
    desc: 'A17 Pro / 钛金属机身',
    price: 8999,
    originalPrice: 9999,
    image: 'https://t10.baidu.com/it/u=1373795157,252511047&fm=30&app=106&f=JPEG?w=640&h=640&s=4E86EC0A1AF665AF9951D1CA030070B1',
    cover: 'https://t10.baidu.com/it/u=1373795157,252511047&fm=30&app=106&f=JPEG?w=640&h=640&s=4E86EC0A1AF665AF9951D1CA030070B1',
    categoryId: 1,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '原色钛金属', price: 8999 },
          { value: '蓝色钛金属', price: 8999 },
          { value: '白色钛金属', price: 8999 },
          { value: '黑色钛金属', price: 8999 }
        ]
      },
      {
        name: '存储容量',
        options: [
          { value: '128GB', price: 8999 },
          { value: '256GB', price: 9999 },
          { value: '512GB', price: 11999 },
          { value: '1TB', price: 13999 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '华为 Mate 60 Pro',
    desc: '昆仑玻璃 / 卫星通信',
    price: 6999,
    originalPrice: 7599,
    image: 'https://t13.baidu.com/it/u=2641007146,2201410457&fm=224&app=112&f=JPEG?w=500&h=500',
    cover: 'https://t13.baidu.com/it/u=2641007146,2201410457&fm=224&app=112&f=JPEG?w=500&h=500',
    categoryId: 1,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '玄黑', price: 6999 },
          { value: '青山黛', price: 6999 },
          { value: '白色', price: 6999 },
          { value: '紫色', price: 6999 }
        ]
      },
      {
        name: '存储容量',
        options: [
          { value: '256GB', price: 6999 },
          { value: '512GB', price: 7999 },
          { value: '1TB', price: 9999 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '小米 14 Pro',
    desc: '澎湃芯片 / 徕卡影像',
    price: 4699,
    originalPrice: 4999,
    image: 'https://img10.360buyimg.com/img/jfs/t1/244084/8/14516/41448/66f53cf6F04384133/62975884143e952f.jpg',
    cover: 'https://img10.360buyimg.com/img/jfs/t1/244084/8/14516/41448/66f53cf6F04384133/62975884143e952f.jpg',
    categoryId: 1,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '钛合金黑', price: 4699 },
          { value: '钛合金白', price: 4699 },
          { value: '钛合金青', price: 4699 }
        ]
      },
      {
        name: '存储容量',
        options: [
          { value: '256GB', price: 4699 },
          { value: '512GB', price: 5299 },
          { value: '1TB', price: 6299 }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'OPPO Find X7',
    desc: '天玑旗舰芯片 / 柔光长焦',
    price: 4299,
    originalPrice: 4599,
    image: 'https://img2.baidu.com/it/u=2877795786,4017849734&fm=253&app=138&f=JPEG?w=800&h=1200',
    cover: 'https://img2.baidu.com/it/u=2877795786,4017849734&fm=253&app=138&f=JPEG?w=800&h=1200',
    categoryId: 1,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '云墨黑', price: 4299 },
          { value: '松露白', price: 4299 },
          { value: '青翠绿', price: 4299 }
        ]
      },
      {
        name: '存储容量',
        options: [
          { value: '256GB', price: 4299 },
          { value: '512GB', price: 4799 },
          { value: '1TB', price: 5799 }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'vivo X100 Pro',
    desc: '自研影像芯片 / 超感光主摄',
    price: 4999,
    originalPrice: 5299,
    image: 'https://img0.baidu.com/it/u=1660273598,3941698868&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1069',
    cover: 'https://img0.baidu.com/it/u=1660273598,3941698868&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1069',
    categoryId: 1,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '钛黑', price: 4999 },
          { value: '白月', price: 4999 },
          { value: '青泉', price: 4999 }
        ]
      },
      {
        name: '存储容量',
        options: [
          { value: '256GB', price: 4999 },
          { value: '512GB', price: 5499 },
          { value: '1TB', price: 6499 }
        ]
      }
    ]
  },
  {
    id: 6,
    name: '联想拯救者游戏本 R9000P',
    desc: '锐龙处理器 / 240Hz电竞屏',
    price: 7999,
    originalPrice: 8599,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 2,
    specs: [
      {
        name: '处理器',
        options: [
          { value: 'R7-7745HX', price: 7999 },
          { value: 'R9-7945HX', price: 8999 }
        ]
      },
      {
        name: '内存',
        options: [
          { value: '16GB', price: 7999 },
          { value: '32GB', price: 8599 }
        ]
      },
      {
        name: '存储容量',
        options: [
          { value: '512GB SSD', price: 7999 },
          { value: '1TB SSD', price: 8399 }
        ]
      }
    ]
  },
  {
    id: 7,
    name: 'Apple MacBook Air 13',
    desc: 'M2 芯片 / 轻薄便携',
    price: 7999,
    originalPrice: 8999,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 2,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '深空灰色', price: 7999 },
          { value: '银色', price: 7999 },
          { value: '午夜色', price: 7999 },
          { value: '星光色', price: 7999 }
        ]
      },
      {
        name: '存储容量',
        options: [
          { value: '256GB', price: 7999 },
          { value: '512GB', price: 9999 },
          { value: '1TB', price: 11999 }
        ]
      }
    ]
  },
  {
    id: 8,
    name: '戴森 Dyson 吹风机 HD15',
    desc: '智能温控 / 负离子护发',
    price: 2999,
    originalPrice: 3299,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 3,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '镍蓝色', price: 2999 },
          { value: '紫红色', price: 2999 },
          { value: '金色', price: 3299 }
        ]
      }
    ]
  },
  {
    id: 9,
    name: '美的 变频空调 1.5匹',
    desc: '一级能效 / 静音节能',
    price: 2599,
    originalPrice: 2899,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 3,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '白色', price: 2599 },
          { value: '金色', price: 2699 }
        ]
      }
    ]
  },
  {
    id: 10,
    name: '耐克 Nike 跑步鞋',
    desc: '缓震跑鞋 / 日常通勤',
    price: 599,
    originalPrice: 799,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 5,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '黑色', price: 599 },
          { value: '白色', price: 599 },
          { value: '灰色', price: 599 }
        ]
      },
      {
        name: '尺码',
        options: [
          { value: '39', price: 599 },
          { value: '40', price: 599 },
          { value: '41', price: 599 },
          { value: '42', price: 599 },
          { value: '43', price: 599 },
          { value: '44', price: 599 }
        ]
      }
    ]
  },
  {
    id: 11,
    name: '南方黑芝麻糊 礼盒装',
    desc: '经典营养早餐',
    price: 39,
    originalPrice: 49,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 6,
    specs: [
      {
        name: '规格',
        options: [
          { value: '400g', price: 39 },
          { value: '800g', price: 69 }
        ]
      }
    ]
  },
  {
    id: 12,
    name: 'Apple AirPods Pro 2',
    desc: '第二代主动降噪 / MagSafe 充电盒',
    price: 1899,
    originalPrice: 1999,
    image: 'https://doc-fd.zol-img.com.cn/t_s640x2000/g7/M00/00/04/ChMkLGXZjBmICxKjAAEN4Cfvq1EAAbCQgNRUzYAAQ34077.jpg',
    cover: 'https://doc-fd.zol-img.com.cn/t_s640x2000/g7/M00/00/04/ChMkLGXZjBmICxKjAAEN4Cfvq1EAAbCQgNRUzYAAQ34077.jpg',
    categoryId: 1,
    specs: [
      {
        name: '版本',
        options: [
          { value: '国行', price: 1899 },
          { value: '港版', price: 1799 }
        ]
      }
    ]
  },
  {
    id: 13,
    name: '罗技 G Pro 无线鼠标',
    desc: '电竞级无线 / Hero 传感器',
    price: 699,
    originalPrice: 799,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 2,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '黑色', price: 699 },
          { value: '白色', price: 749 }
        ]
      }
    ]
  },
  {
    id: 14,
    name: '西门子 滚筒洗衣机 10kg',
    desc: '变频电机 / 蒸汽除菌',
    price: 3599,
    originalPrice: 3999,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 3,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '白色', price: 3599 },
          { value: '银色', price: 3699 }
        ]
      }
    ]
  },
  {
    id: 15,
    name: '兰蔻 小黑瓶 精华 50ml',
    desc: '精华肌底液 / 提亮细腻肌肤',
    price: 869,
    originalPrice: 999,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 4,
    specs: [
      {
        name: '规格',
        options: [
          { value: '30ml', price: 569 },
          { value: '50ml', price: 869 },
          { value: '75ml', price: 1169 }
        ]
      }
    ]
  },
  {
    id: 16,
    name: '阿迪达斯 运动卫衣',
    desc: '圆领套头 / 休闲百搭',
    price: 329,
    originalPrice: 399,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 5,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '黑色', price: 329 },
          { value: '白色', price: 329 },
          { value: '灰色', price: 329 }
        ]
      },
      {
        name: '尺码',
        options: [
          { value: 'S', price: 329 },
          { value: 'M', price: 329 },
          { value: 'L', price: 329 },
          { value: 'XL', price: 329 },
          { value: 'XXL', price: 329 }
        ]
      }
    ]
  },
  {
    id: 17,
    name: '伊利 安慕希 常温酸奶',
    desc: '高端浓缩酸奶 / 205g*12盒',
    price: 69,
    originalPrice: 79,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 6,
    specs: [
      {
        name: '规格',
        options: [
          { value: '205g*12盒', price: 69 },
          { value: '205g*24盒', price: 129 }
        ]
      }
    ]
  },
  {
    id: 18,
    name: 'Switch 游戏机 OLED 港版',
    desc: '7英寸 OLED 屏 / 家庭娱乐',
    price: 2199,
    originalPrice: 2399,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 7,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '白色', price: 2199 },
          { value: '黑色', price: 2199 }
        ]
      }
    ]
  },
  {
    id: 19,
    name: '网易严选 四件套 床品',
    desc: '全棉亲肤 / 多色可选',
    price: 259,
    originalPrice: 299,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 8,
    specs: [
      {
        name: '颜色',
        options: [
          { value: '灰色', price: 259 },
          { value: '蓝色', price: 259 },
          { value: '粉色', price: 259 }
        ]
      },
      {
        name: '尺寸',
        options: [
          { value: '1.5m床', price: 259 },
          { value: '1.8m床', price: 299 },
          { value: '2.0m床', price: 329 }
        ]
      }
    ]
  },
  {
    id: 20,
    name: '德芙 巧克力礼盒 600g',
    desc: '丝滑口感 / 送礼优选',
    price: 89,
    originalPrice: 109,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    cover: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    categoryId: 6,
    specs: [
      {
        name: '规格',
        options: [
          { value: '300g', price: 59 },
          { value: '600g', price: 89 },
          { value: '1000g', price: 139 }
        ]
      }
    ]
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

