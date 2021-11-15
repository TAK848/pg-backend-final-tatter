from tatter.views import UserProfileBaseView


class UserLikeView(UserProfileBaseView):
    mode = 'profile_likes'
