from django.urls import path

from . import views

app_name = 'tart_api'
urlpatterns = [
    path('compose/', views.CreateTartView.as_view(), name='compose'),
    path('delete/<slug:pk>/', views.DeleteTartView.as_view(), name='delete'),
    path('update/<slug:pk>/', views.UpdateTartView.as_view(), name='update'),
    path('list/', views.ListTartView.as_view(), name='list'),
    path('check-update/', views.CheckUpdateView.as_view(), name='check_update'),
    path('<slug:pk>/', views.RetrieveTartView.as_view(), name='retrieve'),
]
