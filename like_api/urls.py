from django.urls import path

from . import views

app_name = 'like_api'
urlpatterns = [
    path('create/', views.CreateLikeView.as_view(), name='create'),
    path('destroy/<slug:tart_id>/',
         views.DestroyLikeView.as_view(), name='destroy'),
]
