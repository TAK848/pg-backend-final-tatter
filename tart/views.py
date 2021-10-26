from django.contrib.auth import get_user_model
from django.views.generic import DetailView

from .models import Tart

User = get_user_model()


class DetailTartView(DetailView):
    model = Tart
    template_name = 'tart/detail.html'
