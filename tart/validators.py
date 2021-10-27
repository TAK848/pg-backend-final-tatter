from django.core.exceptions import ValidationError


def linebreak_limit_tart(tart_text):
    linebreak_count = tart_text.strip().count('\n')
    if linebreak_count > 20:
        raise ValidationError(
            f'Tartは，20行以内（改行最大19回まで）で入力してください（{linebreak_count+1}行になっています）。')
