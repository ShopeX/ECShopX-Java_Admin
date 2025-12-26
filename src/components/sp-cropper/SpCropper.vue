<template>
    <el-dialog :visible="dialogVisible" :fullscreen="true" @close="handleClose" append-to-body>
        <div>
            <h1>图片裁剪</h1>
        </div>

        <div class="flex justify-center h-[calc(100vh-95px)]">
            <div class="flex-1 flex flex-col">

                <div class="flex-1 flex items-center justify-center ">
                    <vue-advanced-cropper ref="cropperRef" :src="imageSrc" :stencil-props="stencilProps"
                        @change="onCropChange" class="w-[650px] h-[600px]" />
                </div>

                <div class="sticky bottom-0 left-0 right-0 p-2 mt-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <el-radio-group v-model="aspectRatio" @change="handleAspectRatioChange">
                                <el-radio-button label="free">自由</el-radio-button>
                                <el-radio-button label="1:1">1:1</el-radio-button>
                                <el-radio-button label="4:3">4:3</el-radio-button>
                                <el-radio-button label="16:9">16:9</el-radio-button>
                            </el-radio-group>
                            <el-button @click="resetCropper" class="!ml-4">重置</el-button>
                        </div>

                        <div v-if="imageList.length > 1" class="flex items-center justify-center gap-4">
                            <el-button size="small" :disabled="currentIndex === 0" @click="goToImage(currentIndex - 1)"
                                icon="el-icon-arrow-left">
                                上一张
                            </el-button>

                            <span class="text-sm text-gray-600">{{ currentIndex + 1 }} / {{ imageList.length }}</span>

                            <el-button size="small" :disabled="currentIndex === imageList.length - 1"
                                @click="goToImage(currentIndex + 1)">
                                下一张
                                <i class="el-icon-arrow-right"></i>
                            </el-button>
                        </div>

                        <div class="flex items-center gap-2">
                            <el-button @click="handleClose">
                                取消
                            </el-button>
                            <el-button type="primary" @click="handleSave" :loading="uploading">
                                确认
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>


            <div class="w-80 border-l border-gray-200 p-6 overflow-y-auto">
                <h3 class="mb-6">图片信息</h3>
                <div>
                    <label class="text-sm mb-2 block">文件名</label>
                    <div class="text-sm bg-gray-50 border border-gray-200 rounded px-3 py-2 mb-5">
                        {{ currentImage.image_name }}
                    </div>
                </div>

                <div>
                    <label class="text-sm mb-2 block">替换文本</label>
                    <el-input v-model="formData.newImageName" type="text" placeholder="请输入新的文件名" :maxlength="50"
                        size="small" class="text-sm w-full mb-5" />
                </div>

                <div>
                    <label class="text-sm mb-2 block">详细信息</label>
                    <span>
                        {{ getImageType(imageFileInfo.type) }} / {{ imageFileInfo.width }} × {{ imageFileInfo.height
                        }} / {{ formatFileSize(imageFileInfo.size) }}
                    </span>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { Cropper as VueAdvancedCropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import UploadUtil from '@/utils/uploadUtil'

export default {
    name: 'SpCropper',
    components: {
        VueAdvancedCropper
    },
    data() {
        return {
            uploading: false,
            dialogVisible: false,
            imageSrc: '',

            imageList: [],
            currentIndex: 0,
            currentImage: null,

            aspectRatio: 'free',
            cropCoordinates: null,
            cropDimensions: {
                width: 0,
                height: 0
            },
            stencilProps: {
                aspectRatio: NaN
            },
            formData: {
                newImageName: '',
            },
            cropper: null,//裁剪器实例引用
            imageFileInfo: null
        }
    },
    computed: {
        aspectRatioValue() {
            switch (this.aspectRatio) {
                case '1:1': return 1
                case '4:3': return 4/3
                case '16:9': return 16/9
                case 'free': return NaN
                default: return NaN
            }
        }
    },
    methods: {
        async showDialog(data) {
            this.dialogVisible = true
            this.imageList = data.imageList
            this.currentIndex = data.currentIndex
            this.currentImage = this.imageList[this.currentIndex]

            if (this.currentImage) {
                this.imageSrc = this.currentImage.url
                this.formData.newImageName = this.currentImage.image_name
                await this.createCurrentImageFile()
            }
            this.$nextTick(() => {
                this.cropper = this.$refs.cropperRef
            })
        },

        async createCurrentImageFile() {
            const response = await fetch(this.currentImage.url)
            const blob = await response.blob()

            const file = new File([blob], this.currentImage.image_name, {
                type: blob.type
            })

            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                    const img = new Image()
                    //当图片完全加载到内存中时，这个函数会被调用
                    img.onload = () => {
                        this.imageFileInfo = {
                            file: file,
                            width: img.width,
                            height: img.height,
                            size: file.size,
                            type: file.type,
                            name: file.name
                        }
                        resolve()
                    }

                    img.src = event.target.result
                }
                reader.readAsDataURL(blob)
            })
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes'
            
            const k = 1024
            const sizes = ['Bytes', 'KB', 'MB', 'GB']
            
            let size = bytes
            let index = 0
            
            //一直除以1024，直到找到合适的单位
            while (size >= k && index < sizes.length - 1) {
                size = size / k
                index++
            }
            
            return size.toFixed(1) + ' ' + sizes[index]
        },

        getImageType(mimeType) {
            if (!mimeType) return '-'
            const typeMap = {
                'image/jpeg': 'JPEG',
                'image/png': 'PNG',
                'image/gif': 'GIF',
                'image/webp': 'WebP',
                'image/svg+xml': 'SVG',
                'image/bmp': 'BMP'
            }
            return typeMap[mimeType] 
        },


        goToImage(index) {
            if (index >= 0 && index < this.imageList.length) {
                this.currentIndex = index
                this.currentImage = this.imageList[index]
                this.imageSrc = this.currentImage.url
                this.formData.newImageName = this.currentImage.image_name

                this.createCurrentImageFile()

                this.$nextTick(() => {
                    this.cropper = this.$refs.cropperRef
                })
            }
        },

        setAspectRatio(ratio) {
            this.aspectRatio = ratio
            this.handleAspectRatioChange()
        },

        onCropChange(coordinates) {  //coordinates从@change事件传入
            this.cropCoordinates = coordinates
            if (coordinates) {
                this.cropDimensions.width = Math.round(coordinates.width)
                this.cropDimensions.height = Math.round(coordinates.height)
            }
        },

        handleAspectRatioChange() {
            this.stencilProps.aspectRatio = this.aspectRatioValue
            if (this.cropper) {
                this.cropper.reset() //不reset会出现选框突然变形，形状被强制拉伸到新比例的问题
            }
        },

        resetCropper() {
            if (this.cropper) {
                this.cropper.reset()
                this.cropCoordinates = null
                this.cropDimensions = { width: 0, height: 0 }
            }
        },

        handleClose() {
            this.dialogVisible = false
            this.$emit('close')
        },

        async handleSave() {
            if (this.cropper && this.cropCoordinates) {
                this.uploading = true
                try {
                    const cropResult = this.cropper.getResult()
                    const canvas = cropResult.canvas
                    const blob = await new Promise(resolve => {
                        canvas.toBlob(resolve, 'image/jpeg')
                    })

                    const file = new File([blob], `${this.formData.newImageName}.jpg`, {
                        type: 'image/jpeg'
                    })

                    const uploadUtil = new UploadUtil()
                    const qiniuResult = await uploadUtil.uploadImg(file, file.name)

                    const uploadParams = {
                        image_cat_id: this.currentImage.image_cat_id,
                        image_name: this.formData.newImageName,
                        image_url: qiniuResult.key,
                        image_type: 'image/jpeg',
                        storage: 'image'
                    }

                    const dbResult = await this.$api.qiniu.uploadQiniuPic(uploadParams)

                    this.$emit('save-complete', {
                        imageId: this.currentImage.image_id,
                        newImageName: this.formData.newImageName,
                        qiniuData: qiniuResult,
                        dbResult: dbResult,
                        cropData: {
                            coordinates: this.cropCoordinates,
                            dimensions: this.cropDimensions
                        }
                    })
                    this.handleClose()

                } catch (error) {
                    this.$message.error('保存失败: ' + error.message)
                } finally {
                    this.uploading = false
                }
            }
        }
    }
}
</script>

<style scoped>
::v-deep .el-dialog__header {
    @apply p-0;
}

</style>