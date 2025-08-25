<template>
  <div class="p-6 overflow-auto min-h-screen ">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Quản lý Workflow Mở khóa thẻ</h1>
      <p>Quản lý và cấu hình quy trình mở khóa thẻ ghi nợ nội địa.</p>
    </div>

    <!-- Workflow Controls -->
    <Card class="mb-6 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <template #content>
        <div class="flex flex-wrap gap-4">
          <Button label="Tạo Workflow" icon="pi pi-plus" @click="createWorkflow" :loading="loading.create"
            class="bg-blue-600 hover:bg-blue-700" />
          <Button label="Xóa Workflow" icon="pi pi-trash" @click="deleteWorkflow" :loading="loading.delete"
            severity="danger" />
        </div>
      </template>
    </Card>

    <!-- Workflow Display -->
    <Card v-if="workflow"
      class="mb-6 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
            <div class="font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-2">
              <i class="pi pi-sitemap"></i> Tên Workflow
            </div>
            <div class="text-blue-700 dark:text-blue-300 mt-1">{{ workflow.name }}</div>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-600">
            <div class="font-semibold text-green-800 dark:text-green-400 flex items-center gap-2">
              <i class="pi pi-tag"></i> Phiên bản
            </div>
            <div class="text-green-700 dark:text-green-300 mt-1">{{ workflow.version }}</div>
          </div>
        </div>
      </template>
    </Card>

    <Card v-if="workflow && configurableNodes.length > 0"
      class="shadow-sm mb-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <template #header>
        <div class="flex items-center gap-2 p-4">
          <i class="pi pi-sliders-h text-xl"></i>
          <span class="text-xl font-bold">Cấu hình các bước xác thực</span>
        </div>
      </template>
      <template #content>
        <div class="space-y-8">
          <!-- Dynamic Node Rendering -->
          <div v-for="node in configurableNodes" :key="node.id"
            class="rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-md bg-white dark:bg-gray-800/50">
            <h3 class="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-900 dark:text-gray-100">
              <i :class="getNodeIcon(node.id)" class="text-2xl text-blue-500"></i>
              <span>{{ getNodeDisplayName(node.id) }}</span>
            </h3>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Cột: Trường không bắt buộc -->
              <div class="rounded-lg p-4 border border-gray-200 dark:border-gray-600 space-y-3">
                <h4 class="text-lg font-semibold mb-3 flex items-center gap-2">
                  <i class="pi pi-circle-off"></i>
                  Trường không bắt buộc
                </h4>
                <!-- Clickable Field Card -->
                <div v-for="([key, field]) in getOptionalFields(node.id)" :key="key"
                  @click="updateNodeField(node.id, key, true)"
                  class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 transform hover:scale-[1.02]">
                  <span class="font-medium text-gray-800 dark:text-gray-200">
                    {{ field.description }}
                    <span v-if="shouldShowRedStar(field.description)" class="text-red-500 ml-1">(*)</span>
                  </span>
                  <i class="pi pi-arrow-right text-green-500 opacity-60"></i>
                </div>
                <div v-if="getOptionalFields(node.id).length === 0" class="text-center py-8 text-gray-500">
                  <i class="pi pi-check-circle text-2xl text-green-500 mb-2 block"></i>
                  <p>Tất cả các trường đều bắt buộc</p>
                </div>
              </div>

              <!-- Cột: Trường bắt buộc -->
              <div
                class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-600 space-y-3 min-h-[150px]">
                <h4 class="text-lg font-semibold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
                  <i class="pi pi-check-circle text-green-600 dark:text-green-400"></i>
                  Trường bắt buộc
                </h4>
                <!-- Clickable Field Card với số thứ tự -->
                <div v-for="([key, field], index) in getRequiredFields(node.id)" :key="key"
                  @click="updateNodeField(node.id, key, false)"
                  class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 transform hover:scale-[1.02]">
                  <div class="flex items-center gap-3">
                    <span
                      class="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">{{
                        index + 1 }}</span>
                    <span class="font-medium text-gray-800 dark:text-gray-200">
                      {{ field.description }}
                      <span v-if="shouldShowRedStar(field.description)" class="text-red-500 ml-1">(*)</span>
                    </span>
                  </div>
                  <i class="pi pi-arrow-left text-gray-500 opacity-60"></i>
                </div>
                <div v-if="getRequiredFields(node.id).length === 0" class="text-center py-8 text-gray-500">
                  <i class="pi pi-inbox text-2xl mb-2 block"></i>
                  <p>Chưa có trường bắt buộc nào</p>
                </div>
              </div>
            </div>

            <!-- Nút Cập nhật cho Node -->
            <div class="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button label="Lưu thay đổi cho bước này" icon="pi pi-save" @click="updateNode(node.id)"
                :loading="getLoadingState(node.id)" severity="success" />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
