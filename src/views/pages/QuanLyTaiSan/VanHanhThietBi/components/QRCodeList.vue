<template>
    <div class="flex flex-col items-center">
        <canvas ref="qrCanvase"></canvas>
        <div class="text-[14px] font-medium mt-[8px]">{{ serialCode }}</div>
    </div>
</template>

<script setup>
import { toCanvas } from 'qrcode';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    assetSerial: {
        type: Object,
        required: true,
        default: () => ({})
    }
});

const qrCanvase = ref();
const serialCode = ref('');

const generateQRCodes = () => {
    if (props.assetSerial && props.assetSerial.assetSerial) {
        serialCode.value = props.assetSerial.assetCode + '-' + props.assetSerial.assetName + '-' + props.assetSerial.assetSerial;
        toCanvas(qrCanvase.value, serialCode.value, {
            width: 150,
            margin: 2,
            errorCorrectionLevel: 'H'
        });
    }
};

watch(
    () => props.assetSerial,
    () => {
        setTimeout(generateQRCodes, 100);
    },
    { deep: true }
);

onMounted(() => {
    setTimeout(generateQRCodes, 100);
});
</script>

<style scoped>
canvas {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}
</style>
