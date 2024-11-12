<script>
document.getElementById('blog-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const image = document.getElementById('image').files[0];
    const postType = document.getElementById('post-type').value;

    const post = {
        title: title,
        content: content,
        date: new Date().toLocaleString(),
        comments: [],
        image: image ? URL.createObjectURL(image) : ''
    };

    if (postType === 'blog') {
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        posts.push(post);
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    } else if (postType === 'announcement') {
        let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
        announcements.push(post);
        localStorage.setItem('announcements', JSON.stringify(announcements));
    }

    alert('포스트가 저장되었습니다!');
    document.getElementById('blog-form').reset();
    document.getElementById('image-preview').style.display = 'none';
});

function previewImage(event) {
    const imagePreview = document.getElementById('image-preview');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
    }
}
</script>