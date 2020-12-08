<template>
    <header class="home-header">
        <div class="brand-section">
            <div class="heading-3">LIVCONNECT</div>
        </div>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/forum">Forum</router-link>
          <router-link to="/articles">Articles</router-link>
          <router-link to="/leaderboard">Leaderboard</router-link>
        </nav>
        <div class="user-section">
            <div v-if="loggedIn">
                <img class="user-avatar" :src="currentUser.photo" @click="onUserIconClick()"/>
            </div>
            <div v-else>
                <button v-google-signin-button="clientId" class="google-signin-button">SIGN IN</button>
            </div>
            <div class="user-dropdown" v-if="userDropdownVisible">
                <ul>
                    <li @click="goToProfile">View Profile</li>
                    <li @click="onSignOut">Sign out</li>
                </ul>
            </div>
        </div>
      </header>
</template>

<script>
    import axios from "axios";
    import GoogleSignInButton from "vue-google-signin-button-directive";

    export default {
        name: "Header",
        directives: {
            GoogleSignInButton
        },
        data() {
            return {
                clientId: "215252273042-0vtav27rr4bscbtackcqhtqhpmispcd9",
                userDropdownVisible: false
            }
        },
        computed: {
            loggedIn() {
                return this.$store.state.user.id !== undefined;
            },
            currentUser() {
                return this.$store.state.user;
            }
        },
        methods: {
            OnGoogleAuthSuccess (idToken) {
                axios.post("/backend/authenticate", {
                    id_token: idToken
                })
                    .then(response => {
                        const user = response.data;
                        this.$store.commit("user", user);
                    })
            },
            OnGoogleAuthFail (error) {
                console.log(error)
            },
            onUserIconClick() {
                this.userDropdownVisible = !this.userDropdownVisible;
            },
            goToProfile() {
                this.$router.push({
                    name: "Member",
                    params: {
                        id: this.currentUser.id
                    }
                });
                this.userDropdownVisible = false;
            },
            onSignOut() {
                this.$store.commit("user", {});
                this.userDropdownVisible = false;
                this.$router.push({
                    name: "Home"
                });
            }
        }
    }
</script>

<style>
    .google-signin-button, .signout-button {
        border: none;
        outline: none;
        font-weight: bold;
        color: #fff;
        background: none;
        height: 50px;
        font-size: 16px;
        cursor: pointer;
    }

    header.home-header {
        display: flex;
        align-items: center;
        background-color: #000000;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08)
    }

    .home-header .brand-section {
        margin-left: 30px;
        margin-right: 60px;
    }

    .home-header nav {
        display: flex;
    }

    .home-header nav > a {
        color: #fff;
        display: block;
        padding: 25px 0;
    }

    .home-header nav > a.router-link-exact-active {
        border-bottom: 2px solid #fff;
    }

    .home-header nav > a:not(:last-child) {
        margin-right: 40px;
    }

    .user-section {
        margin-right: 30px;
        margin-left: auto;
    }
    
    .user-section > div {
        display: flex;
        align-items: center;
    }

    .user-avatar {
        width: 50px;
        border-radius: 50%;
        cursor: pointer;
    }

    .user-dropdown {
        padding: 6px;
        padding-top: 10px;
        position: absolute;
        top: 68px;
        right: 30px;
        z-index: 10;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.4);
    }

    .user-dropdown ul {
        padding: 6px;
    }
    
    .user-dropdown li {
        margin-bottom: 12px;
    }

    .user-dropdown li:hover {
        cursor: pointer;
    }
</style>