import requests
from bs4 import BeautifulSoup

class DoubanTop250Spider:
    def __init__(self):
        self.base_url = "https://movie.douban.com/top250"
        self.headers = {
            "User-Agent": "Mozilla/5.0"
        } 
    def run(self):
        top100=[]
        for j in range(0,100,25):
            url = f"https://movie.douban.com/top250?start={j}&filter="
            response = requests.get(url, headers=self.headers)
            #print(response.text)
            soup = BeautifulSoup(response.text, "html.parser")

            num=soup.find_all('em')
            links= soup.find_all('span', class_='title')
            scores = soup.find_all('span', class_='rating_num')
            movies= soup.find_all('span')
            items = soup.find_all('div', class_='bd')
            year=[];country=[];category=[]

            for i in range(len(items)):
                info = items[i].find('p').text
                lines = info.strip().split('\n')
                movie_info = lines[-1].strip()
                movie_info = movie_info.replace('\xa0', '')
                info = movie_info.split('/')

                if len(info) >= 3:
                    year.append(info[0].strip())
                    country.append(info[1].strip())
                    category.append(info[2].strip())

            # print(year, country, category)
            
            
            # print(movies)
            comments=[]
            for movie in movies:
                if '人评价' in movie.text:
                    comments.append(movie.text)
            i=0
            
            for link in links:
                if "/" not in link.text:
                    i+=1
                    top100.append({
                        "rank_no": num[i-1].text,
                        "title": link.text,
                        "score": scores[i-1].text,
                        "comment_num": comments[i-1].replace("人评价", ""),
                        "year": year[i-1],
                        "country": country[i-1],
                        "category": category[i-1]
                    })
        return top100

# if __name__ == "__main__":
#     spider = DoubanTop250Spider()
#     top100 = spider.run()
#     for item in top100:
#         print(item)
