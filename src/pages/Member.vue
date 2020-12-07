<template>
    <div class="profile-page" v-if="dataLoaded">
        <section class="content-section">
            <section class="author-section">
                <div class="author">
                    <img alt="author" :src="user.photo"/>
                </div>
                <div class="description-1" @click="onAuthorClick(user.id)">
                    {{user.first_name + " " + user.last_name}}
                </div>
                <div class="description-1">{{user.email}}</div>
                <div class="description-1">{{user.total_points}} Points</div>
            </section>
            <section class="profile-section">
                <a-tabs default-active-key="1" :animated="false" :size="'large'">
                    <a-tab-pane key="1" tab="PORTFOLIO" class="tab-content">
                        <div class="portfolios-header">
                            <a-button @click="onAddToPortfolio">
                                Add to Portfolio
                            </a-button>
                        </div>
                        <section class="portfolios-list">
                            <div class="portfolio" v-for="portfolio in portfolios" :key="portfolio.id" @click="onPortfolioClick(portfolio.id)">
                                <div class="portfolio-image"
                                    :style="{
                                        'background-image':'url(backend/api/v1/fileuploads/download?file_s3_url='+portfolio.banner_image+'&file_name='
                                    }"
                                >
                                </div>
                                <div class="portfolio-info">
                                    <div class="portfolio-title heading-5">
                                        {{portfolio.title}}
                                    </div>
                                    <div class="portfolio-stats">
                                        <div class="portfolio-stat">
                                            {{portfolio.likes}} 
                                            {{portfolio.likes===1? "VOTE": "VOTES"}}
                                        </div>
                                    </div>
                                    <div class="portfolio-author">
                                        Posted by 
                                        <div class="author-name" @click.stop="onAuthorClick(portfolio.user.id)">
                                            <span class="description-3">{{portfolio.user.first_name + " " + portfolio.user.last_name}}</span> 
                                        </div>
                                        | {{portfolio.created_at | timeStamp}}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="ARTICLES" class="tab-content">
                        <section class="articles-list">
                            <div class="article" v-for="article in articles" :key="article.id" @click="onArticleClick(article.id)">
                                <div
                                    class="article-image"
                                    :style="{
                                        'background-image':'url(backend/api/v1/fileuploads/download?file_s3_url='+article.banner_image+'&file_name='
                                    }">
                                </div>
                                <div class="article-info">
                                    <div class="article-title heading-5">
                                        {{article.title}}
                                    </div>
                                    <div class="article-stats">
                                        <div class="article-stat">
                                            {{article.likes}} 
                                            {{article.likes===1? "VOTE": "VOTES"}}
                                        </div>
                                        <div class="article-stat">
                                            {{article.comment_count}} 
                                            {{(article.comment_count)? "COMMENT": "COMMENTS"}}
                                        </div>
                                    </div>
                                    <div class="article-author">
                                        Posted by 
                                        <div class="author-name" @click.stop="onAuthorClick(article.user.id)">
                                            <span class="description-3">{{article.user.first_name + " " + article.user.last_name}}</span> 
                                        </div>
                                        | {{article.created_at | timeStamp}}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="QUESTIONS" class="tab-content">
                        <div class="heading-4">
                            Asked these questions:
                        </div>
                        <section class="questions-listing">
                            <section class="question" v-for="question in questions" :key="question.id"  @click="onQuestionClick(question.id)">
                                <div class="question-info">
                                    <div class="question-text heading-4">
                                        {{question.title}}
                                    </div>
                                    <div class="question-tags">
                                        <div class="question-tag" v-for="tag in question.tags" :key="tag" @click.stop="onTopicClick(tag)">
                                            {{tag}}
                                        </div>
                                    </div>
                                    <div class="question-author">
                                        Posted by 
                                        <div class="author-name" @click.stop="onAuthorClick(question.user.id)">
                                            <span class="description-3">{{question.user.first_name + " " + question.user.last_name}}</span> 
                                        </div> 
                                        | {{question.created_at | timeStamp}}
                                    </div>
                                </div>
                                <div class="question-stats">
                                    <div class="question-stat">
                                        {{question.likes===null? "N/A": question.likes}} 
                                        {{question.likes===1 ? "VOTE": "VOTES"}}
                                    </div>
                                    <div class="question-stat">
                                        {{question.answers? question.answers.length: 0}} 
                                        {{(question.answers && (question.answers.length===1))? "ANSWER": "ANSWERS"}}
                                    </div>
                                </div>
                            </section>
                        </section>
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="TAGGED ARTICLES" class="tab-content">
                        <section class="articles-list">
                            <div class="article" v-for="article in taggedArticles" :key="article.id" @click="onArticleClick(article.id)">
                                <div class="article-image" :style="{'background-image':'url(' + article.banner_image + ')'}"></div>
                                <div class="article-info">
                                    <div class="article-title heading-5">
                                        {{article.title}}
                                    </div>
                                    <div class="article-stats">
                                        <div class="article-stat">
                                            {{article.likes===null? "N/A": article.likes}} 
                                            {{article.likes===1? "VOTE": "VOTES"}}
                                        </div>
                                        <div class="article-stat">
                                            {{article.comment_count}} 
                                            {{(article.comment_count===1)? "COMMENT": "COMMENTS"}}
                                        </div>
                                    </div>
                                    <div class="article-author">
                                        Posted by 
                                        <div class="author-name" @click.stop="onAuthorClick(article.user.id)">
                                            <span class="description-3">{{article.user.first_name + " " + article.user.last_name}}</span> 
                                        </div>
                                        | {{article.created_at | timeStamp}}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </a-tab-pane>
                </a-tabs>
            </section>
        </section>
        <a-modal
            title="Add to Portfolio"
            :visible="addToPortfolioModalVisible"
            :closable="false"
            :maskClosable="false"
            @ok="onAddToPortfolioOk"
            @cancel="onAddToPortfolioCancel"
        >
            <a-form>
                <a-form-item :required="true" :label="'Title'">
                    <a-input v-model="newPortfolio.title"/>
                </a-form-item>
                <a-form-item :required="true" :label="'Description'">
                    <a-textarea v-model="newPortfolio.content" :rows="8"/>
                </a-form-item>
                <a-form-item :required="true" :label="'Banner Image'">
                    <b-form-file v-model="currentBannerImage" plain multiple v-on:change="saveBannerImage($event)"></b-form-file>
                    <div v-for="(doc, index) in newPortfolio.bannerImage" :key="index">
                        <span>
                            <span> {{doc.file_name | truncate}} </span>
                        </span>
                    </div>
                </a-form-item>
                <a-form-item :required="false" :label="'Images'">
                    <b-form-file v-model="currentImages" plain multiple v-on:change="saveImage($event)"></b-form-file>
                    <div v-for="(doc, index) in newPortfolio.metadata.images" :key="index">
                        <span>
                            <span> {{doc.file_name | truncate}} </span>
                        </span>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Member",
        data() {
            return {
                user: {},
                portfolios: [],
                articles: [],
                questions: [],
                taggedArticles: [],
                userLoaded: false,
                portfoliosLoaded: false,
                articlesLoaded: false,
                questionsLoaded: false,
                taggedArticlesLoaded: false,
                addToPortfolioModalVisible: false,
                newPortfolio: {
                    title: "",
                    content: "",
                    bannerImage: [],
                    metadata: {
                        images: []
                    }
                },
                currentBannerImage: [],
                currentImages: []
            }
        },
        computed: {
            dataLoaded() {
                return this.userLoaded && this.portfoliosLoaded && this.articlesLoaded && this.questionsLoaded && this.taggedArticlesLoaded;
            },
            currentUser() {
                return this.$store.state.user;
            }
        },
        methods: {
            fetchUser() {
                const userId = this.$route.params.id;
                axios.get("/backend/api/v1/users/" + userId)
                    .then(response => {
                        this.user = response.data.users[0];
                        this.userLoaded = true;
                    })
            },
            fetchPortfolios() {
                const userId = this.$route.params.id;
                axios.post("/backend/api/v1/portfolios/search", {
                    includes: "likes,comments",
                    sort_by: "id:DESC",
                    filters: "userId.eq:"+userId
                })
                    .then(response => {
                        this.portfolios = response.data.portfolios;
                        this.portfoliosLoaded = true;
                    })
            },
            fetchArticles() {
                const userId = this.$route.params.id;
                axios.post("/backend/api/v1/posts/search", {
                    "includes": "likes,comments",
                    "sort_by": "id:DESC",
                    filters: "userId.eq:"+userId
                })
                    .then(response => {
                        this.articles = response.data.posts;
                        this.articlesLoaded = true;
                    })
            },
            fetchQuestions() {
                const userId = this.$route.params.id;
                axios.post("/backend/api/v1/questions/search", {
                    includes: "likes",
                    filters: "userId.eq:"+userId
                })
                    .then(response => {
                        this.questions = response.data.questions;
                        this.questionsLoaded = true;
                    });
            },
            fetchTaggedArticles() {
                this.taggedArticles = this.currentUser.posts;
                this.taggedArticlesLoaded = true;
            },
            onPortfolioClick(id) {
                this.$router.push({
                    name: "PortfolioItem",
                    params: {
                        id
                    }
                });
            },
            onArticleClick(id) {
                this.$router.push({
                    name: "Article",
                    params: {
                        id
                    }
                });
            },
            onAuthorClick(id) {
                if(parseInt(this.$route.params.id) === id) {
                    return;
                }
                this.$router.push({
                    name: "Member",
                    params: {
                        id
                    }
                });
            },
            onTopicClick(topic) {
                this.$router.push({
                    name: "Forum",
                    params: {
                        topic
                    }
                });
            },
            onQuestionClick(id) {
                this.$router.push({
                    name: "Question",
                    params: {
                        id
                    }
                });
            },
            saveImage(event) {
                const self = this;
                this.uploadFile(event)
                    .then(documents => {
                        let updatedImages = [...this.newPortfolio.metadata.images];
                        for(let doc of documents) {
                            doc.file_label = "Image";
                            updatedImages.push(doc);
                            self.currentImages = [];
                        }
                        this.newPortfolio.metadata.images = updatedImages;
                    });
            },
            saveBannerImage(event) {
                const self = this;
                this.uploadFile(event)
                    .then(documents => {
                        let updatedBannerImage = [...this.newPortfolio.bannerImage];
                        for(let doc of documents) {
                            doc.file_label = "Banner Image";
                            updatedBannerImage.push(doc);
                            self.currentImages = [];
                        }
                        this.newPortfolio.bannerImage = updatedBannerImage;
                    });
            },
            uploadFile(event) {
                let files = event.target.files;
                let formData = new FormData();
                for(var i= 0; i < files.length; i++) {
                    formData.append('file', files[i], files[i].name);
                }
                return axios.post("backend/api/v1/fileuploads/upload?upload_class=DOCUMENTS", formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then(response => {
                            return response.data;
                        }).catch(() => {
                            alert("Error in uploading the document(s)");
                        });
            },
            onAddToPortfolio() {
                this.addToPortfolioModalVisible = true;
            },
            onAddToPortfolioOk() {
                this.addToPortfolioModalVisible = false;
                const payload = {
                    title: this.newPortfolio.title,
                    content: this.newPortfolio.content,
                    user: {
                        id: this.currentUser.id
                    },
                    banner_image: this.newPortfolio.bannerImage[0].file_s3_url,
                    metadata: {
                        images: this.newPortfolio.metadata.images
                    }
                }
                axios.post("/backend/api/v1/portfolios", payload)
                    .then(response => {
                        this.fetchData();
                    })
            },
            onAddToPortfolioCancel() {
                this.addToPortfolioModalVisible = false;
            },
            fetchData() {
                this.fetchUser();
                this.fetchPortfolios();
                this.fetchArticles();
                this.fetchQuestions();
                this.fetchTaggedArticles();
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
            },
            truncate(value) {
                if(!value)  return null;
                return value.length < 15 ? value : value.slice(0, 12) + "...";
            }
        }
    }
