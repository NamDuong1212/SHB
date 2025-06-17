<template>
  <DataTable
    :value="File"
    showGridlines
    size="small"
    stripedRows
    responsiveLayout="scroll"
  >
    <Column field="fileName" header="Tệp đính kèm" style="min-width: 200px">
      <template #body="{ data }">
        <div class="flex items-center gap-2">
          <i :class="getFileIcon(data.type)" class="text-lg"></i>
          <a
            class="text-blue-500 hover:underline cursor-pointer"
            :href="data.fileUrl"
            target="_blank"
            >{{ data.fileName }}</a
          >
        </div>
      </template>
    </Column>
    <Column header="Ghi chú">
      <template #body="{ data }">
        <InputText
          class="w-full"
          placeholder="Nhập ghi chú"
          v-model="data.notes"
        ></InputText>
      </template>
    </Column>
    <Column field="createdAt" header="Ngày tải lên" style="width: 150px">
      <template #body="slotProps">
        <span>{{ formatDate(slotProps.data.createdAt) }}</span>
      </template>
    </Column>
    <Column header="Hành động" style="width: 90px; text-align: center">
      <template #body="{ data, index }">
        <div class="flex justify-center">
          <Button
            @click="removeItem(index)"
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            size="small"
          />
        </div>
      </template>
    </Column>
    <template #empty>
      <div class="text-center p-8">
        <i class="pi pi-file-excel text-4xl text-gray-300 mb-3"></i>
        <p class="text-gray-500 mb-2">Chưa có tài liệu nào được tải lên</p>
        <Button
          @click="Openfile()"
          label="Tải lên tài liệu"
          icon="pi pi-upload"
          outlined
          size="small"
        />
      </div>
    </template>
    <template #footer>
      <Button
        @click="Openfile()"
        label="Tải lên"
        icon="pi pi-upload"
        size="small"
        severity="info"
      />
      <input
        type="file"
        multiple
        class="hidden click-file"
        @change="UploadFileLocal($event)"
      />
    </template>
  </DataTable>
</template>
<script setup>
const File = defineModel();
const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const getFileIcon = (fileType) => {
  const iconMap = {
    PDF: "pi pi-file-pdf text-red-500",
    DOC: "pi pi-file-word text-blue-500",
    DOCX: "pi pi-file-word text-blue-500",
    XLS: "pi pi-file-excel text-green-500",
    XLSX: "pi pi-file-excel text-green-500",
    JPG: "pi pi-image text-purple-500",
    PNG: "pi pi-image text-purple-500",
    ZIP: "pi pi-file-zip text-orange-500",
  };
  return iconMap[fileType] || "pi pi-file text-gray-500";
};

const getFileSeverity = (fileType) => {
  const severityMap = {
    PDF: "danger",
    DOC: "info",
    DOCX: "info",
    XLS: "success",
    XLSX: "success",
    JPG: "warning",
    PNG: "warning",
    ZIP: "secondary",
  };
  return severityMap[fileType] || null;
};

const Openfile = () => {
  document.querySelectorAll(".click-file")[0].click();
};

const UploadFileLocal = async (event) => {
  const files = event.target.files;
  if (File.value == undefined) File.value = [];

  Array.from(files).forEach((file) => {
    file.fileUrl = URL.createObjectURL(file);
    file.fileName = file.name;
    file.createdAt = file.lastModifiedDate;
  });
  const newFiles = Array.from(files).filter(
    (file) => !File.value.some((existingFile) => existingFile.fileName === file.name)
  );

  if (newFiles.length > 0) {
    File.value = [...File.value, ...newFiles];
  }
  event.target.value = "";
};

const removeItem = (index) => {
  File.value.splice(index, 1);
};
</script>
