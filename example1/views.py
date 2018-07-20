from django.http import JsonResponse

# モデルのインポート
from .models import Log

# 一般のライブラリ
from collections import OrderedDict


def log_index_json(request, title=None):
    """ログに関するJSONデータを返す"""

    # title == "all" の場合はログ全体を取得する
    if title == "all":

        # ログ全体を取得する
        log_list = Log.objects.select_related().filter(
            user=request.user
        )

    else:
    
        # ログを取得する
        log_list = Log.objects.select_related().filter(
            user=request.user,
            title__title=title
        ).order_by("start")

    # ID で整理する
    d = OrderedDict()
    for log in log_list:
        d[str(log.id)] = {
            "title": str(log.title),
            "start": str(log.start),
            "finish": str(log.finish),
        }

    return JsonResponse(d)