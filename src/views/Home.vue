<template>
    <div class="home">
        <div class="error" v-if="errorValue">Tidak dapat mengambil data</div>
        <div v-if="documents">
            <listview :playlists="documents"></listview>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import { defineAsyncComponent } from 'vue';
import getCollection from '../composables/getCollection';

const ListView = defineAsyncComponent(() => import('../components/ListView.vue'));

export default {
    name: 'Home',
    components: {
        listview: ListView,
    },
    setup() {
        const { documents, errorValue } = getCollection('playlists');

        return { documents, errorValue };
    },
};
</script>
