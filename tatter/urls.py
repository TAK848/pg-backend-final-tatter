from django.urls import path, re_path

from . import views

app_name = 'tatter'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('global/', views.GlobalView.as_view(), name='global'),
    path('userlist/', views.UserListView.as_view(), name='user_list'),
    re_path(r'^user/(?P<username>[\w]+)/$',
            views.UserProfileView.as_view(), name='user_profile'),
]
