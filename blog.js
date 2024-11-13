document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('blog-form')) {
        // 글 작성 폼이 존재하는 경우 (blogwrite.html)
        document.getElementById('blog-form').addEventListener('submit', async function(event) {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const image = document.getElementById('image').files[0];
            const postType = document.getElementById('post-type').value;

            // 이미지 파일을 base64 형식으로 변환
            const getBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            const post = {
                title: title,
                content: content,
                date: new Date().toLocaleString(),
                comments: [],
                image: image ? await getBase64(image) : ''
            };

            if (postType === 'blog') {
                let posts = JSON.parse(sessionStorage.getItem('blogPosts')) || [];
                posts.push(post);
                sessionStorage.setItem('blogPosts', JSON.stringify(posts));
            } else if (postType === 'announcement') {
                let announcements = JSON.parse(sessionStorage.getItem('announcements')) || [];
                announcements.push(post);
                sessionStorage.setItem('announcements', JSON.stringify(announcements));
            } else {
                alert('유효하지 않은 포스트 타입입니다.');
                return;
            }

            alert('포스트가 저장되었습니다!');
            document.getElementById('blog-form').reset();
            document.getElementById('image-preview').style.display = 'none';
        });

// 이미지 업로드 및 미리보기
function previewImage(event) {
    const reader = new FileReader();
    const imagePreview = document.getElementById('image-preview');
    
    reader.onload = function() {
        imagePreview.src = reader.result;  // 이미지를 미리보기
        imagePreview.style.display = 'block';  // 미리보기 이미지 보이게 설정
    };
    
    if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);  // 파일 읽기
    }
}


    } else {
        // blog.html에서 글과 공지사항을 불러올 때
        displayPosts();
        displayAnnouncements();
    }
});

// 블로그 글 목록 표시
function displayPosts() {
    const posts = JSON.parse(sessionStorage.getItem('blogPosts')) || [];
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

// 공지사항 목록 표시 (이미지와 댓글 추가)
function displayAnnouncements() {
    const announcements = JSON.parse(sessionStorage.getItem('announcements')) || [];
    const announcementList = document.getElementById('announcement-list');
    announcementList.innerHTML = '';

    announcements.forEach((announcement, index) => {
        const announcementDiv = document.createElement('div');
        announcementDiv.classList.add('post');

        announcementDiv.innerHTML = `
            <h3 class="post-title">${announcement.title}</h3>
            ${announcement.image ? `<img src="${announcement.image}" alt="공지사항 이미지" style="max-width: 100%; margin-top: 10px;">` : ''}
            <div class="post-content">${announcement.content}</div>
            <p><small>${announcement.date}</small></p>
            <span class="delete-button" onclick="deleteAnnouncement(${index})">삭제</span>
            <hr>
            <div class="comment-section">
                <h4>댓글</h4>
                <form id="comment-form-announcement-${index}" onsubmit="addAnnouncementComment(event, ${index})">
                    <input type="text" placeholder="댓글을 입력하세요" required>
                    <button type="submit">댓글 달기</button>
                </form>
                <div class="comments-list" id="comments-list-announcement-${index}"></div>
            </div>
        `;
        announcementList.appendChild(announcementDiv);
        displayAnnouncementComments(announcement.comments, index);
    });
}

// 블로그 댓글 추가
function addComment(event, postIndex) {
    event.preventDefault();
    const commentInput = event.target.querySelector('input');
    const comment = commentInput.value;

    let posts = JSON.parse(sessionStorage.getItem('blogPosts')) || [];
    posts[postIndex].comments.push({
        content: comment,
        date: new Date().toLocaleString()
    });
    sessionStorage.setItem('blogPosts', JSON.stringify(posts));

    commentInput.value = '';
    displayComments(posts[postIndex].comments, postIndex);
}

// 블로그 댓글 목록 표시
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

// 공지사항 댓글 추가
function addAnnouncementComment(event, announcementIndex) {
    event.preventDefault();
    const commentInput = event.target.querySelector('input');
    const comment = commentInput.value;

    let announcements = JSON.parse(sessionStorage.getItem('announcements')) || [];
    announcements[announcementIndex].comments.push({
        content: comment,
        date: new Date().toLocaleString()
    });
    sessionStorage.setItem('announcements', JSON.stringify(announcements));

    commentInput.value = '';
    displayAnnouncementComments(announcements[announcementIndex].comments, announcementIndex);
}

// 공지사항 댓글 목록 표시
function displayAnnouncementComments(comments, announcementIndex) {
    const commentsList = document.getElementById(`comments-list-announcement-${announcementIndex}`);
    commentsList.innerHTML = '';

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `<p>${comment.content} <small>${comment.date}</small></p>`;
        commentsList.appendChild(commentDiv);
    });
}

// 포스트 삭제
function deletePost(index) {
    let posts = JSON.parse(sessionStorage.getItem('blogPosts')) || [];
    posts.splice(index, 1);
    sessionStorage.setItem('blogPosts', JSON.stringify(posts));
    displayPosts();
}

// 공지사항 삭제
function deleteAnnouncement(index) {
    let announcements = JSON.parse(sessionStorage.getItem('announcements')) || [];
    announcements.splice(index, 1);
    sessionStorage.setItem('announcements', JSON.stringify(announcements));
    displayAnnouncements();
}
