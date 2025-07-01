<template>
  <div class="generation-form" v-loading="loading">
    <!-- 生成规则 -->
    <el-form
      ref="formRef"
      :model="config"
      size="large"
      label-width="auto"
      :rules="rules"
      label-position="top"
    >
      <!-- 生成规则部分 -->
      <!-- <div class="form-section">
        <div class="section-title">
          <Icon icon="bi:gear" />
          学校密钥生成规则
        </div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="密钥长度" prop="length">
              <el-select v-model="config.length" class="form-control" @change="updatePreview">
                <el-option :value="8" label="8位" />
                <el-option :value="12" label="12位" />
                <el-option :value="16" label="16位" />
                <el-option :value="20" label="20位" />
                <el-option :value="24" label="24位" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="分隔符" prop="separator">
              <el-select v-model="config.separator" class="form-control" @change="updatePreview">
                <el-option value="" label="无分隔符" />
                <el-option value="-" label="横线 (-)" />
                <el-option value="_" label="下划线 (_)" />
                <el-option value="." label="点号 (.)" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="分组长度" prop="group_size">
              <el-select v-model="config.group_size" class="form-control" @change="updatePreview">
                <el-option :value="3" label="3位一组" />
                <el-option :value="4" label="4位一组" />
                <el-option :value="5" label="5位一组" />
                <el-option :value="6" label="6位一组" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="preview-section">
          <label>密钥预览：</label>
          <div class="preview-key">{{ previewKey }}</div>
          <el-button :icon="Refresh" type="primary" @click="updatePreview">刷新预览</el-button>
        </div>
      </div> -->

      <!-- 学校信息设置 -->
      <div class="form-section">
        <div class="section-title">
          <Icon icon="bi:building" />
          学校信息设置
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学校标记" prop="school_name" required>
              <el-input
                v-model="config.school_name"
                :minlength="2"
                :maxlength="100"
                placeholder="请输入学校名称或标识"
              />
              <small class="text-muted">用于标识和管理不同学校的密钥</small>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="可绑定设备上限数量" prop="device_limit" required>
              <el-input-number v-model="config.device_limit" :min="1" :max="1000" />
              <small class="text-muted" style="width: 100%">单个密钥最多可绑定的设备数量</small>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注说明" prop="remarks">
          <el-input
            v-model="config.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入密钥用途或备注信息"
          />
        </el-form-item>

        <div class="school-key-settings">
          <!-- <el-form-item label="学校名称" prop="school_name" >
            <el-input v-model="config.school_name" />
          </el-form-item> -->

          <div class="form-group">
            <div class="mb-2">IP段设置（可选）</div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="起始IP" prop="start_ip">
                  <el-input v-model="config.start_ip" placeholder="例如：192.168.1.1" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束IP" prop="end_ip">
                  <el-input v-model="config.end_ip" placeholder="例如：192.168.1.255" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>

      <!-- 数量和周期设置 -->
      <div class="form-section">
        <div class="section-title">
          <Icon icon="bi:calendar-range" />
          数量与周期设置
        </div>
        <div class="form-group">
          <div class="flex-start">
            <el-form-item label="生成数量" prop="quantity">
              <el-input-number v-model="config.quantity" :min="1" :max="1000" />
              <small style="width: 100%" class="text-muted">最多可生成1000个密钥</small>
            </el-form-item>
            <el-form-item label="持续周期（天）" prop="duration_days">
              <el-input-number v-model="config.duration_days" :min="1" :max="3650" />
              <small class="text-muted" style="width: 100%">密钥的持续使用周期</small>
            </el-form-item>
          </div>
        </div>
      </div>

      <!-- 使用期间设置 -->
      <div class="form-section">
        <div class="section-title">
          <Icon icon="bi:clock" />
          使用期间设置
        </div>
        <div class="form-group">
          <div class="flex-start">
            <div class="group-label">可使用期间</div>
            <el-form-item label="开始时间" prop="start_time">
              <el-date-picker
                v-model="config.start_time"
                type="datetime"
                placeholder="选择开始时间"
                :format="DateTime_Formate_For_Dayjs"
                :value-format="DateTime_Formate_For_Dayjs"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="end_time">
              <el-date-picker
                v-model="config.end_time"
                type="datetime"
                placeholder="选择结束时间"
                :format="DateTime_Formate_For_Dayjs"
                :value-format="DateTime_Formate_For_Dayjs"
              />
            </el-form-item>
          </div>
          <div class="group-tip text-muted mb-2">设置密钥可以使用的时间段</div>
        </div>
        <div class="form-group">
          <div class="flex-start">
            <div class="group-label">激活后的有效期</div>
            <el-form-item label="开始时间" prop="activation_start_time">
              <el-date-picker
                v-model="config.activation_start_time"
                type="datetime"
                placeholder="选择开始时间"
                :format="DateTime_Formate_For_Dayjs"
                :value-format="DateTime_Formate_For_Dayjs"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="activation_end_time">
              <el-date-picker
                v-model="config.activation_end_time"
                type="datetime"
                placeholder="选择结束时间"
                :format="DateTime_Formate_For_Dayjs"
                :value-format="DateTime_Formate_For_Dayjs"
              />
            </el-form-item>
          </div>
          <div class="group-tip text-muted">设置激活后的有效时间范围</div>
        </div>
      </div>
    </el-form>
    <!-- 生成操作 -->
    <div class="form-section">
      <div class="generate-actions">
        <div class="batch-info">
          <span>
            将为
            <strong>{{ config.school_name || '未设置学校' }}</strong>
            生成
            <strong>{{ config.quantity }}</strong>
            个学校密钥
          </span>
        </div>
        <div>
          <el-button
            :icon="Key"
            size="large"
            :loading="loading"
            type="primary"
            @click="generateKeys"
          >
            生成密钥
          </el-button>
        </div>
      </div>
    </div>

    <!-- 生成结果 -->
    <div class="form-section" v-if="generatedKeys.length" ref="RefKeys">
      <div class="section-title">
        <Icon icon="bi:check-circle" class="text-success" />
        生成结果
      </div>
      <div class="generated-keys">
        <div class="key-item" v-for="(keyData, index) in generatedKeys" :key="index">
          <div>
            <span class="key-code">{{ keyData.license }}</span>
            <span class="key-info">
              学校密钥 | {{ keyData.school_name }} | 有效期至
              {{ keyData.end_time || keyData.activation_end_time }}
            </span>
          </div>
          <el-button
            type="default"
            :icon="DocumentCopy"
            class="copy-btn"
            @click="copyKey(keyData.license || '')"
          ></el-button>
        </div>
      </div>
      <div class="export-actions pt-4">
        <el-button type="primary" :icon="DocumentCopy" @click="copyAllKeys">复制全部</el-button>
        <el-button type="warning" :icon="Tickets" class="btn-outline" @click="exportTxt">
          导出TXT
        </el-button>
        <el-button type="success" :icon="Document" class="btn-outline" @click="exportExcel">
          导出Excel
        </el-button>
        <!-- <el-button type="success" :icon="Upload" @click="saveToSystem">保存到系统</el-button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="GenerateKey">
  import type { FormInstance, FormRules } from 'element-plus'
  import { Refresh, DocumentCopy, Key, Tickets, Document } from '@element-plus/icons-vue'
  import { Icon } from '@iconify/vue'
  import { generateKeyWithConfig } from '@/utils/index'
  import { type SchoolKey, exportCsvKeys, exportTxtKeys } from './type'
  import { copyToClip } from '@/utils/export'
  import { add } from '@/api/key'
  import { DateTime_Formate_For_Dayjs, IPv4_REGEX } from '@/utils/contant'
  import { formatTime } from '@/utils/dayFormate'
  import dayjs from 'dayjs'
  const loading = ref(false)
  const config = ref<
    SchoolKey & {
      quantity: number
      length: number
      separator: string
      group_size: number
      duration_days?: number
    }
  >({
    school_name: '',
    quantity: 1,
    device_limit: 1,
    duration_days: 1,
    start_time: formatTime(Date.now(), DateTime_Formate_For_Dayjs),
    end_time: formatTime(dayjs().add(1, 'day'), DateTime_Formate_For_Dayjs),
    activation_start_time: formatTime(Date.now(), DateTime_Formate_For_Dayjs),
    activation_end_time: formatTime(dayjs().add(1, 'day'), DateTime_Formate_For_Dayjs),
    created_at: '',
    length: 12,
    separator: '-',
    group_size: 4
  })
  const previewKey = ref('')
  const generatedKeys = ref<SchoolKey[]>([])

  // 表单引用
  const formRef = ref<FormInstance>()
  const RefKeys = ref<HTMLElement>()
  // 校验规则配置
  // 表单规则
  const rules = reactive<FormRules>({
    school_name: [
      { required: true, message: '学校名称不能为空', trigger: 'blur' },
      { min: 2, max: 100, message: '长度在2-100字符之间', trigger: 'blur' }
    ],
    device_limit: [
      { type: 'number', min: 1, max: 1000, message: '设备上限需在1-1000之间', trigger: 'blur' }
    ],
    start_ip: [
      {
        pattern: IPv4_REGEX,
        message: '请输入合法的IP地址（如192.168.1.1）',
        trigger: 'blur'
      }
    ],
    end_ip: [
      {
        pattern: IPv4_REGEX,
        message: '请输入合法的IP地址（如192.168.1.255）',
        trigger: 'blur'
      }
    ],
    quantity: [
      { required: true, message: '生成数量不能为空', trigger: 'blur' },
      { type: 'number', min: 1, max: 1000, message: '数量需在1-1000之间', trigger: 'blur' }
    ],
    duration_days: [
      { type: 'number', min: 1, max: 3650, message: '持续周期需在1-3650天之间', trigger: 'blur' }
    ],
    start_time: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
    end_time: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }],
    activation_start_time: [{ required: true, message: '有效期开始时间不能为空', trigger: 'blur' }],
    activation_end_time: [{ required: true, message: '有效期结束时间不能为空', trigger: 'blur' }]
  })

  const updatePreview = () => {
    previewKey.value = generateKeyWithConfig(config.value)
  }

  // 生成密钥
  const generateKeys = async () => {
    try {
      try {
        await formRef.value?.validate()
      } catch (error) {
        console.error(error)
        ElMessage.warning('密钥配置不合法！')
        return error
      }
      generatedKeys.value = []
      loading.value = true
      const res = await add(config.value)
      generatedKeys.value = res.data || []
    } catch (error) {
      console.error(error)
      // generatedKeys.value = [...new Array(config.value.quantity || 1)].map(() => ({
      //   ...config.value,
      //   license: generateKeyWithConfig(config.value)
      // }))
    } finally {
      loading.value = false
      // 滚动到页面底部
      nextTick(() => {
        RefKeys.value?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }
  const copyKey = async (key: string) => {
    await copyToClip(key)
    ElMessage.success('密钥已复制到剪切板！')
  }

  const copyAllKeys = async () => {
    if (generatedKeys.value?.length <= 0) {
      return ElMessage.warning('请先生成密钥！')
    }
    await copyToClip(generatedKeys.value.map((item) => item.license).join(' '))
    ElMessage.success('密钥已复制到剪切板！')
  }
  // 导出为TXT
  const exportTxt = () => {
    if (generatedKeys.value?.length <= 0) {
      return ElMessage.warning('请先生成密钥！')
    }
    exportTxtKeys(generatedKeys.value, `school_keys_${new Date().toISOString().split('T')[0]}`)
  }

  // 导出为Excel (CSV)
  const exportExcel = () => {
    if (generatedKeys.value?.length <= 0) {
      return ElMessage.warning('请先生成密钥！')
    }
    exportCsvKeys(generatedKeys.value, `school_keys_${new Date().toISOString().split('T')[0]}`)
  }

  // 保存到系统
  const saveToSystem = () => {
    if (generatedKeys.value?.length <= 0) {
      return ElMessage.warning('请先生成密钥！')
    }
    if (confirm(`确定要将这 ${generatedKeys.value.length} 个学校密钥保存到系统中吗？`)) {
      ElMessage.success('密钥已成功保存！')
      // 清空结果
      generatedKeys.value = []
    }
  }
  // 初始化配置
  onMounted(() => {
    // updatePreview()
    formRef.value?.resetFields?.()
  })
</script>

<style scoped lang="scss">
  .generation-form {
    max-width: 900px;
    margin: 0 auto;
  }

  .form-section {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 32px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    }
  }

  .section-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 28px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    & > svg {
      color: #64b5f6;
      font-size: 20px;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #fff, #42a5f5);
      border-radius: 2px;
    }
  }
  .form-group {
    margin-bottom: 20px;
  }
  .group-label {
    width: 150px;
    text-align: right;
    padding-right: 15px;
  }
  .group-tip {
    font-size: 12px;
    margin-top: -10px;
    padding-left: 150px;
  }
  .preview-section {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 24px;
    margin-top: 24px;
  }
  .preview-key {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    background: rgba(100, 181, 246, 0.1);
    padding: 16px 20px;
    border-radius: 8px;
    font-size: 18px;
    letter-spacing: 2px;
    color: #64b5f6;
    border: 1px solid rgba(100, 181, 246, 0.2);
    text-align: center;
    margin: 12px 0;
    font-weight: 600;
  }
  .generate-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .batch-info {
    color: #9e9e9e;
    font-size: 14px;
    font-weight: 500;
  }

  .generated-keys {
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(10px);
  }

  .key-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    transition: background 0.2s ease;
  }

  .key-item:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .key-item:last-child {
    border-bottom: none;
  }

  .key-code {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 14px;
    color: #64b5f6;
    background: rgba(100, 181, 246, 0.1);
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: 600;
    letter-spacing: 1px;
  }
  .text-muted {
    color: var(--text-secondary);
  }
</style>
