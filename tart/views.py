from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView

from .models import Tart


class DetailTartView(LoginRequiredMixin, DetailView):
    model = Tart
    template_name = 'tart/detail.html'
