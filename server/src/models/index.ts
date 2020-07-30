import validateUser from './validators/user/validate-user';
import SubscriberModel from './postgres/subscriber-model';
import ProfileModel from './postgres/profile-model';
import CommentModel from './postgres/comment-model';
import ForumModel from './postgres/forum-model';
import UserModel from './postgres/user-model';
import PostModel from './postgres/post-model';
import LikeModel from './postgres/like-model';
import ISubscriber from './subscriber';
import IUserAuth from './user-auth';
import IProfile from './profile';
import IForum from './forum';
import IUser from './user';
import IPost from './post';

UserModel.hasOne(ProfileModel);
UserModel.hasMany(PostModel);
PostModel.hasMany(CommentModel);
ForumModel.hasMany(PostModel);

ProfileModel.belongsTo(UserModel);
PostModel.belongsTo(UserModel);
CommentModel.belongsTo(UserModel);
CommentModel.belongsTo(PostModel);
PostModel.belongsTo(ForumModel);

export {
    validateUser,
    SubscriberModel,
    ProfileModel,
    CommentModel,
    ForumModel,
    UserModel,
    PostModel,
    LikeModel,
    ISubscriber,
    IUserAuth,
    IProfile,
    IForum,
    IUser,
    IPost
}
