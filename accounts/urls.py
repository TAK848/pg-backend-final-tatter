from django.urls import path

from . import views

app_name = 'accounts'
urlpatterns = [
    path('mypage/edit/', views.MypageView.as_view(), name='mypage_edit'),
]
