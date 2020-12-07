import Home from "@/pages/Home.vue";
import Questions from "@/pages/Questions.vue";
import Question from "@/pages/Question.vue";
import Articles from "@/pages/Articles.vue";
import Article from "@/pages/Article.vue";
import PortfolioItem from "@/pages/PortfolioItem.vue";
import Member from "@/pages/Member.vue";
import Leaderboard from "@/pages/Leaderboard.vue";

export const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: {}
    },
    {
        path: "/forum/:topic?",
        name: "Forum",
        component: Questions,
        meta: {}
    },
    {
        path: "/questions/:id",
        name: "Question",
        component: Question,
        meta: {}
    },
    {
        path: "/articles",
        name: "Articles",
        component: Articles,
        meta: {}
    },
    {
        path: "/articles/:id",
        name: "Article",
        component: Article,
        meta: {}
    },
    {
        path: "/portfolio/:id",
        name: "PortfolioItem",
        component: PortfolioItem,
        meta: {}
    },
    {
        path: "/members/:id",
        name: "Member",
        component: Member,
        meta: {}
    },
    {
        path: "/leaderboard",
        name: "Leaderboard",
        component: Leaderboard,
        meta: {}
    },
    {
        path: "*",
        name: "Not Found",
        component: Home,
        meta: {}
    }
]