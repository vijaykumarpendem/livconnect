<template>
    <div>
        <section class="banner-section">
        </section>
        <section class="content-section">
            <section class="main-content">
                <section class="user-list-section">
                    <div class="heading-3 user-list-heading">Top Designers</div>
                    <div class="user-list">
                        <div class="user user-1">
                            <div class="user-info user-1-info">
                                <img 
                                    class="user-image user-1-image"
                                    :src="users[0].photo"
                                />
                                <div class="user-additional-info users-1-additional-info">
                                    <div class="user-name heading-4" @click="onAuthorClick(users[0].id)">
                                        {{users[0].first_name + " " + users[0].last_name}}
                                    </div>
                                    <div class="heading-4">{{users[0].total_points}} Points</div>
                                </div>
                            </div>
                        </div>
                        <div class="user user-2">
                            <div class="user-info user-2-info">
                                <img 
                                    class="user-image user-2-image"
                                    :src="users[1].photo"
                                />
                                <div class="user-additional-info user-2-additional-info">
                                    <div class="user-name heading-4" @click.stop="onAuthorClick(users[1].id)">
                                        {{users[1].first_name + " " + users[1].last_name}}
                                    </div>
                                    <div class="heading-4">{{users[1].total_points}} Points</div>
                                </div>
                            </div>
                        </div>
                        <div class="user user-3">
                            <div class="user-info user-3-info">
                                <img 
                                    class="user-image user-3-image"
                                    :src="users[2].photo"
                                />
                                <div class="user-additional-info user-3-additional-info">
                                    <div class="user-name heading-4" @click.stop="onAuthorClick(users[2].id)">
                                        {{users[2].first_name + " " + users[2].last_name}}
                                    </div>
                                    <div class="heading-4">{{users[2].total_points}} Points</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="guidelines-section">
                    <div class="heading-3 guidelines-heading">Points System</div>
                    <div class="guidelines">
                        <ul>
                            <li class="description-1">To post an article, you need a minimum of 10 points</li>
                            <li class="description-1">
                                This is how you get points
                                <ul class="get-points-menu {
                                    ">
                                    <li>Portfolio 1 like=1 point</li>
                                    <li>Question 1 like = 2 points</li>
                                    <li>Post 1 like = 1 point</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>
            </section>
        </section>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Leaderboard",
        data() {
            return {
                users: []
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                axios.post("/backend/api/v1/users/search", {
                    sort_by: "totalPoints:DESC"
                })
                    .then(response => {
                        let userList = response.data.users.filter(user => user.id!==1);
                        this.users = userList;
                    });
            },
            onAuthorClick(id) {
                this.$router.push({
                    name: "Member",
                    params: {
                        id
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .content-section {
        padding: 0 75px;
        margin-top: 75px;
    }

    .banner-section {
        height: 350px;
        background-repeat: no-repeat;
        background-size: cover;
        background-image: url('~@/assets/leaderboard try 1.jpeg');
        background-position-y: -357px;
    }

    .main-content {
        width: 60%;
        margin: 0 auto;
    }

    .user-list-section, .guidelines-section {
        margin-bottom: 20px;
    }

    .user-list-heading, .guidelines-heading {
        margin-bottom: 20px;
    }

    .user-list {
        display: flex;
        align-items: baseline;
        justify-content: space-around;
        height: 300px;
    }

    .user div {
        text-align: center;
    }

    .user-1 {
        order: 2;
    }

    .user-2 {
        align-self: center;
        order: 1;
    }

    .user-3 {
        align-self: flex-end;
        order: 3;
    }

    .user-name:hover {
        cursor: pointer;
        color: rgba(20,0,200,0.6);
    }

    .user-image {
        width: 80px;
        border-radius: 50%;
        background-size: cover;
    }

    .user-list {
        display: flex;
    }

    .guidelines-section ul {
        list-style: devanagari !important;
        margin-left: 20px;
    }

    .get-points-menu {
        margin-top: 16px;
    }

    .guidelines-section li {
        margin-bottom: 12px;
    }
</style>