<template>
    <div>
        <section class="banner-section">
            <div class="ask-question-button">
                <button class="main-blue-border-button" @click="onAskQuestion">
                    ASK A QUESTION
                </button>
            </div>
        </section>
        <section class="content-section">
            <div class="main-content">
                <section class="topics-section">
                    <div class="topics-heading">
                        <div class="description-1">FEATURED TOPICS</div>
                    </div>
                    <div class="topics">
                        <div class="topic description-1" v-for="topic in topics" @click="onTopicClick(topic.topic)" :key="topic.id">
                            {{topic.topic}}
                        </div>
                    </div>
                </section>
                <section class="questions-listing">
                    <section class="question" v-for="question in questions" :key="question.id"  @click="onQuestionClick(question.id)">
                        <div class="question-info">
                            <div class="question-text heading-4">
                                {{question.title}}
                            </div>
                            <div class="question-tags">
                                <div class="question-tag" v-for="tag in question.tags" :key="tag.id" @click.stop="onTopicClick(tag.tag_name)">
                                    {{tag.tag_name}}
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
            </div>
        </section>
        <a-modal
            title="Ask a question"
            :visible="askQuestionModalVisible"
            :closable="false"
            :maskClosable="false"
            @ok="onAskQuestionOk"
            @cancel="onAskQuestionCancel"
        >
            <a-form>
                <a-form-item :required="true" :label="'Title'">
                    <a-input v-model="newQuestion.title"/>
                </a-form-item>
                <a-form-item :required="true" :label="'Description'">
                    <a-textarea v-model="newQuestion.content" :rows="6"/>
                </a-form-item>
                <a-form-item :required="false" :label="'Tags'">
                    <template v-for="tag in newQuestion.metadata.tags">
                        <a-tooltip v-if="tag.length > 20" :key="tag.value" :title="tag">
                            <a-tag :key="tag.value" :closable="true" @close="() => handleTagClose(tag)">
                            {{`${tag.slice(0, 20)}...`}}
                            </a-tag>
                        </a-tooltip>
                        <a-tag v-else :key="tag" :closable="true" @close="() => handleTagClose(tag)">
                            {{tag}}
                        </a-tag>
                    </template>
                    <a-input
                        v-if="inputVisible"
                        ref="input"
                        type="text"
                        size="small"
                        :style="{ width: '78px' }"
                        :value="newTagText"
                        @change="handleNewTagTextChange"
                        @keyup.enter="handleNewTagTextConfirm"
                    />
                    <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
                        <a-icon type="plus" /> New Tag
                    </a-tag>
                </a-form-item>
                <a-form-item :required="false" :label="'Images'">
                    <b-form-file v-model="currentImages" plain multiple v-on:change="saveImage($event)"></b-form-file>
                    <div v-for="(doc, index) in newQuestion.metadata.images" :key="index">
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
        name: "Questions",
        data() {
            return {
                questions: [],
                topics: [],
                askQuestionModalVisible: false,
                newQuestion: {
                    title: "",
                    content: "",
                    metadata: {
                        images: [],
                        tags: []
                    }
                },
                currentImages: [],
                newTagText: "",
                inputVisible: false
            }
        },
        computed: {
            currentUser() {
                return this.$store.state.user;
            }
        },
        methods: {
            fetchData() {
                this.fetchQuestions();
                this.fetchTopics();
            },
            fetchQuestions() {
                let url = "";
                let payload;

                const tag = this.$route.params.topic;
                if(tag) {
                    url = "backend/api/v1/questions/tags";
                    payload = [tag]
                } else {
                    url = "backend/api/v1/questions/search";
                    payload = {
                        "includes": "likes,tags",
                        "sort_by": "id:DESC"
                    };
                }

                axios.post(url, payload)
                    .then(response => {
                        let questionsData = [];
                        if(tag) {
                            questionsData = response.data.content;
                        } else {
                            questionsData = response.data.questions;
                        }
                        if(questionsData.length > 4) {
                            questionsData.length = 4;
                        }
                        this.questions = questionsData;
                    });
            },
            fetchTopics() {
                axios.post("/backend/api/v1/tags/search", {
                    "entity": "QUESTION",
                    "sort_by": "id:DESC"
                })
                    .then(response => {
                        let topicData = response.data.tag_list;
                        let topicExistence = {};
                        let finalTopicList = [];
                        topicData.forEach(topic => {
                            if(!topicExistence[topic.tag_name]) {
                                topicExistence[topic.tag_name] = true;
                                finalTopicList.push({
                                    id: topic.id,
                                    topic: topic.tag_name
                                });
                            }
                        });
                        if(finalTopicList.length > 10) {
                            finalTopicList.length = 10;
                        }
                        this.topics = finalTopicList;
                    })
                
            },
            onAskQuestion() {
                this.askQuestionModalVisible = true;
            },
            onAskQuestionOk() {
                this.askQuestionModalVisible = false;
                const tags = this.newQuestion.metadata.tags.map(tag => ({
                    entity: "QUESTION",
                    tag_name: tag
                }));
                const payload = {
                    title: this.newQuestion.title,
                    content: this.newQuestion.content,
                    user: {
                        id: this.currentUser.id
                    },
                    tags: tags,
                    metadata: {
                        images: this.newQuestion.metadata.images
                    }
                }
                axios.post("/backend/api/v1/questions", payload)
                    .then(response => {
                        this.fetchData();
                    })
            },
            onAskQuestionCancel() {
                this.askQuestionModalVisible = false;
            },
            onTopicClick(topic) {
                if(this.$route.params.topic === topic) {
                    return;
                }
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
            onAuthorClick(id) {
                this.$router.push({
                    name: "Member",
                    params: {
                        id
                    }
                });
            },
            onFilesChange(info) {
            },
            saveImage(event) {
                const self = this;
                this.uploadFile(event)
                    .then(documents => {
                        let updatedImages = [...this.newQuestion.metadata.images];
                        for(let doc of documents) {
                            doc.file_label = "Image";
                            updatedImages.push(doc);
                            self.currentImages = [];
                        }
                        this.newQuestion.metadata.images = updatedImages;
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
            showInput() {
                const self = this;
                self.inputVisible = true;
                self.$nextTick(function() {
                    self.$refs.input.focus();
                });
            },
            handleTagClose(removedTag) {
                let updatedValue = this.newQuestion.metadata.tags? [...this.newQuestion.metadata.tags]: [];
                updatedValue = updatedValue.filter(tag => tag !== removedTag);
                this.handleChange(updatedValue);
            },
            handleNewTagTextChange(e) {
                this.newTagText = e.target.value;
            },
            handleNewTagTextConfirm() {
                const newTagText = this.newTagText;
                let updatedValue = this.newQuestion.metadata.tags? [...this.newQuestion.metadata.tags]: [];
                updatedValue = [
                    ...updatedValue,
                    newTagText
                ];
                Object.assign(this, {
                    inputVisible: false,
                    newTagText: '',
                });
                this.newQuestion.metadata.tags = updatedValue;
            }
        },
        watch: {
            "$route.params": {
                immediate: true,
                handler: function(){
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
    .banner-section {
        background-image: url('~@/assets/forum try 1.jpeg');
        height: 400px;
        position: relative;
        background-repeat: no-repeat;
        background-size: cover;
        background-position-y: -600px;
    }

    .ask-question-button {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 50%;
        transform: translate(50%, 50%)
    }

    .content-section {
        margin-top: 75px;
    }

    .main-content {
        display: flex;
        padding: 0 75px;
    }

    .topics-section {
        width: 25%;
        border: 2px;
        border-color: rgba(0,0,0,0.5);
        min-height: 400px;
        height: fit-content;
    }

    .topics-heading {
        margin-bottom: 20px;
    }

    .topic:hover {
        cursor: pointer;
        color: rgba(20,0,200,0.6);
    }

    .questions-listing {
        margin-left: 50px;
        width: 55%;
    }

    .question {
        display: flex;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 4px;
        padding: 20px 24px;
        margin-bottom: 40px;
        cursor: pointer;
    }

    .question-info {
        flex: 2;
    }

    .question-text, .question-tags {
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
        margin-right: 24px;
        margin-bottom: 8px;
    }

    .question-tag:hover {
        color: rgba(20,0,200,0.6);
    }

    .question-stats {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        margin-top: 6px;
    }

    .question-stat {
        margin-left: 20px;
    }

    .topics-section {
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 4px;
        padding: 20px 24px;
    }

    .topics-section .topic {
        margin-bottom: 20px;
    }

    .author-name {
        display: inline-block;
    }

    .author-name:hover {
        cursor: pointer;
        color: rgba(20,0,200,0.6);
    }
</style>