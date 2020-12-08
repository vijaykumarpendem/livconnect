<template>
    <div v-if="messageVisible" class="message-wrapper">
        <div class="message-content">
            {{message}}
        </div>
    </div>    
</template>

<script>
    import EventBus from "@/utils/EventBus";

    export default {
        name: "MessageToast",
        data() {
            return {
                messageVisible: false,
                message: "",
                duration: 2000
            }
        },
        mounted() {
            EventBus.$on("show-message", payload => {
                this.message = payload.message;
                this.messageVisible = true;
                setTimeout(() => {
                    this.messageVisible = false;
                }, (payload.duration||this.duration));
            });
        },
        beforeDestroy() {
            EventBus.$off("show-message");
        }
    }
</script>

<style scoped>
    .message-wrapper {
        position: fixed;
        /* bottom: 50px;
        left: 50%; */
        right: 0;
        top: 85px;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        padding: 10px;
        z-index: 2000;
        background: #fff;
        color: #000;
        box-shadow: 0 0 2px 2px rgba(0,0,0,0.3);
        border-radius: 3px;
        animation-name: float-down;
        animation-duration: 0.5s;
    }

    @keyframes float-down {
        from {top: 0;}
        to {}
    }
</style>
