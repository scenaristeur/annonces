<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand to="/">Bon-Prix</b-navbar-brand>

        <SolidLoginButton v-if="webId == null" />
        <b-button variant="warning" to="/edit" title="Add an annonce" size="sm">+ Add an annonce</b-button>



        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>

            <b-nav-item to="/my_annonces" v-if="webId != null">My annonces</b-nav-item>
            <b-nav-item to="/inbox" v-if="webId != null">Inbox</b-nav-item>
            <b-nav-item to="/config">Config</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
            <SolidLoginButton v-if="webId != null"/>
            <b-nav-item to="/" disabled></b-nav-item>
            <!-- <router-link to="/">Bon-Prix</router-link> | -->
            <!-- <router-link to="/my_annonces">My annonces</router-link> |
            <router-link to="/about">About</router-link> | -->

          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <!-- <b-navbar-nav class="ml-auto">
          <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form> -->

        <!-- <b-nav-item-dropdown text="Lang" right>
        <b-dropdown-item href="#">EN</b-dropdown-item>
        <b-dropdown-item href="#">ES</b-dropdown-item>
        <b-dropdown-item href="#">RU</b-dropdown-item>
        <b-dropdown-item href="#">FA</b-dropdown-item>
      </b-nav-item-dropdown> -->

      <!-- <b-nav-item-dropdown right>
      <template #button-content>
      <em>User</em>
    </template>
    <b-dropdown-item href="#">Profile</b-dropdown-item>
    <b-dropdown-item href="#">Sign Out</b-dropdown-item>
  </b-nav-item-dropdown>
</b-navbar-nav> -->
</b-collapse>
</b-navbar>
</div>

<b-container>
  <router-view/>
  <SolidSession />
</b-container>

<router-link to="/scan"><small>Scan (experimental)</small></router-link>.006 dropzone pics
</div>
</template>
<script>
export default {
  name: 'App',
  components: {
    'SolidLoginButton': () => import('@/components/solid/SolidLoginButton'),
    'SolidSession': () => import('@/components/solid/SolidSession'),
  },
  computed:{
    webId() {
      return this.$store.state.solid.webId
    },
  },
}
</script>

<style>
/* #app {
font-family: Avenir, Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
color: #2c3e50;
}*/


#nav {
  padding: 30px;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
