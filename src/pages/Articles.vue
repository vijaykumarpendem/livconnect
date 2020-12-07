<template>
    <div>
        <section class="banner-section">
            <div class="post-article-button">
                <button class="main-blue-border-button" @click="onWriteArticle">
                    Post an Article or Project
                </button>
            </div>
        </section>
        <section class="content-section">
            <section class="main-content">
                <section class="articles-list">
                    <div class="article" v-for="article in articles" :key="article.id" @click="onArticleClick(article.id)">
                        <div class="article-image"
                            :style="{
                                'background-image':'url(backend/api/v1/fileuploads/download?file_s3_url='+article.banner_image+'&file_name='
                            }"
                        >
                        </div>
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
            </section>
        </section>
        <a-modal
            title="Write an Article"
            :visible="writeArticleModalVisible"
            :closable="false"
            @ok="onWriteArticleOk"
            @cancel="onWriteArticleCancel"
        >
            <a-form>
                <a-form-item :required="true" :label="'Title'">
                    <a-input v-model="newArticle.title"/>
                </a-form-item>
                <a-form-item :required="true" :label="'Description'">
                    <a-textarea v-model="newArticle.content" :rows="8"/>
                </a-form-item>
                <a-form-item :required="true" :label="'Banner Image'">
                    <b-form-file v-model="currentBannerImage" plain multiple v-on:change="saveBannerImage($event)"></b-form-file>
                    <div v-for="(doc, index) in newArticle.bannerImage" :key="index">
                        <span>
                            <span> {{doc.file_name | truncate}} </span>
                        </span>
                    </div>
                </a-form-item>
                <a-form-item :required="false" :label="'Tag Users'">
                    <a-select
                        mode="multiple"
                        v-model="newArticle.taggedUsers"
                        style="width: 100%"
                        placeholder="Please select"
                    >
                        <a-select-option v-for="user in allUsers" :key="user.id">
                            {{user.first_name + " " + user.last_name}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :required="false" :label="'Images'">
                    <b-form-file v-model="currentImages" plain multiple v-on:change="saveImage($event)"></b-form-file>
                    <div v-for="(doc, index) in newArticle.metadata.images" :key="index">
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
        name: "Articles",
        data() {
            return {
                articles: [],
                articleContent: "",
                writeArticleModalVisible: false,
                newArticle: {
                    title: "",
                    content: "",
                    taggedUsers: [],
                    bannerImage: [],
                    metadata: {
                        images: []
                    }
                },
                currentBannerImage: [],
                currentImages: [],
                allUsers: []
            }
        },
        computed: {
            currentUser() {
                return this.$store.state.user;
            }
        },
        methods: {
            fetchData() {
                this.fetchArticles();
                this.fetchAllUsers();
            },
            fetchArticles() {
                axios.post("backend/api/v1/posts/search", {
                    "includes": "likes,comments",
                    "sort_by": "id:DESC"
                })
                    .then(response => {
                        this.articles = response.data.posts;
                    });
            },
            fetchAllUsers() {
                axios.post("backend/api/v1/users/search", {})
                    .then(response => {
                        this.allUsers = response.data.users;
                    });
            },
            onWriteArticle() {
                this.writeArticleModalVisible = true;
            },
            onWriteArticleOk() {
                this.writeArticleModalVisible = false;
                const payload = {
                    title: this.newArticle.title,
                    content: this.newArticle.content,
                    user: {
                        id: this.currentUser.id
                    },
                    tagged_users: this.newArticle.taggedUsers.map(id => ({
                        id
                    })),
                    banner_image: this.newArticle.bannerImage[0].file_s3_url,
                    metadata: {
                        images: this.newArticle.metadata.images
                    },
                    tags: []
                }
                axios.post("/backend/api/v1/posts", payload)
                    .then(response => {
                        this.fetchData();
                    })
            },
            onWriteArticleCancel() {
                this.writeArticleModalVisible = false;
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
                        let updatedImages = [...this.newArticle.metadata.images];
                        for(let doc of documents) {
                            doc.file_label = "Image";
                            updatedImages.push(doc);
                            self.currentImages = [];
                        }
                        this.newArticle.metadata.images = updatedImages;
                    });
            },
            saveBannerImage(event) {
                const self = this;
                this.uploadFile(event)
                    .then(documents => {
                        let updatedBannerImage = [...this.newArticle.bannerImage];
                        for(let doc of documents) {
                            doc.file_label = "Banner Image";
                            updatedBannerImage.push(doc);
                            self.currentImages = [];
                        }
                        this.newArticle.bannerImage = updatedBannerImage;
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
        background-image: url('~@/assets/articles_banner2.jpg');
        height: 300px;
        position: relative;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .post-article-button {
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
        padding: 0 75px;
    }

    .articles-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        row-gap: 30px;
        column-gap: 30px;
    }

    /* .articles-list {
        display: flex;
        flex-wrap: wrap;
    } */

    .article {
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
        border-radius: 8px;
        cursor: pointer;
        margin-right: 50px;
        margin-bottom: 50px;
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

    .author-name {
        display:inline-block;
    }

    .author-name:hover {
        cursor: pointer;
        color: rgba(20,0,200,0.6);
    }

    .article-stats {
        display: flex;
    }
    
    .article-stat {
        margin-right: 20px;
    }
</style>