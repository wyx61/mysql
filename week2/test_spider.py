from mysql_helper import MySqlHelper
from baidu_spider import BaiduHotSpider


def main():
    db = MySqlHelper(
        host="localhost",
        user="root",
        password="123",
        database="baidutop10",
        port=3306
    )

    spider = BaiduHotSpider()

    print("Creating table...")
    db.create_hot_search_table()

    print("Clearing old data...")
    db.clear_hot_search_table()

    print("Crawling Baidu hot search top 10...")
    hot_searches = spider.get_top10()

    print("Saving data into MySQL...")
    for item in hot_searches:
        db.insert_hot_search(
            item["rank_no"],
            item["title"],
            item["hot_score"],
            item["url"]
        )

    print("\nLatest Baidu Hot Search Top 10:")
    records = db.select_hot_search()

    for record in records:
        rank_no, title, hot_score = record
        print(f"{rank_no}. {title}  热度：{hot_score}")


if __name__ == "__main__":
    main()
