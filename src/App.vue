<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Bon-Prix</router-link> |
      <router-link to="/my_annonces">My annonces</router-link> |
      <!-- <router-link to="/scan">Scan</router-link> | -->
      <router-link to="/about">About</router-link> |
      <SolidLoginButton />
    </div>
    <b-container>
      <router-view/>
      <SolidSession />
    </b-container>
  </div>
</template>
<script>
export default {
  name: 'App',
  components: {
    'SolidLoginButton': () => import('@/components/solid/SolidLoginButton'),
    'SolidSession': () => import('@/components/solid/SolidSession'),
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}


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
