// JavaScript remains the same as before
const DOMAIN = `http://localhost:3000/api/v1`;

// Create a reference to the necessary elements in the DOM
const titleInput = document.querySelector('textarea[placeholder="Tiêu đề..."]');
const contentInput = document.querySelector('textarea[placeholder="Bạn đang nghĩ gì...."]');
const postButton = document.querySelector('.btn-post');
const imageIcon = document.querySelector('.bi-image');
const imagePreviewContainer = document.querySelector('.image-preview-container'); // Get the existing preview container

let imageFiles = []; // Store the selected image files

// Function to handle posting a new post
async function addPost(title, content, images) {
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        
        // Append each image file to the FormData
        images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await fetch(`${DOMAIN}/posts/add-post`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Post created successfully:', result);
            // Clear inputs and image previews after successful post
            titleInput.value = '';
            contentInput.value = '';
            imagePreviewContainer.innerHTML = '';
            imageFiles = []; // Reset the image files array
        } else {
            console.error('Failed to create post:', result.message);
        }
    } catch (error) {
        console.error('Error while creating post:', error);
    }
}

// Function to handle image selection
imageIcon.addEventListener('click', () => {
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.multiple = true;
    imageInput.accept = 'image/*'; // Limit to image types
    imageInput.style.display = 'none'; // Hide the input

    document.body.appendChild(imageInput);
    imageInput.click();

    imageInput.onchange = () => {
        const files = imageInput.files;
        imageFiles = Array.from(files); // Convert FileList to Array

        // Clear previous previews
        imagePreviewContainer.innerHTML = '';

        // Display selected images in the HTML
        imageFiles.forEach((file) => {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.width = '100px'; // Set a fixed width for previews
            img.style.marginRight = '10px'; // Spacing between images
            img.style.borderRadius = '5px'; // Rounded corners
            imagePreviewContainer.appendChild(img);
        });

        // Clean up
        document.body.removeChild(imageInput);
    };
});

// Add event listener to the post button
postButton.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title && content) {
        // Confirm before posting
        if (confirm("Bạn có chắc chắn muốn đăng bài viết này?")) {
            addPost(title, content, imageFiles);
        }
    } else {
        alert("Vui lòng điền tiêu đề và nội dung trước khi đăng.");
    }
});
