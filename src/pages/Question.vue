<template>
    <div v-if="dataLoaded">
        <section class="content-section">
            <section class="bread-crumbs">
                <span class="bread-crumb" @click="onHomeClick">Home</span> > 
                <span class="bread-crumb" @click="onForumClick">Forum</span> >
                {{question.title.length>16? (question.title.slice(0,16) + "..."): question.title}}
            </section>
            <section class="main-content">
                <section class="question-answers-section">
                    <section class="question-section">
                        <div class="question">
                            <div class="question-info">
                                <div class="question-title heading-4">
                                    {{question.title}}
                                </div>
                                <div class="question-description description-2">
                                    {{question.content}}
                                </div>
                                <div class="question-tags">
                                    <div class="question-tag" v-for="tag in question.tags" :key="tag.id">
                                        {{tag.tag_name}}
                                    </div>
                                </div>
                                <div class="question-images">
                                    <div class="question-image" v-for="image in question.metadata.images" :key="image.file_s3_url">
                                        <img
                                            :src="'backend/api/v1/fileuploads/download?file_s3_url='+image.file_s3_url+'&file_name='+image.file_name"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="question-stats">
                                <div class="question-stat">
                                    <a-icon type="like" :theme="likeIconTheme" @click="onVoteClick"/>
                                    {{question.likes===null? "N/A": question.likes}} 
                                    {{question.likes===1 ? "VOTE": "VOTES"}}
                                    </div>
                                <div class="question-stat">
                                    {{question.answers? question.answers.length: 0}} 
                                    {{(question.answers && (question.answers.length===1))? "ANSWER": "ANSWERS"}}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="answers-section">
                        <div class="answer" v-for="answer in question.answers" :key="answer.id">
                            <div class="answer-author">
                                <img class="author-image" alt="author-image" :src="answer.user.photo"/>
                            </div>
                            <div class="answer-info">
                                <div class="answer-header">
                                    <div class="author-name">
                                        <div class="description-1" @click="onAuthorClick(answer.user.id)">
                                            {{answer.user.first_name + " " + answer.user.last_name}}
                                        </div>
                                    </div>
                                    <div class="answer-timestamp">
                                        {{answer.created_at | timeStamp}}
                                    </div>
                                </div>
                                <div class="answer-content">
                                    <div class="answer-text">
                                        {{answer.content}}
                                    </div>
                                    <div class="answer-images">
                                        <img alt="image-1" v-for="image in answer.metadata.images" :key="image.file_s3_url"
                                            :src="'backend/api/v1/fileuploads/download?file_s3_url='+image.file_s3_url+'&file_name='+image.file_name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="input-answer">
                            <div class="answer-author">
                                <img class="author-image" alt="author-image" :src="currentUser.photo"/>
                            </div>
                            <div class="input-answer-info">
                                <div class="input-answer-content">
                                    <a-textarea v-model="newAnswer" :rows="6" class="input-answer-text"/>
                                    <div class="input-answer-footer">
                                        <div>
                                            <b-form-file v-model="currentImages" plain multiple v-on:change="saveImage($event)"></b-form-file>
                                            <div v-for="(doc, index) in newAnswerImages" :key="index">
                                                <span>
                                                    <span> {{doc.file_name | truncate}} </span>
                                                </span>
                                            </div>
                                        </div>
                                        <a-button @click="onSubmitAnswer">Submit</a-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
                <section class="additional-info-section">
                    <section class="author-section">
                        <div class="heading-4">POSTED BY</div>
                        <div class="question-author">
                            <img alt="author" :src="question.user.photo"/>
                        </div>
                        <div class="description-1 author-name" @click="onAuthorClick(question.user.id)">
                            {{question.user.first_name + " " + question.user.last_name}}
                        </div>
                        <div class="description-1 author-email">{{question.user.email}}</div>
                        <div class="description-1 author-points">{{question.user.total_points}} Points</div>
                    </section>
                    <section class="similar-questions">
                        <div class="description-1">Similar Questions</div>
                        <ol class="similar-questions-list">
                            <li class="similar-question" v-for="question in similarQuestions" :key="question.id" @click="onQuestionClick(question.id)">
                                {{question.title}}
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
        name: "Question",
        data() {
            return {
                question: {},
                similarQuestions: [],
                questionLoaded: false,
                similarQuestionsLoaded: false,
                newAnswer: "",
                newAnswerImages: [],
                currentImages: [],
                likeIconTheme: "outlined"
            }
        },
        computed: {
            dataLoaded() {
                return this.questionLoaded && this.similarQuestionsLoaded;
            },
            currentUser() {
                return this.$store.state.user;
            }
        },
        methods: {
            fetchData() {
                this.fetchQuestion();
            },
            fetchQuestion() {
                const questionId = this.$route.params.id;
                axios.get("backend/api/v1/questions/" + questionId)
                    .then(response => {
                        this.question = response.data.questions[0];
                        this.questionLoaded = true;
                        const tags = this.question.tags.map(item => item.tag_name);
                        this.fetchSimilarQuestions(tags);
                    })
            },
            fetchSimilarQuestions(tags) {
                axios.post("backend/api/v1/questions/tags", tags)
                    .then(response => {
                        const self = this;
                        this.similarQuestions = response.data.content;
                        this.similarQuestions = this.similarQuestions.filter(item => item.id!=self.$route.params.id);
                        this.similarQuestionsLoaded = true;
                    });
            },
            onHomeClick() {
                this.$router.push({
                    name: "Home"
                });
            },
            onForumClick() {
                this.$router.push({
                    name: "Forum"
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
            saveImage(event) {
                const self = this;
                this.uploadFile(event)
                    .then(documents => {
                        let updatedImages = [...this.newAnswerImages];
                        for(let doc of documents) {
                            doc.file_label = "Image";
                            updatedImages.push(doc);
                            self.currentImages = [];
                        }
                        this.newAnswerImages = updatedImages;
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
            onSubmitAnswer() {
                const payload = {
                    content: this.newAnswer,
                    metadata: {
                        images: this.newAnswerImages
                    },
                    user: {
                        id: this.currentUser.id
                    },
                    question: {
                        id: parseInt(this.$route.params.id)
                    }
                };
                axios.post("/backend/api/v1/answers", payload)
                    .then(response => {
                        this.fetchData();
                        this.newAnswer = "";
                        this.newAnswerImages = [];
                    });
            },
            onVoteClick() {
                const payload = {
                    entity: "QUESTION",
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
            },
            onQuestionClick(id) {
                this.$router.push({
                    name: "Question",
                    params: {
                        id
                    }
                });
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

    .question-answers-section {
        flex-basis: 70%;
        margin-right: 50px;
    }

    .additional-info-section {
        flex-basis: 30%;
    }

    .question {
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        padding: 20px 24px;
    }

    .question-title, .question-description, .question-tags {
        margin-bottom: 20px;
    }

    .question-images {
        max-width: 800px;
    }

    .question-image img {
        max-width: 800px;
    }
    
    .question-tags {
        display: flex;
        flex-wrap: wrap;
    }

    .question-tag {
        background-color: #e1e8f7;
        border-radius: 13px;
        padding: 6px 10px;
        margin-right: 24px;
    }

    .question-stats {
        display: flex;
        margin-top: 50px;
    }

    .question-stat {
        margin-right: 20px;
    }

    .answers-section {
        background-color: #F8F8F9;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        padding: 24px;
    }

    .answer, .input-answer {
        display: flex;
    }

    .answer {
        margin-bottom: 30px;
    }

    .answer-author {
        margin-right: 12px;
    }

    .input-answer-text {
        margin-bottom: 16px;
    }

    .input-answer-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .answer-author .author-image {
        width: 40px;
        border-radius: 50%;
    }

    .answer-info, .input-answer-info {
        flex-basis: 85%;
    }

    .answer-header {
        display: flex;
        justify-content: space-between;
    }

    .author-section, .similar-questions {
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

    .question-author img {
        margin-top: 20px;
        margin-bottom: 20px;
        width: 100px;
        border-radius: 50%;
    }

    .similar-questions-list {
        margin-top: 20px;
        list-style: decimal;
    }

    .similar-questions-list > li {
        margin-bottom: 20px;
        margin-left: 16px;
    }

    .answer-text {
        margin-bottom: 30px;
    }

    .answer-images img {
        max-width: 300px;
    }

    .answer-images img:not(:last-child) {
        margin-right: 20px;
    }

    .author-name:hover, .similar-question:hover, .bread-crumb:hover {
        cursor: pointer;
        color: rgba(20,0,200,0.6);
    }

    .author-name, .author-email, .author-points {
        margin-bottom: 20px;
    }
</style>