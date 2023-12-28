const { Router } = require('express')
const { Response } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_NOI_DUNG } = require("../middleware/actionDefault");
const { PostController } = require('../controllers')

const svRouter = new Router();

//Post
svRouter.get("/get-list-post",
    check_permission(QUAN_LY_NOI_DUNG),
    Response(PostController.getListPost));

svRouter.get('/get-detail-post',
    check_permission(QUAN_LY_NOI_DUNG),
    Response(PostController.getDetailPost));

svRouter.post('/create-update-post',
    check_permission(QUAN_LY_NOI_DUNG),
    Response(PostController.createUpdatePost));

svRouter.post('/delete-post/:id',
    check_permission(QUAN_LY_NOI_DUNG),
    Response(PostController.deletePost));

//Post Category
svRouter.get("/get-list-post-category",
    check_permission(QUAN_LY_NOI_DUNG),
    Response(PostController.getListPostCategory));

svRouter.post('/create-update-post-category',
    check_permission(QUAN_LY_NOI_DUNG),
    Response(PostController.createUpdatePostCategory));

svRouter.post('/delete-post-category/:id',
    check_permission(QUAN_LY_NOI_DUNG),
    Response(PostController.deletePostCategory));

//Post Tag
svRouter.get("/get-list-post-tag",
    check_permission(QUAN_LY_NOI_DUNG),
    Response(PostController.getListPostTag));

svRouter.post('/create-update-post-tag',
    check_permission(QUAN_LY_NOI_DUNG),
    Response(PostController.createUpdatePostTag));

svRouter.post('/delete-post-tag/:id',
    check_permission(QUAN_LY_NOI_DUNG),
    Response(PostController.deletePostTag));

module.exports = svRouter
