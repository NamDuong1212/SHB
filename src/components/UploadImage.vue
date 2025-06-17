<template>
  <FileUpload
    :multiple="true"
    accept="image/*"
    @select="onSelectedFiles"
    ref="FILE_UPLOAD"
  >
    <template #header="{ chooseCallback, clearCallback, files }">
      <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
        <div class="flex gap-2">
          <Button
            @click="chooseCallback()"
            icon="pi pi-images"
            rounded
            size="small"
            outlined
            severity="secondary"
          ></Button>
          <Button
            @click="clearCallback()"
            icon="pi pi-times"
            rounded
            outlined
            size="small"
            severity="danger"
            :disabled="!files || files.length === 0"
          ></Button>
        </div>
      </div>
    </template>
    <template #content="{ files, removeFileCallback, messages }">
      <div class="flex flex-col gap-5 pt-2">
        <Message
          v-for="message of messages"
          :key="message"
          :class="{ 'mb-8': !files.length }"
          severity="error"
        >
        </Message>
        <div v-if="files.length > 0">
          <div>
            <Galleria :value="files" v-model:active-index="indexFile">
              <template #item="slotProps">
                <div class="relative w-[300px] h-[200px] group">
                  <img
                    :src="slotProps.item.fileUrl"
                    :alt="slotProps.item.fileName"
                    class="w-full h-full object-cover"
                  />
                  <div
                    class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-lg"
                  >
                    <div class="flex gap-2 items-center">
                      <Button
                        icon="pi pi-times"
                        severity="danger"
                        size="small"
                        @click="removeFile(removeFileCallback)"
                        rounded
                      ></Button>
                      <Button label="Đặt mặc định" size="small" rounded></Button>
                    </div>
                  </div>
                </div>
              </template>
              <template #thumbnail="slotProps">
                <img
                  :src="slotProps.item.fileUrl"
                  :alt="slotProps.item.fileName"
                  style="width: 50px; height: 50px"
                  class="object-cover"
                />
              </template>
            </Galleria>
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex items-center justify-center flex-col">
        <i
          class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"
        />
        <p class="mt-6 mb-0">Kéo và thả tập tin vào đây để tải lên.</p>
      </div>
    </template>
  </FileUpload>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";

const indexFile = ref(0);
const Files = defineModel();
const FILE_UPLOAD = ref();

onBeforeMount(() => {
  setTimeout(() => {
    if (FILE_UPLOAD.value?.files && Files.value) {
      FILE_UPLOAD.value.files = Files.value;
    }
  }, 200);
});

const onSelectedFiles = (e) => {
  const files = e.files;
  Array.from(files).forEach((file) => {
    file.fileUrl = file?.objectURL || file.fileUrl;
    file.fileName = file?.name || file.fileName;
  });
  Files.value = files;
};

const removeFile = (removeFileCallback) => {
  removeFileCallback(indexFile.value);
  Files.value.splice(indexFile.value, 1);
  if (indexFile.value) {
    indexFile.value -= 1;
  }
};
</script>
