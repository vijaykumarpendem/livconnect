<template>
    <div v-if="dataLoaded">
        <section class="content-section">
            <section class="bread-crumbs">
                <div>
                    <span class="bread-crumb" @click="onHomeClick">Home</span> > 
                    <span class="bread-crumb" @click="onProfileClick">Profile</span> >
                    {{portfolio.title.length>16? (portfolio.title.slice(0,16) + "..."): portfolio.title}}
                </div>
            </section>
            <section class="main-content">
                <section class="portfolio-comments-section">
                    <section class="portfolio-section">
                        <div class="portfolio">
                            <div class="portfolio-info">
                                <div class="portfolio-title heading-4">
                                    {{portfolio.title}}
                                </div>
                                <div class="portfolio-banner-image">
                                    <img
                                        :src="'backend/api/v1/fileuploads/download?file_s3_url='+portfolio.banner_image+'&file_name='"
                                    />
                                </div>
                                <div class="portfolio-description description-2">
                                    {{portfolio.content}}
                                </div>
                                <div class="portfolio-images">
                                    <div class="portfolio-image" v-for="image in portfolio.metadata.images" :key="image.file_s3_url">
                                        <img
                                            :src="'backend/api/v1/fileuploads/download?file_s3_url='+image.file_s3_url+'&file_name='+image.file_name"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="portfolio-stats">
                                <div class="portfolio-stat">
                                    <a-icon type="like" :theme="likeIconTheme" @click="onVoteClick"/>
                                    {{portfolio.likes}} 
                                    {{portfolio.likes===1 ? "VOTE": "VOTES"}}
                                </div>
                            </div>
                        </div>
                    </section>
                </section>

                <section class="additional-info-section">
                    <section class="author-section">
                        <div class="heading-4">OWNED BY</div>
                        <div class="portfolio-author">
                            <img alt="author" :src="portfolio.user.photo"/>
                        </div>
                        <div class="description-1 author-name" @click="onAuthorClick(portfolio.user.id)">
                            {{portfolio.user.first_name + " " + portfolio.user.last_name}}
                        </div>
                        <div class="description-1 author-email">{{portfolio.user.email}}</div>
                        <div class="description-1 author-points">{{portfolio.user.total_points}} Points</div>
                    </section>
                </section>
            </section>
        </section>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "PortfolioItem",
        data() {
            return {
                portfolio: {},
                portfolioLoaded: false,
                likeIconTheme: "outlined"
            }
        },
        computed: {
            dataLoaded() {
                return this.portfolioLoaded;
            },
            currentUser() {
                return this.$store.state.user;
            }
        },
        methods: {
            fetchData() {
                this.fetchPortfolio();
            },
            fetchPortfolio() {
                const portfolioId = this.$route.params.id;
                axios.get("backend/api/v1/portfolios/" + portfolioId)
                    .then(response => {
                        this.portfolio = response.data.portfolios[0];
                        this.portfolioLoaded = true;
                    });
            },
            onHomeClick() {
                this.$router.push({
                    name: "Home"
                })
            },
            onProfileClick() {
                this.$router.push({
                    name: "Member",
                    params: {
                        id: this.currentUser.id
                    }
                })
            },
            onAuthorClick() {
                this.onProfileClick();
            },
            onVoteClick() {
                const payload = {
                    entity: "PORTFOLIO",
                    entity_id: parseInt(this.$route.params.id),
                    action: "LIKE",
                    user: {
                        id: this.currentUser.id
                    }
                }
                axios.post("/backend/api/v1/actions", payload)
                    .then(response => {
                        this.likeIconTheme = "filled";
                        this.fetchData();
                    })
            }
        },
        watch: {
            "$route.params": {
                immediate: true,
                handler: function() {
                    this.fetchData();
                }
            }
        }
    }
</script>

<style scoped>
    .content-section {
        padding: 0 75px;
    }

    .bread-crumbs {
        padding: 30px 0;
    }

    .main-content {
        display: flex;
    }
    
    .portfolio-comments-section {
        flex-basis: 70%;
        margin-right: 50px;
    }

    .portfolio {
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        padding: 20px 24px;
    }

    .portfolio-description {
        margin-top: 40px;
        margin-bottom: 20px;
    }
    
    .tagged-users {
        margin-bottom: 40px;
    }

    .portfolio-title {
        margin-bottom: 40px;
        text-align: center;
    }

    .tagged-users {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .tagged-user {
        background-color: #e1e8f7;
        border-radius: 13px;
        padding: 6px 10px;
        margin-right: 12px;
        margin-left: 12px;
    }

    .portfolio-banner-image img {
        max-width: 800px;
    }

    .portfolio-images {
        display: flex;
        flex-wrap: wrap;
    }

    .portfolio-images img {
        max-width: 800px;
    }

    .portfolio-image {
        margin-right: 30px;
    }

    .portfolio-stats {
        display: flex;
        margin-top: 50px;
    }

    .portfolio-stat {
        margin-right: 20px;
    }

    .comments-section {
        background-color: #F8F8F9;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        padding: 24px;
    }

    .comment, .input-comment{
        display: flex;
    }

    .comment {
        margin-bottom: 30px;
    }

    .comment-author {
        margin-right: 12px;
    }

    .input-comment-text {
        margin-bottom: 16px;
    }

    .input-comment-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .comment-author .author-image {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }

    .comment-info, .input-comment-info {
        flex-basis: 85%;
    }

    .comment-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .additional-info-section {
        flex-basis: 30%;
    }

    .author-section {
        padding: 20px 24px;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 4px;
    }

    .author-section {
        margin-bottom: 30px;
    }

    .author-section img {
        border-radius: 50%;
    }

    .author-section * {
        text-align: center;
    }

    .portfolio-author img {
        margin-top: 20px;
        margin-bottom: 20px;
        width: 100px;
    }

    .author-name:hover, .bread-crumb:hover, .tagged-user:hover {
        cursor: pointer;
        color: rgba(20,0,200,0.6);
    }

    .author-name, .author-email, .author-points {
        margin-bottom: 20px;
    }
</style>