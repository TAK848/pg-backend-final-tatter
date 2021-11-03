from django.views.generic import DetailView

from .models import Tart


class DetailTartView(DetailView):
    model = Tart
    template_name = 'tart/detail.html'
