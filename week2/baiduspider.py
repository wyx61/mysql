import requests


class BaiduHotSpider:
    def __init__(self):
        self.url = "https://top.baidu.com/api/board?platform=pc&tab=realtime"
        self.headers = {
            "User-Agent": "Mozilla/5.0"
        }

    def get_top10(self):
        response = requests.get(self.url, headers=self.headers, timeout=10)
        response.encoding = "utf-8"

        data = response.json()

        hot_list = data["data"]["cards"][0]["content"]

        results = []

        for index, item in enumerate(hot_list[:10], start=1):
            title = item.get("word", "")
            hot_score = item.get("hotScore", "")
            url = item.get("url", "")

            results.append({
                "rank_no": index,
                "title": title,
                "hot_score": hot_score,
                "url": url
            })

        return results
