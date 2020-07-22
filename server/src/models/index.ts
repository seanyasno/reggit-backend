import validateUser from './validators/user/validate-user';
import ProfileModel from './postgres/profile-model';
import CommentModel from './postgres/comment-model';
import ForumModel from './postgres/forum-model';
import UserModel from './postgres/user-model';
import PostModel from './postgres/post-model';
import LikeModel from './postgres/like-model';
import IUserAuth from './user-auth';
import IProfile from './profile';
import IForum from './forum';
import IUser from './user';
import IPost from './post';

UserModel.hasOne(ProfileModel);
UserModel.hasMany(PostModel);
PostModel.hasMany(CommentModel);

ProfileModel.belongsTo(UserModel);
PostModel.belongsTo(UserModel);
CommentModel.belongsTo(UserModel);
CommentModel.belongsTo(PostModel);

export {
    validateUser,
    ProfileModel,
    CommentModel,
    ForumModel,
    UserModel,
    PostModel,
    LikeModel,
    IUserAuth,
    IProfile,
    IForum,
    IUser,
    IPost
}
