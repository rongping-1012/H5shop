import type { ApiResponse, Banner, Category } from '@/types'

// 轮播图
const mockBanners: Banner[] = [
  { id: 1, image: 'https://img.shetu66.com/2023/10/27/1698418887749630.png', link: '' },
  { id: 2, image: 'https://img.shetu66.com/2023/10/27/1698419471657863.png', link: '' },
  { id: 3, image: 'https://img.shetu66.com/2023/10/27/1698418689710618.png', link: '' },
  { id: 4, image: 'https://img.shetu66.com/2023/10/27/1698417811065057.png', link: '' }
]

// 分类入口
const mockCategories: Category[] = [
  {
    id: 1,
    name: '手机数码',
    icon: 'https://img14.360buyimg.com/pop/jfs/t1/223850/31/14455/20834/63191800E303a21e8/f99edecca19f7f3b.jpg'
  },
  {
    id: 2,
    name: '电脑办公',
    icon: 'https://ts4.tc.mm.bing.net/th/id/OIP-C.TDjn4pW_NUkrBNlMI2BdLAHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    id: 3,
    name: '家用电器',
    icon: 'https://img95.699pic.com/photo/60025/5206.jpg_wh300.jpg!/fh/300/quality/90'
  },
  {
    id: 4,
    name: '美妆护肤',
    icon: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.VsIQNKCHnVUhrAO5Aj8PHgHaE8?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    id: 5,
    name: '服饰鞋包',
    icon: 'https://ts4.tc.mm.bing.net/th/id/OIP-C.7kjruLpVdaWjn6N_zDQ0WwHaG6?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    id: 6,
    name: '食品生鲜',
    icon: 'https://sitecdn.sdongpo.com/wordpress-upyun/2020/04/3d0a0ea41576bcb30c05454624229cb5-1024x680.jpeg'
  },
  {
    id: 7,
    name: '母婴玩具',
    icon: 'https://ts3.tc.mm.bing.net/th/id/OIP-C.UCNli8s8pOr8zFCPB3wUZAHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    id: 8,
    name: '更多分类',
    icon: 'https://bpic.588ku.com/element_origin_min_pic/23/04/24/bdfc4e30d6476a5471e0eee67fd06783.jpg'
  }
]

// 限时抢购
interface FlashSaleItem {
  id: number
  image: string
  name: string
  price: string
  originalPrice: string
  salePercent: number
  soldPercent: number
}

const mockFlashSaleList: FlashSaleItem[] = [
  {
    id: 1,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    name: 'Apple iPad Air 10.9英寸平板电脑',
    price: '3799',
    originalPrice: '4399',
    salePercent: 70,
    soldPercent: 70
  },
  {
    id: 2,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    name: 'Apple Watch Series 7',
    price: '2999',
    originalPrice: '3199',
    salePercent: 50,
    soldPercent: 50
  },
  {
    id: 3,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    name: 'AirPods Pro',
    price: '1599',
    originalPrice: '1999',
    salePercent: 80,
    soldPercent: 80
  }
]

// 推荐商品
interface RecommendItem {
  id: number
  image: string
  name: string
  desc: string
  price: string
  originalPrice: string
}

const mockRecommendList: RecommendItem[] = [
  {
    id: 1,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    name: 'Apple iPhone 13 Pro Max (A2644) 256GB 远峰蓝 支持5G 双卡双待',
    desc: 'A15仿生芯片，超视网膜XDR显示屏，Pro级摄像头系统',
    price: '9799',
    originalPrice: '10799'
  },
  {
    id: 2,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    name: '华为 HUAWEI Mate 40 Pro 5G 全网通 8GB+256GB 亮黑色',
    desc: '麒麟9000 5G SoC芯片 超感知徕卡电影影像',
    price: '6999',
    originalPrice: '7499'
  },
  {
    id: 3,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    name: '小米12 Pro 5G 骁龙8 Gen1 2K AMOLED 120Hz高刷 8GB+256GB',
    desc: '全新一代骁龙8，2K AMOLED 120Hz高刷屏',
    price: '4699',
    originalPrice: ''
  },
  {
    id: 4,
    image: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
    name: '荣耀60 5G 8GB+256GB 亮黑色 一亿像素超清摄影',
    desc: '1亿像素超清影像，66W超级快充',
    price: '2999',
    originalPrice: '3299'
  }
]

interface HomeData {
  banners: Banner[]
  categories: Category[]
  flashSaleTime: number
  flashSaleList: FlashSaleItem[]
  recommendList: RecommendItem[]
}

/**
 * 首页综合数据
 */
export const getHomeData = (): Promise<ApiResponse<HomeData>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          banners: mockBanners,
          categories: mockCategories,
          flashSaleTime: 12 * 60 * 60 * 1000,
          flashSaleList: mockFlashSaleList,
          recommendList: mockRecommendList
        }
      })
    }, 400)
  })
}

