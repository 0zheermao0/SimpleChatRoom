<template>
  <div>
    <el-drawer
        ref="drawerRef"
        v-model="settings"
        title="I have a nested form inside!"
        direction="ltr"
        custom-class="demo-drawer"
    >
      <el-row style="display: block">
        <el-space>
          <el-input v-model="this.info_user" placeholder="修改昵称"></el-input>
          <el-button type="primary" disabled><el-icon><check /></el-icon></el-button>
        </el-space>
      </el-row>
      <el-switch
          v-model="dark"
          class="theme-switch"
          active-text="关灯"
          inactive-text="开灯"
      />
    </el-drawer>
    <el-card class="box-card" shadow="always">
      <template #header>
        <div class="card-header">
          <el-avatar :size="45"><el-icon><UserFilled/></el-icon></el-avatar>
          <span style="margin-left: 1vw">Dash Board</span>
          <el-button class="setting-btn" type="primary" color="#7c9cf1" @click="settings=true"><el-icon><setting /></el-icon></el-button>
        </div>
      </template>
      <div>您的昵称是: {{this.user}}</div>
      <br/>
      <div style="color: darkslateblue">☆*: .｡. o(≧▽≦)o .｡.:*☆</div>
      <br/>
      <div>您现在在: {{this.room}} 楼哦</div>
      <el-card class="announcement-card">
        <template #header>
          <div class="announcement-card-header" style="text-align: center;align-items: center">
            <span style="position: center">公告</span>
          </div>
        </template>
        <div class="announcement-card-body">
            <div class="announcement-card-body-content-content">
              <span>{{this.announcement.content}}</span>
            </div>
          </div>
      </el-card>
      <div class="wave"></div>
    </el-card>
  </div>
</template>

<script>
import { Setting, UserFilled, Check } from '@element-plus/icons-vue'

export default {
  name: "UserInfo",
  components: {
    Setting,
    UserFilled,
    Check
  },
  data() {
    return {
      avatar_url: 'public/favicon.ico',
      settings: false,
      info_user: '',
      announcement: {
        content: '没有公告哦'
      },
      dark: false,
    }
  },
  props: {
    user: {
      type: String,
      default: '',
    },
    room: {
      type: String,
      default: '',
    }
  },
  methods: {
    onClickSetting() {
      this.settings = true
      // this.$message.info('别搞')
    }
  },
  watch: {
    user(value) {
      console.log(value);
      this.info_user = value
    },
    dark(value) {
      console.log(value);
      // window.document.documentElement.getElementsByTagName('h1')[0].style.backgroundColor = value ? '#212121' : '#7c9cf1'
      window.document.documentElement.getElementsByClassName('el-scrollbar')[0].style.backgroundColor = value ? '#5b5b5b' : '#f2f2f2'
      if(this.dark){
        window.document.documentElement.setAttribute( "data-theme", 'dark' );
      }else{
        window.document.documentElement.setAttribute( "data-theme", 'light' );
      }
    }
  },
}
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  margin-left: 3vw;
  width: 30vw;
  height: 100%;
}
.setting-btn {
  margin-left: auto;
  color: #f2f2f2;
}
.announcement-card {
  margin-top: 5%;
}


.wave {
  position: relative;
  left: 50%;
  width: 150vw;
  height: 150vw;
  background-color: #7c9cf1;
  border-radius: 46%;
  animation-duration: 6s;
  animation-name: rotate;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  margin-top: 30%;
}

@keyframes rotate {
  0% {
    transform: translate(-50%, 0) rotateZ(0deg);
  }

  50% {
    transform: translate(-50%, -1%) rotateZ(180deg);
  }

  100% {
    transform: translate(-50%, 0) rotateZ(360deg);
  }
}


</style>
