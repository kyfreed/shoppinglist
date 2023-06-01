<script>

export default {
    props: [
        'key',
        'name'
    ],
    methods: {
        deleteItem(){
            this.$emit("delete-item")
        }
    }
}

</script>

<template>
    <div>
        <li>{{ name }}</li>
        <span style="float:right;">
            <svg style="width:16px;height:16px;cursor:pointer;" dominant-baseline="middle" @click="deleteItem">
                <use xlink:href="node_modules/@fortawesome/fontawesome-free/sprites/solid.svg#trash"></use>
            </svg>
        </span>
    </div>
</template>

<style scoped>
    div {
        width: 100%;
        padding: 8px;
    }
</style>