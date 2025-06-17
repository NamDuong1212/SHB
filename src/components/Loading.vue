<template>
  <div class="container_loading">
    <div id="loader">
      <div class="circle-loader">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-4"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container_loading {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999999999999999999999;
}

#loader {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.circle-loader {
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle {
  position: absolute;
  border: 3.5px solid transparent;
  border-radius: 50%;
  animation: rotate 3s infinite ease-in-out;
}

.circle-1 {
  width: 50px;
  height: 50px;
  border-top-color: var(--primary-color);
  border-right-color: var(--primary-color);
  animation-delay: -0.15s;
}

.circle-2 {
  width: 30px;
  height: 30px;
  border-top-color: #404041;
  border-right-color: #404041;
  animation-delay: -0.3s;
}

.circle-3 {
  width: 20px;
  height: 20px;
  border-top-color: var(--primary-color);
  border-right-color: var(--primary-color);
  animation-delay: -0.45s;
}

.circle-4 {
  width: 10px;
  height: 10px;
  border-top-color: #404041;
  border-right-color: #404041;
  animation-delay: -0.6s;
}

@keyframes rotate {
  50% {
    transform: rotate(360deg);
  }
}

.timer-text {
  position: absolute;
  font-size: 48px;
  color: black;
}
</style>
