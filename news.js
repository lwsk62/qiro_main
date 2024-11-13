const newsApiKey = 'b855106bf5e97e7921f47f1595afd311'; // 발급받은 GNews API 키를 입력하세요.

function fetchNews() {
    const url = `https://gnews.io/api/v4/top-headlines?country=kr&token=${newsApiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('news-container');
            newsContainer.innerHTML = ''; // 기존 내용 지우기
            
            // 조회수가 가장 많은 최신 뉴스 3개 가져오기
            const topArticles = data.articles.slice(0, 3);
            topArticles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.classList.add('news-article');
                articleElement.innerHTML = `
                    <div class="article-image">
                        <img src="${article.image}" alt="${article.title}" />
                    </div>
                    <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
                    <p>${article.description}</p>
                `;
                newsContainer.appendChild(articleElement);
            });

            // 나머지 뉴스 기사를 가져와서 아래에 추가
            data.articles.slice(3).forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.classList.add('news-article');
                articleElement.innerHTML = `
                    <div class="article-image">
                        <img src="${article.image}" alt="${article.title}" />
                    </div>
                    <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
                    <p>${article.description}</p>
                `;
                newsContainer.appendChild(articleElement);
            });
        })
        .catch(error => console.error('뉴스 가져오는 중 오류 발생:', error));
}

// 페이지가 로드될 때 뉴스 데이터를 가져옵니다.
window.onload = function() {
    fetchNews();
};