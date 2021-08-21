from django.urls import path

from . import views

app_name = 'accounts'
urlpatterns = [
    path('signup/', views.CustomSignupView.as_view(), name='signup'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('mypage/edit/', views.MypageView.as_view(), name='mypage_edit'),
]
