<template>
    <div class="app-container">
        <tinymce :height="300" v-model="content" />
    </div>
</template>

<script>
import Tinymce from "@/components/Tinymce"
export default {
    components: {
        Tinymce
    },
    data() {
        return {
            content: "welcome to tinymce!"
        }
    },
}
</script>