import WorkflowService from '@/service/WorkflowService'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref } from 'vue'

const toast = useToast()
const workflow = ref(null)
const nodeFields = ref({})
const fieldOrder = ref({}) // Lưu trữ thứ tự chọn của người dùng

const configurableNodes = computed(() => {
  if (!workflow.value || !workflow.value.nodes) return []

  return workflow.value.nodes.filter(node => {
    if (node.type !== 'API_CALL' || !node.config || !node.config.body) {
      return false
    }
    if (node.id === 'node_api_unlock_card') {
      return false
    }
    const bodyFields = Object.keys(node.config.body)
    return bodyFields.length > 0 && bodyFields.some(key => {
      const field = node.config.body[key]
      return field.hasOwnProperty('required') && typeof field.required === 'boolean'
    })
  })
})

const loading = ref({
  create: false,
  get: false,
  delete: false
})

// Helper func
const getNodeIcon = (nodeId) => {
  const iconMap = {
    'node_verify_customer': 'pi pi-user',
    'node_verify_card': 'pi pi-credit-card',
    'node_verify_account': 'pi pi-building',
    'node_verify_transaction': 'pi pi-money-bill'
  }
  return iconMap[nodeId] || 'pi pi-cog'
}

const getNodeDisplayName = (nodeId) => {
  const nameMap = {
    'node_verify_customer': 'Xác thực khách hàng',
    'node_verify_card': 'Xác thực thẻ',
    'node_verify_account': 'Xác thực tài khoản',
    'node_verify_transaction': 'Xác thực giao dịch'
  }
  return nameMap[nodeId] || nodeId.replace('node_', '').replace(/_/g, ' ')
}

const getLoadingState = (nodeId) => {
  return loading.value[`update_${nodeId}`] || false
}

// Kiểm tra xem có nên hiển thị dấu sao đỏ không
const shouldShowRedStar = (description) => {
  if (!description) return false

  const keywords = [
    '6 chữ số ',
    '4 chữ số'
  ]

  const lowerDescription = description.toLowerCase()
  return keywords.some(keyword => lowerDescription.includes(keyword))
}

// === NEW HELPER FUNCTIONS FOR UI ===
const getOptionalFields = (nodeId) => {
  const fields = nodeFields.value[nodeId]
  if (!fields) return []
  return Object.entries(fields).filter(([, field]) => !field.required)
}

const getRequiredFields = (nodeId) => {
  const fields = nodeFields.value[nodeId]
  const order = fieldOrder.value[nodeId] || []
  if (!fields) return []

  // Chỉ lấy các field có trong order và đang required
  return order
    .filter(key => fields[key] && fields[key].required)
    .map(key => [key, fields[key]])
}
// ===================================

const initializeLoadingStates = () => {
  if (workflow.value && workflow.value.nodes) {
    workflow.value.nodes.forEach(node => {
      if (node.type === 'API_CALL') {
        loading.value[`update_${node.id}`] = false
      }
    })
  }
}

// api functions using WorkflowService
const createWorkflow = async () => {
  loading.value.create = true
  try {
    await WorkflowService.createWorkflow()
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Tạo workflow thành công!',
      life: 3000
    })
    await getWorkflow()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Có lỗi xảy ra khi tạo workflow: ' + error.message,
      life: 5000
    })
  } finally {
    loading.value.create = false
  }
}

const getWorkflow = async () => {
  loading.value.get = true
  try {
    const data = await WorkflowService.getWorkflow()
    workflow.value = data

    syncFieldsWithWorkflow(data)
  } catch (error) {
    workflow.value = null; // Clear old data on error
    toast.add({
      severity: 'warn',
      summary: 'Cảnh báo',
      detail: 'Không tìm thấy workflow. Vui lòng tạo một workflow mới.',
      life: 4000
    })
  } finally {
    loading.value.get = false
  }
}

const deleteWorkflow = async () => {
  loading.value.delete = true
  try {
    await WorkflowService.deleteWorkflow()
    workflow.value = null
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Xóa workflow thành công!',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Có lỗi xảy ra khi xóa workflow: ' + error.message,
      life: 5000
    })
  } finally {
    loading.value.delete = false
  }
}

