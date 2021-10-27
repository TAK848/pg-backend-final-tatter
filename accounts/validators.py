from django.core.exceptions import ValidationError


def linebreak_limit_biography(biography):
    linebreak_count = biography.strip().count('\n')
    if linebreak_count > 5:
        raise ValidationError(
            f'自己紹介は，5行以内（改行最大4回まで）で入力してください。（{linebreak_count+1}行になっています。）')
