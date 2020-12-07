<template>
    <div>
        <section class="banner-section">
            <section class="get-started-section">
                <div class="get-started-section__main-text">
                    <div class="heading-1">
                        <div>Connect, Ask & Showcase</div>
                        <div>Get inspired</div>
                    </div>
                </div>
                <div class="get-started-section__description">
                    <div class="description-1">
                        Find & showcase your creative work to the best interior design professionals
                        in the Interior Design industry.
                    </div>
                </div>
                <div class="get-started-section__action-button">
                    <button class="main-blue-border-button" @click="onGetStarted">
                        GET STARTED
                    </button>
                </div>
            </section>
        </section>
        <section class="content-section">
            <section class="entity-section">
                <section class="entity-section__intro">
                    <div class="intro-info">
                        <div class="intro-title">
                            <div class="heading-2">Design Forum</div>
                        </div>
                        <div class="intro-subtitle">
                            <div class="description-2">Get help from the Design Community</div>
                        </div>
                        <div class="intro-description">
                            <div class="heading-4">One stop solution for design dilemmas from Industry experts</div>
                        </div>
                    </div>
                    <div class="intro-action-buttons">
                        <div class="intro-action-button">
                            <button class="main-blue-border-button" @click="onAskQuestion">
                                ASK A QUESTION
                            </button>
                        </div>
                        <div class="intro-action-button">
                            <button class="main-blue-text-button" @click="onBrowseAllQuestions">
                                BROWSE ALL QUESTIONS
                            </button>
                        </div>
                    </div>
                </section>
                <section class="entity-section__detail">
                    <div class="entity-section__detail__header">
                        <div class="heading-3">
                            Recent questions
                        </div>
                        <div>
                        </div>
                    </div>
                    <div class="entity-section__detail__description">
                        <div class="questions-list">
                            <div class="question" v-for="question in questions" :key="question.id"  @click="onQuestionClick(question.id)">
                                <div class="question-info">
                                    <div class="question-text heading-4">
                                       {{question.title}}
                                    </div>
                                    <div class="question-tags-author-section">
                                        <div class="question-tags">
                                            <div class="question-tag" v-for="tag in question.tags" :key="tag.id" @click.stop="onTagClick(tag.tag_name)">
                                                {{tag.tag_name}}
                                            </div>
                                        </div>
                                        <div class="question-author">
                                            Posted by 
                                            <div class="author-name" @click.stop="onAuthorClick(1)">
                                                <span class="description-3">Vijay Kumar</span> 
                                            </div> 
                                            | {{question.created_at | timeStamp}}
                                        </div>
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
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section class="entity-section">
                <section class="entity-section__intro">
                    <div class="intro-info">
                        <div class="intro-title">
                            <div class="heading-2">Articles & Posts</div>
                        </div>
                        <div class="intro-subtitle">
                            <div class="description-2">Get help from the Design Community</div>
                        </div>
                        <div class="intro-description">
                            <div class="heading-4">Showcasing designer talent and keeping up-to-date with latest design trends.</div>
                        </div>
                    </div>
                    <div class="intro-action-buttons">
                        <div class="intro-action-button">
                            <button class="main-blue-border-button" @click="onWriteArticle">
                                WRITE AN ARTICLE
                            </button>
                        </div>
                        <div class="intro-action-button">
                            <button class="main-blue-text-button" @click="onDiscoverArticles">
                                DISCOVER ARTICLES
                            </button>
                        </div>
                    </div>
                </section>
                <section class="entity-section__detail">
                    <div class="entity-section__detail__header">
                        
                    </div>
                    <div class="entity-section__detail__description">
                        <div class="heading-3">
                            Recent articles
                        </div>
                        <div class="articles-list">
                            <div class="article" v-for="article in articles" :key="article.id" @click="onArticleClick(article.id)">
                                <div 
                                    class="article-image"
                                    :style="{
                                        'background-image':'url(backend/api/v1/fileuploads/download?file_s3_url='+article.banner_image+'&file_name='
                                    }"
                                />
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
                        </div>
                        <div class="heading-3 livspace-articles-heading">
                            Articles by Livspace
                        </div>
                        <div class="articles-list">
                            <div class="article" v-for="article in livspaceArticles" :key="article.id" @click="onArticleClick(article.id)">
                                <div 
                                    class="article-image"
                                    :style="{
                                        'background-image':'url(backend/api/v1/fileuploads/download?file_s3_url='+article.banner_image+'&file_name='
                                    }"
                                />
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
                                            {{article.comments? article.comments.length: 0}} 
                                            {{(article.comments && (article.comments.length===1))? "COMMENT": "COMMENTS"}}
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
                        </div>
                    </div>
                </section>
            </section>
        </section>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Home",
        data() {
            return {
                questions: [],
                articles: [],
                livspaceArticles: []
            }
        },
        created() {
            this.fetchQuestions();
            this.fetchArticles();
            this.fetchLivspaceArticles();
        },
        methods: {
            fetchQuestions() {
                axios.post("backend/api/v1/questions/search", {
                    "includes": "likes,tags",
                    "sort_by": "id:DESC"
                })
                    .then(response => {
                        let questionsData = response.data.questions;
                        if(questionsData.length > 4) {
                            questionsData.length = 4;
                        }
                        this.questions = questionsData;
                    })
            },
            fetchArticles() {
                axios.post("backend/api/v1/posts/search", {
                    "includes": "likes,comments",
                    "sort_by": "id:DESC"

                })
                    .then(response => {
                        let articlesData = response.data.posts;
                        if(articlesData.length > 2) {
                            articlesData.length = 2;
                        }
                        this.articles = articlesData;
                    })
                
            },
            fetchLivspaceArticles() {
                axios.post("backend/api/v1/posts/search", {
                    includes: "likes,comments",
                    sort_by: "id:DESC",
                    filters: "userId.eq:"+1
                })
                    .then(response => {
                        let articlesData = response.data.posts;
                        if(articlesData.length > 2) {
                            articlesData.length = 2;
                        }
                        this.livspaceArticles = articlesData;
                    })
                
            },
            onGetStarted() {
                this.$router.push({
                    name: "Forum"
                });
            },
            onAskQuestion() {
                this.$router.push({
                    name: "Forum"
                });
            },
            onBrowseAllQuestions() {
                this.$router.push({
                    name: "Forum"
                });
            },
            onWriteArticle() {
                this.$router.push({
                    name: "Articles"
                });
            },
            onDiscoverArticles() {
                this.$router.push({
                    name: "Articles"
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
            onArticleClick(id) {
                this.$router.push({
                    name: "Article",
                    params: {
                        id
                    }
                });
            },
            onTagClick(tag) {
                this.$router.push({
                    name: "Forum",
                    params: {
                        topic: tag
                    }
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
    .banner-section {
        background-image: url('~@/assets/society.jpg');
        background-position-y: -100px;
        height: 600px;
    }

    .get-started-section {
        width: 600px;
        background: #fff;
        position: absolute;
        left: 100px;
        top: 150px;
        padding: 25px;
        border-radius: 6px;
        box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24); 
    }

    .get-started-section > div:not(:last-child) {
        margin-bottom: 30px;
    }

    .content-section {
        margin-top: 75px;
    }

    .entity-section {
        display: flex;
        padding: 0 75px;
        margin-bottom: 75px;
    }

    .entity-section__intro {
        width: 30%;
        min-height: 450px;
        background-color: #515168;
        color: #fff;
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .intro-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .intro-title {
        margin-bottom: 14px;
    }

    .intro-subtitle {
        margin-bottom: 60px;
    }

    .intro-action-buttons button {
        width: 100%;
    }

    .intro-action-buttons .intro-action-button:not(:last-of-type) {
        margin-bottom: 20px;
    }

    .entity-section__detail {
        width: 65%;
        margin-left: 30px;
    }

    .entity-section__detail__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
    }

    .questions-list, .articles-list {
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        row-gap: 30px;
        column-gap: 30px;
    }

    .question {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 8px;
        padding-top: 20px;
        cursor: pointer;
    }

    .question-info {
        padding: 0 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex:1;
    }

    .question-text, .question-tags, .question-author, .article-title {
        margin-bottom: 20px;
    }

    .question-tags {
        display: flex;
        flex-wrap: wrap;
    }

    .question-tag {
        background-color: #e1e8f7;
        border-radius: 13px;
        padding: 6px 10px;
        margin-right: 12px;
        margin-bottom: 12px;
    }

    .question-tag:hover {
        color: rgba(20,0,200,0.6);
    }

    .question-stats {
        min-height: 56px;
        padding: 20px 24px;
        background-color: #eee;
        display: flex;
    }

    .question-stat {
        margin-right: auto;
    }

    .livspace-articles-heading {
        margin-top: 20px;
    }

    .article {
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 8px;
    }

    .article-image {
        overflow: hidden;
        height: 205px;
        background-repeat: no-repeat;
        background-position: center;
    }

    .article-info {
        padding: 24px 24px;
    }

    .article-title, .article-stats {
        margin-bottom: 20px;
    }

    .article-stats {
        display: flex;
    }
    
    .article-stat {
        margin-right: 20px;
    }

    .author-name {
        display: inline-block;
    }

    .author-name:hover {
        cursor: pointer;
        color: rgba(20,0,200,0.6);
    }
</style>