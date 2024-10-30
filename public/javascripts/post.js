document.addEventListener("DOMContentLoaded", () => {
    const wrapperPosts = document.getElementById('wrapper-posts');
    const searchInput = document.getElementById('searchInput');

    // Fetch data for posts from API
    async function fetchPosts() {
        try {
            const response = await fetch('http://localhost:3000/api/v1/posts/get-all-post'); // Update with your actual API URL
            const posts = await response.json();

            // Check if data is available
            if (posts && posts.data) {
                displayPosts(posts.data);
            } else {
                wrapperPosts.innerHTML = '<p>Không có bài viết nào!</p>';
            }
        } catch (error) {
            console.error('Lỗi khi fetch dữ liệu:', error);
            wrapperPosts.innerHTML = '<p>Đã xảy ra lỗi khi tải bài viết!</p>';
        }
    }

    // Function to display posts
    function displayPosts(posts) {
        wrapperPosts.innerHTML = ''; // Clear any old content

        posts.forEach(items => {
            // Create HTML for each post using the <card-post> component
            let html = `
                <card-post 
                    post-id="${items._id}" 
                    img="https://placehold.co/50x50"
                    title="${items.title}" 
                    content="${items.content}" 
                    time="${items.createdAt}" 
                </card-post>
            `;

            // Insert HTML into the wrapperPosts container
            wrapperPosts.insertAdjacentHTML('beforeend', html);
        });
    }

    // Search functionality for posts
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const postCards = wrapperPosts.getElementsByTagName('card-post');

        Array.from(postCards).forEach(card => {
            const title = card.getAttribute('title').toLowerCase();
            const content = card.getAttribute('content').toLowerCase();
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Call fetchPosts when the page has loaded
    fetchPosts();
});
