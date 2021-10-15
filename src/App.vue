<template>
    <navbar></navbar>
    <div class="content">
        <router-view />
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

const Navbar = defineAsyncComponent(() => import('./components/Navbar.vue'));

export default {
    components: {
        navbar: Navbar,
    },
    setup() {},
};
</script>

<style lang="scss">
.content {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0 auto;
    max-width: 1200px;
    padding: 0 20px;
}
</style>
