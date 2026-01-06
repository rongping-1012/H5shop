<template>
  <div class="address-edit-page">
    <van-nav-bar :title="isEdit ? '编辑地址' : '新增地址'" left-arrow @click-left="$router.back()" />

    <van-form @submit="handleSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.name"
          name="name"
          label="收货人"
          placeholder="请输入收货人姓名"
          :rules="[{ required: true, message: '请输入收货人姓名' }]"
        />
        <van-field
          v-model="form.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          type="tel"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
          ]"
        />
        <van-field
          v-model="form.address"
          name="address"
          label="所在地区"
          placeholder="请选择省市区"
          readonly
          is-link
          @click="showAreaPicker = true"
          :rules="[{ required: true, message: '请选择所在地区' }]"
        />
        <van-field
          v-model="form.detail"
          name="detail"
          label="详细地址"
          placeholder="街道、门牌号等"
          type="textarea"
          rows="2"
          autosize
          :rules="[{ required: true, message: '请输入详细地址' }]"
        />
        <van-field
          v-model="form.location"
          name="location"
          label="定位"
          placeholder="点击定位获取当前位置"
          readonly
          is-link
          @click="handleLocation"
        >
          <template #button>
            <van-icon name="location-o" size="18" />
          </template>
        </van-field>
      </van-cell-group>

      <van-cell-group inset class="default-cell">
        <van-cell title="设为默认地址">
          <template #right-icon>
            <van-switch v-model="form.isDefault" />
          </template>
        </van-cell>
      </van-cell-group>

      <div class="submit-wrap">
        <van-button round block type="primary" native-type="submit">保存</van-button>
      </div>
    </van-form>

    <!-- 地区选择器 -->
    <van-popup v-model:show="showAreaPicker" position="bottom" :style="{ height: '40%' }">
      <van-area
        :area-list="areaList"
        @confirm="onAreaConfirm"
        @cancel="showAreaPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showSuccessToast, showFailToast, showLoadingToast, closeToast } from 'vant'
import { useAddressStore } from '@/store/modules/address'
import { areaList } from '@vant/area-data'

const route = useRoute()
const router = useRouter()
const addressStore = useAddressStore()

const isEdit = ref(false)
const showAreaPicker = ref(false)

const form = reactive({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address: '',
  detail: '',
  location: '',
  latitude: null,
  longitude: null,
  isDefault: false
})

// 获取定位
const handleLocation = () => {
  if (!navigator.geolocation) {
    showFailToast('您的浏览器不支持定位功能')
    return
  }

  showLoadingToast({
    message: '定位中...',
    forbidClick: true
  })

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      form.latitude = latitude
      form.longitude = longitude

      // 这里可以调用地图API进行逆地理编码，获取地址信息
      // 由于是mock数据，我们使用简单的提示
      try {
        // 模拟逆地理编码
        const address = await reverseGeocode(latitude, longitude)
        form.location = address
        form.detail = address
        showSuccessToast('定位成功')
      } catch (error) {
        form.location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        showSuccessToast('定位成功，请手动填写地址')
      }

      closeToast()
    },
    (error) => {
      closeToast()
      let message = '定位失败'
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = '定位权限被拒绝，请在设置中开启'
          break
        case error.POSITION_UNAVAILABLE:
          message = '定位信息不可用'
          break
        case error.TIMEOUT:
          message = '定位超时，请重试或手动填写地址'
          // 超时时提供默认坐标（北京）
          form.latitude = 39.9042
          form.longitude = 116.4074
          form.location = '39.9042, 116.4074'
          break
      }
      showFailToast(message)
    },
    {
      enableHighAccuracy: false, // 改为false，提高成功率
      timeout: 15000, // 增加超时时间到15秒
      maximumAge: 60000 // 允许使用1分钟内的缓存位置
    }
  )
}

// 模拟逆地理编码（实际项目中应该调用真实的地图API）
const reverseGeocode = async (lat, lng) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 这里应该调用真实的地图API（如高德地图、百度地图等）
      // 示例：返回一个模拟地址
      resolve('北京市朝阳区三里屯街道')
    }, 500)
  })
}

// 地区选择确认
const onAreaConfirm = (values) => {
  const province = values[0]?.name || ''
  const city = values[1]?.name || ''
  const district = values[2]?.name || ''

  form.province = province
  form.city = city
  form.district = district
  form.address = `${province}${city}${district}`

  showAreaPicker.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!form.province || !form.city || !form.district) {
    showFailToast('请选择所在地区')
    return
  }

  try {
    if (isEdit.value) {
      await addressStore.updateAddressItem(route.query.id, form)
      showSuccessToast('更新成功')
    } else {
      await addressStore.addAddressItem(form)
      showSuccessToast('添加成功')
    }
    router.back()
  } catch (error) {
    showFailToast(isEdit.value ? '更新失败' : '添加失败')
  }
}

// 初始化数据
const initData = async () => {
  const id = route.query.id
  if (id) {
    isEdit.value = true
    try {
      const address = await addressStore.fetchAddressDetail(id)
      if (address) {
        form.name = address.name || ''
        form.phone = address.phone || ''
        form.province = address.province || ''
        form.city = address.city || ''
        form.district = address.district || ''
        form.address = `${address.province || ''}${address.city || ''}${address.district || ''}`
        form.detail = address.detail || ''
        form.location = address.latitude && address.longitude
          ? `${address.latitude}, ${address.longitude}`
          : ''
        form.latitude = address.latitude || null
        form.longitude = address.longitude || null
        form.isDefault = address.isDefault || false
      }
    } catch (error) {
      showFailToast('获取地址信息失败')
    }
  }
}

onMounted(() => {
  initData()
})
</script>

<style lang="scss" scoped>
// variables 已在 vite.config.js 中全局注入，无需重复导入

.address-edit-page {
  min-height: 100vh;
  background: $bg-color-light;
}

.default-cell {
  margin-top: $spacing-base;
}

.submit-wrap {
  padding: $spacing-xl $spacing-lg;
}

:deep(.van-nav-bar__arrow) {
  color: $primary-color;
}

:deep(.van-switch--on) {
  background-color: $primary-color;
}
</style>

