from django.urls import re_path

from . import views

app_name = 'follow'
urlpatterns = [
    re_path(r'^user/(?P<username>[\w]+)/following/',
            views.FollowingListView.as_view(), name='following'),
    re_path(r'^user/(?P<username>[\w]+)/followers/',
            views.FollowersListView.as_view(), name='followers'),
]
