from django.urls import path

from . import views

app_name = 'tart'
urlpatterns = [
    path('status/<slug:pk>/', views.DetailTartView.as_view(), name='detail'),
]
