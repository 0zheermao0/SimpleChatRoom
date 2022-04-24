<template>
<!--  <img alt="Vue logo" src="./assets/logo.png">-->
  <div class="background">
    <img class="bgIMG" src="@/assets/nightscene.jpg"  alt=""/>
  </div>
  <div style="padding-top: 45px;"><HelloWorld class="msg-section"/></div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
@import "./assets/scss/_handle.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
  z-index: 1;
}
.background {
  @include background_color('background_color');
  width: 99vw;
  height: 98vh;
  background-repeat: no-repeat;
  filter: blur(8px) brightness(0.8);
  z-index: -1;
  position: absolute;
}
.bgIMG {
  width: 100%;
  height: 100%;
}
/deep/.el-message-box {
  @include background_color('background_color');
}
</style>
