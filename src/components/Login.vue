<template>
    <div style="text-align:center">
        <img alt="" src="../assets/logo.png" style="width:100%;max-width:300px;height:auto;margin-top:100px">
        <h4 style="color:#333">Admin Panel</h4>
        <button style="margin:15px auto" class="waves-effect waves-light btn" @click.prevent="$root.Api.login()">Log In</button>  
    </div>
</template>