</script>

<style>
    .profile-page .content-section {
        display: flex;
        padding: 75px;
    }

    .profile-page .author-section {
        flex-basis: 20%;
    }

    .profile-page .profile-section {
        flex-basis: 75%;
    }

    .profile-page .author-section {
        text-align: center;
        padding: 20px 24px;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 4px;
        height: 300px;
    }

    .profile-page .author-section * {
        text-align: center;
    }

    .profile-page .author-section .question-author {
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .profile-page .author-section img {
        width: 100px;
        border-radius: 50%;
    }

    .profile-page .author-section div {
        margin-bottom: 20px;
    }

    .profile-page .profile-section {
        margin-left: 50px;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 4px;
    }

    .profile-page .ant-tabs-nav {
        margin-left: 150px;
    }

    .profile-page .tab-content {
        padding: 20px 50px 50px 50px;
    }

    /* .profile-page .articles-list, .profile-page .portfolios-list {
        display: grid;
        grid-template-columns: auto auto auto;
        row-gap: 30px;
        column-gap: 30px;
    } */

    .profile-page .articles-list, .profile-page .portfolios-list {
        display: flex;
        flex-wrap: wrap;
    }

    .profile-page .article, .profile-page .portfolio {
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 8px;
        cursor: pointer;
        margin-right: 50px;
        margin-bottom: 50px;
    }

    .profile-page .article-image, .profile-page .portfolio-image{
        overflow: hidden;
        height: 205px;
        background-repeat: no-repeat;
        background-position: center;
    }

    .profile-page .article-info, .profile-page .portfolio-info {
        padding: 24px 24px;
    }

    .profile-page .article-title, .profile-page .article-stats, .profile-page .portfolio-title, .profile-page .portfolio-stats {
        margin-bottom: 20px;
    }

    .profile-page .portfolios-header {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
    }

    .profile-page .author-name {
        display:inline-block;
    }

    .profile-page .author-name:hover {
        cursor: pointer;
        color: rgba(20,0,200,0.6);
    }

    .profile-page .article-stats, .profile-page .portfolio-stats {
        display: flex;
    }
    
    .profile-page .article-stat, .profile-page .portfolio-stat {
        margin-right: 20px;
    }

    .profile-page .questions-listing {
        margin-top: 30px;
    }

    .profile-page .question {
        display: flex;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 4px;
        padding: 20px 24px;
        margin-bottom: 40px;
        cursor: pointer;
    }

    .profile-page .question-info {
        flex: 2;
    }

    .profile-page .question-text, .question-tags {
        margin-bottom: 20px;
    }

    .profile-page .question-tags {
        display: flex;
        flex-wrap: wrap;
    }

    .profile-page .question-tag {
        background-color: #e1e8f7;
        border-radius: 13px;
        padding: 6px 10px;
        margin-right: 24px;
    }

    .profile-page .question-tag:hover {
        color: rgba(20,0,200,0.6);
    }

    .profile-page .question-stats {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        margin-top: 6px;
    }

    .profile-page .question-stat {
        margin-left: 20px;
    }
</style>