<script>

export default {
    props: [
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
        <li>
            <span>
                {{ name }}
            </span>
            <span style="float:right;">
                <svg style="width:16px;height:16px;cursor:pointer;" dominant-baseline="middle" @click="deleteItem">
                    <use xlink:href="node_modules/@fortawesome/fontawesome-free/sprites/solid.svg#trash"></use>
                </svg>
            </span>
        </li>
    </div>
</template>

<style scoped>
    div {
        width: 100%;
    }

    li {
        padding: 8px;
    }

    li:hover {
        background-color: #f2f2f2;
    }
</style>