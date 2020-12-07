<template>
    <div v-if="dataLoaded">
        <section class="content-section">
            <section class="bread-crumbs">
                <div>
                    <span class="bread-crumb" @click="onHomeClick">Home</span> > 
                    <span class="bread-crumb" @click="onArticlesClick">Articles</span> >
                    {{article.title.length>16? (article.title.slice(0,16) + "..."): article.title}}
                </div>
            </section>
            <section class="main-content">
                <section class="article-comments-section">
                    <section class="article-section">
                        <div class="article">
                            <div class="article-info">
                                <div class="article-title heading-2">
                                    {{article.title}}
                                </div>
                                <div class="article-banner-image">
                                    <img
                                        :src="'backend/api/v1/fileuploads/download?file_s3_url='+article.banner_image+'&file_name='"
                                    />
                                </div>
                                <div class="article-description heading-4">
                                    {{article.content}}
                                </div>
                                <div class="tagged-users">
                                    <div>Tagged Users:</div>
                                    <div class="tagged-user" v-for="taggedUser in article.tagged_users" :key="taggedUser.id" @click="onUserClick(taggedUser.id)">
                                        {{taggedUser.first_name + " " + taggedUser.last_name}}
                                    </div>
                                </div>
                                <div class="article-images">
                                    <div class="article-image" v-for="image in article.metadata.images" :key="image.file_s3_url">
                                        <img
                                            :src="'backend/api/v1/fileuploads/download?file_s3_url='+image.file_s3_url+'&file_name='+image.file_name"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="article-stats">
                                <div class="article-stat">
                                    <a-icon type="like" :theme="likeIconTheme" @click="onVoteClick"/>
                                    {{article.likes}} 
                                    {{article.likes===1 ? "VOTE": "VOTES"}}
                                    </div>
                                <div class="article-stat">
                                    {{article.comments? article.comments.length: 0}} 
                                    {{(article.comments && (article.comments.length===1))? "COMMENT": "COMMENTS"}}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="comments-section">
                        <div class="comment" v-for="comment in article.comments" :key="comment.id">
                            <div class="comment-author">
                                <img class="author-image" alt="author-image" :src="comment.user.photo"/>
                            </div>
                            <div class="comment-info">
                                <div class="comment-header">
                                    <div class="author-name">
                                        <div class="description-1" @click="onAuthorClick(comment.user.id)">
                                            {{comment.user.first_name + " " + comment.user.last_name}}
                                        </div>
                                    </div>
                                    <div class="comment-timestamp">
                                        {{comment.created_at | timeStamp}}
                                    </div>
                                </div>
                                <div class="comment-content">
                                    <div class="comment-text">
                                        {{comment.content}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="input-comment">
                            <div class="comment-author">
                                <img class="author-image" alt="author-image" :src="currentUser.photo"/>
                            </div>
                            <div class="input-comment-info">
                                <div class="input-comment-content">
                                    <a-textarea v-model="newComment" :rows="4" class="input-comment-text"/>
                                    <div class="input-comment-footer">
                                        <a-button @click="onSubmitComment">Submit</a-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>

                <section class="additional-info-section">
                    <section class="author-section">
                        <div class="heading-4">POSTED BY</div>
                        <div class="article-author">
                            <img alt="author" :src="article.user.photo"/>
                        </div>
                        <div class="description-1 author-name" @click="onAuthorClick(article.user.id)">
                            {{article.user.first_name + " " + article.user.last_name}}
                        </div>
                        <div class="description-1 author-email">{{article.user.email}}</div>
                        <div class="description-1 author-points">{{article.user.total_points}} Points</div>
                    </section>
                    <section class="similar-articles">
                        <div class="description-1">Similar Articles</div>
                        <ol class="similar-articles-list">
                            <li class="similar-article" v-for="article in similarArticles" :key="article.id" @click="onArticleClick(article.id)">
                               {{article.title}}
                            </li>
                        </ol>
                    </section>
                </section>
            </section>
        </section>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Article",
        data() {
            return {
                article: {},
                similarArticles: [],
                articleLoaded: false,
                similarArticlesLoaded: false,
                newComment: "",
                likeIconTheme: "outlined"
            }
        },
        computed: {
            dataLoaded() {
                return this.articleLoaded && this.similarArticlesLoaded;
            },
            currentUser() {
                return this.$store.state.user;
            }
        },
        methods: {
            fetchData() {
                this.fetchArticle();
                this.fetchSimilarArticles();
            },
            fetchArticle() {
                const articleId = this.$route.params.id;
                axios.get("backend/api/v1/posts/" + articleId)
                    .then(response => {
                        this.article = response.data.posts[0];
                        this.articleLoaded = true;
                    });
            },
            fetchSimilarArticles() {
                axios.post("backend/api/v1/posts/search", {})
                    .then(response => {
                        const self = this;
                        this.similarArticles = response.data.posts;
                        this.similarArticles = this.similarArticles.filter(item => item.id!=self.$route.params.id);
                        this.similarArticlesLoaded = true;
                    });
            },
            onAuthorClick(id) {
                this.$router.push({
                    name: "Member",
                    params: {
                        id
                    }
                });
            },
            onArticleClick(id) {
                if(this.$route.params.id == id) {
                    return;
                }
                this.$router.push({
                    name: "Article",
                    params: {
                        id
                    }
                });
            },
            onHomeClick() {
                this.$router.push({
                    name: "Home"
                });
            },
            onArticlesClick() {
                this.$router.push({
                    name: "Articles"
                });
            },
            onUserClick(id) {
                this.$router.push({
                    name: "Member",
                    params: {
                        id
                    }
                })
            },
            onSubmitComment() {
                const payload = {
                    entity: "POST",
                    entity_id: parseInt(this.$route.params.id),
                    action: "COMMENT",
                    user: {
                        id: this.currentUser.id
                    },
                    content: this.newComment
                };
                axios.post("/backend/api/v1/actions", payload)
                    .then(response => {
                        this.newComment = "";
                        this.fetchData();
                    });
            },
            onVoteClick() {
                const payload = {
                    entity: "POST",
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
        },
        filters: {
            timeStamp(time) {
                var d = new Date(time),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;

                return [year, month, day].join('-');
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
    
    .article-comments-section {
        flex-basis: 70%;
        margin-right: 50px;
    }

    .article {
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        padding: 20px 24px;
    }

    .article-description {
        margin-top: 40px;
        margin-bottom: 20px;
    }
    
    .tagged-users {
        margin-bottom: 40px;
    }

    .article-title {
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

    .article-banner-image img {
        max-width: 800px;
    }

    .article-images {
        display: flex;
        flex-wrap: wrap;
    }

    .article-images img {
        max-width: 800px;
    }

    .article-image {
        margin-right: 30px;
    }

    .article-stats {
        display: flex;
        margin-top: 50px;
    }

    .article-stat {
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
    }

    .additional-info-section {
        flex-basis: 30%;
    }

    .author-section, .similar-articles {
        padding: 20px 24px;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 4px;
    }

    .author-section {
        margin-bottom: 30px;
    }

    .author-section * {
        text-align: center;
    }

    .article-author img {
        margin-top: 20px;
        margin-bottom: 20px;
        width: 100px;
        border-radius: 50%;
    }

    .author-name:hover, .similar-article:hover, .bread-crumb:hover, .tagged-user:hover {
        cursor: pointer;
        color: rgba(20,0,200,0.6);
    }

    .author-name, .author-email, .author-points {
        margin-bottom: 20px;
    }

    .similar-articles-list {
        margin-top: 20px;
        list-style: decimal;
    }

    .similar-articles-list > li {
        margin-bottom: 20px;
        margin-left: 16px;
    }
</style>