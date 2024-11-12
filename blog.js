function displayPosts() {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';

    posts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        postDiv.innerHTML = `
            <h3 class="post-title">${post.title}</h3>
            ${post.image ? `<img src="${post.image}" alt="포스트 이미지" style="max-width: 100%; margin-top: 10px;">` : ''}
            <div class="post-content">${post.content}</div>
            <p><small>${post.date}</small></p>
            <span class="delete-button" onclick="deletePost(${index})">삭제</span>
            <hr>
            <div class="comment-section">
                <h4>댓글</h4>
                <form id="comment-form-${index}" onsubmit="addComment(event, ${index})">
                    <input type="text" placeholder="댓글을 입력하세요" required>
                    <button type="submit">댓글 달기</button>
                </form>
                <div class="comments-list" id="comments-list-${index}"></div>
            </div>
        `;
        postList.appendChild(postDiv);
        displayComments(post.comments, index);
    });
}

function displayAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const announcementList = document.getElementById('announcement-list');
    announcementList.innerHTML = '';

    announcements.forEach((announcement) => {
        const announcementDiv = document.createElement('div');
        announcementDiv.classList.add('post');

        announcementDiv.innerHTML = `
            <h3 class="post-title">${announcement.title}</h3>
            <div class="post-content">${announcement.content}</div>
            <p><small>${announcement.date}</small></p>
            <hr>
        `;
        announcementList.appendChild(announcementDiv);
    });
}

function addComment(event, postIndex) {
    event.preventDefault();
    const commentInput = event.target.querySelector('input');
    const comment = commentInput.value;

    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts[postIndex].comments.push({
        content: comment,
        date: new Date().toLocaleString()
    });
    localStorage.setItem('blogPosts', JSON.stringify(posts));

    commentInput.value = '';
    displayComments(posts[postIndex].comments, postIndex);
}

function displayComments(comments, postIndex) {
    const commentsList = document.getElementById(`comments-list-${postIndex}`);
    commentsList.innerHTML = '';

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `<p>${comment.content} <small>${comment.date}</small></p>`;
        commentsList.appendChild(commentDiv);
    });
}

function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts.splice(index, 1);
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    displayPosts();
}

window.onload = function() {
    displayPosts();
    displayAnnouncements(); // 공지사항 목록을 표시하는 함수 호출
};
