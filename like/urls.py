from django.urls import re_path

from . import views

app_name = 'like'
urlpatterns = [
    re_path(r'^user/(?P<username>[\w]+)/likes/$',
            views.UserLikeView.as_view(), name='user_likes'),
]
