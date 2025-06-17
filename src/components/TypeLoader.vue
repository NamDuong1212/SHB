<template>
  <div class="typing-loader">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>
<script setup>

</script>
<style>
.typing-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 40px auto;
  height: 20px;
}

.typing-loader span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3498db;
  opacity: 0;
  transform: translateY(0);
  animation: typing-animation 1.4s infinite ease-in-out;
}

.typing-loader span:nth-child(1) {
  animation-delay: 0s;
}

.typing-loader span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-loader span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-animation {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  30% {
    opacity: 1;
    transform: translateY(-10px);
  }

  60% {
    opacity: 0.5;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>