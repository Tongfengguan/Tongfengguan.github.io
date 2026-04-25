<script lang="ts" setup>
interface Props {
  isOpen: boolean
}
defineProps<Props>()
</script>

<template>
  <div class="entry-gate-overlay" :class="{ 'is-open': isOpen }">
    <!-- 上装甲板 -->
    <div class="gate-panel top-gate">
      <div class="panel-content">
        <div class="warning-strip">WARNING // INTERNAL_ACCESS_ONLY // EMERGENCY</div>
        <div class="gate-label">
          <span class="unit-code">EVA_01</span>
          <span class="unit-type">TEST_TYPE</span>
        </div>
      </div>
      <div class="gate-edge"></div>
    </div>

    <!-- 中心锁定枢纽 -->
    <div class="gate-hub">
      <div class="lock-hex">
        <div class="hex-inner">
          <span class="lock-text">{{ isOpen ? 'RELEASE' : 'LOCKED' }}</span>
        </div>
      </div>
      <div class="horizontal-line"></div>
    </div>

    <!-- 下装甲板 -->
    <div class="gate-panel bottom-gate">
      <div class="gate-edge"></div>
      <div class="panel-content">
        <div class="gate-label footer-label">SYSTEM_SYNC: READY</div>
        <div class="warning-strip rev">WARNING // INTERNAL_ACCESS_ONLY // EMERGENCY</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entry-gate-overlay { position: fixed; inset: 0; z-index: 9999; background: transparent; pointer-events: none; transition: visibility 1.5s; }
.entry-gate-overlay.is-open { visibility: hidden; }

.gate-panel {
  position: absolute; left: 0; width: 100%; height: 50.5%;
  background: #050505; display: flex; flex-direction: column; justify-content: center; align-items: center;
  transition: transform 1.2s cubic-bezier(0.85, 0, 0.15, 1); pointer-events: auto;
  border: 1px solid transparent; overflow: hidden;
}

.top-gate { top: 0; transform: translateY(0); border-bottom-color: var(--eva-green); }
.bottom-gate { bottom: 0; transform: translateY(0); border-top-color: var(--eva-green); }

.is-open .top-gate { transform: translateY(-100%); }
.is-open .bottom-gate { transform: translateY(100%); }

.gate-edge { position: absolute; width: 100%; height: 4px; background: var(--eva-green); box-shadow: 0 0 20px var(--eva-green); }
.top-gate .gate-edge { bottom: 0; }
.bottom-gate .gate-edge { top: 0; }

.panel-content { display: flex; flex-direction: column; align-items: center; gap: 30px; }

.warning-strip {
  background: var(--eva-orange); color: #000; font-weight: 950; font-size: 0.7rem; padding: 6px 0;
  width: 200vw; text-align: center; white-space: nowrap; transform: rotate(-1.5deg); opacity: 0.9; letter-spacing: 2px;
}
.warning-strip.rev { transform: rotate(1.5deg); }

.gate-label { display: flex; flex-direction: column; align-items: center; font-family: 'Orbitron', sans-serif; gap: 5px; }
.unit-code { font-size: 3.5rem; font-weight: 900; color: #fff; line-height: 1; }
.unit-type { font-size: 0.8rem; font-weight: 900; color: #fff; opacity: 0.6; letter-spacing: 5px; }
.footer-label { font-family: 'Share Tech Mono', monospace; letter-spacing: 3px; color: #fff; opacity: 0.8; }

.gate-hub { position: absolute; top: 50%; left: 0; width: 100%; height: 0; display: flex; align-items: center; justify-content: center; z-index: 100; transition: opacity 0.4s; }
.is-open .gate-hub { opacity: 0; pointer-events: none; }

.lock-hex {
  width: 140px; height: 160px; background: var(--eva-green);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex; align-items: center; justify-content: center; z-index: 2; box-shadow: 0 0 40px var(--eva-green);
}
.hex-inner {
  width: 90%; height: 90%; background: #000;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex; align-items: center; justify-content: center;
}
.lock-text { color: #fff; font-weight: 900; font-size: 0.7rem; letter-spacing: 2px; animation: blink 1s step-end infinite; }
.horizontal-line { position: absolute; left: 0; right: 0; height: 2px; background: var(--eva-green); opacity: 0.3; }

@keyframes blink { 50% { opacity: 0; } }
</style>
