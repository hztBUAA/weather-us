<template>
  <div class="dashboard-container">

    <div class="loader" />

    <h1>Welcome to the Weather-us</h1>
    <div class="explore-button">
      <router-link to="map/index">探索</router-link>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.not-hit{
  overflow: hidden;
}

h1 {
  font-size: 30px;
  color: #333;
}

.explore-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #150416;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
}

.explore-button::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 0 5px 5px;
  border-color: transparent transparent transparent white;

}

.explore-button:hover {
  transform: translateY(-5px); /* 鼠标悬浮时向上浮动5px */
}

.loader {
    top: 60px;
    position: absolute; /* 添加相对定位，使其成为绝对定位元素的参考点 */
    width: 40px;
    height: 40px;
    --c:no-repeat linear-gradient(orange 0 0);
    background: var(--c),var(--c),var(--c),var(--c);
    background-size: 21px 21px;
    animation: l5 1.5s infinite cubic-bezier(0.3,1,0,1);
    margin-bottom: 40px;
}
@keyframes l5 {
   0%   {background-position: 0    0,100% 0   ,100% 100%,0 100%}
   33%  {background-position: 0    0,100% 0   ,100% 100%,0 100%;width:60px;height: 60px}
   66%  {background-position: 100% 0,100% 100%,0    100%,0 0   ;width:60px;height: 60px}
   100% {background-position: 100% 0,100% 100%,0    100%,0 0   }
}
</style>
