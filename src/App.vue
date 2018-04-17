<template>
  <div>

    <nav v-show="$root.Api.isLoggedIn">
      <div class="container">
        <div class="nav-wrapper">
        
          <router-link to="/sites" class="brand-logo"><img alt="" src="./assets/logo-small.png" width="20" height="20"></router-link>
          <a href="#" data-activates="mobile-collapse" ref="collapse" class="button-collapse"><i class="material-icons">menu</i></a>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li>
              <router-link to="/sites"><i class="fa fa-list-ul"></i> Sites</span>
              </router-link>
            </li>
            <li>
              <router-link to="/upload"><i class="fa fa-upload"></i> Upload</span>
              </router-link>
            </li>
            <li v-show="!$root.Api.isLoggedIn"><a @click.prevent="$root.Api.login()" href="#"><i class="fa fa-sign-in"></i> Login</span></a></li>
            <li v-show="$root.Api.isLoggedIn"><a href="#" @click.prevent="$root.Api.logout()"><i class="fa fa-sign-out"></i> Exit</span></a></li>
          </ul>
          <ul class="side-nav" id="mobile-collapse">
            <li>
              <router-link to="/sites"><i class="fa fa-list-ul"></i> Sites</span>
              </router-link>
            </li>
            <li>
              <router-link to="/upload"><i class="fa fa-upload"></i> Upload</span>
              </router-link>
            </li>
            <li v-show="!$root.Api.isLoggedIn"><a @click.prevent="$root.Api.login()" href="#"><i class="fa fa-sign-in"></i> Login</span></a></li>
            <li v-show="$root.Api.isLoggedIn"><a href="#" @click.prevent="$root.Api.logout()"><i class="fa fa-sign-out"></i> Exit</span></a></li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {
      $(this.$refs.collapse).sideNav({closeOnClick: true});
    }
  }
</script>