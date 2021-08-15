from django.core.management.utils import get_random_secret_key

secret_key = get_random_secret_key()

with open('./config/local_settings.py', 'w', encoding='UTF-8') as file:
    file.write(f"SECRET_KEY = '{secret_key}'\n")
    file.write("""
# メール送信設定
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'XXXXX@gmail.com'
EMAIL_HOST_PASSWORD = 'xxxx'
""")
