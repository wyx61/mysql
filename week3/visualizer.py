import matplotlib.pyplot as plt
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False


class MovieVisualizer:

    def __init__(self, records):

        self.records = records

    def draw_score_top10(self):
        movies = []
        for record in self.records:
            rank_no = record[0]
            title = record[1]
            score = record[2]

            movies.append({
                "rank_no": rank_no,
                "title": title,
                "score": float(score)
            })

        movies = sorted(movies, key=lambda x: x["score"], reverse=True)
        top10 = movies[:10]
        titles = [movie["title"] for movie in top10]
        scores = [movie["score"] for movie in top10]
        plt.figure(figsize=(12, 6))
        plt.bar(titles, scores)
        plt.title("Douban Top100 Score Top10")
        plt.xlabel("Movie")
        plt.ylabel("Score")
        plt.xticks(rotation=45, ha="right")
        plt.ylim(8.5, 10)
        plt.tight_layout()
        plt.savefig("score_top10.png")
        plt.show()

    def draw_comment_top10(self):
        movies = []
        for record in self.records:
            rank_no = record[0]
            title = record[1]
            comment_num = record[3].replace("人评价", "")

            movies.append({
                "rank_no": rank_no,
                "title": title,
                "comment_num": int(comment_num)
            })

        movies = sorted(movies, key=lambda x: x["comment_num"], reverse=True)
        top10 = movies[:10]
        titles = [movie["title"] for movie in top10]
        comment_nums = [movie["comment_num"] for movie in top10]
        plt.figure(figsize=(12, 6))
        plt.bar(titles, comment_nums)
        plt.title("Douban Top100 Comment Number Top10")
        plt.xlabel("Movie")
        plt.ylabel("Comment Number")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.savefig("comment_top10.png")
        plt.show()

    def draw_year_distribution(self):
        movies = []
        for record in self.records:
            year = record[4][:4]  # Extract the year from the full date
            movies.append(year) 
        years = {}
        for movie in movies:
            if movie not in years:
                years[movie] = 1
            else:
                years[movie] += 1
        years = dict(sorted(years.items()))

        plt.figure(figsize=(12, 6))
        plt.bar(years.keys(), years.values())
        plt.title("Douban Top100 Year Distribution")
        plt.xlabel("Year")
        plt.ylabel("Number of Movies")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.savefig("year_distribution.png")
        plt.show()
