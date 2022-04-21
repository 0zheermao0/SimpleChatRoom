<template>
  <el-upload
      ref="upload"
      :limit=limitNum
      accept=".jpg, .png"
      :data="uploadData"
      :action="this.uploadURL"
      :on-exceed="exceedFile"
      :on-success="handleSuccess"
      :on-error="handleError"
      :show-file-list="false"
  >
    <el-button type="primary" size="small" circle>
      <el-icon><promotion/></el-icon></el-button>
  </el-upload>
</template>

<script>
import {baseURL} from "@/config/baseConfig";
import {Promotion} from "@element-plus/icons-vue";

export default {
  name: "UploadComponent",
  data(){
    return {
      limitNum: 1,
      uploadURL: baseURL + "upload",
    }
  },
  Components: {
    Promotion
  },
  props: {
    uploadData: {
      type: Object
    }
  },
  methods: {
    exceedFile () {
      this.$message.warning(`只能选择 ${this.limitNum} 个文件`)
    },
    // beforeUploadFile (file) {
    //   console.log('before upload')
    //   console.log(file)
    //   const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
    //   const size = file.size / 1024 / 1024
    //   if (extension !== 'xlsx' || extension !== 'xls') {
    //     this.$message.warning('只能上传后缀是.xlsx, .xls的文件')
    //   }
    //   if (size > 10) {
    //     this.$message.warning('文件大小不得超过10M')
    //   }
    // },
    handleSuccess () {
      this.$message.success('文件上传成功')
    },
    // eslint-disable-next-line handle-callback-err
    handleError () {
      this.$message.error('文件上传失败 请检查文件格式')
    },
    uploadNow () {
      console.log('upload now', baseURL + 'sendFile')
      this.$message.info('是的，其实还是不支持文件上传的')
    }
  },
}
</script>

<style scoped>

</style>
