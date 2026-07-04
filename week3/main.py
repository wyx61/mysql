from douban_spider import DoubanTop250Spider
from mysql_helper import MySqlHelper
from visualizer import MovieVisualizer

def main():
    db = MySqlHelper(
    host="localhost",
    user="root",
    password="123",
    database="doubantop100",
    port=3306
    )

    spider = DoubanTop250Spider()

    print("Creating table...")
    db.create_douban_top100_table()

    print("Clearing old data...")
    db.clear_douban_top100_table()

    print("Crawling Douban Top100...")
    movies = spider.run()

    print("Saving data into MySQL...")

    for movie in movies:
        db.insert_douban_top100(
            movie["rank_no"],
            movie["title"],
            movie["score"],
            movie["comment_num"],
            movie["year"],
            movie["country"],
            movie["category"]
        )
    #查询数据库并打印
    print("Selecting data from MySQL...")
    records = db.select_douban_top100()

    print("\nDouban Top100 from database:")
    for record in records:
        rank_no, title, score, comment_num, year, country, category = record
        print(f"{rank_no}. {title}, {score}, {comment_num}, {year}, {country}, {category}")

    #生成可视化图片
    print("Creating charts...")
    visualizer = MovieVisualizer(records)
    visualizer.draw_score_top10()
    visualizer.draw_comment_top10()
    visualizer.draw_year_distribution()


if __name__ == "__main__":
    main()
