<template>
  <div class="address-list-page">
    <van-nav-bar title="收货地址" left-arrow @click-left="$router.back()">
      <template #right>
        <van-icon name="plus" size="18" @click="goAddAddress" />
      </template>
    </van-nav-bar>

    <div v-if="loading" class="loading-wrap">
      <van-loading type="spinner" />
    </div>

    <div v-else-if="addressList.length === 0" class="empty-wrap">
      <BaseEmpty>暂无收货地址</BaseEmpty>
      <van-button type="primary" round @click="goAddAddress">添加地址</van-button>
    </div>

    <div v-else class="address-list">
      <van-cell-group>
        <div
          v-for="item in addressList"
          :key="item.id"
          class="address-item"
          @click="handleSelect(item)"
        >
          <van-checkbox
            :model-value="item.isDefault"
            @click.stop="handleSetDefault(item)"
            class="address-checkbox"
          />
          <div class="address-content">
            <div class="address-header">
              <div class="address-info">
                <span class="address-name">{{ item.name }}</span>
                <span class="address-tel">{{ item.tel }}</span>
              </div>
              <van-tag v-if="item.isDefault" type="danger" class="default-tag">默认</van-tag>
            </div>
            <div class="address-detail">{{ item.address }}</div>
          </div>
          <div class="address-actions" @click.stop>
            <van-icon
              name="edit"
              size="18"
              class="edit-icon"
              @click="handleEdit(item)"
            />
            <van-icon
              name="delete-o"
              size="18"
              class="delete-icon"
              @click="handleDelete(item)"
            />
          </div>
        </div>
      </van-cell-group>
      <div class="add-button-wrap">
        <van-button type="primary" round block @click="goAddAddress">
          添加新地址
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showSuccessToast, showFailToast } from 'vant'
import { useAddressStore } from '@/store/modules/address'
import BaseEmpty from '@/components/base/BaseEmpty.vue'

const router = useRouter()
const addressStore = useAddressStore()

const loading = ref(false)

const addressList = computed(() => {
  return addressStore.addressList.map((item) => ({
    id: item.id,
    name: item.name,
    tel: item.phone,
    address: `${item.province}${item.city}${item.district}${item.address}${item.detail}`,
    isDefault: item.isDefault
  }))
})

const fetchAddressList = async () => {
  loading.value = true
  try {
    await addressStore.fetchAddressList()
  } catch (error) {
    showFailToast('获取地址列表失败')
  } finally {
    loading.value = false
  }
}

const goAddAddress = () => {
  router.push('/user/address/edit')
}

const handleEdit = (item) => {
  router.push({
    path: '/user/address/edit',
    query: { id: item.id }
  })
}

const handleSelect = (item) => {
  // 如果是从订单页面选择地址，返回选中的地址
  const from = router.currentRoute.value.query.from
  if (from === 'order') {
    router.back()
  } else {
    // 点击地址项时，无论是否已经是默认地址，都设置为默认（会取消其他地址的默认状态）
    handleSetDefault(item)
  }
}

const handleDelete = async (item) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这个地址吗？'
    })

    await addressStore.deleteAddressItem(item.id)
    showSuccessToast('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      showFailToast('删除失败')
    }
  }
}

// 设置默认地址
const handleSetDefault = async (item) => {
  try {
    await addressStore.setDefaultAddressItem(item.id)
    showSuccessToast('已设为默认地址')
  } catch (error) {
    showFailToast('设置失败')
  }
}

onMounted(() => {
  fetchAddressList()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/mixins.scss' as *;
.address-list-page {
  min-height: 100vh;
  background: $bg-color-light;
}

.loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-xxl;
}

.empty-wrap {
  padding: $spacing-xxl;
  text-align: center;

  .van-button {
    margin-top: $spacing-lg;
  }
}

:deep(.van-nav-bar__right) {
  .van-icon {
    color: $primary-color;
  }
}

.address-list {
  padding-bottom: env(safe-area-inset-bottom);
}

.address-item {
  display: flex;
  align-items: flex-start;
  padding: $spacing-base $spacing-lg;
  background: $bg-color-white;
  border-bottom: 1px solid $border-color-light;
  transition: background-color 0.2s;

  &:active {
    background-color: $bg-color-light;
  }

  &:last-child {
    border-bottom: none;
  }
}

.address-checkbox {
  flex-shrink: 0;
  margin-right: $spacing-base;
  margin-top: 4px;
}

.address-content {
  flex: 1;
  min-width: 0;
  padding-right: $spacing-sm;
}

.address-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-xs;
  gap: $spacing-sm;
}

.address-info {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  flex: 1;
  min-width: 0;
}

.address-name {
  font-size: $font-size-base;
  font-weight: 600;
  color: $text-color-dark;
}

.address-tel {
  font-size: $font-size-sm;
  color: $text-color-normal;
}

.default-tag {
  flex-shrink: 0;
  background-color: $primary-color !important;
  color: #fff !important;
  border: none !important;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: 500;
}

.address-detail {
  font-size: $font-size-sm;
  color: $text-color-normal;
  line-height: 1.6;
  @include text-ellipsis(2);
}

.address-actions {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  flex-shrink: 0;

  .edit-icon,
  .delete-icon {
    color: $text-color-normal;
    padding: $spacing-xs;
    transition: color 0.2s;
  }

  .edit-icon:hover,
  .delete-icon:hover {
    opacity: 0.8;
  }

  .delete-icon {
    color: $primary-color;
  }
}

.add-button-wrap {
  padding: $spacing-lg;
  background: $bg-color-white;
  margin-top: $spacing-base;
}

:deep(.van-checkbox__icon--checked .van-icon) {
  background-color: $primary-color;
  border-color: $primary-color;
}

:deep(.van-cell-group) {
  background: transparent;
}
</style>

