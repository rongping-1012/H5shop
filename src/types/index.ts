/**
 * API 响应基础类型
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message?: string
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * 分页响应
 */
export interface PaginationResponse<T> {
  list: T[]
  hasMore: boolean
  total?: number
}

/**
 * 用户相关类型
 */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email?: string
  phone?: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  password: string
  nickname?: string
  phone?: string
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

/**
 * 商品相关类型
 */
export interface Goods {
  id: number
  name: string
  desc?: string
  price: number
  originalPrice?: number
  image: string
  cover?: string
  categoryId: number
  quantity?: number
  selected?: boolean
}

export interface GoodsListParams extends PaginationParams {
  categoryId?: number
  keyword?: string
  useCache?: boolean
}

/**
 * 购物车相关类型
 */
export interface CartItem extends Goods {
  quantity: number
  selected: boolean
}

/**
 * 订单相关类型
 */
export interface Order {
  id: number | string
  orderNo: string
  goodsList: CartItem[]
  totalPrice: number
  status: OrderStatus
  createTime: string
  address?: Address
}

export enum OrderStatus {
  PENDING = 'pending', // 待支付
  PAID = 'paid', // 已支付
  SHIPPED = 'shipped', // 已发货
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled' // 已取消
}

export interface CreateOrderParams {
  goodsList: CartItem[]
  addressId: number
  couponId?: number
}

/**
 * 地址相关类型
 */
export interface Address {
  id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export interface AddressForm {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault?: boolean
}

/**
 * 优惠券相关类型
 */
export interface Coupon {
  id: number
  name: string
  amount: number
  minAmount?: number
  type: CouponType
  status: CouponStatus
  expireTime: string
}

export enum CouponType {
  DISCOUNT = 'discount', // 折扣券
  CASH = 'cash' // 现金券
}

export enum CouponStatus {
  UNUSED = 'unused', // 未使用
  USED = 'used', // 已使用
  EXPIRED = 'expired' // 已过期
}

/**
 * 分类相关类型
 */
export interface Category {
  id: number
  name: string
  icon: string
  parentId?: number
}

/**
 * Banner 相关类型
 */
export interface Banner {
  id: number
  image: string
  link?: string
  type?: string
}

/**
 * 路由元信息类型
 */
export interface RouteMeta {
  title?: string
  icon?: string
  keepAlive?: boolean
  showTabBar?: boolean
  showNavBar?: boolean
  hidden?: boolean
  requiresAuth?: boolean
  roles?: string[]
  permissions?: string[]
}

/**
 * 自定义指令绑定值类型
 */
export interface LazyLoadBinding {
  src: string
  placeholder?: string
}

