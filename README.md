# pg-backend-final-tasks
## 必要な初期設定
configディレクトリ下の`local_settings.py`に，SECRET_KEYとメール送信設定を以下のように退避させています。
```
SECRET_KEY = 'xXxXxXxXxXxXxXxXxXxXxXxXxXxX'

# メール送信設定
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'xxxx@gmail.com'
EMAIL_HOST_PASSWORD = 'xxxx'

```
`generate_local_settings.py`に，SECRET_KEYを生成した上で上記の設定をまとめて生成し，`local_settings.py`を作成して記入するスクリプトを書きました。
必要に応じて仮想環境に入り，プロジェクトのルートディレクトリから，
```
python generate_local_settings.py
```
と実行してconfigディレクトリに`local_settings.py`が生成されていることを確認した上，必要に応じてメール送信設定を書き換えてください。
よろしくお願いいたします。

## オートフォーマットについて
作成したpythonファイルは，pep8に基づきオートフォーマットをかけています。ご留意の程よろしくお願い致します。
