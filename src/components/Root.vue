<template>
    <div>
        <Loading size="100" margin="160px auto" />
    </div>
</template>

<script>
    import Loading from './shared/Loading'
    export default {
        components:{ Loading },
        mounted(){
            if(!this.$root.Api.isLoggedIn){
                this.$root.Api.login()
            }
            else{
                this.$router.push('/sites')
            }
        }
    }
</script>

