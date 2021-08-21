from string import (ascii_lowercase, ascii_uppercase, digits, punctuation,
                    whitespace)

from django.core.exceptions import ValidationError


def contain_any(target, condition_list):
    return any([i in target for i in condition_list])


class MixInSymbolValidator:
    message = "パスワードは，大小英字・数字・記号（!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~）の全種類を組み合わせて設定してください。"

    def validate(self, password, user=None):
        if not all([
            contain_any(password, ascii_lowercase),
            contain_any(password, ascii_uppercase),
            contain_any(password, digits),
            contain_any(password, punctuation),
        ]):
            raise ValidationError(self.message)

    def get_help_text(self):
        return self.message


class AsciiSymbolValidator:
    message = "パスワードに使用できるのは，半角英数字・記号（!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~）のみです。"

    def validate(self, password, user=None):
        if not password.isascii() or contain_any(password, whitespace):
            raise ValidationError(self.message)

    def get_help_text(self):
        return self.message
