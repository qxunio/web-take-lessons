<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class App extends Vue {

    }
</script>
<style lang="scss">
    body {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        height: 100vh;
        margin: 0;
    }
</style>
