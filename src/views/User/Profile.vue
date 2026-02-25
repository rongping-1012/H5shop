<template>
  <div class="profile-page">
    <van-nav-bar title="个人资料" left-arrow @click-left="$router.back()" />

    <van-cell-group inset class="profile-group">
      <van-cell title="头像" is-link @click="showAvatarPicker = true">
        <template #value>
          <van-image
            :src="form.avatar || defaultAvatar"
            width="50"
            height="50"
            round
            fit="cover"
          />
        </template>
      </van-cell>
      <van-field v-model="form.nickname" label="昵称" placeholder="请输入昵称" />
      <van-field v-model="form.phone" label="手机号" placeholder="请输入手机号" type="tel" />
      <van-field v-model="form.email" label="邮箱" placeholder="请输入邮箱" type="email" />
    </van-cell-group>

    <div class="submit-wrap">
      <van-button block round type="primary" @click="handleSubmit">保存</van-button>
    </div>

    <!-- 头像选择器 -->
    <van-action-sheet v-model:show="showAvatarPicker" :actions="avatarActions" @select="onSelectAvatar" />
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showFailToast } from 'vant'
import { useUserStore } from '@/store/modules/user'
import { uploadAvatar } from '@/api/profile'
import { setUserInfo } from '@/utils/auth'

const router = useRouter()
const userStore = useUserStore()

const defaultAvatar = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
const showAvatarPicker = ref(false)
const fileInput = ref(null)

const form = reactive({
  nickname: '',
  phone: '',
  email: '',
  avatar: ''
})

const avatarActions = [
  { name: '拍照', value: 'camera' },
  { name: '从相册选择', value: 'album' },
  { name: '取消', value: 'cancel' }
]

const onSelectAvatar = (action) => {
  if (action.value === 'camera' || action.value === 'album') {
    fileInput.value?.click()
  }
  showAvatarPicker.value = false
}

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showFailToast('请选择图片文件')
    return
  }

  // 检查文件大小（限制为 5MB）
  if (file.size > 5 * 1024 * 1024) {
    showFailToast('图片大小不能超过 5MB')
    e.target.value = ''
    return
  }

  try {
    const res = await uploadAvatar(file)
    if (res.code === 200 && res.data.avatar) {
      form.avatar = res.data.avatar
      // 立即更新 store 中的用户信息，以便其他页面能实时看到新头像
      if (userStore.userInfo) {
        userStore.userInfo = { ...userStore.userInfo, avatar: res.data.avatar }
        // 同时保存到 localStorage，确保数据持久化
        setUserInfo(userStore.userInfo)
      }
      showSuccessToast('头像上传成功')
    } else {
      showFailToast('头像上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    showFailToast('头像上传失败')
  }

  // 清空input，以便可以重复选择同一文件
  e.target.value = ''
}

const handleSubmit = async () => {
  if (!form.nickname.trim()) {
    showFailToast('请输入昵称')
    return
  }

  try {
    // 确保表单数据包含头像
    const updateData = {
      ...form,
      avatar: form.avatar || userStore.userInfo?.avatar || ''
    }
    
    await userStore.updateUserProfile(updateData)
    showSuccessToast('保存成功')
    
    // 延迟返回，确保 store 更新完成
    setTimeout(() => {
      router.back()
    }, 100)
  } catch (error) {
    console.error('保存失败:', error)
    showFailToast('保存失败，请重试')
  }
}

onMounted(() => {
  // 初始化表单数据
  if (userStore.userInfo) {
    form.nickname = userStore.userInfo.nickname || ''
    form.phone = userStore.userInfo.phone || ''
    form.email = userStore.userInfo.email || ''
    form.avatar = userStore.userInfo.avatar || ''
  }
})
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: $bg-color-light;
}

.profile-group {
  margin-top: $spacing-base;
}

.submit-wrap {
  padding: $spacing-xl $spacing-lg;
}
</style>

