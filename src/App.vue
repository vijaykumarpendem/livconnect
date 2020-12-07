<template>
  <div id="app">
    <section class="content-section">
      <Header/>
      <router-view/>
      <!-- <img alt="Vue logo" src="./assets/logo.png"/> -->
    </section>
    <!-- <section class="loader-parent">
      <aside class="loader">Loading...</aside>
    </section> -->
  </div>
</template>

<script>
import GoogleSignInButton from "vue-google-signin-button-directive";
import Header from "@/components/Header";

export default {
  name: 'App',
  directives: {
    GoogleSignInButton
  },
  components: {
    Header
  },
  data() {
    return {
      clientId: "215252273042-0vtav27rr4bscbtackcqhtqhpmispcd9"
    }
  },
  methods: {
    OnGoogleAuthSuccess (idToken) {
      // Receive the idToken and make your magic with the backend
      debugger;
    },
    OnGoogleAuthFail (error) {
      console.log(error)
    }
  }
}
</script>

<style scoped>
  .google-signin-button {
    color: white;
    background-color: red;
    height: 50px;
    font-size: 16px;
    border-radius: 10px;
    padding: 10px 20px 25px 20px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .loader-parent {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 30;
    display: flex;
    background: rgb(80 80 80 / 50%);
  }
  .loader,
  .loader:before,
  .loader:after {
    border-radius: 50%;
  }
  .loader {
    color: #0dc5c1;
    font-size: 5px;
    text-indent: -99999em;
    margin: auto;
    position: relative;
    width: 10em;
    height: 10em;
    box-shadow: inset 0 0 0 1em;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }
  .loader:before,
  .loader:after {
    position: absolute;
    content: '';
  }
  .loader:before {
    width: 5.2em;
    height: 10.2em;
    background: white;
    border-radius: 10.2em 0 0 10.2em;
    top: -0.1em;
    left: -0.1em;
    -webkit-transform-origin: 5.1em 5.1em;
    transform-origin: 5.1em 5.1em;
    -webkit-animation: load2 2s infinite ease 1.5s;
    animation: load2 2s infinite ease 1.5s;
  }
  .loader:after {
    width: 5.2em;
    height: 10.2em;
    background: white;
    border-radius: 0 10.2em 10.2em 0;
    top: -0.1em;
    left: 4.9em;
    -webkit-transform-origin: 0.1em 5.1em;
    transform-origin: 0.1em 5.1em;
    -webkit-animation: load2 2s infinite ease;
    animation: load2 2s infinite ease;
  }
  @-webkit-keyframes load2 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load2 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }


</style>
