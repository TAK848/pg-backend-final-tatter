from django.urls import path

from . import views

app_name = 'follow_api'
urlpatterns = [
    path('create/', views.CreateFollowView.as_view(), name='create'),
    path('destroy/<uuid:follower_uuid>/',
         views.DestroyFollowView.as_view(), name='destroy'),
]
