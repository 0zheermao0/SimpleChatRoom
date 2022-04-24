<template>
  <div>
    <el-drawer
        ref="drawerRef"
        v-model="settings"
        title="I have a nested form inside!"
        direction="ltr"
    >
      <el-row style="display: block">
        <el-space>
          <el-input v-model="this.info_user" placeholder="修改昵称"></el-input>
          <el-button type="primary" @click="onClickChangeName"><el-icon><check /></el-icon></el-button>
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
      <div>您的昵称是: {{this.info_user}}</div>
      <br/>
      <div>☆*: .｡. o(≧▽≦)o .｡.:*☆</div>
      <br/>
      <div>您现在在: {{this.room}} 楼哦</div>
      <br/>
      <div>☆*: .｡. o(≧▽≦)o .｡.:*☆</div>
      <br/>
      <div>一共有 {{this.total}} 个小伙伴在线，快去找找他们在哪个房间</div>
      <el-card class="announcement-card">
        <template #header>
          <div class="announcement-card-header" style="text-align: center;align-items: center">
            <span style="position: center">公告</span>
          </div>
        </template>
        <div class="announcement-card-body">
            <div class="announcement-card-body-content-content">
              <span  v-for="con in this.announcement.contents" :key="con">{{con}}<br/></span>
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
      info_user: 'anonymous',
      announcement: {
        contents: ['1.支持夜间模式(我的配色审美就这样了,不服来打我)', '2.可以在设置里动态修改名字辣🥺' ,'3.即将实装消息灭霸机制（每天随机删掉一半消息）']
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
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onClickChangeName() {
      this.$store.commit('setUser', this.info_user)
      console.log(this.$store.getters.getUser)
      this.info_user = this.$store.getters.getUser
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
  },
  watch: {
    user(value) {
      console.log(value);
      this.info_user = value
    },
    dark(value) {
      console.log(value);
      window.document.documentElement.getElementsByClassName('el-scrollbar')[0].style.backgroundColor = value ? '#5b5b5b' : '#f2f2f2'
      window.document.documentElement.getElementsByTagName('body')[0].style.backgroundColor = value ? '#5b5b5b' : '#f2f2f2'
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
@import "../assets/scss/common.scss";

</style>
