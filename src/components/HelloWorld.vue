<script setup lang="ts">
import { ref } from 'vue';
import ScreenShot from "js-web-screen-shot";
import { getDesktopCapturerSource } from '../utils/xxx';
import { getInitStream } from '../utils/yyy';
import VueIcon from "../assets/vue.svg";

defineProps<{ msg: string }>()

const count = ref(0)

const doScreenShot = async () => {
  // 下面这两块自己考虑  
  const sources = await getDesktopCapturerSource(); // 这里返回的是设备上的所有窗口信息
  // 这里可以对`sources`数组下面id进行判断  找到当前的electron窗口  这里为了简单直接拿了第一个
  console.log(sources);
  const stream = await getInitStream(sources.filter(e => e.name == "electron js-web-screen-shot demo")[0]);

  new ScreenShot({
    enableWebRtc: true, // 启用webrtc
    screenFlow: stream!, // 传入屏幕流数据
    level: 999,
    userToolbar: [
      {
        title: "截图",
        icon: VueIcon,
        activeIcon: VueIcon,
        clickFn() {
          console.log("自定义按钮被点击了");
        },
      }
    ]
  });
}
</script>

<template>
  <h1>{{ msg }}</h1>
  <h2>js-web-screen-shot</h2>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <button type="button" @click="doScreenShot">截图</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