const updateNode = async (nodeId) => {
  const loadingKey = `update_${nodeId}`
  loading.value[loadingKey] = true

  try {
    const nodeData = workflow.value.nodes.find(n => n.id === nodeId);
    if (!nodeData) throw new Error('Không tìm thấy node.');

    // Tạo payload mới với thứ tự theo fieldOrder
    const fieldsToUpdate = nodeFields.value[nodeId];
    const currentOrder = fieldOrder.value[nodeId] || [];

    console.log('Current fieldOrder for', nodeId, ':', currentOrder)

    const orderedFields = {};

    // Đầu tiên, thêm các field theo thứ tự người dùng đã chọn (required fields)
    currentOrder.forEach(fieldKey => {
      if (nodeData.config.body[fieldKey]) {
        orderedFields[fieldKey] = {
          ...nodeData.config.body[fieldKey],
          required: fieldsToUpdate && fieldsToUpdate[fieldKey]
            ? fieldsToUpdate[fieldKey].required
            : nodeData.config.body[fieldKey].required
        };
      }
    });

    // Sau đó, thêm các field không required (không có trong order)
    Object.keys(nodeData.config.body).forEach(fieldKey => {
      if (!orderedFields[fieldKey]) {
        orderedFields[fieldKey] = {
          ...nodeData.config.body[fieldKey],
          required: fieldsToUpdate && fieldsToUpdate[fieldKey]
            ? fieldsToUpdate[fieldKey].required
            : nodeData.config.body[fieldKey].required
        };
      }
    });

    console.log('Ordered fields to send:', Object.keys(orderedFields))

    await WorkflowService.updateNodeBody(nodeId, orderedFields)
    toast.add({
      severity: 'success',
      summary: 'Cập nhật thành công',
      detail: `Cập nhật bước "${getNodeDisplayName(nodeId)}" thành công!`,
      life: 3000
    })

    await getWorkflow()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi cập nhật',
      detail: `Có lỗi khi cập nhật bước "${getNodeDisplayName(nodeId)}": ` + error.message,
      life: 5000
    })
  } finally {
    loading.value[loadingKey] = false
  }
}

const updateNodeField = (nodeId, fieldKey, required) => {
  if (!nodeFields.value[nodeId]) {
    nodeFields.value[nodeId] = {}
  }
  if (!nodeFields.value[nodeId][fieldKey]) {
    nodeFields.value[nodeId][fieldKey] = {}
  }
  nodeFields.value[nodeId][fieldKey].required = required

  // Cập nhật thứ tự chọn của người dùng
  if (!fieldOrder.value[nodeId]) {
    fieldOrder.value[nodeId] = []
  }

  // Nếu đang chuyển thành required (true)
  if (required) {
    // Nếu field này chưa có trong thứ tự, thêm vào cuối danh sách theo thứ tự chọn
    if (!fieldOrder.value[nodeId].includes(fieldKey)) {
      fieldOrder.value[nodeId].push(fieldKey)
    }
  } else {
    // Nếu chuyển thành không required, xóa khỏi thứ tự
    const index = fieldOrder.value[nodeId].indexOf(fieldKey)
    if (index > -1) {
      fieldOrder.value[nodeId].splice(index, 1)
    }
  }

  // Lưu thứ tự vào localStorage để duy trì khi reload
  localStorage.setItem(`fieldOrder_${nodeId}`, JSON.stringify(fieldOrder.value[nodeId]))
}

const syncFieldsWithWorkflow = (workflowData) => {
  if (!workflowData || !workflowData.nodes) {
    nodeFields.value = {};
    fieldOrder.value = {};
    return
  }

  const newFields = {}
  const newOrder = {}
  initializeLoadingStates()

  workflowData.nodes.forEach(node => {
    if (node.type === 'API_CALL' && node.config && node.config.body) {
      newFields[node.id] = {}

      // Khôi phục thứ tự từ localStorage trước
      const savedOrder = localStorage.getItem(`fieldOrder_${node.id}`)
      if (savedOrder) {
        try {
          newOrder[node.id] = JSON.parse(savedOrder)
        } catch {
          newOrder[node.id] = []
        }
      } else {
        newOrder[node.id] = []
      }

      Object.keys(node.config.body).forEach(fieldKey => {
        const field = node.config.body[fieldKey]
        newFields[node.id][fieldKey] = {
          type: field.type,
          required: field.required,
          description: field.description
        }

        // Chỉ thêm vào order nếu field đã required VÀ chưa có trong order
        if (field.required && !newOrder[node.id].includes(fieldKey)) {
          newOrder[node.id].push(fieldKey)
        }
      })

      // Loại bỏ các field không còn tồn tại hoặc không required khỏi order
      newOrder[node.id] = newOrder[node.id].filter(fieldKey =>
        node.config.body[fieldKey] && newFields[node.id][fieldKey]?.required
      )
    }
  })
  nodeFields.value = newFields;
  fieldOrder.value = newOrder;
}

onMounted(() => {
  getWorkflow()
})
</script>

<style scoped>
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
</style>